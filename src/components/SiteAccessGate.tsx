import React, { useState, useRef, useEffect } from 'react';
import { dbService } from '../services/db';
import { logActivity } from '../services/logger';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';

interface SiteAccessGateProps {
  onAccessGranted: () => void;
}

export const SiteAccessGate: React.FC<SiteAccessGateProps> = ({ onAccessGranted }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const userInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    userInputRef.current?.focus();
    logActivity('PERIMETER_GATE_VIEW: Site access prompt presented', '/');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please enter both username and password.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      const isValid = dbService.verifySiteCredentials(cleanUser, cleanPass);
      setIsVerifying(false);

      if (isValid) {
        logActivity(`PERIMETER_GATE_SUCCESS: Operator "${cleanUser}" passed gate verification`, '/');
        onAccessGranted();
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        logActivity(`PERIMETER_GATE_FAILED: Denied entry for "${cleanUser}" (attempt #${nextAttempts})`, '/');
        setError('Access Denied: Invalid username or password.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none font-mono">
      {/* Ambient Cyber Lighting & Matrix Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -translate-y-20" />
      </div>

      {/* Cyber Grid Lines */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Header Status */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-emerald-500/20 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
            &gt;_
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-wider text-white">KALI</span>
            <span className="text-emerald-500 font-semibold">//</span>
            <span className="text-xs uppercase tracking-widest text-slate-300">SECURITY COLLECTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Perimeter Gate Active</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div 
          className={`w-full max-w-md bg-[#0b0f17]/95 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-7 transition-transform ${
            shake ? 'animate-shake' : ''
          }`}
        >
          {/* Card Icon & Header */}
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-black border border-emerald-500 flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 border border-emerald-500/25 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Restricted Access Gate</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Perimeter Security Check
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-sans">
                This collective network is guarded. Enter authorized operator credentials to access the intelligence platform.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-snug">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Username</span>
              </label>
              <div className="relative">
                <input
                  ref={userInputRef}
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/70 border border-emerald-500/30 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all tracking-wider disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Password</span>
                </label>
                <span className="text-[10px] text-emerald-400">
                  Encrypted Verification
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/70 border border-emerald-500/30 focus:border-emerald-400 rounded-lg px-4 py-2.5 pr-11 text-xs text-white placeholder-slate-600 focus:outline-none transition-all tracking-wider disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-white transition-colors p-0.5 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold tracking-widest uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate & Access Website</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Security Badge */}
          <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 / ECC-P384</span>
            </span>
            <span>Zero-Trust Architecture</span>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="relative z-10 px-6 py-4 text-center text-[11px] text-slate-500 border-t border-emerald-500/10">
        <span>KALI Security Collective · Controlled Distribution • Authorized Testing Mandates Only</span>
      </footer>
    </div>
  );
};
