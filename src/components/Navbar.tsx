import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { AuthenticatedUser, isUserAdmin, dbService } from '../services/db';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Calendar,
  ShieldCheck,
  Database,
  Lock,
  Unlock,
  LogOut,
  User
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSQLModal: () => void;
  currentUser: AuthenticatedUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSQLModal,
  currentUser,
  onLogout
}) => {
  const { totalCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = isUserAdmin(currentUser);
  const isAdminPanelUnlocked = dbService.isAdminPanelUnlocked();

  const navItems = [
    { id: 'home', label: 'Network' },
    { id: 'menu', label: 'Arsenal' },
    { id: 'book', label: 'Lab Access' },
    { id: 'cellar', label: 'Threat Vault' },
    { id: 'events', label: 'Hackathons' },
    { id: 'chef', label: 'Council' },
    { id: 'press', label: 'Disclosures' },
    { id: 'contact', label: 'Comms' },
    { id: 'admin', label: 'Admin Panel' },
  ];

  const handleNav = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070a0f]/95 backdrop-blur-md border-b border-emerald-500/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:text-emerald-300 transition-colors shadow-inner shadow-emerald-500/10">
              <span className="font-mono font-bold text-base">&gt;_</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-wider font-mono text-white group-hover:text-emerald-400 transition-colors">
                  KALI
                </span>
                <span className="text-emerald-500 font-mono text-sm font-semibold">//</span>
                <span className="text-xs uppercase tracking-widest text-zinc-300 font-mono">
                  SECURITY
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5 inline-block" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80 font-mono">
                Ethical Hacker Collective
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-xs uppercase tracking-wider font-mono font-medium transition-colors cursor-pointer relative py-2 ${
                  currentTab === item.id
                    ? 'text-emerald-400 font-bold'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {item.label}
                {currentTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Database SQL button */}
            <button
              onClick={onOpenSQLModal}
              title="Inspect PostgreSQL & Supabase Database Schema"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-emerald-500/25 hover:border-emerald-400 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-mono">SQL / DB</span>
            </button>

            {/* Loadout Staging Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 text-white transition-all cursor-pointer"
              aria-label="View Staged Arsenal Loadout"
              title="Arsenal Loadout"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-300 hover:text-emerald-400 transition-colors" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center shadow-[0_0_6px_rgba(16,185,129,0.8)] font-mono">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Reserve Lab Station CTA */}
            <button
              onClick={() => handleNav('book')}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Lab Pod</span>
            </button>

            {/* Active User Status & Sign Out */}
            {currentUser && (
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-1.5 py-1">
                {isAdmin ? (
                  <button
                    onClick={() => handleNav('admin')}
                    className="flex items-center gap-1.5 text-xs text-white hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Operations Command Center"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-xs text-emerald-400 font-mono">{currentUser.username}</span>
                    <span className="text-[9px] uppercase tracking-wider font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">Ops</span>
                  </button>
                ) : (
                  <div
                    className="flex items-center gap-1.5 text-xs text-zinc-300 pr-1 select-none"
                    title={`Operator Account: @${currentUser.username} (${currentUser.role})`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="font-medium text-xs text-zinc-200 font-mono">{currentUser.username}</span>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-400 bg-white/5 border border-white/10 px-1 py-0.5 rounded">Operator</span>
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/5 transition-colors cursor-pointer"
                  title="Disconnect & Lock Terminal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Single Unified Admin Login / Panel Trigger */}
            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-mono text-xs ${
                currentTab === 'admin' || currentTab === 'login'
                  ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/30'
                  : 'bg-zinc-900 border border-emerald-500/35 text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-400 font-semibold'
              }`}
              title={isAdminPanelUnlocked ? 'Operations Center (Unlocked)' : 'Admin Login'}
            >
              {isAdminPanelUnlocked ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>{isAdminPanelUnlocked ? 'Admin Panel' : 'Admin Login'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-500/20 bg-[#070a0f] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-2.5 text-xs font-mono uppercase tracking-wider font-medium rounded-lg transition-colors ${
                  currentTab === item.id
                    ? 'bg-emerald-500/15 text-emerald-400 font-bold border-l-2 border-emerald-400'
                    : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            {currentUser && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-semibold">@{currentUser.username}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">{currentUser.role}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1 font-bold cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Lock & Sign Out</span>
                </button>
              </div>
            )}

            <button
              onClick={() => handleNav('admin')}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-colors ${
                currentTab === 'admin' || currentTab === 'login'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-zinc-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40'
              }`}
            >
              {isAdminPanelUnlocked ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{isAdminPanelUnlocked ? 'Admin Panel (Unlocked)' : 'Admin Login'}</span>
            </button>

            <button
              onClick={() => handleNav('book')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 text-black text-xs font-mono font-bold tracking-wider uppercase"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Lab Pod</span>
            </button>

            <button
              onClick={onOpenSQLModal}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Inspect Database Schema</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
