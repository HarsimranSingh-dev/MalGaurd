import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldX, ShieldAlert } from 'lucide-react';

export default function VerdictBadge({ verdict, size = 'large' }) {
  const configs = {
    CLEAN: {
      label: 'CLEAN / BENIGN',
      sublabel: 'No malicious indicators or threat signatures found',
      color: 'emerald',
      bg: 'bg-[#edf7f0] border-[#c9e6d4]',
      badgeClass: 'cyber-badge-clean',
      titleColor: 'text-[#1b5e39]',
      icon: ShieldCheck,
      iconBg: 'bg-[#ffffff] text-[#1b5e39] border-[#c9e6d4]',
      pulse: false
    },
    SUSPICIOUS: {
      label: 'SUSPICIOUS / UNVERIFIED',
      sublabel: 'Heuristic anomalies detected; quarantine recommended',
      color: 'amber',
      bg: 'bg-[#fef8eb] border-[#fae1b1]',
      badgeClass: 'cyber-badge-suspicious',
      titleColor: 'text-[#9a5b04]',
      icon: AlertTriangle,
      iconBg: 'bg-[#ffffff] text-[#9a5b04] border-[#fae1b1]',
      pulse: false
    },
    MALICIOUS: {
      label: 'MALICIOUS THREAT DETECTED',
      sublabel: 'High-confidence malware signature; immediate containment required',
      color: 'crimson',
      bg: 'bg-[#fdf2f2] border-[#f8cdcd]',
      badgeClass: 'cyber-badge-malicious',
      titleColor: 'text-[#a81c1c]',
      icon: AlertOctagon,
      iconBg: 'bg-[#ffffff] text-[#a81c1c] border-[#f8cdcd]',
      pulse: false
    }
  };

  const config = configs[verdict] || configs.SUSPICIOUS;
  const Icon = config.icon;

  if (size === 'small') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${config.badgeClass}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{verdict}</span>
      </span>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl p-6 border ${config.bg} shadow-subtle`}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className={`p-4 rounded-xl border ${config.iconBg} relative shadow-subtle`}>
          <Icon className="w-8 h-8" />
        </div>

        <div className="text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[#7c828d]">SOC Assessment Verdict:</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${config.badgeClass}`}>
              {verdict}
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${config.titleColor}`}>
            {config.label}
          </h2>
          <p className="text-xs sm:text-sm text-[#525866] mt-1 font-medium">
            {config.sublabel}
          </p>
        </div>
      </div>
    </div>
  );
}
