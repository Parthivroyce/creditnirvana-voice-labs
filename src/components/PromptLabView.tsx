import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  FileCode, 
  HelpCircle, 
  Sliders,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { LOAN_SETTLEMENT_PROMPT, INSURANCE_RENEWAL_PROMPT, SystemPromptDefinition } from '../data/prompts';
import { AgentType } from '../types';

export const PromptLabView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('loan_settlement');
  const isLoan = selectedAgent === 'loan_settlement';
  const goldenPrompt = isLoan ? LOAN_SETTLEMENT_PROMPT : INSURANCE_RENEWAL_PROMPT;

  const [promptText, setPromptText] = useState<string>(goldenPrompt.promptText);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync when toggling agents
  const handleAgentChange = (agent: AgentType) => {
    setSelectedAgent(agent);
    const target = agent === 'loan_settlement' ? LOAN_SETTLEMENT_PROMPT : INSURANCE_RENEWAL_PROMPT;
    setPromptText(target.promptText);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPromptText(goldenPrompt.promptText);
  };

  const handleDownload = () => {
    const filename = `CreditNirvana_${goldenPrompt.agentId}_SystemPrompt.md`;
    const blob = new Blob([promptText], { type: 'text/markdown' });
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
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              <h1 className="text-xl font-bold text-white">System Prompt Engineering Lab</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Production system prompts configured with multi-phase dialogue architecture, strict negotiation bounds, and compliance watchdogs.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAgentChange('loan_settlement')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isLoan ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Loan Settlement Prompt
            </button>
            <button
              onClick={() => handleAgentChange('insurance_renewal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !isLoan ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Insurance Renewal Prompt
            </button>
          </div>
        </div>
      </div>

      {/* Facts Snapshot Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {Object.entries(goldenPrompt.keyFacts).map(([key, value]) => (
          <div key={key} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block line-clamp-1">{key}</span>
            <span className="font-bold text-white text-xs mt-0.5 block">{value}</span>
          </div>
        ))}
      </div>

      {/* Prompt Editor & Action Toolbar */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">{goldenPrompt.agentName}</span>
            <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
              v{goldenPrompt.version}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Golden</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4 bg-slate-950">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={22}
            className="w-full bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed resize-y"
          />
        </div>
      </div>

      {/* Compliance & Objection Watchout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Configured Objection Strategies</span>
          </div>
          <ul className="space-y-2">
            {goldenPrompt.objectionList.map((obj, i) => (
              <li key={i} className="flex items-start space-x-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-rose-400 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Regulatory & Compliance Safeguards</span>
          </div>
          <ul className="space-y-2">
            {goldenPrompt.complianceGuards.map((guard, i) => (
              <li key={i} className="flex items-start space-x-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{guard}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
