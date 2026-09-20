import React, { useState } from 'react';
import { Stethoscope, Sparkles, HelpCircle, CheckCircle } from 'lucide-react';
import SymptomInputForm from '../components/symptom/SymptomInputForm';
import DiagnosisResultCard from '../components/symptom/DiagnosisResultCard';
import PlaybookChecklist from '../components/symptom/PlaybookChecklist';
import { diagnoseSymptoms } from '../services/api';

export default function SymptomCheckerPage() {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleDiagnose = async (symptomsText) => {
    setIsDiagnosing(true);
    setDiagnosis(null);
    try {
      const result = await diagnoseSymptoms(symptomsText);
      setDiagnosis(result);
    } catch (err) {
      console.error('Symptom diagnosis failed:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#226343] font-bold mb-1">
          <Stethoscope className="w-4 h-4" />
          <span>Non-Technical Triage & Incident Playbook Generator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1e21] tracking-tight">
          Symptom-Based Malware Diagnosis Assistant
        </h2>
        <p className="text-sm text-[#525866] mt-1 max-w-3xl">
          Experiencing unusual computer behaviors? Describe symptoms in plain language to identify probable malware families and generate an interactive containment and eradication playbook.
        </p>
      </div>

      {/* Input Form */}
      <SymptomInputForm onDiagnose={handleDiagnose} isDiagnosing={isDiagnosing} />

      {/* Diagnosis Results and Playbook */}
      {diagnosis && !isDiagnosing && (
        <div className="space-y-8 pt-2 animate-in fade-in duration-500">
          {/* Matched Family & Confidence */}
          <DiagnosisResultCard diagnosis={diagnosis} />

          {/* Step-by-Step Playbook Cards Grouped by Phase: 🔴 Contain → 🟠 Eradicate → 🟢 Recover → 🔵 Prevent */}
          <PlaybookChecklist playbook={diagnosis.playbook} />
        </div>
      )}
    </div>
  );
}
