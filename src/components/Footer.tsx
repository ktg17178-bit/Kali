import React from 'react';
import { Terminal, ShieldCheck, Database, Lock, Cpu, Radio, KeyRound, Globe } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenSQLModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenSQLModal }) => {
  return (
    <footer className="bg-[#05070a] border-t border-emerald-500/20 text-slate-400 text-xs font-mono">
      {/* Top Banner: Metrics & Mandate */}
      <div className="border-b border-emerald-500/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Terminal className="w-4 h-4 text-emerald-400 mb-1.5" />
            <span className="text-white font-bold text-xs tracking-wider uppercase">142 Disclosures</span>
            <span className="text-[11px] text-slate-500">Coordinated Zero-Day CVEs</span>
          </div>
          <div className="flex flex-col items-center">
            <Cpu className="w-4 h-4 text-emerald-400 mb-1.5" />
            <span className="text-white font-bold text-xs tracking-wider uppercase">12 Arsenal Modules</span>
            <span className="text-[11px] text-slate-500">Peer-Audited Production Tools</span>
          </div>
          <div className="flex flex-col items-center">
            <Radio className="w-4 h-4 text-emerald-400 mb-1.5" />
            <span className="text-white font-bold text-xs tracking-wider uppercase">Isolated Sandboxes</span>
            <span className="text-[11px] text-slate-500">Air-Gapped Lab Pods</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
            <span className="text-white font-bold text-xs tracking-wider uppercase">Responsible Standard</span>
            <span className="text-[11px] text-slate-500">Strict Ethical Mandate</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              &gt;_
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider text-white">
                KALI
              </span>
              <span className="text-[9px] uppercase tracking-widest text-emerald-400">
                Ethical Security Collective
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-xs font-sans leading-relaxed">
            A decentralized alliance of vulnerability researchers, reverse engineers, and penetration testers. Dedicated to continuous offensive discovery, responsible disclosure, and open cybersecurity tooling.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenSQLModal}
              title="Inspect PostgreSQL & Supabase Database Architecture"
              className="p-2 rounded bg-zinc-900 border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectTab('admin')}
              title="Operations Command Center"
              className="p-2 rounded bg-zinc-900 border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Research Labs */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold tracking-wider uppercase">
            Research Divisions
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-sans">
            <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onSelectTab('menu')}>Offensive Tools & C2 Staging</li>
            <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onSelectTab('menu')}>Kernel Memory & Hypervisor Exploits</li>
            <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onSelectTab('menu')}>Software-Defined Radio & RF Spectrum</li>
            <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onSelectTab('cellar')}>Cryptographic Audits & Side-Channels</li>
            <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onSelectTab('events')}>Hardware JTAG & Micro-Soldering</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold tracking-wider uppercase">
            Network Directives
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('home')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Network Overview
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('menu')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Toolkits & Payloads
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('book')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Lab Pod Reservations
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('cellar')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Threat Intelligence Vault
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('events')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Hackathons & CTF
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('chef')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Security Council
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('admin')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Admin Login</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Secure Drop & Verification */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold tracking-wider uppercase">
            Verification & Comms
          </h4>
          <div className="space-y-2 text-xs text-slate-400">
            <p>PGP Key: 4B9F 2A81 E604 C97D</p>
            <p>Matrix: #kali-collective:matrix.org</p>
            <p>Email: security@kali-collective.org</p>
            <div className="pt-2">
              <button
                onClick={() => onSelectTab('contact')}
                className="w-full py-2 rounded bg-zinc-900 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black text-xs font-bold uppercase transition-all cursor-pointer text-center block"
              >
                Encrypted Drop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-500/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 KALI Security Collective. All toolkits distributed under authorized ethical testing mandates.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectTab('admin')} className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer">Admin Login</button>
            <button onClick={onOpenSQLModal} className="hover:text-emerald-400 cursor-pointer">PostgreSQL DDL</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
