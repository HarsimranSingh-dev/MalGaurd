import React, { useState } from 'react';
import { X, BookOpen, Copy, Check, ShieldAlert, CheckCircle2, Terminal } from 'lucide-react';
import PlaybookChecklist from '../symptom/PlaybookChecklist';

export default function FamilyPlaybookModal({ family, onClose }) {
  if (!family) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#090f20] border border-cyan-500/40 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#1e2d4e] flex items-center justify-between bg-[#0b142c] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-opacity-20 border border-current/40" style={{ color: family.color, backgroundColor: `${family.color}20` }}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {family.name} Incident Response Playbook
                </h3>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  family.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  family.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {family.severity} SEVERITY
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400/80 mt-0.5">
                Targeted Containment & Eradication Strategy
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-[#14203b] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Overview Callout */}
          <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2d4e]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Threat Overview:</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {family.description}
            </p>
          </div>

          {/* Indicators of Compromise summary */}
          {family.indicators && (
            <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2d4e]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Common Indicators of Compromise (IoCs):</h4>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                {family.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-red-400">›</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Interactive 4-Phase Playbook */}
          <PlaybookChecklist playbook={family.playbook} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e2d4e] bg-[#0b142c] flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
          <span>MalGuard Threat Intel Repository</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#14203b] hover:bg-[#1a2d59] text-white font-semibold transition-colors"
          >
            Close Playbook
          </button>
        </div>
      </div>
    </div>
  );
}
