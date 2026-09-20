import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Target, Sparkles } from 'lucide-react';

export default function DiagnosisResultCard({ diagnosis }) {
  if (!diagnosis) return null;

  return (
    <div className="rounded-xl bg-[#ffffff] border border-[#e5e0d8] overflow-hidden shadow-subtle">
      <div className="p-6 bg-[#f8f7f4] border-b border-[#e5e0d8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-[#fdf2f2] border border-[#f8cdcd] text-[#a81c1c]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7c828d]">
                Primary Matched Threat Family:
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#fdf2f2] text-[#a81c1c] border border-[#f8cdcd] font-bold">
                {diagnosis.severity || 'CRITICAL'} SEVERITY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1e21] tracking-tight mt-0.5">
              {diagnosis.matchedFamily}
            </h2>
          </div>
        </div>

        {/* Confidence Dial */}
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#ffffff] border border-[#e5e0d8] self-start md:self-auto shadow-subtle">
          <div className="text-right">
            <span className="text-xs font-mono text-[#7c828d] block">AI Match Confidence</span>
            <span className="text-2xl font-bold font-mono text-[#226343]">{diagnosis.confidence}%</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#c9e6d4] border-t-[#226343] flex items-center justify-center font-mono text-xs font-bold text-[#1b5e39]">
            {Math.round(diagnosis.confidence)}%
          </div>
        </div>
      </div>

      {/* AI Analysis Summary */}
      <div className="p-6 space-y-4">
        <div className="p-4 rounded-lg bg-[#f8f7f4] border border-[#e5e0d8]">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#226343] font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Triage Summary</span>
          </div>
          <p className="text-sm text-[#1c1e21] leading-relaxed font-sans">
            {diagnosis.summary}
          </p>
        </div>

        {/* Associated MITRE Tactics */}
        {diagnosis.mitreTactics && diagnosis.mitreTactics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono text-[#7c828d] uppercase mr-1">Associated MITRE Techniques:</span>
            {diagnosis.mitreTactics.map((t, idx) => {
              const isObj = typeof t === 'object' && t !== null;
              const tacticStr = isObj ? `${t.id} – ${t.name}` : String(t);
              const parts = tacticStr.split(' – ');
              const key = isObj ? t.id : idx;
              return (
                <span key={key} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#ffffff] border border-[#e5e0d8] text-[#1c1e21] shadow-subtle">
                  <strong className="text-[#a81c1c]">{parts[0]}</strong>{parts[1] ? ` – ${parts[1]}` : ''}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
