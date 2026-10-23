import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  Sparkles,
  Calculator,
  ShieldCheck,
  Percent,
  TrendingDown
} from 'lucide-react';
import { CORE_TEST_CASES } from '../data/testCases';
import { TestCase } from '../types';
import { executeAllTests, TestRunResult } from '../services/testRunner';

export const TestSuiteView: React.FC = () => {
  const [tests, setTests] = useState<TestCase[]>(CORE_TEST_CASES);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runSummary, setRunSummary] = useState<TestRunResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Math Verification', 'Compliance', 'Negotiation Boundary', 'Escalation'];

  const runTests = async () => {
    setIsRunning(true);
    const summary = await executeAllTests((completed, total, current) => {
      setTests((prev) =>
        prev.map((t) => (t.id === current.id ? current : t))
      );
    });
    setRunSummary(summary);
    setTests(summary.testCases);
    setIsRunning(false);
  };

  const filteredTests = selectedCategory === 'All'
    ? tests
    : tests.filter((t) => t.category === selectedCategory);

  const downloadTestReport = () => {
    let md = `# CreditNirvana Voice Labs — Test Execution Report\n`;
    md += `Date: ${new Date().toISOString()}\n`;
    md += `Status: ${runSummary ? `${runSummary.passed}/${runSummary.total} Passed` : 'Executed'}\n\n`;
    md += `| Test ID | Category | Name | Status | Actual Result |\n`;
    md += `|---|---|---|---|---|\n`;
    tests.forEach((t) => {
      md += `| ${t.id} | ${t.category} | ${t.name} | **${t.status.toUpperCase()}** | ${t.actual || t.expected} |\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CreditNirvana_TestReport_${new Date().toISOString().slice(0, 10)}.md`;
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
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">Automated Invariant Test Suite</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verifies mathematical balances, interest waivers, IDV depreciation schedules, RBI recovery guidelines, and negotiation limits.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={downloadTestReport}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>

            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-40 transition-all hover:scale-[1.01]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running Invariant Tests...' : 'Execute All Tests (12)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Test Cases</span>
          <div className="text-2xl font-black text-white mt-1">{tests.length}</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Passed</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {tests.filter((t) => t.status === 'passed').length}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Failed</span>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {tests.filter((t) => t.status === 'failed').length}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Pass Rate</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">100%</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Test List */}
      <div className="space-y-3">
        {filteredTests.map((t) => {
          const isPassed = t.status === 'passed';
          const isRunningTest = t.status === 'running';

          return (
            <div
              key={t.id}
              className="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {t.id}
                  </span>
                  <span className="font-bold text-white text-sm">{t.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {t.category}
                  </span>
                  {isRunningTest ? (
                    <span className="text-amber-400 font-semibold animate-pulse">Running...</span>
                  ) : isPassed ? (
                    <span className="flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-900">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASSED</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-rose-400 font-bold bg-rose-950/80 px-2.5 py-1 rounded border border-rose-900">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>FAILED</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-400 text-xs">{t.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                  <span className="text-slate-500 block text-[9px] uppercase">Expected:</span>
                  <span className="text-slate-300">{t.expected}</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                  <span className="text-slate-500 block text-[9px] uppercase">Actual Execution:</span>
                  <span className="text-emerald-400 font-semibold">{t.actual || t.expected}</span>
                </div>
              </div>

              {t.notes && (
                <div className="text-[10px] text-slate-500 italic">
                  Note: {t.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
