import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Terminal, Flag } from 'lucide-react';

export default function ThreatIndicatorsList({ indicators = [], verdict = 'CLEAN' }) {
  const isClean = verdict === 'CLEAN';

  return (
    <div className="rounded-xl bg-[#ffffff] p-5 border border-[#e5e0d8] shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg border ${
            isClean 
              ? 'bg-[#edf7f0] text-[#1b5e39] border-[#c9e6d4]' 
              : 'bg-[#fdf2f2] text-[#a81c1c] border-[#f8cdcd]'
          }`}>
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1c1e21] tracking-wide">
              {isClean ? 'Static Verification Heuristics' : 'Detected Threat Indicators & Heuristics'}
            </h4>
            <p className="text-[11px] text-[#525866]">Low-level PE header, API imports, and behavioral telemetry</p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#7c828d]">
          {indicators.length} signals
        </span>
      </div>

      <div className="space-y-2.5">
        {indicators.map((indicator, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 p-3 rounded-lg border text-xs leading-relaxed transition-colors ${
              isClean 
                ? 'bg-[#edf7f0]/60 border-[#c9e6d4] text-[#1c1e21]' 
                : 'bg-[#fdf2f2]/70 border-[#f8cdcd] text-[#1c1e21]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isClean ? (
                <CheckCircle className="w-4 h-4 text-[#1b5e39]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#a81c1c]" />
              )}
            </div>
            <div className="flex-1 font-mono">
              <span>{indicator}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
