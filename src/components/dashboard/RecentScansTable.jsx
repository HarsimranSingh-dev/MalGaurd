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
    <div className="rounded-2xl bg-[#0b1224] border border-[#1e2d4e] overflow-hidden">
      <div className="p-5 border-b border-[#1e2d4e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Recent Threat Inspections</h3>
            <p className="text-xs text-slate-400">Chronological telemetry feed of scrutinized binary files</p>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            <span>View Full Audit Log</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0e162c] text-[11px] font-mono uppercase text-slate-400 border-b border-[#1e2d4e]">
              <th className="py-3 px-5">Target File</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">AI Threat Classification</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Entropy</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-5 text-right">Forensic Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17223b] text-sm">
            {scans.map((scan) => (
              <tr 
                key={scan.id} 
                onClick={() => onSelectScan && onSelectScan(scan)}
                className="hover:bg-[#111c38]/50 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-[#14213d] border border-[#23355b] text-cyan-400">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors font-mono text-xs">
                        {scan.filename}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {scan.sha256 ? `${scan.sha256.slice(0, 16)}...` : 'Unknown hash'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  {getVerdictBadge(scan.verdict)}
                </td>
                <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                  {scan.aiPrediction}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-200">{scan.confidence}%</span>
                    <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className={`h-full rounded-full ${
                          scan.verdict === 'MALICIOUS' ? 'bg-red-500' :
                          scan.verdict === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${scan.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    scan.entropy > 7.2 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    scan.entropy > 6.5 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {scan.entropy || '5.20'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-400 font-mono flex items-center space-x-1.5 pt-4">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{scan.timestamp}</span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectScan) onSelectScan(scan);
                    }}
                    className="p-1.5 rounded-lg bg-[#14203d] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
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
