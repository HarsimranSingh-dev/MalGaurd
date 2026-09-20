import React from 'react';
import { Gauge, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EntropyMeter({ entropy = 5.6 }) {
  const numEntropy = parseFloat(entropy) || 5.0;
  const maxEntropy = 8.0;
  const percentage = Math.min(Math.max((numEntropy / maxEntropy) * 100, 0), 100);

  let statusText = 'Normal Unpacked Code';
  let statusColor = 'text-[#1b5e39]';
  let barBg = 'bg-[#226343]';
  let badgeBorder = 'border-[#c9e6d4] bg-[#edf7f0]';

  if (numEntropy >= 7.2) {
    statusText = 'Packed / Encrypted Payload Detected';
    statusColor = 'text-[#a81c1c]';
    barBg = 'bg-[#a81c1c]';
    badgeBorder = 'border-[#f8cdcd] bg-[#fdf2f2]';
  } else if (numEntropy >= 6.4) {
    statusText = 'Compressed / Lightly Obfuscated';
    statusColor = 'text-[#9a5b04]';
    barBg = 'bg-[#9a5b04]';
    badgeBorder = 'border-[#fae1b1] bg-[#fef8eb]';
  }

  return (
    <div className="rounded-xl bg-[#ffffff] p-5 border border-[#e5e0d8] shadow-subtle">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#edf7f0] text-[#226343] border border-[#c9e6d4]">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1c1e21] tracking-wide">Shannon Entropy Score</h4>
            <p className="text-[11px] text-[#525866] font-mono">Measure of randomness (0.00 - 8.00 bits/byte)</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-[#1c1e21] tracking-tight">
            {numEntropy.toFixed(2)}
          </span>
          <span className="text-xs text-[#7c828d] font-mono"> / 8.00</span>
        </div>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="space-y-2 mt-4">
        <div className="w-full bg-[#f1ede6] h-3.5 rounded-full p-0.5 border border-[#e5e0d8] overflow-hidden">
          <div 
            className={`h-full rounded-full ${barBg} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-[10px] font-mono text-[#7c828d] px-1">
          <span>0.0 (Plaintext)</span>
          <span>4.0</span>
          <span>6.0 (Standard PE)</span>
          <span className="text-[#9a5b04]">7.2 (Threshold)</span>
          <span className="text-[#a81c1c] font-bold">8.0 (Encrypted)</span>
        </div>
      </div>

      {/* Interpretation callout */}
      <div className={`mt-4 p-3 rounded-lg border flex items-center justify-between text-xs ${badgeBorder}`}>
        <div className="flex items-center space-x-2">
          {numEntropy >= 7.2 ? (
            <AlertTriangle className="w-4 h-4 text-[#a81c1c]" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#1b5e39]" />
          )}
          <span className={`font-semibold ${statusColor}`}>{statusText}</span>
        </div>
        <span className="text-[11px] text-[#525866] font-mono">
          {numEntropy >= 7.2 ? 'Adversaries compress or encrypt code to evade AV' : 'Standard entropy profile'}
        </span>
      </div>
    </div>
  );
}
