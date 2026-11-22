import React, { useState } from 'react';
import { Terminal, Mail, Send, CheckCircle2, ShieldCheck, KeyRound, MessageSquare, Radio } from 'lucide-react';
import { logActivity } from '../services/logger';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    handle: '',
    subject: 'Vulnerability Disclosure',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    logActivity(`COMMS_MESSAGE: Encrypted inquiry received from ${form.email} (${form.subject})`, '/contact');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
          <Terminal className="w-4 h-4" />
          <span>Encrypted Drop</span>
          <span aria-hidden="true">·</span>
          <span>Responsible Disclosure</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
          Secure Comms & Operations Drop
        </h1>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          For coordinated zero-day disclosures, community module submissions, private lab access clearance, or cryptographic key exchanges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 font-mono">
        {/* Contact Info & PGP */}
        <div className="space-y-6">
          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>PGP Public Fingerprint & Verification</span>
            </h3>
            <div className="p-3 bg-black/60 rounded-lg border border-zinc-800 text-[11px] text-emerald-400 break-all select-all">
              4B9F 2A81 E604 C97D 8102 F541 A988 12DE 39B0 77E1
            </div>
            <div className="space-y-4 text-xs text-slate-300 font-sans">
              <div className="flex items-start gap-3">
                <Radio className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <span className="font-semibold text-white font-mono block">Matrix Community Space</span>
                  <span className="text-slate-400 font-mono text-[11px]">#kali-collective:matrix.org</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">End-to-end encrypted rooms for red teamers and exploit devs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <span className="font-semibold text-white font-mono block">Security Inbox</span>
                  <span className="text-slate-400 font-mono text-[11px]">security@kali-collective.org</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">Automated PGP decryption with 24-hour response SLA.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 space-y-3 text-xs">
            <span className="font-bold text-white uppercase text-[11px] block">Coordinated Disclosure Guidelines</span>
            <ul className="space-y-1.5 text-slate-400 font-sans list-disc list-inside">
              <li>All reported zero-day vulnerabilities receive immediate triage within 48 hours.</li>
              <li>A standard 90-day embargo applies before public disclosure or CVE assignment.</li>
              <li>Exploit proofs-of-concept must be demonstrated in isolated sandboxes.</li>
            </ul>
          </div>
        </div>

        {/* Encrypted Inquiry Form */}
        <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Encrypted Transmission Received</h3>
              <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
                Your dispatch has been logged in the operations database and queued for cryptographic verification.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-zinc-800 text-slate-300 hover:text-white rounded text-xs font-mono cursor-pointer"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-white">Transmit Message to Council</h3>

              <div>
                <label className="text-[11px] text-slate-400 uppercase block mb-1">Handle / Sender Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cipher_99"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/70 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase block mb-1">Comms Email / Signal</label>
                <input
                  type="email"
                  required
                  placeholder="operator@proton.me"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-black/70 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase block mb-1">Inquiry Vector</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-black/70 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="Vulnerability Disclosure">Vulnerability Disclosure (CVE)</option>
                  <option value="Arsenal Module Proposal">Arsenal Module Proposal</option>
                  <option value="Lab Workstation Clearance">Lab Workstation Clearance</option>
                  <option value="CTF Team Accreditation">CTF Team Accreditation</option>
                  <option value="General Cryptographic Comms">General Cryptographic Comms</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase block mb-1">Encrypted Payload / Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Include vulnerability details, affected firmware version, or proposal..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-black/70 border border-zinc-800 rounded p-3 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Secure Dispatch</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
