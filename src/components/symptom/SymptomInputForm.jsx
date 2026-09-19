import React, { useState } from 'react';
import { Stethoscope, Sparkles, Send, MessageSquare, HelpCircle, ArrowRight } from 'lucide-react';
import { mockSymptomPresets } from '../../services/mockData';

export default function SymptomInputForm({ onDiagnose, isDiagnosing }) {
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symptoms.trim() || isDiagnosing) return;
    onDiagnose(symptoms);
  };

  const handleSelectPreset = (preset) => {
    setSymptoms(preset.query);
  };

  return (
    <div className="rounded-2xl bg-[#0b1224] p-6 border border-[#1e2d4e] shadow-card-glow space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Describe Observed Computer Symptoms
            </h3>
            <p className="text-xs text-slate-400">
              Explain anomalies in plain English — e.g. unusual popups, encrypted file extensions, high CPU, or hijacked browser.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1 text-xs text-cyan-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Triage Assistant v2.4</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={5}
            placeholder="e.g. My screen turned black and now all my .docx and .xlsx files end with '.locked'. There is a red popup asking for Bitcoin payment and my Windows restore points are gone..."
            className="w-full rounded-xl bg-[#070c18] border border-[#1e2d4e] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 p-4 text-sm text-slate-100 placeholder-slate-500 transition-all font-sans leading-relaxed resize-y outline-none"
          />
          <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-500">
            {symptoms.length} characters
          </div>
        </div>

        {/* Quick presets buttons */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Quick Example Scenarios (Click to test):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {mockSymptomPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-2.5 rounded-xl bg-[#0e162b] border border-[#1e2d4e] hover:border-cyan-500/40 hover:bg-[#121d38] transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                  <span>{preset.label}</span>
                  <span className="text-[10px] font-mono text-slate-500">{preset.family}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">
                  {preset.query}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit diagnose button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={!symptoms.trim() || isDiagnosing}
            className={`
              flex items-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all
              ${!symptoms.trim() || isDiagnosing
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-neon-cyan transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'}
            `}
          >
            {isDiagnosing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Symptom Signatures...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="uppercase tracking-wider">Diagnose & Generate Playbook</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
