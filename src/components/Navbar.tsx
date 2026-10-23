import React from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  Car, 
  FileCheck, 
  Sliders, 
  LayoutDashboard, 
  Send, 
  Zap,
  Activity,
  Bot
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'loan_agent'
  | 'insurance_agent'
  | 'scenarios'
  | 'tests'
  | 'prompts'
  | 'submission';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  systemStatus: {
    sarvamConfigured: boolean;
    geminiConfigured: boolean;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  systemStatus,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  CreditNirvana
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Voice Labs
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Prompt Engineer Intern • Voice & Agentic AI</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('loan_agent')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'loan_agent'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Loan Agent</span>
            </button>

            <button
              onClick={() => setActiveTab('insurance_agent')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'insurance_agent'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Insurance Agent</span>
            </button>

            <button
              onClick={() => setActiveTab('scenarios')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'scenarios'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Difficult Scenarios</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tests'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Test Suite</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'prompts'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prompt Lab</span>
            </button>

            {/* Submission Hub Tab (Prominent) */}
            <button
              onClick={() => setActiveTab('submission')}
              className={`relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'submission'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/30'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Recruiter Submission</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>
          </nav>

          {/* Right Status Indicators */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Audio:</span>
              <span className="text-emerald-400 font-medium">Dual-Channel HD</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
              <Zap className={`w-3.5 h-3.5 ${systemStatus.sarvamConfigured ? 'text-amber-400' : 'text-indigo-400'}`} />
              <span className="text-slate-400">Voice:</span>
              <span className="text-slate-200 font-medium">
                {systemStatus.sarvamConfigured ? 'Sarvam API' : 'Browser WebSpeech'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800/60 text-xs">
          <button onClick={() => setActiveTab('dashboard')} className={`px-2.5 py-1 rounded ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('loan_agent')} className={`px-2.5 py-1 rounded ${activeTab === 'loan_agent' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}>Loan Agent</button>
          <button onClick={() => setActiveTab('insurance_agent')} className={`px-2.5 py-1 rounded ${activeTab === 'insurance_agent' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Insurance Agent</button>
          <button onClick={() => setActiveTab('scenarios')} className={`px-2.5 py-1 rounded ${activeTab === 'scenarios' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}>Scenarios</button>
          <button onClick={() => setActiveTab('tests')} className={`px-2.5 py-1 rounded ${activeTab === 'tests' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Tests</button>
          <button onClick={() => setActiveTab('prompts')} className={`px-2.5 py-1 rounded ${activeTab === 'prompts' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>Prompts</button>
          <button onClick={() => setActiveTab('submission')} className={`px-2.5 py-1 rounded font-bold ${activeTab === 'submission' ? 'bg-emerald-600 text-white' : 'text-emerald-400'}`}>Submission</button>
        </div>
      </div>
    </header>
  );
};
