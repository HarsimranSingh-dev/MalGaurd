import React from 'react';
import { 
  Menu, 
  Search, 
  ShieldCheck, 
  Bell, 
  Cpu, 
  PlusCircle, 
  RefreshCw 
} from 'lucide-react';

export default function TopHeader({ 
  currentTab, 
  setCurrentTab, 
  setMobileOpen,
  onQuickScan 
}) {
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
    <header className="sticky top-0 z-30 bg-[#080d1a]/90 backdrop-blur-md border-b border-[#1e2d4e] px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & breadcrumb/title */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-[#0e1629] text-slate-300 border border-[#1e2d4e] lg:hidden hover:text-white"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{currentInfo.title}</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Status badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0c152a] border border-[#1e2d4e] text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-mono text-[11px]">API Contract: Ready</span>
          </div>

          {/* Quick Scan CTA Button */}
          <button
            onClick={() => {
              setCurrentTab('scanner');
              if (onQuickScan) onQuickScan();
            }}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-neon-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze File</span>
          </button>

          {/* Quick Symptom CTA button */}
          <button
            onClick={() => setCurrentTab('symptoms')}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0e1830] hover:bg-[#132247] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Symptom Triage</span>
          </button>
        </div>
      </div>
    </header>
  );
}
