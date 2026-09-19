import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCode, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Binary
} from 'lucide-react';

export default function FileUploader({ onAnalyze, isScanning }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const samplePresets = [
    { name: 'LockBit_payload.exe', size: '2.4 MB', type: 'Malicious Sample', desc: 'Ransomware / Packed PE binary' },
    { name: 'Invoice_OCT26.docm.exe', size: '750 KB', type: 'Trojan Stealer', desc: 'RedLine credential harvesting payload' },
    { name: 'Sysinternals_Suite.zip', size: '14.2 MB', type: 'Clean File', desc: 'Legitimate administrative utilities' },
    { name: 'driver_hook_patch.dll', size: '480 KB', type: 'Suspicious Sample', desc: 'Unsigned dynamic link library' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedFile({
      name: preset.name,
      size: preset.size.includes('MB') ? parseFloat(preset.size) * 1024 * 1024 : parseFloat(preset.size) * 1024,
      isPreset: true
    });
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) return;
    onAnalyze(selectedFile);
  };

  return (
    <div className="space-y-6">
      {/* Drop Area */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current && inputRef.current.click()}
        className={`
          relative rounded-2xl border-2 border-dashed p-8 md:p-12 text-center cursor-pointer transition-all duration-300
          ${dragActive 
            ? 'border-cyan-400 bg-cyan-500/10 shadow-neon-cyan scale-[1.01]' 
            : 'border-[#1e2d4e] hover:border-cyan-500/50 bg-[#0a1122]/80 hover:bg-[#0d162d]'}
        `}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          onChange={handleChange}
          accept=".exe,.dll,.bin,.pdf,.doc,.docx,.zip,.scr,.ps1,.sh,.js,.apk"
        />

        {/* Pulsing radar effect */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 relative">
          <UploadCloud className={`w-10 h-10 text-cyan-400 ${dragActive ? 'animate-bounce' : ''}`} />
          <div className="absolute -inset-1 rounded-2xl bg-cyan-400/20 blur animate-pulse-slow pointer-events-none"></div>
        </div>

        <h3 className="text-lg font-bold text-white tracking-wide">
          Drop your suspect file here, or <span className="text-cyan-400 underline decoration-cyan-400/40 underline-offset-4">browse filesystem</span>
        </h3>
        <p className="mt-1.5 text-xs text-slate-400 max-w-md mx-auto">
          Supports PE binaries (.exe, .dll), scripts (.ps1, .js), archives (.zip), documents, and raw dumps up to 100MB.
        </p>

        {/* Selected file preview pill */}
        {selectedFile && (
          <div className="mt-5 inline-flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-neon-cyan text-sm">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold">{selectedFile.name}</span>
            <span className="text-xs text-cyan-400/80 font-mono">
              ({typeof selectedFile.size === 'number' ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : selectedFile.size || '2.4 MB'})
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Action CTA & Quick Presets */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Or click a threat sample preset to test:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className={`
                  text-xs font-mono px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5
                  ${selectedFile?.name === preset.name 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-neon-cyan' 
                    : 'bg-[#0e162b] border-[#1e2d4e] text-slate-300 hover:border-cyan-500/40 hover:text-white'}
                `}
              >
                <Binary className="w-3.5 h-3.5 text-cyan-400" />
                <span>{preset.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-sans font-bold ${
                  preset.type.includes('Malicious') ? 'bg-red-500/20 text-red-400' :
                  preset.type.includes('Clean') ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {preset.type.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Big Analyze Button */}
        <button
          onClick={handleStartAnalysis}
          disabled={!selectedFile || isScanning}
          className={`
            flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300
            ${!selectedFile || isScanning
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-neon-cyan transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'}
          `}
        >
          {isScanning ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Disassembling & Inferencing...</span>
            </>
          ) : (
            <>
              <FileCode className="w-5 h-5" />
              <span className="uppercase font-extrabold tracking-wider">Analyze Threat Vector</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
