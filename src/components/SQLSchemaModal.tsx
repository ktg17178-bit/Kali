import React, { useState } from 'react';
import { dbService } from '../services/db';
import { X, Copy, Check, Database, Server, Key, AlertCircle, Terminal } from 'lucide-react';

interface SQLSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SQLSchemaModal: React.FC<SQLSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(() => dbService.getSupabaseConfig().url);
  const [supabaseKey, setSupabaseKey] = useState(() => dbService.getSupabaseConfig().anonKey);
  const [connectStatus, setConnectStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const sql = dbService.getSQLSchema();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setConnectStatus(null);
    const result = await dbService.configureSupabase(supabaseUrl, supabaseKey);
    setIsTesting(false);
    setConnectStatus(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-3xl bg-[#0b0f17] border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white">
        {/* Header */}
        <div className="p-5 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">KALI PostgreSQL & Supabase Database Architecture</h2>
              <p className="text-xs text-slate-400">Tables for menu_items, bookings, users, and security activity_logs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Supabase Connection Widget */}
          <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-200">Supabase Cloud Database Relay (Optional)</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                dbService.getSupabaseConfig().isConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800 text-slate-400 border border-zinc-700'
              }`}>
                {dbService.getSupabaseConfig().isConnected ? '● Connected' : 'Local Storage Engine Active'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              The application runs out of the box with resilient browser local persistence, SQL export, JSON backups, and snapshot tools. To link a live Supabase project, provide your project URL and anon public key below.
            </p>
            <form onSubmit={handleSaveConnection} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Project URL</label>
                  <input
                    type="url"
                    placeholder="https://xyz.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full bg-[#111722] border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Anon / Public Key</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="w-full bg-[#111722] border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                    />
                    <Key className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                {connectStatus ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {connectStatus}
                  </span>
                ) : <span />}
                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isTesting ? 'Verifying...' : supabaseUrl ? 'Update & Save Credentials' : 'Switch to Local DB'}
                </button>
              </div>
            </form>
          </div>

          {/* SQL Editor Code Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Run in Supabase / PostgreSQL SQL Editor</span>
                <span className="text-[11px] text-slate-500">DDL & RLS Policies</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dbService.downloadSQLSchemaFile()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-slate-200 transition-colors border border-zinc-700 cursor-pointer"
                  title="Download PostgreSQL Schema File"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download .sql File</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-slate-200 transition-colors border border-zinc-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
              </div>
            </div>
            <pre className="p-4 rounded-xl bg-black border border-emerald-500/20 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-72 leading-relaxed selection:bg-emerald-500 selection:text-black">
              {sql}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-500/20 bg-black/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-medium text-white transition-colors cursor-pointer border border-zinc-700"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
