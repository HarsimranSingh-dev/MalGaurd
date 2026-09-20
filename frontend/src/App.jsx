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
    <div className="min-h-screen bg-[#f8f7f4] text-[#1c1e21] cyber-grid-bg flex flex-col selection:bg-[#226343]/15 selection:text-[#1b5036]">
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
        <footer className="mt-auto border-t border-[#e5e0d8] bg-[#f1ede6] px-4 sm:px-8 py-4 text-xs font-mono text-[#525866] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#226343]"></span>
            <span className="font-medium text-[#1c1e21]">MalGuard v1.0</span>
          </div>
          <div className="text-[#7c828d]">
            Malware analysis & incident response platform
          </div>
        </footer>
      </div>
    </div>
  );
}
