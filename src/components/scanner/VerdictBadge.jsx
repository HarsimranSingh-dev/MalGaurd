import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldX, ShieldAlert } from 'lucide-react';

export default function VerdictBadge({ verdict, size = 'large' }) {
  const configs = {
    CLEAN: {
      label: 'CLEAN / BENIGN',
      sublabel: 'No malicious indicators or threat signatures found',
      color: 'emerald',
      bg: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400',
      badgeClass: 'cyber-badge-clean',
      glow: 'shadow-neon-emerald',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      pulse: false
    },
    SUSPICIOUS: {
      label: 'SUSPICIOUS / UNVERIFIED',
      sublabel: 'Heuristic anomalies detected; quarantine recommended',
      color: 'amber',
      bg: 'bg-amber-950/40 border-amber-500/50 text-amber-400',
      badgeClass: 'cyber-badge-suspicious',
      glow: 'shadow-neon-amber',
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/20 text-amber-400',
      pulse: true
    },
    MALICIOUS: {
      label: 'MALICIOUS THREAT DETECTED',
      sublabel: 'High-confidence malware signature; immediate containment required',
      color: 'crimson',
      bg: 'bg-red-950/40 border-red-500/60 text-red-400',
      badgeClass: 'cyber-badge-malicious',
      glow: 'shadow-neon-crimson',
      icon: AlertOctagon,
      iconBg: 'bg-red-500/20 text-red-400',
      pulse: true
    }
  };

  const config = configs[verdict] || configs.SUSPICIOUS;
  const Icon = config.icon;

  if (size === 'small') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${config.badgeClass}`}>
        <Icon className={`w-3.5 h-3.5 ${config.pulse ? 'animate-pulse' : ''}`} />
        <span>{verdict}</span>
      </span>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 border ${config.bg} ${config.glow} backdrop-blur-md`}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className={`p-4 rounded-2xl border border-current/30 ${config.iconBg} relative`}>
          <Icon className={`w-10 h-10 ${config.pulse ? 'animate-pulse' : ''}`} />
          {config.pulse && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          )}
        </div>

        <div className="text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">SOC Assessment Verdict:</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-extrabold ${config.badgeClass}`}>
              {verdict}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white">
            {config.label}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            {config.sublabel}
          </p>
        </div>
      </div>
    </div>
  );
}
