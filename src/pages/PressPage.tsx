import React, { useState } from 'react';
import { Terminal, ShieldCheck, CheckCircle2, Send, MessageSquare, Crosshair } from 'lucide-react';
import { logActivity } from '../services/logger';

interface CommunityLogEntry {
  id: string;
  author: string;
  handle: string;
  date: string;
  toolMentioned: string;
  comment: string;
}

const INITIAL_LOGBOOK: CommunityLogEntry[] = [
  {
    id: 'log-1',
    author: 'Nikolai Voronin',
    handle: '@voronin_re',
    date: 'October 2026',
    toolMentioned: 'Ghidra Reverse Engineering Suite',
    comment: 'The automated struct recovery and microcode decompiler plugins saved our incident response team over 40 hours during a live firmware triage.'
  },
  {
    id: 'log-2',
    author: 'Sarah Jenkins',
    handle: '@sjenkins_sec',
    date: 'September 2026',
    toolMentioned: 'Cobalt Strike C2 Simulator Node',
    comment: 'Flawless malleable C2 profiles with clean egress simulation. Allowed our red team to thoroughly validate our enterprise EDR telemetry.'
  },
  {
    id: 'log-3',
    author: 'Kenji Sato',
    handle: '@kenji_sdr',
    date: 'August 2026',
    toolMentioned: 'HackRF One SDR Wideband Transceiver',
    comment: 'The custom PortaPack firmware and Sub-GHz signal replay scripts worked right out of the box during our automotive CAN bus security audit.'
  }
];

export const PressPage: React.FC = () => {
  const [logbook, setLogbook] = useState<CommunityLogEntry[]>(INITIAL_LOGBOOK);
  const [newAuthor, setNewAuthor] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [newTool, setNewTool] = useState('Ghidra Reverse Engineering Suite');
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const entry: CommunityLogEntry = {
      id: `log-${Date.now()}`,
      author: newAuthor.trim(),
      handle: newHandle.trim().startsWith('@') ? newHandle.trim() : `@${newHandle.trim() || 'operator'}`,
      date: 'Just Now',
      toolMentioned: newTool,
      comment: newComment.trim()
    };

    setLogbook([entry, ...logbook]);
    setSubmitted(true);
    setNewAuthor('');
    setNewHandle('');
    setNewComment('');
    logActivity(`COMMUNITY_LOG: Review submitted by ${entry.handle}`, '/press');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Security Advisories</span>
          <span aria-hidden="true">·</span>
          <span>Community Endorsements</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
          Advisories & Community Feedback
        </h1>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          Critical research assessments from DEF CON, Black Hat proceedings, and field-tested feedback from security operators worldwide.
        </p>
      </div>

      {/* Conference & Peer Endorsements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">DEF CON 33 Review</span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              "KALI's open-source binary analysis suite and zero-day taint tracking pipeline establish a benchmark for reproducible offensive security tools."
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-800 text-[11px] text-slate-400">
            <span className="font-bold text-white block">Advisory Review Committee</span>
            <span>Las Vegas, NV</span>
          </div>
        </div>

        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">IEEE Cyber Journal</span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              "The mathematical precision of KALI's cryptographic side-channel analysis models illustrates the immense power of decentralized research."
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-800 text-[11px] text-slate-400">
            <span className="font-bold text-white block">Academic Peer Evaluation</span>
            <span>Cryptographic Engineering</span>
          </div>
        </div>

        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Black Hat Briefing</span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              "Their coordinated disclosure programs and hardware testing villagers provide critical telemetry for defending enterprise infrastructure."
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-800 text-[11px] text-slate-400">
            <span className="font-bold text-white block">Offensive Research Summit</span>
            <span>Security Operations Brief</span>
          </div>
        </div>
      </div>

      {/* Community Operator Logbook */}
      <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-2xl p-6 sm:p-10 font-mono">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/15">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase">
              <MessageSquare className="w-4 h-4" />
              <span>Operator Logbook & Field Notes</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Live Telemetry from Active Operators</h2>
          </div>
          <span className="text-xs text-slate-500">Peer verification signatures</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Submission Form */}
          <div className="lg:col-span-1 bg-black/50 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Submit Field Verification Note</h3>
            {submitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-emerald-400 font-bold">Field Note Logged Successfully</p>
                <p className="text-[11px] text-slate-400 font-sans">Thank you for contributing to the collective knowledge base.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs text-slate-300 underline cursor-pointer"
                >
                  Write Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Operator Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Handle / Matrix ID</label>
                  <input
                    type="text"
                    placeholder="@handle"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Toolkit Mentioned</label>
                  <select
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Ghidra Reverse Engineering Suite">Ghidra Reverse Engineering Suite</option>
                    <option value="Cobalt Strike C2 Simulator Node">Cobalt Strike C2 Simulator Node</option>
                    <option value="Metasploit Pro Red Team Rig">Metasploit Pro Red Team Rig</option>
                    <option value="HackRF One SDR Wideband Transceiver">HackRF One SDR Wideband Transceiver</option>
                    <option value="Flipper Zero Marauder Pentest Kit">Flipper Zero Marauder Pentest Kit</option>
                    <option value="Suricata Next-Gen IPS Sensor">Suricata Next-Gen IPS Sensor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Field Feedback / Note</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe deployment results or vulnerability discovery..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Field Note</span>
                </button>
              </form>
            )}
          </div>

          {/* List of Notes */}
          <div className="lg:col-span-2 space-y-4">
            {logbook.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{entry.author}</span>
                    <span className="text-emerald-400 text-[11px]">{entry.handle}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{entry.date}</span>
                </div>
                <span className="text-[10px] text-cyan-400 block font-semibold">
                  Module: {entry.toolMentioned}
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  "{entry.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
