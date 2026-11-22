import React, { useState } from 'react';
import { Calendar, Users, Clock, Terminal, Crosshair, CheckCircle2, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { logActivity } from '../services/logger';

interface EventsPageProps {
  onSelectTab: (tab: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onSelectTab }) => {
  const [selectedTrack, setSelectedTrack] = useState<'ctf' | 'wargame' | 'hardware'>('ctf');
  const [teamSize, setTeamSize] = useState<number>(4);
  const [computeTier, setComputeTier] = useState<'standard' | 'dedicated' | 'airgap'>('dedicated');
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);

  const eventTracks = {
    ctf: {
      title: 'Global 48H CTF Championship',
      subtitle: 'Jeopardy & Attack-Defense Competition',
      format: 'Teams of up to 8 Operators',
      baseFee: 150,
      description: 'Global 48-hour challenge spanning binary exploitation, web injection, cryptography, reverse engineering, and cloud forensics with a $25,000 bounty pool.'
    },
    wargame: {
      title: 'Red vs Blue Infrastructure Wargame',
      subtitle: 'Adversary Simulation Drill',
      format: 'Teams of up to 10 Operators',
      baseFee: 250,
      description: 'Simulated corporate cloud network with active purple-team emulation. Test evasive C2 implants against real-time SIEM and EDR automated threat responses.'
    },
    hardware: {
      title: 'Hardware & RF Village Bootcamp',
      subtitle: 'Hands-on Firmware & SDR Sprint',
      format: 'Teams of up to 4 Operators',
      baseFee: 200,
      description: 'Micro-soldering, UART/JTAG extraction, software-defined radio protocol decoding, and CAN bus automotive telemetry penetration testing.'
    }
  };

  const computeTierCosts = {
    standard: { name: 'Shared Docker Sandbox', price: 20 },
    dedicated: { name: 'Dedicated 64-Core VM Node', price: 60 },
    airgap: { name: 'Air-Gapped Hardware Rig', price: 120 }
  };

  const totalEstimate = eventTracks[selectedTrack].baseFee + (teamSize * computeTierCosts[computeTier].price);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    logActivity(`EVENT_REGISTRATION: ${eventTracks[selectedTrack].title} (${teamSize} operators, $${totalEstimate})`, '/events');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Competitions & Drills</span>
          <span aria-hidden="true">·</span>
          <span>Community Events</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
          Hackathons, CTF Tournaments & Wargames
        </h1>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          Participate in global capture-the-flag competitions, red vs blue team adversarial simulations, and specialized hardware security bootcamps hosted by KALI.
        </p>
      </div>

      {/* Tracks Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        {/* Track 1 */}
        <div
          onClick={() => setSelectedTrack('ctf')}
          className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
            selectedTrack === 'ctf'
              ? 'bg-[#0f172a] border-emerald-400 shadow-xl shadow-emerald-500/10'
              : 'bg-[#0b0f17] border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden border border-zinc-800 relative bg-black">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                alt="CTF Tournament"
                className="w-full h-full object-cover opacity-80"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                Prize: $25,000
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                Global Sprint
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                48H Global CTF Championship
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                {eventTracks.ctf.description}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">{eventTracks.ctf.format}</span>
            <span className="text-emerald-400 font-bold">Base: ${eventTracks.ctf.baseFee}</span>
          </div>
        </div>

        {/* Track 2 */}
        <div
          onClick={() => setSelectedTrack('wargame')}
          className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
            selectedTrack === 'wargame'
              ? 'bg-[#0f172a] border-emerald-400 shadow-xl shadow-emerald-500/10'
              : 'bg-[#0b0f17] border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden border border-zinc-800 relative bg-black">
              <img
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
                alt="Wargame"
                className="w-full h-full object-cover opacity-80"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-cyan-400 font-bold border border-cyan-500/30">
                Purple Team Drill
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                Adversary Simulation
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Red vs Blue Defense Wargame
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                {eventTracks.wargame.description}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">{eventTracks.wargame.format}</span>
            <span className="text-emerald-400 font-bold">Base: ${eventTracks.wargame.baseFee}</span>
          </div>
        </div>

        {/* Track 3 */}
        <div
          onClick={() => setSelectedTrack('hardware')}
          className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
            selectedTrack === 'hardware'
              ? 'bg-[#0f172a] border-emerald-400 shadow-xl shadow-emerald-500/10'
              : 'bg-[#0b0f17] border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden border border-zinc-800 relative bg-black">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Hardware Village"
                className="w-full h-full object-cover opacity-80"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-amber-400 font-bold border border-amber-500/30">
                Hardware Lab
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                Physical Hacking
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Hardware & RF Village
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                {eventTracks.hardware.description}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">{eventTracks.hardware.format}</span>
            <span className="text-emerald-400 font-bold">Base: ${eventTracks.hardware.baseFee}</span>
          </div>
        </div>
      </div>

      {/* Interactive Registration & Seat Calculator */}
      <div className="bg-[#0b0f17] border border-emerald-500/30 rounded-2xl p-6 sm:p-10 font-mono">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Event Dispatch Configurator
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Register Team & Compute Allocation
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-sans">
                Configure your operator team size and isolated testing environment for {eventTracks[selectedTrack].title}.
              </p>
            </div>

            {/* Team Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Team Size:</span>
                <span className="text-emerald-400 font-bold">{teamSize} Operators</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Compute Tier */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">Isolated Compute Tier:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['standard', 'dedicated', 'airgap'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setComputeTier(tier)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      computeTier === tier
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                        : 'bg-black/50 border-zinc-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{computeTierCosts[tier].name}</span>
                    <span className="text-[10px] text-slate-500">+${computeTierCosts[tier].price}/op</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Preview */}
            <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Estimated Registration Pass</span>
                <span className="text-xl font-bold text-emerald-400">${totalEstimate}</span>
              </div>
              <span className="text-xs text-slate-400">Includes sandbox access & telemetry</span>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-black/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            {inquirySubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Team Registration Request Dispatched</h3>
                <p className="text-xs text-slate-400 font-sans">
                  The event coordinators have received your team configuration. Access tokens and VPN certificates will be generated shortly.
                </p>
                <button
                  onClick={() => setInquirySubmitted(false)}
                  className="px-4 py-2 bg-zinc-800 text-slate-300 hover:text-white rounded text-xs font-mono cursor-pointer"
                >
                  Configure Another Team
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <h3 className="text-sm font-bold text-white">Submit Team Clearance Request</h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Team Handle / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector-7 Red Team"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Team Captain Email</label>
                  <input
                    type="email"
                    required
                    placeholder="captain@sector7-ops.io"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Special Requirements (e.g. GPU, VLAN)</label>
                  <input
                    type="text"
                    placeholder="e.g. 10Gbps bridge or custom Kali build"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Confirm Event Registration
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
