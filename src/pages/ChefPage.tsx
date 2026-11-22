import React from 'react';
import { Terminal, Cpu, ShieldCheck, Crosshair, KeyRound, Radio, ArrowRight } from 'lucide-react';

interface ChefPageProps {
  onSelectTab: (tab: string) => void;
}

export const ChefPage: React.FC<ChefPageProps> = ({ onSelectTab }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Security Council</span>
          <span aria-hidden="true">·</span>
          <span>Core Researchers</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
          The KALI Research Council
        </h1>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          Founded by offensive security veterans, reverse engineers, and cryptographic researchers dedicated to transparent peer-audited vulnerability research and ethical community education.
        </p>
      </div>

      {/* Main Founder Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl relative bg-black">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
              alt="Chief Security Officer Marco Kali"
              className="w-full h-full object-cover filter contrast-125 brightness-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 font-mono">
              <span className="text-xs uppercase text-emerald-400 tracking-widest block mb-1">
                Chief Security Officer & Founder
              </span>
              <h3 className="text-2xl font-bold text-white">Marco Kali</h3>
              <p className="text-xs text-slate-300 mt-1">20 Years in Low-Level Vulnerability Research & Kernel Exploitation</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-xs font-mono font-semibold text-emerald-400 tracking-wider uppercase">
            Adversarial Rigor & Open Science
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white leading-tight">
            "True defense is forged through rigorous, relentless offensive discovery."
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Marco founded the KALI collective to dismantle the secrecy surrounding offensive security research. Having conducted security audits for mission-critical distributed systems and CERN computational clusters, his vision was to provide ethical researchers with peer-audited tools and isolated testing environments.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Under his leadership, the collective has coordinated disclosures for over 140 high-impact CVEs, developed open-source binary analysis tools, and trained thousands of next-generation penetration testers.
          </p>

          <div className="space-y-3 pt-4 border-t border-emerald-500/15 font-mono">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hypervisor & Kernel Hardening</h4>
                <p className="text-xs text-slate-400 font-sans">Specializing in virtual machine escapes, eBPF taint analysis, and zero-allocation kernel memory bugs.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Crosshair className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Coordinated Disclosure Standard</h4>
                <p className="text-xs text-slate-400 font-sans">Strict 90-day responsible disclosure policy with automated vendor remediation verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Council Members Grid */}
      <div className="space-y-8 pt-8 border-t border-emerald-500/15">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-mono font-bold text-white">
            Principal Fellows & Domain Leads
          </h3>
          <p className="text-xs text-slate-400">
            Leading our specialized research labs across hardware, cryptography, and industrial SCADA security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Member 1 */}
          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Alex 'Cipher' Rivera</h4>
              <span className="text-[11px] text-emerald-400 block mt-0.5">Principal Exploit Developer</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              DEF CON & Black Hat speaker. Author of core memory corruption payloads and automated coverage fuzzing routines in AFL++ and Ghidra.
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-zinc-800">
              Disclosures: 42 CVEs · Research: Binary Reversing
            </div>
          </div>

          {/* Member 2 */}
          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Dr. Elena Vance</h4>
              <span className="text-[11px] text-emerald-400 block mt-0.5">Cryptographic Architect</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              PhD in Applied Cryptography. Directs our mathematical audits of post-quantum ciphers, constant-time implementations, and side-channel leakage.
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-zinc-800">
              Disclosures: 18 CVEs · Research: Post-Quantum Crypto
            </div>
          </div>

          {/* Member 3 */}
          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Devon 'Root' Brooks</h4>
              <span className="text-[11px] text-emerald-400 block mt-0.5">Hardware & SCADA Lead</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Pioneer in RF spectrum analysis, JTAG extraction, and cyber-physical security testing for power grids and transportation protocols.
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-zinc-800">
              Disclosures: 29 CVEs · Research: SDR & Hardware
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono">
        <div>
          <h3 className="text-lg font-bold text-white">Collaborate with the Research Council</h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Submit a vulnerability for peer review, propose a new tool module, or request specialized lab testing.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onSelectTab('contact')}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase cursor-pointer"
          >
            Encrypted Comms
          </button>
          <button
            onClick={() => onSelectTab('book')}
            className="px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-emerald-400 text-slate-200 text-xs font-medium uppercase cursor-pointer"
          >
            Book Lab Pod
          </button>
        </div>
      </div>
    </div>
  );
};
