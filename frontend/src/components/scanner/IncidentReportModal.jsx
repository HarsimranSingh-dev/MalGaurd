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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-xl bg-[#ffffff] border border-[#e5e0d8] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-[#e5e0d8] flex items-center justify-between bg-[#f8f7f4]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-[#edf7f0] border border-[#c9e6d4] text-[#226343]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1c1e21] tracking-wide">
                Forensic Incident Investigation Report
              </h3>
              <p className="text-xs font-mono text-[#525866]">
                Report ID: MAL-{scan.id || '2026-X99'} • Generated: {scan.timestamp}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-[#f1ede6] text-[#525866] hover:text-[#1c1e21] hover:bg-[#eae5dc] transition-colors border border-[#e5e0d8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none">
          {/* Executive Overview Banner */}
          <div className="p-4 rounded-lg bg-[#f8f7f4] border border-[#e5e0d8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-[#7c828d] uppercase">Target Binary:</span>
              <h4 className="text-base font-mono font-bold text-[#1c1e21] mt-0.5">{scan.filename}</h4>
              <p className="text-xs text-[#525866] mt-0.5">Size: {scan.fileSize || '2.4 MB'} • Format: Portable Executable (PE32+)</p>
            </div>
            <div>
              <span className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase ${
                scan.verdict === 'MALICIOUS' ? 'cyber-badge-malicious' :
                scan.verdict === 'SUSPICIOUS' ? 'cyber-badge-suspicious' : 'cyber-badge-clean'
              }`}>
                {scan.verdict} • {scan.confidence}% Confidence
              </span>
            </div>
          </div>

          {/* Hashes & Entropy Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#f8f7f4] border border-[#e5e0d8] space-y-2">
              <span className="text-[11px] font-mono text-[#7c828d] uppercase">SHA-256 Checksum:</span>
              <div className="p-2 rounded bg-[#ffffff] border border-[#e5e0d8] font-mono text-xs text-[#1c1e21] break-all select-all font-medium">
                {scan.sha256}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#f8f7f4] border border-[#e5e0d8] space-y-2">
              <span className="text-[11px] font-mono text-[#7c828d] uppercase">Entropy & Classification:</span>
              <div className="flex items-center justify-between p-2 rounded bg-[#ffffff] border border-[#e5e0d8]">
                <span className="font-mono text-xs text-[#525866]">Shannon: <strong className="text-[#1c1e21]">{scan.entropy} / 8.00</strong></span>
                <span className="font-mono text-xs text-[#a81c1c] font-bold">{scan.aiPrediction}</span>
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Matrix Mapping */}
          {scan.mitreTactics && scan.mitreTactics.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7c828d] font-semibold">
                Adversary Techniques (MITRE ATT&CK®):
              </span>
              <div className="flex flex-wrap gap-2">
                {scan.mitreTactics.map((t) => (
                  <span key={t.id} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#fdf2f2] border border-[#f8cdcd] text-[#a81c1c]">
                    <strong>{t.id}</strong>: {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Telemetry Indicators */}
          {scan.threatIndicators && scan.threatIndicators.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7c828d] font-semibold">
                Forensic Indicators:
              </span>
              <ul className="space-y-1.5 text-xs text-[#1c1e21]">
                {scan.threatIndicators.map((ind, i) => (
                  <li key={i} className="flex items-start space-x-2 font-mono">
                    <span className="text-[#226343] mt-0.5">›</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 border-t border-[#e5e0d8] bg-[#f8f7f4] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#7c828d] font-mono">
            MalGuard CyberSOC Automated Telemetry
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyJson}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#ffffff] hover:bg-[#f1ede6] text-[#1c1e21] text-xs font-medium border border-[#e5e0d8] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#1b5e39]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#226343] hover:bg-[#1b5036] text-white font-medium text-xs shadow-subtle transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Report JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-[#ffffff] hover:bg-[#f1ede6] text-[#525866] text-xs border border-[#e5e0d8] transition-colors"
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
