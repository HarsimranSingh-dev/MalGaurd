import React, { useState } from 'react';
import { 
  FileSearch, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  Hash, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import FileUploader from '../components/scanner/FileUploader';
import VerdictBadge from '../components/scanner/VerdictBadge';
import EntropyMeter from '../components/scanner/EntropyMeter';
import MitreTacticsTags from '../components/scanner/MitreTacticsTags';
import ThreatIndicatorsList from '../components/scanner/ThreatIndicatorsList';
import IncidentReportModal from '../components/scanner/IncidentReportModal';
import { analyzeFile } from '../services/api';

export default function FileScannerPage({ initialFile }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleAnalyze = async (file) => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const result = await analyzeFile(file);
      setScanResult(result);
    } catch (err) {
      console.error('File analysis error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyHash = () => {
    if (!scanResult?.sha256) return;
    navigator.clipboard.writeText(scanResult.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
          <FileSearch className="w-4 h-4" />
          <span>Automated Static & Heuristic Pipeline</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          File Threat Analyzer & PE Disassembler
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Upload suspect executables, scripts, or archives to extract cryptographic hashes, compute Shannon entropy, predict malicious classification using AI neural models, and cross-reference with MITRE ATT&CK techniques.
        </p>
      </div>

      {/* File Uploader Dropzone */}
      <FileUploader onAnalyze={handleAnalyze} isScanning={isScanning} />

      {/* Scanning loading placeholder */}
      {isScanning && (
        <div className="p-8 rounded-2xl bg-[#0b1224] border border-cyan-500/40 text-center space-y-4 shadow-neon-cyan/20">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h4 className="text-base font-bold text-white">Disassembling Executable Structure</h4>
            <p className="text-xs font-mono text-cyan-400 mt-1">
              Extracting PE sections • Calculating entropy • Running AI Heuristic Classification...
            </p>
          </div>
        </div>
      )}

      {/* Full Results Section */}
      {scanResult && !isScanning && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1e2d4e]">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Inspection Telemetry:</span>
              <h3 className="text-xl font-bold text-white font-mono">{scanResult.filename}</h3>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-neon-cyan transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Incident Report Summary</span>
              </button>
            </div>
          </div>

          {/* 1. Verdict Badge (Big Banner) */}
          <VerdictBadge verdict={scanResult.verdict} />

          {/* 2. Cryptographic Hashes & AI Classification Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hash & Metadata Card */}
            <div className="rounded-2xl bg-[#0b1224] p-5 border border-[#1e2d4e] space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-400 font-bold">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>Cryptographic Digest / SHA-256</span>
              </div>

              <div className="relative p-3 rounded-xl bg-[#070c18] border border-[#1e2d4e]">
                <span className="font-mono text-xs text-cyan-300 break-all select-all block pr-8">
                  {scanResult.sha256}
                </span>
                <button
                  onClick={handleCopyHash}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-[#14203d] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy SHA-256 Hash"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-[#0e162b] border border-[#1e2d4e]">
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">File Size:</span>
                  <span className="text-slate-200 font-mono font-bold">{scanResult.fileSize}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0e162b] border border-[#1e2d4e]">
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Scan Timestamp:</span>
                  <span className="text-slate-200 font-mono font-bold truncate block">{scanResult.timestamp.split(' ')[1]}</span>
                </div>
              </div>
            </div>

            {/* AI Threat Model Prediction Card */}
            <div className="rounded-2xl bg-[#0b1224] p-5 border border-[#1e2d4e] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-400 font-bold">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>AI Model Threat Classification</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                    Neural Heuristic
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#070c18] border border-[#1e2d4e] space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Classified Signature:</span>
                  <div className="text-lg font-mono font-black text-white tracking-tight">
                    {scanResult.aiPrediction}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#17223b] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono block">Inference Confidence</span>
                  <span className="text-xl font-mono font-bold text-cyan-400">{scanResult.confidence}%</span>
                </div>
                <div className="w-32 bg-[#121c33] h-2 rounded-full overflow-hidden border border-[#1e2d4e]">
                  <div 
                    className={`h-full rounded-full ${
                      scanResult.verdict === 'MALICIOUS' ? 'bg-red-500' :
                      scanResult.verdict === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${scanResult.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Entropy Score with Visual Segmented Bar */}
          <EntropyMeter entropy={scanResult.entropy} />

          {/* 4. MITRE ATT&CK Tactics as Tags */}
          <MitreTacticsTags tactics={scanResult.mitreTactics} />

          {/* 5. List of Threat Indicators */}
          <ThreatIndicatorsList 
            indicators={scanResult.threatIndicators} 
            verdict={scanResult.verdict} 
          />
        </div>
      )}

      {/* Downloadable Incident Report Summary View Modal */}
      {showReportModal && (
        <IncidentReportModal 
          scan={scanResult} 
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
}
