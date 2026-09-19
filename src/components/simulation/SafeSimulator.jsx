import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Cpu, 
  Radio, 
  Bug,
  Sparkles
} from 'lucide-react';

export default function SafeSimulator() {
  const [activeScenario, setActiveScenario] = useState('ransomware_canary');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([
    { time: '12:00:00', type: 'info', text: 'MalGuard Safe Sandbox initialized. Ready for zero-risk detection simulation.' }
  ]);
  const [simulationState, setSimulationState] = useState('idle'); // 'idle' | 'running' | 'intercepted'
  const consoleEndRef = useRef(null);

  const scenarios = [
    {
      id: 'ransomware_canary',
      name: 'Ransomware Canary Modification',
      icon: Lock,
      risk: 'CRITICAL',
      desc: 'Simulates rapid file alteration and canary decoy destruction in %USERPROFILE%\\Documents.',
      actionSummary: 'Triggers behavioral tripwire and immediate process tree termination.'
    },
    {
      id: 'eicar_detection',
      name: 'EICAR Standard Antivirus Test',
      icon: Bug,
      risk: 'BENIGN TEST',
      desc: 'Injects harmless standardized 68-byte EICAR signature string into virtual memory buffer.',
      actionSummary: 'Verifies static signature scanning engine detection speed.'
    },
    {
      id: 'c2_beacon',
      name: 'Simulated C2 Beacon Traffic',
      icon: Radio,
      risk: 'HIGH',
      desc: 'Simulates periodic jittered HTTPS handshakes on port 8443 matching Cobalt Strike profile.',
      actionSummary: 'Detects repetitive heartbeat packet intervals and isolates virtual socket.'
    },
    {
      id: 'process_injection',
      name: 'Process Hollowing Simulation',
      icon: Cpu,
      risk: 'CRITICAL',
      desc: 'Simulates NtUnmapViewOfSection and WriteProcessMemory targeting suspended svchost.exe.',
      actionSummary: 'Detects cross-process memory tampering and denies execution permissions.'
    }
  ];

  const logEvent = (type, text) => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { time, type, text }]);
  };

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setSimulationState('running');
    setLogs([
      { time: new Date().toTimeString().split(' ')[0], type: 'info', text: `[+] Initializing safe simulation container: ${activeScenario}` }
    ]);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    if (activeScenario === 'ransomware_canary') {
      await delay(600);
      logEvent('info', '[01] Spawning sandbox virtual host (Isolated Ring-3 Environment)...');
      await delay(700);
      logEvent('warn', '[02] Malicious script attempting write: C:\\Sandbox\\Canary_Decoy_Doc.docx.locked');
      await delay(600);
      logEvent('warn', '[03] High frequency I/O burst detected: 84 files renamed within 120ms');
      await delay(700);
      logEvent('danger', '[04] ALERT: MalGuard Behavioral Tripwire Triggered! Rule: [RANSOMWARE.CANARY_TOUCH]');
      await delay(800);
      logEvent('success', '[05] ACTION TAKEN: Injected kill signal SIGKILL into rogue PID 4912');
      await delay(600);
      logEvent('success', '[06] SHIELD APPLIED: Rollback volume shadow copy restoration completed without data loss.');
      setSimulationState('intercepted');
    } else if (activeScenario === 'eicar_detection') {
      await delay(500);
      logEvent('info', '[01] Writing EICAR standard test string buffer to memory...');
      await delay(600);
      logEvent('info', '[02] Hex dump: X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
      await delay(600);
      logEvent('danger', '[03] MATCH: Static Yara Engine detected Signature: [EICAR_STANDARD_TEST]');
      await delay(600);
      logEvent('success', '[04] FILE QUARANTINED: Hash cda0d54e2888ec7f242e9e3ec57d090e3d1152e87d41a87d');
      setSimulationState('intercepted');
    } else if (activeScenario === 'c2_beacon') {
      await delay(500);
      logEvent('info', '[01] Emulating socket connection on 10.0.0.45:49812 -> 194.26.29.112:8443');
      await delay(600);
      logEvent('warn', '[02] SYN -> SYN-ACK -> ACK established with TLS 1.3 handshake');
      await delay(700);
      logEvent('warn', '[03] Periodic beacon detected: Interval 5000ms (+/- 10% jitter), payload 512 bytes');
      await delay(800);
      logEvent('danger', '[04] ALERT: Network Heuristic matched adversary C2 Profile: [COBALT_STRIKE_MALLAD]');
      await delay(600);
      logEvent('success', '[05] MITIGATION: Dynamic Firewall perimeter rule applied; IP 194.26.29.112 blocked.');
      setSimulationState('intercepted');
    } else {
      await delay(500);
      logEvent('info', '[01] Creating suspended thread inside svchost.exe (PID 1024)...');
      await delay(700);
      logEvent('warn', '[02] VirtualAllocEx requested 0x00400000 with PAGE_EXECUTE_READWRITE');
      await delay(700);
      logEvent('danger', '[03] ALERT: Process Hollowing heuristic triggered via ZwWriteVirtualMemory');
      await delay(600);
      logEvent('success', '[04] Kernel Driver blocked memory remap request (STATUS_ACCESS_DENIED)');
      await delay(500);
      logEvent('success', '[05] Attacking process PID 8892 terminated; Integrity validated.');
      setSimulationState('intercepted');
    }

    setIsRunning(false);
  };

  const handleReset = () => {
    setLogs([{ time: new Date().toTimeString().split(' ')[0], type: 'info', text: 'Console reset. Ready for next simulation.' }]);
    setSimulationState('idle');
  };

  return (
    <div className="space-y-6">
      {/* Simulation Selector */}
      <div className="rounded-2xl bg-[#0b1224] p-6 border border-[#1e2d4e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Zero-Risk Safe Sandbox Environment
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                100% Isolated
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              MalGuard Threat Simulation Lab
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select a simulated cyberattack vector below to observe how MalGuard's EDR heuristic engine traps and neutralizes adversary actions in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-[#14203b] hover:bg-[#1c2e54] text-slate-300 text-xs font-semibold border border-[#23355b] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Sandbox</span>
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className={`
                flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all
                ${isRunning 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-neon-cyan transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'}
              `}
            >
              {isRunning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Executing Scenario...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeScenario === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  if (!isRunning) {
                    setActiveScenario(sc.id);
                    setSimulationState('idle');
                  }
                }}
                className={`
                  p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between
                  ${isSelected 
                    ? 'bg-[#101b38] border-cyan-400 shadow-neon-cyan/40' 
                    : 'bg-[#0e162b] border-[#1e2d4e] hover:border-cyan-500/40 hover:bg-[#121f3d]'}
                `}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#172445] text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      sc.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      sc.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {sc.risk}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {sc.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {sc.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Live Stream */}
      <div className="rounded-2xl bg-[#060a14] border border-[#1e2d4e] overflow-hidden shadow-2xl">
        {/* Terminal Titlebar */}
        <div className="px-4 py-3 bg-[#0a1122] border-b border-[#1e2d4e] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <div className="h-4 w-px bg-slate-700 mx-2"></div>
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs text-slate-300 font-semibold">
              malguard-sandbox@telemetry-daemon:~#
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono">
            {simulationState === 'intercepted' && (
              <span className="flex items-center space-x-1 text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>THREAT INTERCEPTED & CONTAINED</span>
              </span>
            )}
            {simulationState === 'running' && (
              <span className="flex items-center space-x-1 text-cyan-400 font-bold animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>SANDBOX EXECUTION IN PROGRESS</span>
              </span>
            )}
          </div>
        </div>

        {/* Terminal Log Body */}
        <div className="p-5 font-mono text-xs space-y-2 h-72 overflow-y-auto cyber-scanline bg-[#04070f]">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start space-x-3 leading-relaxed">
              <span className="text-slate-600 select-none">[{log.time}]</span>
              <span className={`flex-1 ${
                log.type === 'danger' ? 'text-red-400 font-bold' :
                log.type === 'warn' ? 'text-amber-400' :
                log.type === 'success' ? 'text-emerald-400 font-bold' :
                'text-slate-300'
              }`}>
                {log.text}
              </span>
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
}
