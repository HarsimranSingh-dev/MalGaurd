import React from 'react';
import { Target, ExternalLink, Shield } from 'lucide-react';

export default function MitreTacticsTags({ tactics = [] }) {
  if (!tactics || tactics.length === 0) {
    return (
      <div className="rounded-2xl bg-[#0b1224] p-5 border border-[#1e2d4e]">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-4 h-4 text-slate-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">MITRE ATT&CK® Mapping</h4>
        </div>
        <p className="text-xs text-slate-400">
          No adversary tactics or technique signatures mapped for this sample. File exhibits benign runtime execution profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0b1224] p-5 border border-[#1e2d4e]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">MITRE ATT&CK® Tactics & Techniques</h4>
            <p className="text-[11px] text-slate-400">Mapped adversary behavior catalogued in cyber kill-chain</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30 font-bold">
          {tactics.length} Techniques
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {tactics.map((tactic) => (
          <div
            key={tactic.id}
            className="group flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#0f172e] border border-red-500/30 hover:border-red-400/60 hover:bg-[#14203d] transition-all shadow-sm"
          >
            <span className="font-mono text-xs font-bold text-red-400 group-hover:text-red-300">
              {tactic.id}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-200 font-medium">
              {tactic.name}
            </span>
            {tactic.phase && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-400 uppercase">
                {tactic.phase}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
