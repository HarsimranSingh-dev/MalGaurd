import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  ShieldAlert, 
  FileText, 
  Terminal,
  ExternalLink 
} from 'lucide-react';

export default function IncidentReportModal({ scan, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!scan) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(scan, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MalGuard_Report_${scan.filename}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#090f20] border border-cyan-500/40 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-[#1e2d4e] flex items-center justify-between bg-[#0b142c]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Forensic Incident Investigation Report
              </h3>
              <p className="text-xs font-mono text-cyan-400/80">
                Report ID: MAL-{scan.id || '2026-X99'} • Generated: {scan.timestamp}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-[#14203b] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none">
          {/* Executive Overview Banner */}
          <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2d4e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Target Binary:</span>
              <h4 className="text-base font-mono font-bold text-white mt-0.5">{scan.filename}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Size: {scan.fileSize || '2.4 MB'} • Format: Portable Executable (PE32+)</p>
            </div>
            <div>
              <span className={`px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold uppercase ${
                scan.verdict === 'MALICIOUS' ? 'cyber-badge-malicious' :
                scan.verdict === 'SUSPICIOUS' ? 'cyber-badge-suspicious' : 'cyber-badge-clean'
              }`}>
                {scan.verdict} • {scan.confidence}% Confidence
              </span>
            </div>
          </div>

          {/* Hashes & Entropy Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2d4e] space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">SHA-256 Checksum:</span>
              <div className="p-2 rounded bg-[#070b14] border border-[#1e2d4e] font-mono text-xs text-cyan-300 break-all select-all">
                {scan.sha256}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0e172e] border border-[#1e2d4e] space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Entropy & Classification:</span>
              <div className="flex items-center justify-between p-2 rounded bg-[#070b14] border border-[#1e2d4e]">
                <span className="font-mono text-xs text-slate-300">Shannon: <strong className="text-white">{scan.entropy} / 8.00</strong></span>
                <span className="font-mono text-xs text-red-400 font-bold">{scan.aiPrediction}</span>
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Matrix Mapping */}
          {scan.mitreTactics && scan.mitreTactics.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Adversary Techniques (MITRE ATT&CK®):
              </span>
              <div className="flex flex-wrap gap-2">
                {scan.mitreTactics.map((t) => (
                  <span key={t.id} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300">
                    <strong>{t.id}</strong>: {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Telemetry Indicators */}
          {scan.threatIndicators && scan.threatIndicators.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Forensic Indicators:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {scan.threatIndicators.map((ind, i) => (
                  <li key={i} className="flex items-start space-x-2 font-mono">
                    <span className="text-cyan-400 mt-0.5">›</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 border-t border-[#1e2d4e] bg-[#0b142c] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            MalGuard CyberSOC Automated Telemetry
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyJson}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#14203d] hover:bg-[#1a2b52] text-slate-200 text-xs font-semibold border border-[#26375c] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-neon-cyan transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Report JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-[#14203d] hover:bg-[#1a2b52] text-slate-300 text-xs border border-[#26375c] transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
