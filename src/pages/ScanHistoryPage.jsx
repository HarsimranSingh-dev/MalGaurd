import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  FileCode, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import IncidentReportModal from '../components/scanner/IncidentReportModal';
import { getScanReports } from '../services/api';

export default function ScanHistoryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [selectedScan, setSelectedScan] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getScanReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch = 
      r.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.sha256 && r.sha256.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.aiPrediction.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerdict = verdictFilter === 'ALL' || r.verdict === verdictFilter;
    return matchesSearch && matchesVerdict;
  });

  const handleExportCSV = () => {
    const headers = ['Filename', 'Verdict', 'AI Prediction', 'Confidence', 'Entropy', 'SHA256', 'Timestamp'];
    const rows = filteredReports.map(r => [
      `"${r.filename}"`,
      r.verdict,
      `"${r.aiPrediction}"`,
      `${r.confidence}%`,
      r.entropy,
      r.sha256,
      `"${r.timestamp}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MalGuard_Scan_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
            <History className="w-4 h-4" />
            <span>Forensic Audit Trail</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Historical Scan Registry
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Search and inspect historical binary scans, cryptographic digests, and AI classifications.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReports}
            className="p-2.5 rounded-xl bg-[#0e162b] border border-[#1e2d4e] hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#121f3d] hover:bg-[#182952] text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0b1224] border border-[#1e2d4e] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename, SHA-256, or malware variant..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#070c18] border border-[#1e2d4e] focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-500 outline-none font-mono"
          />
        </div>

        {/* Verdict filter pills */}
        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'MALICIOUS', 'SUSPICIOUS', 'CLEAN'].map((v) => (
            <button
              key={v}
              onClick={() => setVerdictFilter(v)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap
                ${verdictFilter === v 
                  ? v === 'MALICIOUS' ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-neon-crimson/30' :
                    v === 'SUSPICIOUS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                    v === 'CLEAN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-[#0e172e] text-slate-400 border border-transparent hover:text-white'}
              `}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-[#0b1224] border border-[#1e2d4e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0e162c] text-[11px] font-mono uppercase text-slate-400 border-b border-[#1e2d4e]">
                <th className="py-3 px-5">Target Filename</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">AI Prediction</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Entropy</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17223b] text-sm">
              {filteredReports.map((scan) => (
                <tr 
                  key={scan.id} 
                  onClick={() => setSelectedScan(scan)}
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
                        <div className="text-[10px] text-slate-500 font-mono">
                          {scan.sha256 ? `${scan.sha256.slice(0, 20)}...` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-mono ${
                      scan.verdict === 'MALICIOUS' ? 'cyber-badge-malicious' :
                      scan.verdict === 'SUSPICIOUS' ? 'cyber-badge-suspicious' : 'cyber-badge-clean'
                    }`}>
                      {scan.verdict === 'MALICIOUS' && <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />}
                      {scan.verdict === 'SUSPICIOUS' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {scan.verdict === 'CLEAN' && <ShieldCheck className="w-3.5 h-3.5" />}
                      <span>{scan.verdict}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                    {scan.aiPrediction}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-200">{scan.confidence}%</span>
                      <div className="w-10 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
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

                  <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{scan.timestamp}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScan(scan);
                      }}
                      className="p-1.5 rounded-lg bg-[#14203d] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Inspect Full Forensic Report"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            No matching scans found for query "{searchQuery}".
          </div>
        )}
      </div>

      {/* Report Modal */}
      {selectedScan && (
        <IncidentReportModal 
          scan={selectedScan} 
          onClose={() => setSelectedScan(null)} 
        />
      )}
    </div>
  );
}
