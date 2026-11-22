/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SQLSchemaModal } from './components/SQLSchemaModal';
import { AdminPasswordPage } from './components/AdminPasswordPage';
import { SiteAccessGate } from './components/SiteAccessGate';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { BookingPage } from './pages/BookingPage';
import { ChefPage } from './pages/ChefPage';
import { ContactPage } from './pages/ContactPage';
import { CellarPage } from './pages/CellarPage';
import { EventsPage } from './pages/EventsPage';
import { PressPage } from './pages/PressPage';
import { AdminPage } from './pages/AdminPage';
import { dbService, AuthenticatedUser } from './services/db';
import { logVisitorVisit } from './services/logger';
import { Check, X } from 'lucide-react';

function AppContent() {
  const [isSiteAuthorized, setIsSiteAuthorized] = useState<boolean>(() => {
    return dbService.isSiteAccessGranted();
  });

  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    return dbService.getCurrentUser();
  });

  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (path === '/admin' || hash === 'admin') return 'admin';
      if (path === '/login' || hash === 'login' || path === '/signin' || hash === 'signin') return 'login';
      if (hash === 'menu' || path === '/menu') return 'menu';
      if (hash === 'cellar' || path === '/cellar') return 'cellar';
      if (hash === 'events' || path === '/events') return 'events';
      if (hash === 'press' || path === '/press') return 'press';
      if (hash === 'book' || hash === 'booking' || path === '/book') return 'book';
      if (hash === 'contact' || path === '/contact') return 'contact';
      if (hash === 'chef' || path === '/chef') return 'chef';
    }
    return 'home';
  });

  const [isSQLModalOpen, setIsSQLModalOpen] = useState(false);
  const { toastMessage, dismissToast } = useCart();

  // Listen to popstate / hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (path === '/admin' || hash === 'admin') {
        setCurrentTab('admin');
      } else if (path === '/login' || hash === 'login' || path === '/signin' || hash === 'signin') {
        setCurrentTab('login');
      } else if (hash === 'menu' || path === '/menu') {
        setCurrentTab('menu');
      } else if (hash === 'cellar' || path === '/cellar') {
        setCurrentTab('cellar');
      } else if (hash === 'events' || path === '/events') {
        setCurrentTab('events');
      } else if (hash === 'press' || path === '/press') {
        setCurrentTab('press');
      } else if (hash === 'book' || hash === 'booking' || path === '/book') {
        setCurrentTab('book');
      } else if (hash === 'contact' || path === '/contact') {
        setCurrentTab('contact');
      } else if (hash === 'chef' || path === '/chef') {
        setCurrentTab('chef');
      } else if (hash === '' || path === '/') {
        setCurrentTab('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Track page visit on website visit & navigation - captures basic info: real IP and visit time
  useEffect(() => {
    const pagePath = currentTab === 'home' ? '/' : `/${currentTab}`;
    logVisitorVisit(pagePath);
  }, [currentTab]);

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlock = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setCurrentTab('home');
    window.location.hash = '';
  };

  const handleLogout = () => {
    dbService.logoutUser();
    dbService.revokeSiteAccess();
    setIsSiteAuthorized(false);
    setCurrentUser(null);
    setCurrentTab('home');
    window.location.hash = '';
  };

  // If site access is not authorized, require visitor authentication
  // (Username: "kali", Password: "linux" - with no hints revealed)
  if (!isSiteAuthorized) {
    return (
      <SiteAccessGate
        onAccessGranted={() => {
          setIsSiteAuthorized(true);
          setCurrentUser(dbService.getCurrentUser());
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black relative font-mono">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b0f17] border border-emerald-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-200">{toastMessage}</span>
          <button
            onClick={dismissToast}
            className="text-slate-500 hover:text-white ml-2 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSQLModal={() => setIsSQLModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* View Container */}
      <main className="flex-1">
        {currentTab === 'login' && (
          <AdminPasswordPage 
            onUnlockSuccess={() => {
              const user = dbService.getCurrentUser() || {
                id: 'USR-ADMIN-KTG',
                username: 'ktg17178',
                email: 'ktg17178@gmail.com',
                role: 'admin',
                displayName: 'Super Administrator'
              };
              setCurrentUser(user);
              handleSelectTab('admin');
            }} 
            onCancel={() => handleSelectTab('home')}
          />
        )}
        {currentTab === 'home' && <HomePage onSelectTab={handleSelectTab} />}
        {currentTab === 'menu' && <MenuPage onSelectTab={handleSelectTab} />}
        {currentTab === 'cellar' && <CellarPage onSelectTab={handleSelectTab} />}
        {currentTab === 'events' && <EventsPage onSelectTab={handleSelectTab} />}
        {currentTab === 'book' && <BookingPage onSelectTab={handleSelectTab} />}
        {currentTab === 'chef' && <ChefPage onSelectTab={handleSelectTab} />}
        {currentTab === 'press' && <PressPage />}
        {currentTab === 'contact' && <ContactPage />}
        {currentTab === 'admin' && (
          <AdminPage
            onOpenSQLModal={() => setIsSQLModalOpen(true)}
            onSelectTab={handleSelectTab}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        onNavigateToMenu={() => handleSelectTab('menu')}
        onNavigateToBooking={() => handleSelectTab('book')}
      />

      {/* SQL & Supabase Schema Modal */}
      <SQLSchemaModal
        isOpen={isSQLModalOpen}
        onClose={() => setIsSQLModalOpen(false)}
      />

      {/* Luxury Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenSQLModal={() => setIsSQLModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
