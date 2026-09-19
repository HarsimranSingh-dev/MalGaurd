import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function PlaybookChecklist({ playbook }) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [copied, setCopied] = useState(false);

  if (!playbook) return null;

  const phases = [
    {
      key: 'contain',
      title: 'Phase 1: Containment',
      icon: ShieldAlert,
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      dotColor: 'bg-red-500',
      emoji: '🔴',
      description: 'Isolate affected systems to prevent lateral infection across network boundaries.',
      items: playbook.contain || []
    },
    {
      key: 'eradicate',
      title: 'Phase 2: Eradication',
      icon: Trash2,
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      dotColor: 'bg-orange-500',
      emoji: '🟠',
      description: 'Purge malware artifacts, persistence keys, rogue tasks, and dropped binaries.',
      items: playbook.eradicate || []
    },
    {
      key: 'recover',
      title: 'Phase 3: Recovery',
      icon: RotateCcw,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      dotColor: 'bg-emerald-500',
      emoji: '🟢',
      description: 'Restore clean configurations, verify system integrity, and rotate credentials.',
      items: playbook.recover || []
    },
    {
      key: 'prevent',
      title: 'Phase 4: Prevention & Hardening',
      icon: ShieldCheck,
      badgeColor: 'bg-blue-500/20 text-cyan-400 border-cyan-500/40',
      dotColor: 'bg-cyan-500',
      emoji: '🔵',
      description: 'Apply defensive group policies, patch vulnerabilities, and deploy detection rules.',
      items: playbook.prevent || []
    }
  ];

  // Calculate completion percentage
  const allItems = phases.flatMap(p => p.items);
  const totalCount = allItems.length;
  const completedCount = allItems.filter(item => completedSteps[item.id]).length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleStep = (id) => {
    setCompletedSteps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyPlaybook = () => {
    let text = `=== MALGUARD INCIDENT RESPONSE PLAYBOOK ===\n\n`;
    phases.forEach(p => {
      text += `${p.emoji} ${p.title}\n`;
      p.items.forEach((item, idx) => {
        const isDone = completedSteps[item.id] ? '[x]' : '[ ]';
        text += `  ${isDone} ${item.title}: ${item.text}\n`;
      });
      text += `\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Playbook Header & Progress Tracker */}
      <div className="p-5 rounded-2xl bg-[#0b1224] border border-[#1e2d4e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Standard Incident Response Lifecycle
            </span>
            <span className="text-xs text-slate-500 font-mono">• NIST SP 800-61</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Step-by-Step Incident Response Playbook
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Follow sequential phases from immediate containment through root cause eradication.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">
              Completed: <strong className="text-cyan-300 font-bold">{completedCount}</strong> / {totalCount}
            </div>
            <div className="w-36 bg-[#121c33] h-2 rounded-full overflow-hidden mt-1.5 border border-[#1e2d4e]">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleCopyPlaybook}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#13203e] hover:bg-[#1a2d59] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Playbook'}</span>
          </button>
        </div>
      </div>

      {/* 4 Phases Stack */}
      <div className="grid grid-cols-1 gap-6">
        {phases.map((phase) => {
          const PhaseIcon = phase.icon;
          return (
            <div 
              key={phase.key}
              className="rounded-2xl bg-[#0b1224] border border-[#1e2d4e] overflow-hidden"
            >
              {/* Phase Header */}
              <div className="p-4 bg-[#0e162c] border-b border-[#1e2d4e] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{phase.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                      <span>{phase.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {phase.description}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${phase.badgeColor} font-bold`}>
                  {phase.items.filter(i => completedSteps[i.id]).length} / {phase.items.length} Done
                </span>
              </div>

              {/* Checklist Items */}
              <div className="p-4 space-y-3">
                {phase.items.map((item) => {
                  const isChecked = !!completedSteps[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleStep(item.id)}
                      className={`
                        flex items-start space-x-3.5 p-3.5 rounded-xl border transition-all cursor-pointer select-none
                        ${isChecked 
                          ? 'bg-[#08121f]/50 border-emerald-500/30 opacity-75' 
                          : 'bg-[#0e172e] border-[#1e2d4e] hover:border-cyan-500/40 hover:bg-[#121f3d]'}
                      `}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-mono font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                            {item.title}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${isChecked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
