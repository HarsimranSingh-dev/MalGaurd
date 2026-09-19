import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FileSearch, 
  Stethoscope, 
  History, 
  BookOpen, 
  Terminal, 
  Radio, 
  Activity, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'SOC Overview', icon: LayoutDashboard, badge: 'Live' },
    { id: 'scanner', label: 'File Threat Analyzer', icon: FileSearch, badge: 'AI Engine' },
    { id: 'symptoms', label: 'Symptom Diagnosis', icon: Stethoscope, badge: 'Playbook' },
    { id: 'history', label: 'Scan Audit History', icon: History },
    { id: 'encyclopedia', label: 'Threat Encyclopedia', icon: BookOpen, badge: 'MITRE' },
    { id: 'simulation', label: 'Safe Simulation Demo', icon: Terminal, badge: 'Sandbox' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#080e1e] border-r border-[#1e2d4e] flex flex-col
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1e2d4e]/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-neon-cyan">
                <ShieldAlert className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-wider text-white">MAL<span className="text-cyan-400">GUARD</span></span>
              </div>
              <p className="text-[11px] font-mono text-cyan-400/80 tracking-widest uppercase">Cyber Defense SOC</p>
            </div>
          </div>
        </div>

        {/* SOC Live Sensor Status Pill */}
        <div className="mx-4 my-3 p-2.5 rounded-lg bg-[#0c152a] border border-[#1e2d4e] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">SOC Telemetry</span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            ONLINE
          </span>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-300 border-l-4 border-cyan-400 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111d38]/60'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`
                    text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold
                    ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Threat Level Indicator footer */}
        <div className="p-4 border-t border-[#1e2d4e]/80 bg-[#060a16]">
          <div className="rounded-xl p-3 bg-gradient-to-b from-[#0e172e] to-[#0a1122] border border-[#1e2d4e]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                Global Threat Level
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-400">ELEVATED</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 h-full w-[65%] rounded-full animate-pulse"></div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Model: Heuristic v3.4</span>
              <span className="text-cyan-400">Zero-Day Shield</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
