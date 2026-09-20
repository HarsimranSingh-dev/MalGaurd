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
          relative rounded-xl border-2 border-dashed p-8 md:p-12 text-center cursor-pointer transition-all duration-200 shadow-subtle
          ${dragActive 
            ? 'border-[#226343] bg-[#edf7f0] scale-[1.01]' 
            : 'border-[#e5e0d8] hover:border-[#226343] bg-[#ffffff] hover:bg-[#f8f7f4]'}
        `}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          onChange={handleChange}
          accept=".exe,.dll,.bin,.pdf,.doc,.docx,.zip,.scr,.ps1,.sh,.js,.apk"
        />

        <div className="mx-auto w-16 h-16 rounded-xl bg-[#edf7f0] border border-[#c9e6d4] flex items-center justify-center mb-4">
          <UploadCloud className={`w-8 h-8 text-[#226343] ${dragActive ? 'animate-bounce' : ''}`} />
        </div>

        <h3 className="text-lg font-bold text-[#1c1e21] tracking-tight">
          Drop your suspect file here, or <span className="text-[#226343] underline decoration-[#c9e6d4] underline-offset-4">browse filesystem</span>
        </h3>
        <p className="mt-1.5 text-xs text-[#525866] max-w-md mx-auto">
          Supports PE binaries (.exe, .dll), scripts (.ps1, .js), archives (.zip), documents, and raw dumps up to 100MB.
        </p>

        {/* Selected file preview pill */}
        {selectedFile && (
          <div className="mt-5 inline-flex items-center space-x-3 px-4 py-2.5 rounded-lg bg-[#edf7f0] border border-[#c9e6d4] text-[#1c1e21] shadow-subtle text-sm">
            <FileCode className="w-4 h-4 text-[#226343]" />
            <span className="font-mono font-semibold">{selectedFile.name}</span>
            <span className="text-xs text-[#525866] font-mono">
              ({typeof selectedFile.size === 'number' ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : selectedFile.size || '2.4 MB'})
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#1b5e39]" />
          </div>
        )}
      </div>

      {/* Action CTA & Quick Presets */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#7c828d] font-semibold flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#226343]" />
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
                    ? 'bg-[#edf7f0] border-[#226343] text-[#1c1e21] font-semibold shadow-subtle' 
                    : 'bg-[#ffffff] border-[#e5e0d8] text-[#525866] hover:border-[#226343] hover:text-[#1c1e21]'}
                `}
              >
                <Binary className="w-3.5 h-3.5 text-[#226343]" />
                <span>{preset.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-sans font-bold ${
                  preset.type.includes('Malicious') ? 'bg-[#fdf2f2] text-[#a81c1c]' :
                  preset.type.includes('Clean') ? 'bg-[#edf7f0] text-[#1b5e39]' :
                  'bg-[#fef8eb] text-[#9a5b04]'
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
            flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-200
            ${!selectedFile || isScanning
              ? 'bg-[#e5e0d8] text-[#7c828d] cursor-not-allowed'
              : 'bg-[#226343] hover:bg-[#1b5036] text-white shadow-subtle transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'}
          `}
        >
          {isScanning ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Disassembling & Inferencing...</span>
            </>
          ) : (
            <>
              <FileCode className="w-5 h-5" />
              <span className="uppercase font-bold tracking-wider">Analyze Threat Vector</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
