import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileSearch, 
  Activity, 
  RefreshCw 
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ThreatActivityChart from '../components/dashboard/ThreatActivityChart';
import RecentScansTable from '../components/dashboard/RecentScansTable';
import QuickActionBanner from '../components/dashboard/QuickActionBanner';
import IncidentReportModal from '../components/scanner/IncidentReportModal';
import { getDashboardStats } from '../services/api';

export default function DashboardPage({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-sm text-cyan-400">Loading MalGuard SOC Telemetry...</p>
      </div>
    );
  }

  const { stats, timeline, categories, recentScans } = data;

  return (
    <div className="space-y-8">
      {/* Quick Action Banner */}
      <QuickActionBanner onNavigate={onNavigate} />

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Scans Inspected"
          value={stats.totalScans}
          subtitle="Heuristic & Static Decompilations"
          trend="+12.4% this week"
          icon={FileSearch}
          variant="cyan"
          badge="Live Feed"
        />

        <StatCard
          title="Malicious Threats Flagged"
          value={stats.threatsFound}
          subtitle={`${stats.threatPercentage} of overall telemetry`}
          trend="+4 today"
          icon={ShieldAlert}
          variant="crimson"
          badge="High Priority"
        />

        <StatCard
          title="Clean Binaries Certified"
          value={stats.cleanFiles}
          subtitle={`${stats.cleanPercentage} verified benign`}
          trend="+89 today"
          icon={ShieldCheck}
          variant="emerald"
          badge="Verified"
        />

        <StatCard
          title="Suspicious / Quarantined"
          value={stats.suspiciousFiles}
          subtitle="Heuristics under deep review"
          trend="Requires SOC review"
          icon={AlertTriangle}
          variant="amber"
          badge="Action Req."
        />
      </div>

      {/* Telemetry Chart & Category Breakdown */}
      <ThreatActivityChart timeline={timeline} categories={categories} />

      {/* Recent Scans Table */}
      <RecentScansTable 
        scans={recentScans} 
        onSelectScan={(scan) => setSelectedScan(scan)}
        onViewAll={() => onNavigate('history')}
      />

      {/* Forensic Report Modal if clicked from table */}
      {selectedScan && (
        <IncidentReportModal 
          scan={selectedScan} 
          onClose={() => setSelectedScan(null)} 
        />
      )}
    </div>
  );
}
