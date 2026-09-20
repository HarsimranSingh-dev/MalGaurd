import React from 'react';
import { X, BookOpen, ShieldAlert, Trash2, RotateCcw, ShieldCheck } from 'lucide-react';

const phases = [
  { key: 'contain',   emoji: '🔴', title: 'Phase 1: Containment',           icon: ShieldAlert },
  { key: 'eradicate', emoji: '🟠', title: 'Phase 2: Eradication',            icon: Trash2 },
  { key: 'recover',   emoji: '🟢', title: 'Phase 3: Recovery',               icon: RotateCcw },
  { key: 'prevent',   emoji: '🔵', title: 'Phase 4: Prevention & Hardening', icon: ShieldCheck },
];

export default function FamilyPlaybookModal({ family, onClose }) {
  if (!family) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white border border-[#e5e0d8] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#e5e0d8] flex items-center justify-between bg-[#f8f7f4] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl border" style={{ color: family.color, backgroundColor: `${family.color}20`, borderColor: `${family.color}40` }}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-[#1c1e21] tracking-wide">
                  {family.name} Incident Response Playbook
                </h3>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  family.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
                  family.severity === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                  'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {family.severity} SEVERITY
                </span>
              </div>
              <p className="text-xs font-mono text-[#525866] mt-0.5">Targeted Containment & Eradication Strategy</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-[#f1ede6] text-[#525866] hover:text-[#1c1e21] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-white">
          {/* Overview */}
          <div className="p-4 rounded-xl bg-[#f8f7f4] border border-[#e5e0d8]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#525866] mb-1 font-semibold">Threat Overview:</h4>
            <p className="text-sm text-[#1c1e21] leading-relaxed">{family.description}</p>
          </div>

          {/* IoCs */}
          {family.indicators && (
            <div className="p-4 rounded-xl bg-[#f8f7f4] border border-[#e5e0d8]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#525866] mb-2 font-semibold">Common Indicators of Compromise (IoCs):</h4>
              <ul className="space-y-1.5 text-xs text-[#1c1e21] font-mono">
                {family.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#a82a2a] font-bold">›</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4-Phase Playbook */}
          {family.playbook && (
            <div className="space-y-4">
              {phases.map((phase) => {
                const items = (family.playbook[phase.key] || []);
                if (items.length === 0) return null;
                return (
                  <div key={phase.key} className="rounded-xl bg-white border border-[#e5e0d8] overflow-hidden shadow-sm">
                    <div className="p-4 bg-[#f8f7f4] border-b border-[#e5e0d8] flex items-center space-x-3">
                      <span className="text-lg">{phase.emoji}</span>
                      <h4 className="text-sm font-bold text-[#1c1e21]">{phase.title}</h4>
                      <span className="ml-auto text-[11px] font-mono text-[#7c828d]">{items.length} steps</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {items.map((item, idx) => (
                        <div key={item.id || idx} className="p-3.5 rounded-lg bg-[#f8f7f4] border border-[#e5e0d8]">
                          <div className="text-xs font-mono font-bold text-[#1c1e21] mb-1">{item.title}</div>
                          <p className="text-xs text-[#525866] leading-relaxed">{item.text || item.desc || ''}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e5e0d8] bg-[#f8f7f4] flex items-center justify-between text-xs text-[#525866] font-mono shrink-0">
          <span>MalGuard Threat Intel Repository</span>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-[#226343] hover:bg-[#1b5036] text-white font-semibold transition-colors shadow-sm">
            Close Playbook
          </button>
        </div>
      </div>
    </div>
  );
}
