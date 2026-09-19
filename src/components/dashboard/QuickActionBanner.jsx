import React from 'react';
import { ShieldCheck, Stethoscope, Terminal, ArrowRight, Sparkles } from 'lucide-react';

export default function QuickActionBanner({ onNavigate }) {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-r from-[#0c1833] via-[#0d1e44] to-[#0a142c] border border-cyan-500/30 relative overflow-hidden shadow-card-glow">
      {/* Visual cyber mesh background */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-0 right-1/3 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Heuristic Threat Response</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Next-Gen Threat Analysis & Incident Triage
          </h2>
          <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
            Inspect suspicious PE executables, compute Shannon entropy, map adversary tradecraft to the MITRE ATT&CK framework, or generate an automated containment playbook from symptom descriptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-neon-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Scan Suspicious File</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('symptoms')}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[#111f3d] hover:bg-[#16274e] text-cyan-300 border border-cyan-500/30 text-sm font-semibold transition-all hover:border-cyan-400/50"
          >
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            <span>Symptom Assistant</span>
          </button>

          <button
            onClick={() => onNavigate('simulation')}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[#0e1629] hover:bg-[#14203b] text-slate-300 border border-slate-700 text-sm font-semibold transition-all"
          >
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>Run Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
