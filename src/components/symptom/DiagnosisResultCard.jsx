import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Target, Sparkles } from 'lucide-react';

export default function DiagnosisResultCard({ diagnosis }) {
  if (!diagnosis) return null;

  return (
    <div className="rounded-2xl bg-[#0b1224] border border-cyan-500/30 overflow-hidden shadow-card-glow">
      <div className="p-6 bg-gradient-to-r from-[#0d162f] to-[#0a1124] border-b border-[#1e2d4e] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 shadow-neon-crimson">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Primary Matched Threat Family:
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                {diagnosis.severity || 'CRITICAL'} SEVERITY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              {diagnosis.matchedFamily}
            </h2>
          </div>
        </div>

        {/* Confidence Dial */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#070c18] border border-[#1e2d4e] self-start md:self-auto">
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">AI Match Confidence</span>
            <span className="text-2xl font-black font-mono text-cyan-400">{diagnosis.confidence}%</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center font-mono text-xs font-bold text-cyan-300">
            {Math.round(diagnosis.confidence)}%
          </div>
        </div>
      </div>

      {/* AI Analysis Summary */}
      <div className="p-6 space-y-4">
        <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2d4e]">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Triage Summary</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {diagnosis.summary}
          </p>
        </div>

        {/* Associated MITRE Tactics */}
        {diagnosis.mitreTactics && diagnosis.mitreTactics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono text-slate-400 uppercase mr-1">Associated MITRE Techniques:</span>
            {diagnosis.mitreTactics.map((t) => (
              <span key={t.id} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#111c38] border border-[#23355f] text-slate-300">
                <strong className="text-red-400">{t.id}</strong> {t.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
