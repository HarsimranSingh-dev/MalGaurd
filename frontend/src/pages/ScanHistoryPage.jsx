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
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#226343] font-bold mb-1">
            <History className="w-4 h-4" />
            <span>Forensic Audit Trail</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1e21] tracking-tight">
            Historical Scan Registry
          </h2>
          <p className="text-sm text-[#525866] mt-1">
            Search and inspect historical binary scans, cryptographic digests, and AI classifications.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReports}
            className="p-2.5 rounded-lg bg-[#ffffff] border border-[#e5e0d8] hover:bg-[#f1ede6] text-[#525866] hover:text-[#1c1e21] transition-colors shadow-subtle"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#226343] hover:bg-[#1b5036] text-white text-xs font-medium shadow-subtle transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e5e0d8] flex flex-col md:flex-row items-center justify-between gap-4 shadow-subtle">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#7c828d] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename, SHA-256, or malware variant..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#ffffff] border border-[#e5e0d8] focus:border-[#226343] text-xs text-[#1c1e21] placeholder-[#7c828d] outline-none font-mono"
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
                  ? v === 'MALICIOUS' ? 'bg-[#fdf2f2] text-[#a81c1c] border border-[#f8cdcd]' :
                    v === 'SUSPICIOUS' ? 'bg-[#fef8eb] text-[#9a5b04] border border-[#fae1b1]' :
                    v === 'CLEAN' ? 'bg-[#edf7f0] text-[#1b5e39] border border-[#c9e6d4]' :
                    'bg-[#edf7f0] text-[#1b5e39] border border-[#c9e6d4]'
                  : 'bg-[#f8f7f4] text-[#7c828d] border border-[#e5e0d8] hover:text-[#1c1e21]'}
              `}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl bg-[#ffffff] border border-[#e5e0d8] overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f7f4] text-[11px] font-mono uppercase text-[#7c828d] border-b border-[#e5e0d8]">
                <th className="py-3 px-5">Target Filename</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">AI Prediction</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Entropy</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1ede6] text-sm">
              {filteredReports.map((scan) => (
                <tr 
                  key={scan.id} 
                  onClick={() => setSelectedScan(scan)}
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
                        <div className="text-[10px] text-[#7c828d] font-mono">
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
                      {scan.verdict === 'MALICIOUS' && <AlertOctagon className="w-3.5 h-3.5" />}
                      {scan.verdict === 'SUSPICIOUS' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {scan.verdict === 'CLEAN' && <ShieldCheck className="w-3.5 h-3.5" />}
                      <span>{scan.verdict}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono text-[#525866]">
                    {scan.aiPrediction}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#1c1e21]">{scan.confidence}%</span>
                      <div className="w-10 bg-[#e5e0d8] h-1.5 rounded-full overflow-hidden hidden sm:block">
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

                  <td className="py-3.5 px-4 text-xs text-[#7c828d] font-mono">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#7c828d]" />
                      <span>{scan.timestamp}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScan(scan);
                      }}
                      className="p-1.5 rounded-lg bg-[#f1ede6] hover:bg-[#edf7f0] text-[#525866] hover:text-[#226343] transition-colors border border-[#e5e0d8]"
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
          <div className="p-8 text-center text-[#7c828d] text-xs font-mono">
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
