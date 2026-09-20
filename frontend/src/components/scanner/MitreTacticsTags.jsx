import React from 'react';
import { Target, ExternalLink, Shield } from 'lucide-react';

export default function MitreTacticsTags({ tactics = [] }) {
  if (!tactics || tactics.length === 0) {
    return (
      <div className="rounded-xl bg-[#ffffff] p-5 border border-[#e5e0d8] shadow-subtle">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-4 h-4 text-[#7c828d]" />
          <h4 className="text-sm font-bold text-[#1c1e21] tracking-wide">MITRE ATT&CK® Mapping</h4>
        </div>
        <p className="text-xs text-[#525866]">
          No adversary tactics or technique signatures mapped for this sample. File exhibits benign runtime execution profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#ffffff] p-5 border border-[#e5e0d8] shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#fdf2f2] text-[#a81c1c] border border-[#f8cdcd]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1c1e21] tracking-wide">MITRE ATT&CK® Tactics & Techniques</h4>
            <p className="text-[11px] text-[#525866]">Mapped adversary behavior catalogued in cyber kill-chain</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#fdf2f2] text-[#a81c1c] border border-[#f8cdcd] font-bold">
          {tactics.length} Techniques
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {tactics.map((tactic) => (
          <div
            key={tactic.id}
            className="group flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#f8f7f4] border border-[#e5e0d8] hover:border-[#a81c1c] transition-colors shadow-subtle"
          >
            <span className="font-mono text-xs font-bold text-[#a81c1c]">
              {tactic.id}
            </span>
            <span className="text-[#d4cec4]">|</span>
            <span className="text-xs text-[#1c1e21] font-medium">
              {tactic.name}
            </span>
            {tactic.phase && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f1ede6] text-[#525866] uppercase border border-[#e5e0d8]">
                {tactic.phase}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
