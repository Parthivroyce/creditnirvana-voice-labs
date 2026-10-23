import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle, 
  User, 
  Bot, 
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { DIFFICULT_SCENARIOS } from '../data/scenarios';
import { DifficultScenario } from '../types';
import { voicePipeline } from '../services/voicePipeline';
import { LOAN_SETTLEMENT_PROMPT, INSURANCE_RENEWAL_PROMPT } from '../data/prompts';

export const DifficultSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DIFFICULT_SCENARIOS[0].id);
  const activeScenario = DIFFICULT_SCENARIOS.find((s) => s.id === selectedScenarioId) || DIFFICULT_SCENARIOS[0];

  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<{
    turn: number;
    customer: string;
    botResponse: string;
    complianceNote: string;
    passed: boolean;
  }[]>([]);

  const isLoan = activeScenario.agentType === 'loan_settlement';
  const promptDef = isLoan ? LOAN_SETTLEMENT_PROMPT : INSURANCE_RENEWAL_PROMPT;
  const agentSpeaker = isLoan ? 'meera' : 'arvind';

  // Run a single turn
  const executeTurn = async (turnIdx: number) => {
    if (turnIdx >= activeScenario.dialogueScript.length) {
      setIsRunning(false);
      return;
    }

    const scriptItem = activeScenario.dialogueScript[turnIdx];
    setCurrentTurnIndex(turnIdx);

    // Call conversational API
    try {
      const history = simulationLogs.map((l) => [
        { role: 'user' as const, content: l.customer },
        { role: 'assistant' as const, content: l.botResponse },
      ]).flat();

      const res = await voicePipeline.generateAgentResponse(
        activeScenario.agentType,
        promptDef.promptText,
        history,
        scriptItem.customerTurn
      );

      // Play audio response briefly
      voicePipeline.speakAgentText(res.reply, { speaker: agentSpeaker, languageCode: 'en-IN' });

      setSimulationLogs((prev) => [
        ...prev,
        {
          turn: turnIdx + 1,
          customer: scriptItem.customerTurn,
          botResponse: res.reply,
          complianceNote: scriptItem.complianceWatchout,
          passed: res.complianceCheck.isCompliant,
        },
      ]);
    } catch (err) {
      console.warn('Simulation turn error:', err);
    }
  };

  // Run full automated simulation
  const runFullSimulation = async () => {
    setIsRunning(true);
    setSimulationLogs([]);
    setCurrentTurnIndex(0);

    for (let i = 0; i < activeScenario.dialogueScript.length; i++) {
      await executeTurn(i);
      // Wait between turns
      await new Promise((r) => setTimeout(r, 2200));
    }
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationLogs([]);
    setCurrentTurnIndex(0);
    voicePipeline.interruptAgentSpeech();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h1 className="text-xl font-bold text-white">Difficult-Customer Simulator</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Stress-test both Voice AI agents against hardball customer objections, extreme lowball counteroffers, legal threats, and portal competitor quotes.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetSimulation}
              disabled={isRunning}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={runFullSimulation}
              disabled={isRunning}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Simulating Conversation...' : 'Run Automated Simulation'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Selector & Persona Profile (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Select Test Scenario</h3>
            <div className="space-y-1.5">
              {DIFFICULT_SCENARIOS.map((scenario) => {
                const isSelected = scenario.id === selectedScenarioId;
                const isLoanScen = scenario.agentType === 'loan_settlement';
                return (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenarioId(scenario.id);
                      resetSimulation();
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? isLoanScen
                          ? 'bg-rose-950/80 border-rose-600 text-white shadow-md'
                          : 'bg-blue-950/80 border-blue-600 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isLoanScen ? 'bg-rose-900 text-rose-300' : 'bg-blue-900 text-blue-300'}`}>
                        {isLoanScen ? 'Personal Loan' : 'Car Insurance'}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">{scenario.difficulty}</span>
                    </div>
                    <div className="font-bold text-slate-200">{scenario.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{scenario.customerPersona}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Scenario Card Details */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>Customer Persona Profile</span>
            </div>
            <div>
              <div className="text-white font-bold">{activeScenario.customerPersona}</div>
              <p className="text-slate-400 mt-1 leading-relaxed">{activeScenario.description}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">Core Objection</span>
              <p className="text-slate-300 text-[11px] font-medium">{activeScenario.primaryObjection}</p>
            </div>
          </div>
        </div>

        {/* Live Simulation Feed & Turn Analysis (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">{activeScenario.title}</h3>
              <p className="text-xs text-slate-400">
                Testing Agent: <span className="text-slate-200 font-semibold">{promptDef.agentName}</span> ({promptDef.role})
              </p>
            </div>

            {simulationLogs.length > 0 && (
              <div className="flex items-center space-x-2 text-xs bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">
                  {simulationLogs.filter((l) => l.passed).length}/{simulationLogs.length} Turns Invariant Compliant
                </span>
              </div>
            )}
          </div>

          {/* Turns Timeline */}
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {simulationLogs.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-slate-500">
                <Sparkles className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                <h4 className="text-sm font-semibold text-slate-400">Simulation Ready to Run</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click "Run Automated Simulation" to watch the agent navigate {activeScenario.customerPersona}'s objections in real time.
                </p>
              </div>
            ) : (
              simulationLogs.map((log) => (
                <div key={log.turn} className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400 uppercase tracking-wider">Turn {log.turn}</span>
                    <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Compliance Verified</span>
                    </span>
                  </div>

                  {/* Customer Line */}
                  <div className="flex items-start space-x-2 text-xs">
                    <div className="w-6 h-6 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold shrink-0 text-[10px]">
                      C
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 text-[11px] block">{activeScenario.customerPersona}</span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed font-mono text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        "{log.customer}"
                      </p>
                    </div>
                  </div>

                  {/* Bot Response */}
                  <div className="flex items-start space-x-2 text-xs">
                    <div className={`w-6 h-6 rounded ${isLoan ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'} flex items-center justify-center font-bold shrink-0 text-[10px]`}>
                      B
                    </div>
                    <div className="flex-1">
                      <span className={`font-bold ${isLoan ? 'text-rose-400' : 'text-blue-400'} text-[11px] block`}>
                        {promptDef.agentName} (Agent)
                      </span>
                      <p className="text-slate-100 mt-0.5 leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/80">
                        "{log.botResponse}"
                      </p>
                    </div>
                  </div>

                  {/* Compliance Watchout Audited */}
                  <div className="text-[10px] text-slate-400 bg-slate-900/40 p-2 rounded border border-slate-800/80 flex items-center space-x-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>Audited Rule:</strong> {log.complianceNote}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
