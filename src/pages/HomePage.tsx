import React from 'react';
import { 
  ArrowRight, 
  Terminal, 
  ShieldAlert, 
  Calendar, 
  Cpu, 
  Radio, 
  KeyRound, 
  Crosshair,
  ShieldCheck,
  Activity,
  Layers,
  Box,
  Binary
} from 'lucide-react';
import { Cyber3DBackground } from '../components/Cyber3DBackground';
import { TopWifiHackingBar } from '../components/TopWifiHackingBar';
import { BottomWifiHacking3D } from '../components/BottomWifiHacking3D';

interface HomePageProps {
  onSelectTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-16 pb-16 font-mono">
      {/* 0. TOP 3D WI-FI HACKING & INTERCEPT BAR */}
      <TopWifiHackingBar />

      {/* 1. HERO SECTION WITH 3D CYBER THREAT THEME */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-emerald-500/15">
        {/* 3D Interactive Cyber Hacking Theme Background */}
        <Cyber3DBackground interactiveHUD={true} />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          {/* Unboxed clean metadata kicker */}
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 mb-6 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>KALI // CYBER SECURITY RESEARCH ALLIANCE</span>
            <span aria-hidden="true">·</span>
            <span>v6.2 ROLLING</span>
            <span aria-hidden="true">·</span>
            <span>ZERO-DAY COALITION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
            Decentralized Ethical Hacking & <span className="text-emerald-400">Security Collective</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed mb-10 font-sans">
            A peer-driven alliance of penetration testers, reverse engineers, vulnerability researchers, and exploit developers. We build open offensive security toolkits, operate isolated CTF lab sandboxes, and publish coordinated zero-day disclosures.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onSelectTab('menu')}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Box className="w-4 h-4" />
              <span>Browse Products & 3D Arsenal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onSelectTab('book')}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Lab Sandbox Pod</span>
            </button>
          </div>

          {/* Real Community Telemetry & Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16 pt-8 border-t border-emerald-500/15 text-center">
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-white">4,800+</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Active Nodes</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-emerald-400">12</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Production Kits</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-white">142</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">CVE Disclosures</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-bold text-emerald-400">99.9%</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Sandbox Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMMUNITY SECURITY DIRECTIVE & ARCHITECTURE PILLARS (Clean theme, zero photos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Real-time Cyber Telemetry & Kernel Monitor Widget (replaces stock photo) */}
            <div className="bg-black/80 border border-emerald-500/30 rounded-xl p-5 shadow-2xl font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>KALI_COUNCIL_KERNEL_DAEMON</span>
                </div>
                <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                  RING-0 ACTIVE
                </span>
              </div>

              {/* Pseudo terminal output */}
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Subsystem Integrity: SHA256 verified</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-sans">
                  Target: <strong className="text-white font-mono">Linux Kernel 6.8+ / x86_64 / eBPF Security Probe</strong>
                </p>
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] space-y-1 text-slate-400 font-mono">
                  <div className="text-emerald-400">[0x00] DISCLOSURE_DIRECTIVE: RFC-9116 security.txt aligned</div>
                  <div>[0x01] RESEARCH_LEADS: Alex 'Cipher' Rivera & Council</div>
                  <div>[0x02] LAB_SANDBOX: Air-gapped VLAN Isolation Layer 2</div>
                  <div className="text-cyan-400">[0x03] ZERO_DAY_TELEMETRY: Automated taint tracking active</div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[11px] text-slate-500">
                <span>Council clearance: <strong className="text-slate-300">LEVEL 5</strong></span>
                <span className="text-emerald-400">DEF CON / Black Hat Fellows</span>
              </div>
            </div>

            {/* Directive Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                <Crosshair className="w-4 h-4" />
                <span>The Community Directive</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                "Security is not the illusion of a perimeter; it is the rigor of continuous adversarial challenge."
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                At KALI, we believe responsible offensive research is the cornerstone of robust defensive architecture. Every tool, script, and exploit chain published through our collective is rigorously sandboxed, audited, and cataloged alongside remediation telemetry.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-500/15">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    Binary & Kernel Analysis
                  </span>
                  <p className="text-[11px] text-slate-400 font-sans">Headless Ghidra decompilation, taint analysis, and symbol restoration pipelines.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    Hardware & SDR Testing
                  </span>
                  <p className="text-[11px] text-slate-400 font-sans">Wideband RF spectrum probing, Sub-GHz replay analysis, and micro-soldering labs.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectTab('chef')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Meet the Security Council & Core Researchers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSITION BANNER TO THE NEXT PRODUCTS PAGE (Housed with 3D Tesseract Theme) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0d131f] via-[#0b0f17] to-[#0d131f] border border-cyan-500/30 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider">
              <Box className="w-4 h-4 text-cyan-400" />
              <span>Next Page: Cyber Arsenal & Weaponized Products</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Explore All 12 Community Toolkits in 3D
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              All offensive frameworks, defensive sensors, zero-day lab environments, and hardware pentest rigs are cataloged on the next page with a dedicated 3D Tesseract Vault visualization.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <button
              onClick={() => onSelectTab('menu')}
              className="px-8 py-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Launch 3D Products Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. COMMUNITY SECURITY ADVISORIES BANNER */}
      <section className="border-y border-emerald-500/15 bg-[#0b0f17] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>RESPONSIBLE DISCLOSURE ALLIANCE</span>
          </div>
          <blockquote className="text-lg sm:text-2xl text-white leading-relaxed">
            "KALI provides one of the cleanest, peer-audited offensive security arsenals in the ethical research sector. Their coordinated zero-day disclosures have fortified critical infrastructure globally."
          </blockquote>
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              Global Cyber Defense Review
            </span>
            <span className="text-[11px] text-slate-500 mt-1">CVE Coordinated Disclosure Partner 2026</span>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM 3D WI-FI RF SPECTRUM & AIRCRACK WATERFALL */}
      <BottomWifiHacking3D />
    </div>
  );
};
