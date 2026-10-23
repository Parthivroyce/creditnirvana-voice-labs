import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Download, 
  Play, 
  Pause, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Send,
  CornerDownLeft,
  FileText,
  Award,
  Clock,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { AgentType, ChatMessage, CallDisposition, CallEvaluation } from '../types';
import { LOAN_SETTLEMENT_PROMPT, INSURANCE_RENEWAL_PROMPT } from '../data/prompts';
import { DualChannelAudioRecorder } from '../services/audioRecorder';
import { voicePipeline } from '../services/voicePipeline';

interface VoiceAgentViewProps {
  agentType: AgentType;
}

export const VoiceAgentView: React.FC<VoiceAgentViewProps> = ({ agentType }) => {
  const isLoan = agentType === 'loan_settlement';
  const promptDef = isLoan ? LOAN_SETTLEMENT_PROMPT : INSURANCE_RENEWAL_PROMPT;
  const agentName = promptDef.agentName;
  const agentSpeaker = isLoan ? 'meera' : 'arvind';
  const themeColor = isLoan ? 'rose' : 'blue';

  // Call states
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'paused' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOnHold, setIsOnHold] = useState<boolean>(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Messages & transcripts
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [interimSpeech, setInterimSpeech] = useState<string>('');

  // Audio recording
  const recorderRef = useRef<DualChannelAudioRecorder | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<{ blob: Blob; url: string } | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  // Post-call evaluation
  const [evaluation, setEvaluation] = useState<CallEvaluation | null>(null);
  const [disposition, setDisposition] = useState<CallDisposition | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const audioLevelIntervalRef = useRef<any>(null);

  // Auto-scroll transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimSpeech]);

  // Handle call timer
  useEffect(() => {
    if (callStatus === 'connected') {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callStatus]);

  // Audio waveform animation loop
  useEffect(() => {
    if (callStatus === 'connected') {
      audioLevelIntervalRef.current = setInterval(() => {
        if (isAgentSpeaking) {
          setAudioLevel(Math.floor(Math.random() * 40) + 40);
        } else if (recorderRef.current) {
          const lvl = recorderRef.current.getAudioLevel();
          setAudioLevel(lvl > 5 ? lvl : Math.floor(Math.random() * 8));
        }
      }, 100);
    } else {
      setAudioLevel(0);
      if (audioLevelIntervalRef.current) clearInterval(audioLevelIntervalRef.current);
    }
    return () => {
      if (audioLevelIntervalRef.current) clearInterval(audioLevelIntervalRef.current);
    };
  }, [callStatus, isAgentSpeaking]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Call
  const startCall = async () => {
    setCallStatus('calling');
    setCallDuration(0);
    setRecordedAudio(null);
    setEvaluation(null);
    setDisposition(null);
    setMessages([]);

    // Initialize dual channel recorder
    recorderRef.current = new DualChannelAudioRecorder();
    await recorderRef.current.start();

    // Start speech recognition
    voicePipeline.startSpeechRecognition(
      (transcript, isFinal) => {
        if (isFinal) {
          setInterimSpeech('');
          handleCustomerMessage(transcript);
        } else {
          setInterimSpeech(transcript);
        }
      },
      (err) => {
        console.warn('Speech recognition status:', err);
      },
      () => {
        // Customer voice onset -> trigger barge-in interruption of agent
        voicePipeline.interruptAgentSpeech();
        setIsAgentSpeaking(false);
      }
    );

    // Initial greeting from agent after brief ringing delay
    setTimeout(() => {
      setCallStatus('connected');
      const openingGreeting = isLoan
        ? "Hello, this is Priya Sharma calling from CreditNirvana on behalf of the recovery division. Am I speaking with the primary account holder? For your privacy, could you please confirm your date of birth or the last 4 digits of your PAN?"
        : "Hello! This is Rajesh Nair from CreditNirvana Insurance. I am calling regarding the comprehensive insurance renewal for your Maruti Brezza. Is this a good time for a quick 2-minute update?";

      const initialMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        speakerName: agentName,
        text: openingGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        complianceCheck: {
          isCompliant: true,
          flags: [],
          notes: isLoan ? 'Compliant pre-disclosure KYC greeting' : 'Compliant IRDAI renewal opening',
        },
      };

      setMessages([initialMsg]);

      // Speak opening greeting
      setIsAgentSpeaking(true);
      voicePipeline.speakAgentText(
        openingGreeting,
        { speaker: agentSpeaker, languageCode: 'en-IN' },
        () => setIsAgentSpeaking(true),
        () => setIsAgentSpeaking(false)
      );
    }, 1200);
  };

  // End Call
  const endCall = async () => {
    voicePipeline.interruptAgentSpeech();
    voicePipeline.stopSpeechRecognition();
    setIsAgentSpeaking(false);
    setCallStatus('ended');

    // Stop dual-channel audio recorder
    if (recorderRef.current) {
      const audioResult = await recorderRef.current.stop();
      if (audioResult) {
        setRecordedAudio(audioResult);
      }
    }

    // Evaluate conversation
    try {
      const evalRes = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType,
          messages,
        }),
      });
      if (evalRes.ok) {
        const evalData = await evalRes.json();
        setEvaluation(evalData);
        setDisposition(evalData.disposition);
        setShowEvaluationModal(true);
      }
    } catch (err) {
      console.warn('Evaluation failed:', err);
    }
  };

  // Customer message handler
  const handleCustomerMessage = async (userText: string) => {
    if (!userText.trim() || callStatus !== 'connected') return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'customer',
      speakerName: 'Customer (You)',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTextInput('');

    // Generate agent reply
    try {
      const history = messages.map((m) => ({
        role: (m.sender === 'agent' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.text,
      }));

      const response = await voicePipeline.generateAgentResponse(
        agentType,
        promptDef.promptText,
        history,
        userText
      );

      const agentReplyMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        speakerName: agentName,
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sentiment: response.sentiment,
        complianceCheck: response.complianceCheck,
      };

      setMessages((prev) => [...prev, agentReplyMsg]);

      // Speak agent reply
      if (!isOnHold) {
        setIsAgentSpeaking(true);
        voicePipeline.speakAgentText(
          response.reply,
          { speaker: agentSpeaker, languageCode: 'en-IN' },
          () => setIsAgentSpeaking(true),
          () => setIsAgentSpeaking(false)
        );
      }
    } catch (err) {
      console.error('Error generating agent response:', err);
    }
  };

  // Quick objection injection buttons
  const loanQuickObjections = [
    "Yes, I am Ramesh. Last 4 digits of PAN are 4821.",
    "I lost my business 8 months ago and have zero income. Stop calling me.",
    "I can only pay ₹1,50,000 from borrowing. Take it or you get nothing.",
    "Call me after 6 months when I find a new job.",
    "Your interest charges are fraudulent. I am filing a harassment suit.",
    "Send the official settlement letter first, then I will pay.",
    "I can arrange ₹2,00,000 tomorrow and ₹2,00,000 in 10 days. Send UPI link."
  ];

  const insuranceQuickObjections = [
    "Hi Rajesh, I have 2 minutes. What's the renewal price?",
    "I just got a quote on PolicyBazaar for ₹12,000! Why is yours ₹15,000?",
    "Why did you reduce my Brezza's IDV from ₹9 Lakhs to ₹8 Lakhs?",
    "Can you do it for ₹13,000? Give me an extra discount.",
    "I don't need Zero Dep or Engine Protection, give me third-party only.",
    "Okay, that makes sense. Send the payment link to my WhatsApp for ₹15,000."
  ];

  const currentQuickObjections = isLoan ? loanQuickObjections : insuranceQuickObjections;

  // Audio download
  const downloadRecordedAudio = () => {
    if (!recordedAudio) return;
    const a = document.createElement('a');
    a.href = recordedAudio.url;
    a.download = `CreditNirvana_${agentType}_CallRecording_${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Transcript download
  const downloadTranscript = (format: 'txt' | 'json') => {
    let content = '';
    let mime = 'text/plain';
    const filename = `CreditNirvana_${agentType}_Transcript_${new Date().toISOString().slice(0, 10)}.${format}`;

    if (format === 'json') {
      content = JSON.stringify(
        {
          agent: agentName,
          agentType,
          durationSeconds: callDuration,
          timestamp: new Date().toISOString(),
          evaluation,
          disposition,
          transcript: messages,
        },
        null,
        2
      );
      mime = 'application/json';
    } else {
      content = `CreditNirvana Voice Labs — Call Transcript\n`;
      content += `Agent: ${agentName} (${isLoan ? 'Personal Loan Settlement' : 'Car Insurance Renewal'})\n`;
      content += `Duration: ${formatTimer(callDuration)} | Date: ${new Date().toLocaleString()}\n`;
      content += `--------------------------------------------------------\n\n`;
      messages.forEach((m) => {
        content += `[${m.timestamp}] ${m.speakerName}:\n${m.text}\n\n`;
      });
      if (disposition) {
        content += `--------------------------------------------------------\n`;
        content += `Disposition Outcome: ${disposition.outcome}\n`;
        content += `Agreed Amount: ₹${disposition.agreedAmount?.toLocaleString('en-IN') || 'N/A'}\n`;
        content += `Summary Notes: ${disposition.notes}\n`;
      }
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Agent Header Bar */}
      <div className={`p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border ${isLoan ? 'border-rose-900/40' : 'border-blue-900/40'} shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl ${isLoan ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'} flex items-center justify-center font-black text-xl shadow-inner`}>
              {agentName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">{agentName}</h1>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isLoan ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-blue-950 text-blue-300 border border-blue-800'}`}>
                  {promptDef.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Engine: <span className="text-slate-300 font-medium">Sarvam {agentSpeaker}</span> • Model: <span className="text-slate-300 font-medium">Gemini 3.8 Flash / Sarvam</span> • Dual-channel Audio
              </p>
            </div>
          </div>

          {/* Quick Business Parameters Snapshot */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {isLoan ? (
              <>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Overdue: </span>
                  <span className="text-slate-200 font-bold">8 Mo (₹6.50L)</span>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">OTS Offer: </span>
                  <span className="text-rose-400 font-bold">₹4,00,000</span>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Waiver: </span>
                  <span className="text-emerald-400 font-bold">₹2,50,000</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Vehicle: </span>
                  <span className="text-slate-200 font-bold">Maruti Brezza</span>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">IDV: </span>
                  <span className="text-amber-400 font-bold">₹8,00,000 (-11.1%)</span>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Premium: </span>
                  <span className="text-blue-400 font-bold">₹15,000 (Save ₹5k)</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Call Interface & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Telephony Voice Console (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Call Telephony Card */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${callStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : callStatus === 'calling' ? 'bg-amber-500 animate-ping' : 'bg-slate-600'}`}></span>
                <span className="font-semibold uppercase tracking-wider text-slate-300">
                  {callStatus === 'connected' ? 'Call Active' : callStatus === 'calling' ? 'Connecting Call...' : callStatus === 'ended' ? 'Call Ended' : 'Call Standby'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-200 font-bold">{formatTimer(callDuration)}</span>
              </div>
            </div>

            {/* Visualizer & Speaker Avatar */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="relative">
                {/* Pulsing rings when speaking */}
                {isAgentSpeaking && (
                  <div className={`absolute inset-0 rounded-full scale-125 ${isLoan ? 'bg-rose-500/20' : 'bg-blue-500/20'} animate-ping pointer-events-none`}></div>
                )}
                <div className={`w-24 h-24 rounded-full ${isLoan ? 'bg-gradient-to-tr from-rose-600 to-amber-600' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'} p-1 shadow-2xl`}>
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{agentName.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-white text-base">{agentName}</h3>
                <p className="text-xs text-slate-400">
                  {isAgentSpeaking ? (
                    <span className="text-emerald-400 font-semibold animate-pulse">Speaking...</span>
                  ) : callStatus === 'connected' ? (
                    <span className="text-slate-400">Listening to you...</span>
                  ) : (
                    <span>Ready for call</span>
                  )}
                </p>
              </div>

              {/* Dynamic Waveform Visualizer */}
              <div className="flex items-center justify-center space-x-1.5 h-12 w-full max-w-xs px-4">
                {[...Array(16)].map((_, i) => {
                  const barHeight = callStatus === 'connected' 
                    ? Math.max(8, Math.min(48, (audioLevel * (0.4 + (i % 5) * 0.15)))) 
                    : 4;
                  return (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-75 ${
                        isAgentSpeaking
                          ? isLoan ? 'bg-rose-500' : 'bg-blue-500'
                          : audioLevel > 15
                          ? 'bg-emerald-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Primary Telephony Call Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {callStatus === 'idle' || callStatus === 'ended' ? (
                <button
                  onClick={startCall}
                  className={`w-full py-3.5 rounded-xl ${isLoan ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'} text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all hover:scale-[1.01]`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Start Live Voice Call</span>
                </button>
              ) : (
                <button
                  onClick={endCall}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call & Generate Evaluation</span>
                </button>
              )}

              {/* In-Call Controls */}
              {callStatus === 'connected' && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                      isMuted 
                        ? 'bg-amber-950/80 border-amber-600 text-amber-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isMuted ? 'Muted' : 'Mute'}</span>
                  </button>

                  <button
                    onClick={() => {
                      voicePipeline.interruptAgentSpeech();
                      setIsAgentSpeaking(false);
                    }}
                    className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                    <span>Barge-in</span>
                  </button>

                  <button
                    onClick={() => setIsOnHold(!isOnHold)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                      isOnHold 
                        ? 'bg-amber-950/80 border-amber-600 text-amber-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{isOnHold ? 'Unhold' : 'Hold'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Genuine Audio Recording Playback & Download Card */}
          {recordedAudio && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-emerald-900/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Dual-Channel Recording</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-800">
                  Audio Captured
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mixed customer microphone input and synthesized agent speech into a single audio file.
              </p>

              <audio ref={playbackAudioRef} src={recordedAudio.url} className="w-full h-8 mt-2" controls />

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={downloadRecordedAudio}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span>Download Genuine Audio (.webm)</span>
                </button>
                <button
                  onClick={() => downloadTranscript('txt')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Objection Prompter (Click-to-Test) */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Difficult Objection Injector</span>
              <span className="text-[10px] text-slate-500">Click to say as customer</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {currentQuickObjections.map((obj, idx) => (
                <button
                  key={idx}
                  disabled={callStatus !== 'connected'}
                  onClick={() => handleCustomerMessage(obj)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  "{obj}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Transcript & Compliance Audit Log (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[700px] bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          {/* Transcript Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Telephony Transcript & Compliance Feed</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => downloadTranscript('txt')}
                disabled={messages.length === 0}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Text</span>
              </button>
              <button
                onClick={() => downloadTranscript('json')}
                disabled={messages.length === 0}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Transcript Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Mic className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
                <h4 className="text-sm font-semibold text-slate-400">Ready to start conversation</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Click "Start Live Voice Call" to initiate speaking with {agentName}. 
                  Spoken conversation turns and compliance tags will stream here in real time.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center space-x-2 mb-1 px-1">
                      <span className={`text-[11px] font-bold ${isAgent ? (isLoan ? 'text-rose-400' : 'text-blue-400') : 'text-slate-300'}`}>
                        {msg.speakerName}
                      </span>
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAgent
                          ? 'bg-slate-800/90 text-slate-100 rounded-tl-sm border border-slate-700/60'
                          : 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {/* Compliance & sentiment tags */}
                    {isAgent && msg.complianceCheck && (
                      <div className="flex items-center space-x-2 mt-1 px-1">
                        <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/50">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{msg.complianceCheck.notes || 'RBI / IRDAI Compliant'}</span>
                        </span>
                        {msg.sentiment && (
                          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            Mood: {msg.sentiment}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Interim live speech recognition bubble */}
            {interimSpeech && (
              <div className="flex flex-col items-end opacity-75">
                <span className="text-[10px] text-indigo-400 px-1 mb-1 font-mono">Listening (Speaking...)...</span>
                <div className="max-w-xl p-3 rounded-2xl text-xs bg-indigo-950/80 border border-indigo-500/40 text-indigo-200">
                  {interimSpeech}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Fallback Text Input Bar */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCustomerMessage(textInput);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                disabled={callStatus !== 'connected'}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={callStatus === 'connected' ? "Type a reply if not using microphone..." : "Connect call to chat..."}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={callStatus !== 'connected' || !textInput.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Post-Call Evaluation Modal */}
      {showEvaluationModal && evaluation && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Automated Conversation Evaluation</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Call duration: {formatTimer(callDuration)} • Agent: {agentName}
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">{evaluation.overallScore}/100</div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Quality Score</span>
              </div>
            </div>

            {/* Disposition & Outcome */}
            {disposition && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Disposition: </span>
                  <span className="text-indigo-400 font-bold">{disposition.outcome}</span>
                </div>
                {disposition.agreedAmount && (
                  <div>
                    <span className="text-slate-400">Agreed Amount: </span>
                    <span className="text-emerald-400 font-bold">₹{disposition.agreedAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            )}

            {/* 5-Category Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Dimensions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Identity Verification & Privacy</span>
                    <span className="font-bold text-indigo-400">{evaluation.categories.identityVerification}/10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${evaluation.categories.identityVerification * 10}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Objection Handling & Firmness</span>
                    <span className="font-bold text-indigo-400">{evaluation.categories.objectionHandling}/10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${evaluation.categories.objectionHandling * 10}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Factual Accuracy & Numbers</span>
                    <span className="font-bold text-indigo-400">{evaluation.categories.factualAccuracy}/10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${evaluation.categories.factualAccuracy * 10}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Regulatory & RBI/IRDAI Compliance</span>
                    <span className="font-bold text-emerald-400">{evaluation.categories.regulatoryCompliance}/10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${evaluation.categories.regulatoryCompliance * 10}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1 sm:col-span-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Commercial Conversion & Closing</span>
                    <span className="font-bold text-indigo-400">{evaluation.categories.commercialClosing}/10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${evaluation.categories.commercialClosing * 10}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Observations */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider">Audit Highlights</h4>
              <ul className="space-y-1">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-900/30">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => downloadTranscript('txt')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Export Call Report
              </button>
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Close & Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
