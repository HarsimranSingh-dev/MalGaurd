import React from 'react';
import { ShieldCheck, Terminal, ArrowRight, Sparkles } from 'lucide-react';

export default function QuickActionBanner({ onNavigate }) {
  return (
    <div className="rounded-xl p-6 bg-[#ffffff] border border-[#e5e0d8] relative overflow-hidden shadow-subtle">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#edf7f0] border border-[#c9e6d4] text-[#1b5e39] text-xs font-mono mb-3 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#226343]" />
            <span>AI-Driven Heuristic Threat Response</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1c1e21] tracking-tight">
            Next-Gen Threat Analysis & Incident Triage
          </h2>
          <p className="mt-1.5 text-sm text-[#525866] leading-relaxed">
            Inspect suspicious PE executables, compute Shannon entropy, and map adversary tradecraft to the MITRE ATT&CK framework.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#226343] hover:bg-[#1b5036] text-white font-medium text-sm tracking-wide shadow-subtle transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Scan Suspicious File</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('simulation')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#ffffff] hover:bg-[#f1ede6] text-[#525866] hover:text-[#1c1e21] border border-[#e5e0d8] text-sm font-medium transition-all"
          >
            <Terminal className="w-4 h-4 text-[#7c828d]" />
            <span>Run Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
