import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/db';
import { logActivity } from '../services/logger';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Sparkles,
  Terminal,
  Fingerprint
} from 'lucide-react';

interface AdminPasswordPageProps {
  onUnlockSuccess: () => void;
  onCancel: () => void;
}

export const AdminPasswordPage: React.FC<AdminPasswordPageProps> = ({ onUnlockSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);
  
  // Rate-limiting / brute force protection
  const [failedAttempts, setFailedAttempts] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('kali_admin_failed_attempts');
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
    logActivity('PAGE_VIEW: ADMIN_PASSWORD_LOCK_SCREEN', '/admin#password-gate');
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownSeconds > 0) return;

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setError('Please enter the administrative password.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const isValid = await dbService.verifyAdminPanelPassword(trimmedPassword);
      if (isValid) {
        // Unlock admin panel
        dbService.unlockAdminPanel();
        sessionStorage.removeItem('kali_admin_failed_attempts');
        setFailedAttempts(0);
        await logActivity('ADMIN_PANEL_PASSWORD_SUCCESS: Master clearance verified', '/admin');
        onUnlockSuccess();
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        sessionStorage.setItem('kali_admin_failed_attempts', nextAttempts.toString());
        await logActivity(`ADMIN_PANEL_PASSWORD_FAILED: Invalid attempt #${nextAttempts}`, '/admin');

        setShake(true);
        setTimeout(() => setShake(false), 500);

        if (nextAttempts >= 5) {
          setCooldownSeconds(30);
          setError('Too many failed attempts. Security cooldown active for 30 seconds.');
        } else {
          setError(`Incorrect admin password. Access denied (${5 - nextAttempts} attempts remaining).`);
        }
      }
    } catch {
      setError('Verification service unavailable. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div
        className={`w-full max-w-md bg-[#121212]/95 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-7 relative z-10 transition-transform ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* Top Header Badge */}
        <div className="text-center space-y-3 font-mono">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-black border border-emerald-500 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 border border-emerald-500/20 text-[10px] text-emerald-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Single Password Gate</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Operator Login & Admin Gate
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-sans">
              Enter master password to authenticate and unlock administrative controls. No username required.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Cooldown Timer Alert */}
        {cooldownSeconds > 0 && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Lockout active: Please wait <strong>{cooldownSeconds}s</strong> before retry.</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleVerify} className="space-y-4 font-mono">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Master Password</span>
              </label>
              <span className="text-[10px] text-emerald-400">
                Encrypted Verification
              </span>
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                required
                disabled={cooldownSeconds > 0 || isVerifying}
                autoComplete="current-password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/70 border border-emerald-500/30 focus:border-emerald-400 rounded-lg px-4 py-2.5 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none transition-all tracking-wider disabled:opacity-50"
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

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              type="submit"
              disabled={cooldownSeconds > 0 || isVerifying}
              className="w-full py-3 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold tracking-widest uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In & Unlock Admin Panel</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white text-xs font-medium transition-colors border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Community Network</span>
            </button>
          </div>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>KALI Command Security</span>
          <span className="flex items-center gap-1">
            <Fingerprint className="w-3 h-3 text-emerald-400" />
            Session Lock Enforced
          </span>
        </div>
      </div>
    </div>
  );
};
