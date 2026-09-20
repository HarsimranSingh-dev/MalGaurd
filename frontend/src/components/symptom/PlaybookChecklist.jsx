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
      badgeColor: 'bg-[#fdf2f2] text-[#a81c1c] border-[#f8cdcd]',
      dotColor: 'bg-[#a81c1c]',
      emoji: '🔴',
      description: 'Isolate affected systems to prevent lateral infection across network boundaries.',
      items: playbook.contain || []
    },
    {
      key: 'eradicate',
      title: 'Phase 2: Eradication',
      icon: Trash2,
      badgeColor: 'bg-[#fef8eb] text-[#9a5b04] border-[#fae1b1]',
      dotColor: 'bg-[#9a5b04]',
      emoji: '🟠',
      description: 'Purge malware artifacts, persistence keys, rogue tasks, and dropped binaries.',
      items: playbook.eradicate || []
    },
    {
      key: 'recover',
      title: 'Phase 3: Recovery',
      icon: RotateCcw,
      badgeColor: 'bg-[#edf7f0] text-[#1b5e39] border-[#c9e6d4]',
      dotColor: 'bg-[#1b5e39]',
      emoji: '🟢',
      description: 'Restore clean configurations, verify system integrity, and rotate credentials.',
      items: playbook.recover || []
    },
    {
      key: 'prevent',
      title: 'Phase 4: Prevention & Hardening',
      icon: ShieldCheck,
      badgeColor: 'bg-[#f1ede6] text-[#1c1e21] border-[#e5e0d8]',
      dotColor: 'bg-[#226343]',
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
      <div className="p-5 rounded-xl bg-[#ffffff] border border-[#e5e0d8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#226343] font-bold">
              Standard Incident Response Lifecycle
            </span>
            <span className="text-xs text-[#7c828d] font-mono">• NIST SP 800-61</span>
          </div>
          <h3 className="text-lg font-bold text-[#1c1e21] tracking-tight mt-0.5">
            Step-by-Step Incident Response Playbook
          </h3>
          <p className="text-xs text-[#525866] mt-1">
            Follow sequential phases from immediate containment through root cause eradication.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs font-mono text-[#525866]">
              Completed: <strong className="text-[#226343] font-bold">{completedCount}</strong> / {totalCount}
            </div>
            <div className="w-36 bg-[#f1ede6] h-2 rounded-full overflow-hidden mt-1.5 border border-[#e5e0d8]">
              <div 
                className="h-full bg-[#226343] transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleCopyPlaybook}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#f1ede6] hover:bg-[#eae5dc] text-[#1c1e21] border border-[#e5e0d8] text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#1b5e39]" /> : <Copy className="w-4 h-4 text-[#7c828d]" />}
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
              className="rounded-xl bg-[#ffffff] border border-[#e5e0d8] overflow-hidden shadow-subtle"
            >
              {/* Phase Header */}
              <div className="p-4 bg-[#f8f7f4] border-b border-[#e5e0d8] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{phase.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1c1e21] tracking-wide flex items-center gap-2">
                      <span>{phase.title}</span>
                    </h4>
                    <p className="text-[11px] text-[#525866]">
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
                        flex items-start space-x-3.5 p-3.5 rounded-lg border transition-all cursor-pointer select-none
                        ${isChecked 
                          ? 'bg-[#edf7f0]/40 border-[#c9e6d4] opacity-80' 
                          : 'bg-[#f8f7f4] border-[#e5e0d8] hover:border-[#226343] hover:bg-[#ffffff]'}
                      `}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-[#226343] transition-colors shrink-0"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-[#1b5e39]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#7c828d]" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-mono font-bold ${isChecked ? 'line-through text-[#7c828d]' : 'text-[#1c1e21]'}`}>
                            {item.title}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${isChecked ? 'text-[#7c828d] line-through' : 'text-[#525866]'}`}>
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
