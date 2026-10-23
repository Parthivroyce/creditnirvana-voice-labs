import { AgentType } from '../types';

export interface TTSOptions {
  speaker?: string; // 'meera' | 'arvind' | 'pavithra'
  languageCode?: string; // 'en-IN' | 'hi-IN'
  pace?: number;
}

export class VoicePipelineService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentAudioEl: HTMLAudioElement | null = null;

  constructor() {
    // Check for browser speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN';
    }
  }

  isSpeechRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  startSpeechRecognition(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onUserVoiceOnset?: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser. Please use text input or Chrome/Edge.');
      return;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      onUserVoiceOnset?.(); // Barge-in trigger
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        onResult(interimTranscript.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      // Ignore routine aborts
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch {
          this.isListening = false;
        }
      }
    };

    try {
      this.recognition.start();
    } catch (err: any) {
      onError(err.message || 'Failed to start microphone speech recognition.');
    }
  }

  stopSpeechRecognition() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  // Interruption / Barge-in: stops any currently playing agent audio
  interruptAgentSpeech() {
    if (this.currentAudioEl) {
      this.currentAudioEl.pause();
      this.currentAudioEl.currentTime = 0;
      this.currentAudioEl = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // Speaks agent response using Sarvam API or browser SpeechSynthesis fallback
  async speakAgentText(
    text: string,
    options: TTSOptions,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    this.interruptAgentSpeech();
    onStart?.();

    try {
      // 1. Try server-side Sarvam TTS endpoint
      const response = await fetch('/api/sarvam/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker: options.speaker || 'meera',
          language_code: options.languageCode || 'en-IN',
          pace: options.pace || 1.05,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          this.currentAudioEl = audio;
          audio.onended = () => {
            this.currentAudioEl = null;
            onEnd?.();
          };
          audio.onerror = () => {
            this.fallbackBrowserTTS(text, options, onEnd);
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Server error or Sarvam key not configured; fall through to browser SpeechSynthesis
    }

    // 2. High-fidelity browser SpeechSynthesis fallback
    this.fallbackBrowserTTS(text, options, onEnd);
  }

  private fallbackBrowserTTS(
    text: string,
    options: TTSOptions,
    onEnd?: () => void
  ) {
    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = options.speaker === 'meera' ? 1.05 : 0.95;

    // Pick best Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(
      (v) =>
        v.lang === 'en-IN' ||
        v.name.includes('India') ||
        v.name.includes('Hindi') ||
        v.name.includes('Veena') ||
        v.name.includes('Rishi')
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  // Generate agent response by calling the full-stack server
  async generateAgentResponse(
    agentType: AgentType,
    customPrompt: string,
    history: { role: 'user' | 'assistant' | 'system'; content: string }[],
    userMessage: string
  ): Promise<{
    reply: string;
    sentiment: 'positive' | 'neutral' | 'frustrated' | 'cooperative' | 'defensive';
    complianceCheck: {
      isCompliant: boolean;
      flags: string[];
      notes?: string;
    };
  }> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentType,
        systemPrompt: customPrompt,
        history,
        userMessage,
      }),
    });

    if (!res.ok) {
      throw new Error(`Chat API failed with status ${res.status}`);
    }

    return await res.json();
  }
}

export const voicePipeline = new VoicePipelineService();
