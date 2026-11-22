import React, { useState } from 'react';
import { Terminal, Search, ShieldAlert, Cpu, Lock, Check, Plus, ArrowRight, FileCode, ExternalLink, Activity } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';

interface VulnerabilityReport {
  id: string;
  name: string;
  cveId: string;
  discoverer: string;
  year: number;
  category: 'Zero-Day Research' | 'Kernel Exploits' | 'Firmware & IoT' | 'Cloud IAM' | 'Crypto Audits';
  affectedSystem: string;
  cvssScore: number;
  severity: 'Critical' | 'High' | 'Medium';
  notes: string;
  patchStatus: string;
  exploitVector: string;
  image: string;
}

const THREAT_DOSSIERS: VulnerabilityReport[] = [
  {
    id: 'cve-1',
    name: 'Linux Kernel eBPF Privilege Escalation Chain',
    cveId: 'CVE-2026-38411',
    discoverer: 'KALI Zero-Day Research Group',
    year: 2026,
    category: 'Kernel Exploits',
    affectedSystem: 'Linux Kernels 5.10 through 6.8',
    cvssScore: 9.8,
    severity: 'Critical',
    notes: 'Out-of-bounds array write in kernel/bpf/verifier.c allowing unprivileged local users to overwrite credentials structures and gain root execution.',
    patchStatus: 'Coordinated Upstream Patch Verified',
    exploitVector: 'Local Privilege Escalation (LPE)',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cve-2',
    name: 'Kubernetes API Multi-Tenant Namespace Escape',
    cveId: 'CVE-2026-29104',
    discoverer: 'KALI Cloud Red Team',
    year: 2026,
    category: 'Cloud IAM',
    affectedSystem: 'K8s Cluster Autoscaler & CRI-O',
    cvssScore: 9.1,
    severity: 'Critical',
    notes: 'Flaw in subpath volume mount handling combined with symlink racing that enables malicious container pods to read node host filesystem.',
    patchStatus: 'Patch Released v1.30.2',
    exploitVector: 'Container Breakout / Node Takeover',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cve-3',
    name: 'Broadcom Wi-Fi SoC Remote Code Execution',
    cveId: 'CVE-2025-44912',
    discoverer: 'Alex Rivera (KALI Research)',
    year: 2025,
    category: 'Firmware & IoT',
    affectedSystem: 'Broadcom BCM43xx Wi-Fi Firmware',
    cvssScore: 9.6,
    severity: 'Critical',
    notes: 'Heap buffer overflow in 802.11 beacon parser triggered by specially crafted management frames over-the-air with no user interaction.',
    patchStatus: 'Firmware OEM Advisory Issued',
    exploitVector: 'Zero-Click Over-The-Air RCE',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cve-4',
    name: 'Elliptic Curve Side-Channel Nonce Recovery',
    cveId: 'CVE-2025-18820',
    discoverer: 'KALI Cryptographic Working Group',
    year: 2025,
    category: 'Crypto Audits',
    affectedSystem: 'Hardware Security Modules & Microchips',
    cvssScore: 8.5,
    severity: 'High',
    notes: 'Microarchitectural cache-timing leak during ECDSA scalar multiplication allowing full private key extraction after 2,048 signatures.',
    patchStatus: 'Constant-Time Firmware Update Applied',
    exploitVector: 'Cache-Timing Cryptanalysis',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cve-5',
    name: 'Smart Grid SCADA Modbus Remote Hijack',
    cveId: 'CVE-2025-30198',
    discoverer: 'Devon Brooks & Industrial Team',
    year: 2025,
    category: 'Firmware & IoT',
    affectedSystem: 'PLC RTU Controllers',
    cvssScore: 8.9,
    severity: 'High',
    notes: 'Missing authentication in industrial PLC remote telemetry interface allows arbitrary coil manipulation and unauthorized sensor state falsification.',
    patchStatus: 'ICS-CERT Coordinated Advisory',
    exploitVector: 'Network Remote Protocol Spoofing',
    image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cve-6',
    name: 'Windows GDI+ Font Engine TrueType OOB Read',
    cveId: 'CVE-2025-08129',
    discoverer: 'KALI Reverse Engineering Lab',
    year: 2025,
    category: 'Zero-Day Research',
    affectedSystem: 'Microsoft Windows 11 / Server 2025',
    cvssScore: 8.8,
    severity: 'High',
    notes: 'Out-of-bounds pointer calculation in font rasterizer leading to information disclosure and subsequent ASLR bypass chain.',
    patchStatus: 'MSRC Security Update Verified',
    exploitVector: 'Malicious Font Parsing / Memory Leak',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80'
  }
];

interface CellarPageProps {
  onSelectTab: (tab: string) => void;
}

export const CellarPage: React.FC<CellarPageProps> = ({ onSelectTab }) => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDossier, setSelectedDossier] = useState<VulnerabilityReport | null>(null);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Kernel Exploits', 'Zero-Day Research', 'Firmware & IoT', 'Cloud IAM', 'Crypto Audits'];

  const filteredDossiers = THREAT_DOSSIERS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.affectedSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.discoverer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStageReport = (item: VulnerabilityReport, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const menuItem: MenuItem = {
      id: item.id,
      name: `${item.cveId} - ${item.name}`,
      description: item.notes,
      price: 50,
      category: 'Zero-Day Labs',
      image_url: item.image,
      is_special: item.severity === 'Critical',
      prep_time: 'Instant Dossier',
      wine_pairing: item.affectedSystem
    };
    addItem(menuItem, 1);
    setAddedMap(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [item.id]: false }));
    }, 1600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Vulnerability Intelligence Archive</span>
          <span aria-hidden="true">·</span>
          <span>CVE Dossiers</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
          Threat Intelligence Vault
        </h1>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          Comprehensive archives of zero-day research papers, coordinated vulnerability disclosures, hardware firmware extractions, and exploit chains discovered by KALI researchers.
        </p>
      </div>

      {/* Vault Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 text-center font-mono">
          <span className="text-[10px] text-slate-400 uppercase block">Total Disclosures</span>
          <span className="text-2xl font-bold text-white mt-1 block">142</span>
        </div>
        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 text-center font-mono">
          <span className="text-[10px] text-slate-400 uppercase block">Critical Severity</span>
          <span className="text-2xl font-bold text-rose-400 mt-1 block">38</span>
        </div>
        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 text-center font-mono">
          <span className="text-[10px] text-slate-400 uppercase block">Patch Verification</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">100%</span>
        </div>
        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 text-center font-mono">
          <span className="text-[10px] text-slate-400 uppercase block">Active Advisories</span>
          <span className="text-2xl font-bold text-cyan-400 mt-1 block">6 Curated</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-black/60 rounded-lg border border-emerald-500/20 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search CVE, kernel, vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/70 border border-emerald-500/20 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDossiers.map((dossier) => (
          <div
            key={dossier.id}
            onClick={() => setSelectedDossier(dossier)}
            className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl overflow-hidden hover:border-emerald-400/60 transition-all flex flex-col group cursor-pointer shadow-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              <img
                src={dossier.image}
                alt={dossier.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/80 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                  {dossier.cveId}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  dossier.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                }`}>
                  CVSS {dossier.cvssScore}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-xs text-slate-300 bg-black/80 px-2 py-0.5 rounded border border-white/10">
                {dossier.year}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                  {dossier.category} · {dossier.exploitVector}
                </span>
                <h3 className="text-base font-mono font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                  {dossier.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {dossier.notes}
                </p>
                <div className="mt-3 p-2 rounded bg-black/50 border border-zinc-800 text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-semibold">Target: </span>
                  {dossier.affectedSystem}
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-slate-400">{dossier.patchStatus}</span>
                <button
                  onClick={(e) => handleStageReport(dossier, e)}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    addedMap[dossier.id]
                      ? 'bg-emerald-500 text-black'
                      : 'bg-zinc-800 hover:bg-emerald-500 hover:text-black text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {addedMap[dossier.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Stage Whitepaper</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dossier Detail Modal */}
      {selectedDossier && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedDossier(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0b0f17] border border-emerald-500/40 rounded-2xl overflow-hidden shadow-2xl text-white font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between border-b border-emerald-500/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-emerald-400 font-bold">{selectedDossier.cveId}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-rose-400 font-semibold">CVSS {selectedDossier.cvssScore} {selectedDossier.severity}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedDossier.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">Discovered by {selectedDossier.discoverer}</p>
                </div>
                <button
                  onClick={() => setSelectedDossier(null)}
                  className="p-1.5 rounded bg-zinc-800 text-slate-300 hover:text-white hover:bg-zinc-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed font-sans text-slate-300">
                <span className="font-mono text-emerald-400 font-bold block uppercase">Vulnerability Breakdown:</span>
                <p>{selectedDossier.notes}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-black/60 border border-emerald-500/20 text-xs">
                <div>
                  <span className="text-slate-500 block">Affected Subsystems</span>
                  <span className="text-slate-200">{selectedDossier.affectedSystem}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Attack Surface / Vector</span>
                  <span className="text-slate-200">{selectedDossier.exploitVector}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Remediation Status</span>
                  <span className="text-emerald-400">{selectedDossier.patchStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Disclosure Cycle</span>
                  <span className="text-slate-200">{selectedDossier.year} Coordinated Disclosure</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleStageReport(selectedDossier);
                    setSelectedDossier(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Stage Whitepaper in Loadout</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedDossier(null);
                    onSelectTab('book');
                  }}
                  className="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer border border-zinc-700"
                >
                  Test in Lab Pod
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
