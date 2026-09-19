import axios from 'axios';
import { 
  mockDashboardStats, 
  mockScanTimeline, 
  mockThreatCategories, 
  mockRecentScans, 
  mockMalwareFamilies,
  mockSymptomPresets 
} from './mockData';

// Base API client configured for future FastAPI backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to force mock data or automatically fallback if backend is offline
const USE_MOCK = true;

/**
 * Generate a simulated SHA-256 hash
 */
function generateMockSha256(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}49afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c1`.slice(0, 64);
}

/**
 * File Analysis API Endpoint: POST /api/analyze
 */
export async function analyzeFile(fileOrMock) {
  if (!USE_MOCK) {
    try {
      const formData = new FormData();
      if (fileOrMock instanceof File) {
        formData.append('file', fileOrMock);
      } else {
        formData.append('filename', fileOrMock.filename);
      }
      const response = await apiClient.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.warn('Backend /api/analyze unavailable, falling back to simulated analysis engine:', err.message);
    }
  }

  // Realistic mock engine with 1200ms processing simulation
  await new Promise((res) => setTimeout(res, 1200));

  const filename = fileOrMock.name || fileOrMock.filename || 'sample_binary.exe';
  const lowerName = filename.toLowerCase();

  // Heuristic mock decision logic based on filename patterns
  let verdict = 'CLEAN';
  let prediction = 'Safe PE Executable (Verified Signature)';
  let confidence = 98.6;
  let entropy = (5.2 + Math.random() * 0.9).toFixed(2);
  let mitreTactics = [];
  let indicators = [
    'Valid Authenticode digital signature',
    'PE header boundaries within normal security parameters',
    'No suspicious API imports or packed sections found',
    'Heuristic behavior tree classified as Benign'
  ];

  if (lowerName.includes('ransom') || lowerName.includes('lock') || lowerName.includes('crypt') || lowerName.includes('invoice') || lowerName.includes('pay')) {
    verdict = 'MALICIOUS';
    prediction = 'Ransomware.LockBit3.gen';
    confidence = 97.4;
    entropy = (7.65 + Math.random() * 0.3).toFixed(2);
    mitreTactics = [
      { id: 'T1486', name: 'Data Encrypted for Impact', phase: 'Impact' },
      { id: 'T1490', name: 'Inhibit System Recovery', phase: 'Impact' },
      { id: 'T1059', name: 'Command and Scripting Interpreter', phase: 'Execution' }
    ];
    indicators = [
      `High Shannon entropy (${entropy}/8.0) indicating encrypted section payload (.vmp0)`,
      "Invokes 'vssadmin.exe Delete Shadows /All /Quiet' to block system recovery",
      "Dynamic import resolution bypassing IAT table",
      "CryptAcquireContext & CryptEncrypt high-frequency calls detected"
    ];
  } else if (lowerName.includes('trojan') || lowerName.includes('stealer') || lowerName.includes('key') || lowerName.includes('patch') || lowerName.includes('crack') || lowerName.includes('.scr')) {
    verdict = 'MALICIOUS';
    prediction = 'Trojan.Spyware.RedLine';
    confidence = 95.8;
    entropy = (7.45 + Math.random() * 0.4).toFixed(2);
    mitreTactics = [
      { id: 'T1555', name: 'Credentials from Password Stores', phase: 'Credential Access' },
      { id: 'T1041', name: 'Exfiltration Over C2 Channel', phase: 'Exfiltration' }
    ];
    indicators = [
      `Elevated Shannon entropy (${entropy}/8.0) with packed UPX sections`,
      "Targeted queries for Chrome SQLite master login files",
      "Injected memory thread detected targeting explorer.exe"
    ];
  } else if (lowerName.includes('setup') || lowerName.includes('updater') || lowerName.includes('patch') || lowerName.includes('dll') || lowerName.includes('test')) {
    verdict = 'SUSPICIOUS';
    prediction = 'Unverified Binary / Obfuscated Downloader';
    confidence = 81.2;
    entropy = (6.85 + Math.random() * 0.5).toFixed(2);
    mitreTactics = [
      { id: 'T1027', name: 'Obfuscated Files or Information', phase: 'Defense Evasion' }
    ];
    indicators = [
      `Section entropy (${entropy}/8.0) exceeds standard uncompressed code threshold`,
      "Self-signed or missing code-signing certificate",
      "Dynamic library loading via LoadLibraryA with encoded strings"
    ];
  }

  const result = {
    id: `scan-${Date.now().toString().slice(-4)}`,
    filename,
    fileSize: fileOrMock.size ? `${(fileOrMock.size / (1024 * 1024)).toFixed(2)} MB` : '2.1 MB',
    verdict,
    aiPrediction: prediction,
    confidence: Number(confidence.toFixed(1)),
    entropy: Number(entropy),
    sha256: generateMockSha256(filename),
    md5: 'a87ff679a2f3e71d9181a67b7542122c',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    mitreTactics,
    threatIndicators: indicators,
  };

  // Prepend to recent scans cache
  mockRecentScans.unshift(result);
  return result;
}

/**
 * Symptom Diagnosis API Endpoint: POST /api/diagnose
 */
export async function diagnoseSymptoms(symptomText) {
  if (!USE_MOCK) {
    try {
      const response = await apiClient.post('/api/diagnose', { symptoms: symptomText });
      return response.data;
    } catch (err) {
      console.warn('Backend /api/diagnose unavailable, falling back to simulated AI assistant:', err.message);
    }
  }

  // Simulate AI inference latency
  await new Promise((res) => setTimeout(res, 900));

  const text = (symptomText || '').toLowerCase();

  let matchedFamily = mockMalwareFamilies[0]; // Default Ransomware
  let confidence = 94.5;
  let summary = "The symptoms strongly match cryptographic extortion malware behavior, specifically mass file encryption and recovery suppression.";

  if (text.includes('ad') || text.includes('popup') || text.includes('redirect') || text.includes('browser') || text.includes('search engine')) {
    matchedFamily = mockMalwareFamilies.find((f) => f.id === 'adware') || mockMalwareFamilies[4];
    confidence = 92.1;
    summary = "Symptoms indicate browser hijacking, invasive advertising injection, or an unauthorized Potentially Unwanted Program (PUP) helper extension.";
  } else if (text.includes('password') || text.includes('crypto') || text.includes('wallet') || text.includes('discord') || text.includes('logout') || text.includes('cookie')) {
    matchedFamily = mockMalwareFamilies.find((f) => f.id === 'infostealer') || mockMalwareFamilies[2];
    confidence = 96.2;
    summary = "High probability of Infostealer / Spyware harvesting browser SQLite password vaults, session tokens, or local cryptocurrency wallets.";
  } else if (text.includes('usb') || text.includes('shortcut') || text.includes('lnk') || text.includes('network') || text.includes('spread') || text.includes('share')) {
    matchedFamily = mockMalwareFamilies.find((f) => f.id === 'worm') || mockMalwareFamilies[3];
    confidence = 95.0;
    summary = "Symptoms point toward self-propagating worm activity spreading via network shares or infected USB removable media.";
  } else if (text.includes('shell') || text.includes('powershell') || text.includes('port') || text.includes('cpu') || text.includes('connection') || text.includes('backdoor')) {
    matchedFamily = mockMalwareFamilies.find((f) => f.id === 'trojan') || mockMalwareFamilies[1];
    confidence = 93.8;
    summary = "Observed telemetry suggests an active remote access Trojan (RAT) or backdoor maintaining command-and-control communication.";
  } else if (text.includes('bsod') || text.includes('kernel') || text.includes('driver') || text.includes('invisible')) {
    matchedFamily = mockMalwareFamilies.find((f) => f.id === 'rootkit') || mockMalwareFamilies[5];
    confidence = 91.4;
    summary = "Signs of low-level kernel evasion or rootkit subverting operating system APIs and security services.";
  }

  return {
    diagnosisId: `diag-${Date.now().toString().slice(-5)}`,
    matchedFamily: matchedFamily.name,
    familyId: matchedFamily.id,
    confidence,
    summary,
    severity: matchedFamily.severity,
    color: matchedFamily.color,
    mitreTactics: matchedFamily.mitreTactics,
    playbook: matchedFamily.playbook,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };
}

/**
 * Scan Reports / History API Endpoint: GET /api/reports
 */
export async function getScanReports() {
  if (!USE_MOCK) {
    try {
      const response = await apiClient.get('/api/reports');
      return response.data;
    } catch (err) {
      console.warn('Backend /api/reports unavailable, using mock data:', err.message);
    }
  }
  await new Promise((res) => setTimeout(res, 300));
  return [...mockRecentScans];
}

/**
 * Malware Families Encyclopedia API Endpoint: GET /api/families
 */
export async function getMalwareFamilies() {
  if (!USE_MOCK) {
    try {
      const response = await apiClient.get('/api/families');
      return response.data;
    } catch (err) {
      console.warn('Backend /api/families unavailable, using mock data:', err.message);
    }
  }
  await new Promise((res) => setTimeout(res, 200));
  return [...mockMalwareFamilies];
}

/**
 * Dashboard Overview Stats Endpoint: GET /api/dashboard
 */
export async function getDashboardStats() {
  await new Promise((res) => setTimeout(res, 250));
  return {
    stats: {
      ...mockDashboardStats,
      totalScans: mockRecentScans.length + 1480,
      threatsFound: mockRecentScans.filter((s) => s.verdict === 'MALICIOUS').length + 245,
      cleanFiles: mockRecentScans.filter((s) => s.verdict === 'CLEAN').length + 1150,
      suspiciousFiles: mockRecentScans.filter((s) => s.verdict === 'SUSPICIOUS').length + 77,
    },
    timeline: mockScanTimeline,
    categories: mockThreatCategories,
    recentScans: mockRecentScans.slice(0, 6),
  };
}
