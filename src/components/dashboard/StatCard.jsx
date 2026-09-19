import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'cyan', // 'cyan' | 'emerald' | 'crimson' | 'amber'
  trend,
  badge
}) {
  const styles = {
    cyan: {
      border: 'border-cyan-500/30 hover:border-cyan-400/60',
      glow: 'shadow-neon-cyan/20',
      bgGlow: 'from-cyan-500/10 to-transparent',
      text: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-400/60',
      glow: 'shadow-neon-emerald/20',
      bgGlow: 'from-emerald-500/10 to-transparent',
      text: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
    crimson: {
      border: 'border-red-500/35 hover:border-red-400/60',
      glow: 'shadow-neon-crimson/20',
      bgGlow: 'from-red-500/10 to-transparent',
      text: 'text-red-400',
      badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
      iconBg: 'bg-red-500/15 text-red-400 border-red-500/30',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-400/60',
      glow: 'shadow-neon-amber/20',
      bgGlow: 'from-amber-500/10 to-transparent',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    }
  };

  const style = styles[variant] || styles.cyan;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl bg-[#0b1224] p-5 border ${style.border} 
      transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${style.glow}
    `}>
      {/* Background radial gradient */}
      <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${style.bgGlow} rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none`}></div>

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">{title}</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white">{value}</span>
            {badge && (
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${style.badgeBg} font-bold`}>
                {badge}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border ${style.iconBg} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-[#1a2642]">
        <span>{subtitle}</span>
        {trend && (
          <span className={`font-mono font-semibold ${trend.startsWith('+') ? style.text : 'text-slate-400'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
