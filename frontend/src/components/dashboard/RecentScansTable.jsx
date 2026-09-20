import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ExternalLink, 
  FileCode, 
  Clock, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

export default function RecentScansTable({ scans, onSelectScan, onViewAll }) {
  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'CLEAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cyber-badge-clean">
            <ShieldCheck className="w-3.5 h-3.5" />
            CLEAN
          </span>
        );
      case 'SUSPICIOUS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cyber-badge-suspicious">
            <AlertTriangle className="w-3.5 h-3.5" />
            SUSPICIOUS
          </span>
        );
      case 'MALICIOUS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cyber-badge-malicious">
            <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
            MALICIOUS
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {verdict}
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl bg-[#ffffff] border border-[#e5e0d8] overflow-hidden shadow-subtle">
      <div className="p-5 border-b border-[#e5e0d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#edf7f0] border border-[#c9e6d4] text-[#226343]">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1c1e21] tracking-wide">Recent Threat Inspections</h3>
            <p className="text-xs text-[#525866]">Chronological telemetry feed of scrutinized binary files</p>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 text-xs text-[#226343] hover:text-[#1b5036] font-semibold transition-colors"
          >
            <span>View Full Audit Log</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8f7f4] text-[11px] font-mono uppercase text-[#7c828d] border-b border-[#e5e0d8]">
              <th className="py-3 px-5">Target File</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">AI Threat Classification</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Entropy</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-5 text-right">Forensic Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1ede6] text-sm">
            {scans.map((scan) => (
              <tr 
                key={scan.id} 
                onClick={() => onSelectScan && onSelectScan(scan)}
                className="hover:bg-[#f8f7f4] transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-[#f1ede6] border border-[#e5e0d8] text-[#226343]">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#1c1e21] group-hover:text-[#226343] transition-colors font-mono text-xs">
                        {scan.filename}
                      </div>
                      <div className="text-[11px] text-[#7c828d] font-mono">
                        {scan.sha256 ? `${scan.sha256.slice(0, 16)}...` : 'Unknown hash'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  {getVerdictBadge(scan.verdict)}
                </td>
                <td className="py-3.5 px-4 text-xs font-mono text-[#525866]">
                  {scan.aiPrediction}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#1c1e21]">{scan.confidence}%</span>
                    <div className="w-12 bg-[#e5e0d8] h-1.5 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className={`h-full rounded-full ${
                          scan.verdict === 'MALICIOUS' ? 'bg-[#a81c1c]' :
                          scan.verdict === 'SUSPICIOUS' ? 'bg-[#9a5b04]' : 'bg-[#226343]'
                        }`}
                        style={{ width: `${scan.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                    scan.entropy > 7.2 ? 'bg-[#fdf2f2] text-[#a81c1c] border-[#f8cdcd]' :
                    scan.entropy > 6.5 ? 'bg-[#fef8eb] text-[#9a5b04] border-[#fae1b1]' :
                    'bg-[#f1ede6] text-[#525866] border-[#e5e0d8]'
                  }`}>
                    {scan.entropy || '5.20'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-[#7c828d] font-mono flex items-center space-x-1.5 pt-4">
                  <Clock className="w-3.5 h-3.5 text-[#7c828d]" />
                  <span>{scan.timestamp}</span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectScan) onSelectScan(scan);
                    }}
                    className="p-1.5 rounded-lg bg-[#f1ede6] hover:bg-[#edf7f0] text-[#525866] hover:text-[#226343] transition-colors border border-[#e5e0d8]"
                    title="Inspect Forensic Report"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
