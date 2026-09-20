import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  ShieldCheck, 
  Bell, 
  Cpu, 
  PlusCircle, 
  RefreshCw 
} from 'lucide-react';
import { checkBackendHealth } from '../../services/api';

export default function TopHeader({ 
  currentTab, 
  setCurrentTab, 
  setMobileOpen,
  onQuickScan 
}) {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    let isMounted = true;
    async function verifyBackend() {
      const health = await checkBackendHealth();
      if (isMounted) {
        setBackendStatus(health?.status === 'healthy' ? 'online' : 'standby');
      }
    }
    verifyBackend();
    const interval = setInterval(verifyBackend, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const titles = {
    dashboard: { title: 'Security Operations Center', subtitle: 'Real-time telemetry, threat landscape & incident monitoring' },
    scanner: { title: 'Deep File Threat Analyzer', subtitle: 'Static PE disassembly, entropy analysis, and AI model inference' },
    symptoms: { title: 'Symptom-Based Assistant & Playbook Generator', subtitle: 'Natural language triage, malware matching, and containment playbooks' },
    history: { title: 'Forensic Scan Audit History', subtitle: 'Immutable log of historical file hashes, verdicts, and indicators' },
    encyclopedia: { title: 'Malware Family Encyclopedia', subtitle: 'Comprehensive MITRE ATT&CK taxonomy and remediation guides' },
    simulation: { title: 'Safe Sandbox Simulation', subtitle: 'Interactive live demonstration of malware detection vectors' },
  };

  const currentInfo = titles[currentTab] || titles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e5e0d8] px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & breadcrumb/title */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-[#f1ede6] text-[#1c1e21] border border-[#e5e0d8] lg:hidden hover:bg-[#eae5dc]"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg lg:text-xl font-bold text-[#1c1e21] tracking-tight flex items-center gap-2">
              <span>{currentInfo.title}</span>
            </h1>
            <p className="text-xs text-[#525866] hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Live Backend status badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#f1ede6] border border-[#e5e0d8] text-xs">
            <span className={`h-2 w-2 rounded-full ${
              backendStatus === 'online' 
                ? 'bg-[#226343] animate-pulse' 
                : backendStatus === 'checking' 
                ? 'bg-[#9a5b04]' 
                : 'bg-[#7c828d]'
            }`}></span>
            <span className="text-[#525866] font-mono text-[11px]">
              {backendStatus === 'online' ? 'API: Connected (Render)' : backendStatus === 'checking' ? 'Checking API...' : 'API: Standby'}
            </span>
          </div>

          {/* Quick Scan CTA Button */}
          <button
            onClick={() => {
              setCurrentTab('scanner');
              if (onQuickScan) onQuickScan();
            }}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#226343] hover:bg-[#1b5036] text-white font-medium text-xs tracking-wide shadow-subtle transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze File</span>
          </button>

          {/* Quick Symptom CTA button */}
          <button
            onClick={() => setCurrentTab('symptoms')}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#f1ede6] hover:bg-[#eae5dc] text-[#1c1e21] border border-[#e5e0d8] text-xs font-medium transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-[#226343]" />
            <span>Symptom Triage</span>
          </button>
        </div>
      </div>
    </header>
  );
}
