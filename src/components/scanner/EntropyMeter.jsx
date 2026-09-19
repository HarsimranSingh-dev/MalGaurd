import React from 'react';
import { Gauge, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EntropyMeter({ entropy = 5.6 }) {
  const numEntropy = parseFloat(entropy) || 5.0;
  const maxEntropy = 8.0;
  const percentage = Math.min(Math.max((numEntropy / maxEntropy) * 100, 0), 100);

  let statusText = 'Normal Unpacked Code';
  let statusColor = 'text-emerald-400';
  let barGradient = 'from-emerald-500 to-cyan-500';
  let badgeBorder = 'border-emerald-500/30 bg-emerald-500/10';

  if (numEntropy >= 7.2) {
    statusText = 'Packed / Encrypted Payload Detected';
    statusColor = 'text-red-400';
    barGradient = 'from-amber-500 via-orange-500 to-red-500';
    badgeBorder = 'border-red-500/40 bg-red-500/15 shadow-neon-crimson/30';
  } else if (numEntropy >= 6.4) {
    statusText = 'Compressed / Lightly Obfuscated';
    statusColor = 'text-amber-400';
    barGradient = 'from-cyan-500 to-amber-500';
    badgeBorder = 'border-amber-500/30 bg-amber-500/10';
  }

  return (
    <div className="rounded-2xl bg-[#0b1224] p-5 border border-[#1e2d4e]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">Shannon Entropy Score</h4>
            <p className="text-[11px] text-slate-400 font-mono">Measure of randomness (0.00 - 8.00 bits/byte)</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {numEntropy.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 font-mono"> / 8.00</span>
        </div>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="space-y-2 mt-4">
        <div className="w-full bg-[#121c33] h-4 rounded-full p-0.5 border border-[#1e2d4e] overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700 relative`}
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer light bar */}
            <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/60 rounded-full blur-[1px]"></div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
          <span>0.0 (Plaintext)</span>
          <span>4.0</span>
          <span>6.0 (Standard PE)</span>
          <span className="text-amber-400">7.2 (Threshold)</span>
          <span className="text-red-400 font-bold">8.0 (Encrypted)</span>
        </div>
      </div>

      {/* Interpretation callout */}
      <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between text-xs ${badgeBorder}`}>
        <div className="flex items-center space-x-2">
          {numEntropy >= 7.2 ? (
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className={`font-semibold ${statusColor}`}>{statusText}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {numEntropy >= 7.2 ? 'Adversaries compress or encrypt code to evade AV' : 'Standard entropy profile'}
        </span>
      </div>
    </div>
  );
}
