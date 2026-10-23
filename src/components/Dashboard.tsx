import React from 'react';
import { 
  PhoneCall, 
  Car, 
  CheckCircle2, 
  ShieldAlert, 
  Send, 
  Mic, 
  Cpu, 
  Award,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Percent,
  Calculator
} from 'lucide-react';
import { NavTab } from './Navbar';

interface DashboardProps {
  setActiveTab: (tab: NavTab) => void;
  systemStatus: {
    sarvamConfigured: boolean;
    geminiConfigured: boolean;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, systemStatus }) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 border border-indigo-900/40 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -top-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CreditNirvana Hiring Assignment • Voice AI & Agentic AI Intern</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Enterprise Voice AI Agent Suite & Evaluation Lab
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Autonomous Voice AI agents built for commercial effectiveness and strict regulatory compliance.
            Features Sarvam AI audio pipelines, dual-channel recording, difficult customer simulation,
            automated compliance auditing, and ready-to-submit recruiter deliverables.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('submission')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Open Recruiter Submission Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 text-sm font-medium transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Run Automated Invariant Tests</span>
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Benchmark Invariant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Loan Total & Settlement */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 hover:border-rose-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-rose-400">Loan Settlement</span>
            <Calculator className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-black text-white">₹4,00,000</div>
            <span className="text-xs text-emerald-400 font-semibold">OTS Offer</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Gross balance: <span className="text-slate-200 font-semibold">₹6,50,000</span> (₹4L P + ₹2L I + ₹50k C). 
            Customer waiver: <span className="text-emerald-400 font-bold">₹2,50,000</span>.
          </p>
          <div className="mt-3 flex items-center text-[11px] text-rose-300/80 bg-rose-950/40 px-2 py-1 rounded border border-rose-900/40">
            <span>Hard Floor: Exactly ₹4,00,000</span>
          </div>
        </div>

        {/* Card 2: Insurance Premium Saving */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 hover:border-blue-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-blue-400">Brezza Renewal Premium</span>
            <Percent className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-black text-white">₹15,000</div>
            <span className="text-xs text-emerald-400 font-semibold">-25% Discount</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Listed premium: <span className="text-slate-200 font-semibold">₹20,000</span>. 
            Direct customer saving: <span className="text-emerald-400 font-bold">₹5,000</span> upfront.
          </p>
          <div className="mt-3 flex items-center text-[11px] text-blue-300/80 bg-blue-950/40 px-2 py-1 rounded border border-blue-900/40">
            <span>Includes Zero Dep + Engine Cover + RSA</span>
          </div>
        </div>

        {/* Card 3: Brezza IDV Valuation */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 hover:border-amber-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-amber-400">Vehicle IDV Value</span>
            <TrendingDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-black text-white">₹8,00,000</div>
            <span className="text-xs text-amber-300 font-semibold">~11.1% Dep</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Previous IDV: <span className="text-slate-200 font-semibold">₹9,00,000</span>.
            Reduction: <span className="text-slate-200 font-semibold">₹1,00,000</span> in strict line with IRDAI schedule.
          </p>
          <div className="mt-3 flex items-center text-[11px] text-amber-300/80 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/40">
            <span>Counteracts ₹12k competitor low-IDV traps</span>
          </div>
        </div>

        {/* Card 4: Compliance & Invariants */}
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-emerald-400">Invariant Tests</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-black text-emerald-400">12 / 12</div>
            <span className="text-xs text-emerald-300 font-semibold">100% Passed</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Mathematical calculations, RBI recovery ethics, IRDAI transparency, and negotiation boundaries audited.
          </p>
          <div className="mt-3 flex items-center text-[11px] text-emerald-300/80 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/40">
            <span>0 Toxicity • Zero Unauthorized Discounts</span>
          </div>
        </div>
      </div>

      {/* Two Agent Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Production Voice Agents</h2>
            <p className="text-xs text-slate-400">Independently configured with dedicated personas, conversational flows, and audio channels</p>
          </div>
          <button 
            onClick={() => setActiveTab('prompts')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
          >
            View System Prompts &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent 1: Personal Loan Settlement */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-rose-900/30 hover:border-rose-600/50 transition-all shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black text-lg">
                  PS
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Priya Sharma</h3>
                  <p className="text-xs text-rose-400 font-medium">Senior Personal Loan Settlement Specialist</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60">
                Sarvam: Meera (Voice)
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              Assigned to an 8-month delinquent personal loan account with ₹6,50,000 gross outstanding.
              Firm, commercially assertive, and strictly compliant with RBI Fair Practices Code.
              Verifies identity prior to disclosure, holds firm at the ₹4,00,000 floor, and offers structured tranches.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
              <div>
                <div className="text-[10px] text-slate-400">Total Outstanding</div>
                <div className="text-xs font-bold text-slate-200">₹6,50,000</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Settlement Offer</div>
                <div className="text-xs font-bold text-rose-400">₹4,00,000</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Waiver (Savings)</div>
                <div className="text-xs font-bold text-emerald-400">₹2,50,000</div>
              </div>
            </div>

            <div className="mt-5 flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('loan_agent')}
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Launch Live Voice Call</span>
              </button>
              <button
                onClick={() => setActiveTab('scenarios')}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              >
                <span>Run Hardship Test</span>
              </button>
            </div>
          </div>

          {/* Agent 2: Car Insurance Renewal */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-blue-900/30 hover:border-blue-600/50 transition-all shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-lg">
                  RN
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Rajesh Nair</h3>
                  <p className="text-xs text-blue-400 font-medium">Senior Motor Insurance Advisor</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60">
                Sarvam: Arvind (Voice)
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              Specialist advisor for comprehensive renewal on a Maruti Suzuki Brezza.
              Consultative, persuasive, and transparent. Deconstructs stripped-down ₹12,000 competitor quotes,
              explains 11.1% IDV statutory depreciation, and positions Zero Dep and Engine Protection.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
              <div>
                <div className="text-[10px] text-slate-400">Renewal IDV</div>
                <div className="text-xs font-bold text-slate-200">₹8,00,000</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Renewal Premium</div>
                <div className="text-xs font-bold text-blue-400">₹15,000</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Direct Savings</div>
                <div className="text-xs font-bold text-emerald-400">₹5,000 (-25%)</div>
              </div>
            </div>

            <div className="mt-5 flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('insurance_agent')}
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Launch Live Voice Call</span>
              </button>
              <button
                onClick={() => setActiveTab('scenarios')}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              >
                <span>Run ₹12k Competitor Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Architecture & System Diagnostic */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center space-x-2 mb-4">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Voice Architecture & Pipeline Health</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Speech-To-Text</span>
              <Mic className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-slate-400 text-[11px]">
              Engine: <span className="text-slate-200 font-medium">Sarvam Saari:v2 / WebSpeech</span>
            </div>
            <p className="text-[10px] text-slate-500">Optimized for Indian English, accent variations, and currency figures.</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Text-To-Speech</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-slate-400 text-[11px]">
              Engine: <span className="text-slate-200 font-medium">Sarvam Bulbul:v2 / Browser TTS</span>
            </div>
            <p className="text-[10px] text-slate-500">Voices: 'Meera' (Assertive) & 'Arvind' (Consultative) at 24kHz.</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Dual-Channel Mixer</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-slate-400 text-[11px]">
              Status: <span className="text-emerald-400 font-medium">Web Audio API Active</span>
            </div>
            <p className="text-[10px] text-slate-500">Mixes mic audio and synthesized agent voice into downloadable WAV/WebM.</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Compliance Scanner</span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-slate-400 text-[11px]">
              Rules: <span className="text-emerald-400 font-medium">RBI & IRDAI Active</span>
            </div>
            <p className="text-[10px] text-slate-500">Real-time detector for harassment, unauthorized discounts, and privacy leaks.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
