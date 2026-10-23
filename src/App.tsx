/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { VoiceAgentView } from './components/VoiceAgentView';
import { DifficultSimulator } from './components/DifficultSimulator';
import { TestSuiteView } from './components/TestSuiteView';
import { PromptLabView } from './components/PromptLabView';
import { SubmissionView } from './components/SubmissionView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [systemStatus, setSystemStatus] = useState<{
    sarvamConfigured: boolean;
    geminiConfigured: boolean;
  }>({
    sarvamConfigured: false,
    geminiConfigured: false,
  });

  useEffect(() => {
    // Check backend health
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setSystemStatus({
          sarvamConfigured: data.sarvamConfigured || false,
          geminiConfigured: data.geminiConfigured || false,
        });
      })
      .catch((err) => {
        console.warn('Backend health check error:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard setActiveTab={setActiveTab} systemStatus={systemStatus} />
        )}

        {activeTab === 'loan_agent' && (
          <VoiceAgentView agentType="loan_settlement" />
        )}

        {activeTab === 'insurance_agent' && (
          <VoiceAgentView agentType="insurance_renewal" />
        )}

        {activeTab === 'scenarios' && <DifficultSimulator />}

        {activeTab === 'tests' && <TestSuiteView />}

        {activeTab === 'prompts' && <PromptLabView />}

        {activeTab === 'submission' && <SubmissionView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">CreditNirvana Voice Labs</span>
            <span>•</span>
            <span>Hiring Assignment Submission for Prompt Engineer Intern (Voice AI & Agentic AI)</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Evaluated by Ambuj Pratap Jain</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('submission')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
            >
              Submission Package
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
