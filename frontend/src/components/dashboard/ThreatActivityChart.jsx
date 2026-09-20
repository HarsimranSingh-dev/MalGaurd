import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Activity, ShieldAlert, PieChart as PieIcon } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#ffffff] border border-[#e5e0d8] p-3 rounded-lg shadow-panel">
        <p className="text-xs font-mono text-[#1c1e21] font-bold mb-1.5">{label}</p>
        <div className="space-y-1 text-xs">
          <p className="text-[#1b5e39] flex items-center justify-between gap-4">
            <span>Clean Files:</span>
            <span className="font-mono font-bold">{payload[0]?.value}</span>
          </p>
          <p className="text-[#a81c1c] flex items-center justify-between gap-4">
            <span>Malicious Threats:</span>
            <span className="font-mono font-bold">{payload[1]?.value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ThreatActivityChart({ timeline, categories }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 24-Hour Scan Activity Area Chart */}
      <div className="lg:col-span-2 rounded-xl bg-[#ffffff] p-5 border border-[#e5e0d8] relative overflow-hidden shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#edf7f0] border border-[#c9e6d4] text-[#226343]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1e21] tracking-wide">SOC Threat Ingestion Flow</h3>
              <p className="text-xs text-[#525866]">24-hour volumetric file inspection telemetry</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#1b5e39]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#226343]"></span> Clean Files
            </span>
            <span className="flex items-center gap-1.5 text-[#a81c1c]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#a81c1c]"></span> Malicious Flags
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cleanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#226343" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#226343" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="maliciousGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a81c1c" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#a81c1c" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d8" opacity={0.8} />
              <XAxis dataKey="time" stroke="#7c828d" tick={{ fontSize: 11 }} />
              <YAxis stroke="#7c828d" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="clean" 
                stroke="#226343" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#cleanGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="malicious" 
                stroke="#a81c1c" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#maliciousGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Threat Category Breakdown Card */}
      <div className="rounded-xl bg-[#ffffff] p-5 border border-[#e5e0d8] flex flex-col justify-between shadow-subtle">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-2 rounded-lg bg-[#fef8eb] border border-[#fae1b1] text-[#9a5b04]">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1e21] tracking-wide">Threat Vectors</h3>
              <p className="text-xs text-[#525866]">Identified malware families</p>
            </div>
          </div>

          <div className="space-y-3.5 mt-4">
            {categories.map((cat) => {
              const total = categories.reduce((acc, c) => acc + c.count, 0);
              const percentage = Math.round((cat.count / total) * 100);
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#1c1e21] font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      {cat.name}
                    </span>
                    <span className="font-mono text-[#525866] font-bold">
                      {cat.count} <span className="text-[#7c828d] font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#f1ede6] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-[#f1ede6] flex items-center justify-between text-xs text-[#525866]">
          <span className="font-mono">Top Variant: Ransomware</span>
          <span className="text-[#a81c1c] font-semibold font-mono">43.2% of threats</span>
        </div>
      </div>
    </div>
  );
}
