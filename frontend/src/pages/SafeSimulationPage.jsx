import React from 'react';
import { Terminal, ShieldAlert, Sparkles } from 'lucide-react';
import SafeSimulator from '../components/simulation/SafeSimulator';

export default function SafeSimulationPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#226343] font-bold mb-1">
          <Terminal className="w-4 h-4" />
          <span>Live SOC Telemetry Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1c1e21] tracking-tight">
          Safe Threat Simulation & EDR Validation Lab
        </h2>
        <p className="text-sm text-[#525866] mt-1 max-w-3xl">
          Test real-time defense mechanisms against simulated cyber attack techniques in a completely sandboxed virtual environment. No real damage, zero persistent artifacts.
        </p>
      </div>

      <SafeSimulator />
    </div>
  );
}
