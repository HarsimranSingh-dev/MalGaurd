import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle, Terminal, Flag } from 'lucide-react';

export default function ThreatIndicatorsList({ indicators = [], verdict = 'CLEAN' }) {
  const isClean = verdict === 'CLEAN';

  return (
    <div className="rounded-2xl bg-[#0b1224] p-5 border border-[#1e2d4e]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg border ${
            isClean 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}>
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              {isClean ? 'Static Verification Heuristics' : 'Detected Threat Indicators & Heuristics'}
            </h4>
            <p className="text-[11px] text-slate-400">Low-level PE header, API imports, and behavioral telemetry</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          {indicators.length} signals
        </span>
      </div>

      <div className="space-y-2.5">
        {indicators.map((indicator, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 p-3 rounded-xl border text-xs leading-relaxed transition-colors ${
              isClean 
                ? 'bg-[#0b1626]/70 border-emerald-500/20 text-slate-300' 
                : 'bg-[#150f1d]/70 border-red-500/25 text-slate-200 hover:border-red-500/40'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isClean ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
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
