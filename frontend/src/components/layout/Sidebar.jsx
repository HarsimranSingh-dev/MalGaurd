import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FileSearch, 
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
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#f1ede6] border-r border-[#e5e0d8] flex flex-col
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#e5e0d8] flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#226343] flex items-center justify-center shadow-subtle">
                <ShieldAlert className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#226343]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#1c1e21]">MAL<span className="text-[#226343]">GUARD</span></span>
              </div>
              <p className="text-[11px] font-mono text-[#7c828d] tracking-wider uppercase">Cyber Defense SOC</p>
            </div>
          </div>
        </div>

        {/* SOC Live Sensor Status Pill */}
        <div className="mx-4 my-3 p-2.5 rounded-lg bg-[#ffffff] border border-[#e5e0d8] flex items-center justify-between text-xs shadow-subtle">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#226343]" />
            <span className="text-[#1c1e21] font-medium">SOC Telemetry</span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#edf7f0] text-[#1b5e39] border border-[#c9e6d4] font-semibold">
            ONLINE
          </span>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[11px] font-mono font-semibold tracking-wider text-[#7c828d] uppercase">
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
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors group
                  ${isActive 
                    ? 'bg-[#ffffff] text-[#1c1e21] border border-[#d4cec4] shadow-subtle font-semibold' 
                    : 'text-[#525866] hover:text-[#1c1e21] hover:bg-[#eae5dc]'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#226343]' : 'text-[#7c828d] group-hover:text-[#1c1e21]'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`
                    text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold
                    ${isActive ? 'bg-[#edf7f0] text-[#1b5e39] border border-[#c9e6d4]' : 'bg-[#e5e0d8] text-[#525866] group-hover:bg-[#ded9cf]'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Threat Level Indicator footer */}
        <div className="p-4 border-t border-[#e5e0d8] bg-[#f1ede6]">
          <div className="rounded-xl p-3 bg-[#ffffff] border border-[#e5e0d8] shadow-subtle">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[#525866] flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-[#9a5b04]" />
                Global Threat Level
              </span>
              <span className="text-[11px] font-mono font-bold text-[#9a5b04] bg-[#fef8eb] px-1.5 py-0.5 rounded border border-[#fae1b1]">ELEVATED</span>
            </div>
            <div className="w-full bg-[#f1ede6] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-[#9a5b04] h-full w-[65%] rounded-full"></div>
            </div>
            <p className="mt-2 text-[10px] text-[#7c828d] font-mono flex items-center justify-between">
              <span>Model: Heuristic v3.4</span>
              <span className="text-[#226343] font-medium">Zero-Day Shield</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
