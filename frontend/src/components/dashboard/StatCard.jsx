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
      border: 'border-[#e5e0d8] hover:border-[#d4cec4]',
      text: 'text-[#226343]',
      badgeBg: 'bg-[#edf7f0] text-[#1b5e39] border-[#c9e6d4]',
      iconBg: 'bg-[#edf7f0] text-[#226343] border-[#c9e6d4]',
    },
    emerald: {
      border: 'border-[#e5e0d8] hover:border-[#d4cec4]',
      text: 'text-[#1b5e39]',
      badgeBg: 'bg-[#edf7f0] text-[#1b5e39] border-[#c9e6d4]',
      iconBg: 'bg-[#edf7f0] text-[#1b5e39] border-[#c9e6d4]',
    },
    crimson: {
      border: 'border-[#e5e0d8] hover:border-[#d4cec4]',
      text: 'text-[#a81c1c]',
      badgeBg: 'bg-[#fdf2f2] text-[#a81c1c] border-[#f8cdcd]',
      iconBg: 'bg-[#fdf2f2] text-[#a81c1c] border-[#f8cdcd]',
    },
    amber: {
      border: 'border-[#e5e0d8] hover:border-[#d4cec4]',
      text: 'text-[#9a5b04]',
      badgeBg: 'bg-[#fef8eb] text-[#9a5b04] border-[#fae1b1]',
      iconBg: 'bg-[#fef8eb] text-[#9a5b04] border-[#fae1b1]',
    }
  };

  const style = styles[variant] || styles.cyan;

  return (
    <div className={`
      relative overflow-hidden rounded-xl bg-[#ffffff] p-5 border ${style.border} 
      shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel-hover
    `}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#7c828d] font-semibold">{title}</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-[#1c1e21]">{value}</span>
            {badge && (
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${style.badgeBg} font-bold`}>
                {badge}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border ${style.iconBg} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#525866] pt-3 border-t border-[#f1ede6]">
        <span>{subtitle}</span>
        {trend && (
          <span className={`font-mono font-semibold ${trend.startsWith('+') ? style.text : 'text-[#7c828d]'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
