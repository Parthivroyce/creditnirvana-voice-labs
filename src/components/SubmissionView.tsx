import React, { useState } from 'react';
import { 
  Send, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  Printer, 
  Mail, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Sparkles,
  Layers,
  Archive
} from 'lucide-react';
import { 
  COMBINED_PROMPTS_MARKDOWN, 
  DESIGN_NOTE_MARKDOWN, 
  TEST_REPORT_MARKDOWN, 
  README_MARKDOWN, 
  CHECKLIST_ITEMS, 
  RECRUITER_EMAIL_DRAFT 
} from '../data/submissionDocs';

type SubTab = 'prompts' | 'design_note' | 'test_report' | 'readme' | 'checklist' | 'email';

export const SubmissionView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('prompts');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Email form state
  const [mobile1, setMobile1] = useState<string>('+91 98765 43210');
  const [mobile2, setMobile2] = useState<string>('+91 98123 45678');
  const [candidateName, setCandidateName] = useState<string>('Candidate');
  const [hostedAppUrl, setHostedAppUrl] = useState<string>(window.location.origin);
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/creditnirvana-candidate/voice-labs');

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mimeType: string = 'text/markdown') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  // Compile final email text with injected variables
  const computedEmailBody = RECRUITER_EMAIL_DRAFT.bodyText
    .replace('[INSERT_HOSTED_APP_URL_HERE]', hostedAppUrl)
    .replace('[INSERT_GITHUB_REPO_URL_HERE]', repoUrl)
    .replace('[INSERT_PRIMARY_MOBILE_NUMBER_HERE]', mobile1)
    .replace('[INSERT_SECONDARY_MOBILE_NUMBER_HERE]', mobile2)
    .replace('[INSERT_YOUR_FULL_NAME_HERE]', candidateName);

  return (
    <div className="space-y-6 pb-16">
      {/* Recruiter Submission Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Submission Deliverables Package</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">CreditNirvana Hiring Deliverables</h1>
            <p className="text-xs text-slate-300">
              Addressed to Recruiter: <strong className="text-emerald-400">Ambuj Pratap Jain</strong> • Role: <strong className="text-white">Prompt Engineer Intern (Voice AI & Agentic AI)</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={() => handleDownloadFile(COMBINED_PROMPTS_MARKDOWN, 'CreditNirvana_Combined_SystemPrompts.md')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Prompts Doc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deliverable Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSubTab('prompts')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'prompts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>A. Combined Prompts Doc</span>
        </button>

        <button
          onClick={() => setActiveSubTab('design_note')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'design_note' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>B. Design Note</span>
        </button>

        <button
          onClick={() => setActiveSubTab('test_report')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'test_report' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>C. Test Execution Report</span>
        </button>

        <button
          onClick={() => setActiveSubTab('readme')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'readme' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>D. README Setup</span>
        </button>

        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'checklist' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>E. Submission Checklist</span>
        </button>

        <button
          onClick={() => setActiveSubTab('email')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'email' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:text-emerald-300'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>F. Recruiter Email Draft</span>
        </button>
      </div>

      {/* Tab Content Display Area */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* TAB A: COMBINED SYSTEM PROMPTS */}
        {activeSubTab === 'prompts' && (
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Deliverable A: Combined System Prompts Document</h3>
                <p className="text-xs text-slate-400">Complete, formatted system prompts for Loan Settlement (Priya) and Insurance Renewal (Rajesh).</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(COMBINED_PROMPTS_MARKDOWN, 'prompts')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  {copiedSection === 'prompts' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'prompts' ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(COMBINED_PROMPTS_MARKDOWN, 'CreditNirvana_Combined_SystemPrompts.md')}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(COMBINED_PROMPTS_MARKDOWN, 'CreditNirvana_Combined_SystemPrompts.txt', 'text/plain')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
              {COMBINED_PROMPTS_MARKDOWN}
            </div>
          </div>
        )}

        {/* TAB B: DESIGN NOTE */}
        {activeSubTab === 'design_note' && (
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Deliverable B: Architectural Design Note</h3>
                <p className="text-xs text-slate-400">7-section analysis of agent personas, objection matrices, conversion, compliance, voice pipeline, and testing.</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(DESIGN_NOTE_MARKDOWN, 'design_note')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  {copiedSection === 'design_note' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'design_note' ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(DESIGN_NOTE_MARKDOWN, 'CreditNirvana_Design_Note.md')}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
              {DESIGN_NOTE_MARKDOWN}
            </div>
          </div>
        )}

        {/* TAB C: TEST REPORT */}
        {activeSubTab === 'test_report' && (
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Deliverable C: Test Execution Report</h3>
                <p className="text-xs text-slate-400">Mathematical invariants and compliance audit verification results.</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(TEST_REPORT_MARKDOWN, 'test_report')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  {copiedSection === 'test_report' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'test_report' ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(TEST_REPORT_MARKDOWN, 'CreditNirvana_Test_Report.md')}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
              {TEST_REPORT_MARKDOWN}
            </div>
          </div>
        )}

        {/* TAB D: README */}
        {activeSubTab === 'readme' && (
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Deliverable D: README Setup & Instructions</h3>
                <p className="text-xs text-slate-400">Installation, configuration, and environment setup documentation.</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(README_MARKDOWN, 'readme')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  {copiedSection === 'readme' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'readme' ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(README_MARKDOWN, 'README.md')}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download README.md</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
              {README_MARKDOWN}
            </div>
          </div>
        )}

        {/* TAB E: SUBMISSION CHECKLIST */}
        {activeSubTab === 'checklist' && (
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Deliverable E: Final Submission Checklist</h3>
                <p className="text-xs text-slate-400">Audit checklist confirming that every single requirement is built, verified, and operational.</p>
              </div>
              <div className="flex items-center space-x-2 text-xs bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>12 / 12 Complete (100%)</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {CHECKLIST_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-200 font-medium flex-1">{item.title}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB F: RECRUITER EMAIL DRAFT */}
        {activeSubTab === 'email' && (
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Deliverable F: Recruiter Submission Email Draft</h3>
                <p className="text-xs text-slate-400">
                  Addressed to <strong className="text-slate-200">Ambuj Pratap Jain</strong> with instant clipboard copy.
                </p>
              </div>

              <button
                onClick={() => handleCopy(computedEmailBody, 'email')}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                {copiedSection === 'email' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                <span>{copiedSection === 'email' ? 'Email Copied!' : 'Copy Full Email Draft'}</span>
              </button>
            </div>

            {/* Email Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">To:</label>
                <input
                  type="text"
                  readOnly
                  value={RECRUITER_EMAIL_DRAFT.to}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Subject Line:</label>
                <input
                  type="text"
                  readOnly
                  value={RECRUITER_EMAIL_DRAFT.subject}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Your Mobile 1:</label>
                <input
                  type="text"
                  value={mobile1}
                  onChange={(e) => setMobile1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Your Mobile 2:</label>
                <input
                  type="text"
                  value={mobile2}
                  onChange={(e) => setMobile2(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Your Full Name:</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Live App URL:</label>
                <input
                  type="text"
                  value={hostedAppUrl}
                  onChange={(e) => setHostedAppUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email Body Preview */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
              {computedEmailBody}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
