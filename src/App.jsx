import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import DashboardPage from './pages/DashboardPage';
import FileScannerPage from './pages/FileScannerPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import ScanHistoryPage from './pages/ScanHistoryPage';
import MalwareEncyclopediaPage from './pages/MalwareEncyclopediaPage';
import SafeSimulationPage from './pages/SafeSimulationPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 cyber-grid-bg flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col transition-all duration-300">
        {/* Top Header */}
        <TopHeader 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          setMobileOpen={setMobileOpen}
          onQuickScan={() => setCurrentTab('scanner')}
        />

        {/* Page Views Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage onNavigate={(tab) => setCurrentTab(tab)} />
          )}

          {currentTab === 'scanner' && (
            <FileScannerPage />
          )}

          {currentTab === 'symptoms' && (
            <SymptomCheckerPage />
          )}

          {currentTab === 'history' && (
            <ScanHistoryPage />
          )}

          {currentTab === 'encyclopedia' && (
            <MalwareEncyclopediaPage />
          )}

          {currentTab === 'simulation' && (
            <SafeSimulationPage />
          )}
        </main>

        {/* Platform Footer */}
        <footer className="mt-auto border-t border-[#1e2d4e]/70 bg-[#060a14] px-4 sm:px-8 py-4 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>MalGuard CyberSOC Platform v2.4</span>
            <span>•</span>
            <span className="text-cyan-400">FastAPI API-Ready</span>
          </div>
          <div>
            Built for enterprise malware triage & incident response
          </div>
        </footer>
      </div>
    </div>
  );
}
