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
    <div className="rounded-xl bg-[#ffffff] p-6 border border-[#e5e0d8] shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-[#edf7f0] border border-[#c9e6d4] text-[#226343]">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1c1e21] tracking-wide">
              Describe Observed Computer Symptoms
            </h3>
            <p className="text-xs text-[#525866]">
              Explain anomalies in plain English — e.g. unusual popups, encrypted file extensions, high CPU, or hijacked browser.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1 text-xs text-[#226343] font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#226343]" />
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
            className="w-full rounded-lg bg-[#ffffff] border border-[#e5e0d8] focus:border-[#226343] focus:ring-1 focus:ring-[#226343] p-4 text-sm text-[#1c1e21] placeholder-[#7c828d] transition-all font-sans leading-relaxed resize-y outline-none"
          />
          <div className="absolute bottom-3 right-3 text-[11px] font-mono text-[#7c828d]">
            {symptoms.length} characters
          </div>
        </div>

        {/* Quick presets buttons */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#7c828d] font-semibold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#226343]" />
            Quick Example Scenarios (Click to test):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {mockSymptomPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-2.5 rounded-lg bg-[#f8f7f4] border border-[#e5e0d8] hover:border-[#226343] hover:bg-[#ffffff] transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-[#1c1e21] group-hover:text-[#226343]">
                  <span>{preset.label}</span>
                  <span className="text-[10px] font-mono text-[#7c828d]">{preset.family}</span>
                </div>
                <p className="text-[11px] text-[#525866] truncate mt-1">
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
              flex items-center space-x-2 px-7 py-3 rounded-lg font-bold text-sm tracking-wide transition-all
              ${!symptoms.trim() || isDiagnosing
                ? 'bg-[#e5e0d8] text-[#7c828d] border border-[#e5e0d8] cursor-not-allowed'
                : 'bg-[#226343] hover:bg-[#1b5036] text-white shadow-subtle transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'}
            `}
          >
            {isDiagnosing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
