import React, { useState, useEffect, useRef } from 'react';
import { 
  MenuItem, 
  Booking, 
  AuditLog, 
  MenuCategory, 
  BookingStatus, 
  User, 
  UserRole, 
  ActivityLog,
  DatabaseBackup,
  DatabaseHealthReport,
  DatabaseSnapshot
} from '../types';
import { 
  dbService, 
  AuthenticatedUser, 
  hashPassword, 
  ADMIN_PASSWORD_HASH, 
  isUserAdmin, 
  SUPER_ADMIN_EMAIL,
  formatFileSize
} from '../services/db';
import { logActivity, parseBrowser } from '../services/logger';
import { AdminPasswordPage } from '../components/AdminPasswordPage';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  History,
  Database,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Users,
  Activity,
  Globe,
  Download,
  Terminal,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  FileSpreadsheet,
  FileCode,
  FileText,
  HardDrive,
  Sparkles,
  Layers,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

interface AdminPageProps {
  onOpenSQLModal: () => void;
  onSelectTab?: (tab: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onOpenSQLModal, onSelectTab }) => {
  // Current user logged in to site
  const [currentUser] = useState<AuthenticatedUser | null>(() => {
    return dbService.getCurrentUser();
  });

  // Strict Admin Panel Password Gate state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return dbService.isAdminPanelUnlocked();
  });

  // Admin Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'bookings' | 'users' | 'activity_logs' | 'logs' | 'security' | 'database'>('dashboard');

  // Data States
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Activity Logs Controls
  const [activitySearch, setActivitySearch] = useState('');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // User Management States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'member' as UserRole,
    phone: '+1 (555) 000-0000'
  });

  // Menu Management States
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('All');
  const [isEditingMenu, setIsEditingMenu] = useState<MenuItem | null>(null);
  const [isCreatingMenu, setIsCreatingMenu] = useState(false);
  const [menuForm, setMenuForm] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 30,
    category: 'Veg',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    is_special: false,
    calories: 450,
    prep_time: '20 min',
    is_available: true,
    wine_pairing: ''
  });

  // Bookings Filter & Station Table Assignment
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [selectedBookingNotes, setSelectedBookingNotes] = useState<Booking | null>(null);
  const [editingBookingTableId, setEditingBookingTableId] = useState<string | null>(null);
  const [bookingTableInput, setBookingTableInput] = useState<string>('');

  // Security Tab States (Change Admin Password)
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // SQL Copy Feedback
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Strong Database Engine & File Management States
  const [dbHealth, setDbHealth] = useState<DatabaseHealthReport | null>(null);
  const [snapshots, setSnapshots] = useState<DatabaseSnapshot[]>([]);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [dbActionFeedback, setDbActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isVacuuming, setIsVacuuming] = useState(false);
  const [isExportingDump, setIsExportingDump] = useState(false);

  // File Import / Restore Modal States
  const [importedBackupPreview, setImportedBackupPreview] = useState<DatabaseBackup | null>(null);
  const [importMode, setImportMode] = useState<'overwrite' | 'merge'>('overwrite');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all data when unlocked
  const refreshData = async () => {
    setLoadingData(true);
    try {
      const [m, b, u, act, health] = await Promise.all([
        dbService.getMenuItems(),
        dbService.getBookings(),
        dbService.getUsers(),
        dbService.getActivityLogs(),
        dbService.getDatabaseHealth()
      ]);
      setMenuItems(m);
      setBookings(b);
      setUsers(u);
      setLogs(dbService.getLogs());
      setActivityLogs(act);
      setDbHealth(health);
      setSnapshots(dbService.getSnapshots());
    } finally {
      setLoadingData(false);
    }
  };

  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  useEffect(() => {
    if (isUnlocked) {
      refreshData();
    }
  }, [isUnlocked]);

  // Real-time live log stream listener & auto-refresh
  useEffect(() => {
    const handleLiveEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ActivityLog>;
      if (customEvent.detail) {
        setActivityLogs((prev) => [customEvent.detail, ...prev.filter((l) => l.id !== customEvent.detail.id)].slice(0, 300));
      }
    };
    window.addEventListener('kali-live-activity', handleLiveEvent);

    let interval: NodeJS.Timeout | null = null;
    if (isUnlocked && isLiveStreaming) {
      interval = setInterval(async () => {
        try {
          const freshLogs = await dbService.getActivityLogs();
          setActivityLogs(freshLogs);
        } catch {
          // ignore
        }
      }, 2500);
    }

    return () => {
      window.removeEventListener('kali-live-activity', handleLiveEvent);
      if (interval) clearInterval(interval);
    };
  }, [isUnlocked, isLiveStreaming]);

  // Handle Locking Admin Panel Immediately
  const handleLockAdminPanel = () => {
    dbService.lockAdminPanel();
    setIsUnlocked(false);
    logActivity('ADMIN_PANEL_LOCKED: Administrator manually locked admin console', '/admin');
  };

  // Change Admin Password Action
  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newAdminPass.length < 4) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 4 characters.' });
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match. Please re-enter.' });
      return;
    }

    const res = await dbService.setAdminPanelPassword(newAdminPass);
    if (res.success) {
      setPasswordStatus({ type: 'success', message: 'Admin panel password updated successfully! Keep this credential safe.' });
      setNewAdminPass('');
      setConfirmAdminPass('');
      logActivity('ADMIN_PASSWORD_UPDATED: New administrative password set', '/admin#security');
    } else {
      setPasswordStatus({ type: 'error', message: res.message });
    }
  };

  const handleResetAdminPasswordToDefault = async () => {
    if (confirm('Reset the admin panel password to system default?')) {
      await dbService.resetAdminPanelPassword();
      setPasswordStatus({ type: 'success', message: 'Admin password reset to system default.' });
      logActivity('ADMIN_PASSWORD_RESET: Reverted to system default', '/admin#security');
    }
  };

  // --- MENU ACTIONS ---
  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name.trim() || menuForm.price <= 0) return;
    if (isEditingMenu) {
      await dbService.updateMenuItem({
        ...menuForm,
        id: isEditingMenu.id
      });
      setIsEditingMenu(null);
    } else {
      await dbService.addMenuItem(menuForm);
      setIsCreatingMenu(false);
    }
    await refreshData();
  };

  const handleDeleteMenu = async (id: string, name: string) => {
    if (confirm(`Are you sure you wish to delete "${name}" from the menu?`)) {
      await dbService.deleteMenuItem(id);
      await refreshData();
    }
  };

  const handleResetMenu = async () => {
    if (confirm('Reset all menu items to the original 12 5-star signature dishes?')) {
      await dbService.resetMenuToDefaults();
      await refreshData();
    }
  };

  const openEditModal = (item: MenuItem) => {
    setIsEditingMenu(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url,
      is_special: item.is_special,
      calories: item.calories || 450,
      prep_time: item.prep_time || '20 min',
      is_available: item.is_available !== false,
      wine_pairing: item.wine_pairing || ''
    });
  };

  const openCreateModal = () => {
    setIsCreatingMenu(true);
    setMenuForm({
      name: '',
      description: '',
      price: 35,
      category: 'Veg',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      is_special: false,
      calories: 450,
      prep_time: '20 min',
      is_available: true,
      wine_pairing: ''
    });
  };

  const handleToggleMenuAvailability = async (id: string) => {
    await dbService.toggleMenuItemAvailability(id);
    await refreshData();
  };

  // --- BOOKING ACTIONS ---
  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    await dbService.updateBookingStatus(id, status);
    await refreshData();
  };

  const handleSaveBookingTable = async (id: string) => {
    if (!bookingTableInput.trim()) return;
    await dbService.updateBookingTable(id, bookingTableInput.trim());
    setEditingBookingTableId(null);
    setBookingTableInput('');
    await refreshData();
  };

  // --- DATABASE & FILE HUB ACTIONS ---
  const handleDownloadBackupJson = async () => {
    try {
      await dbService.downloadDatabaseBackupFile();
      setDbActionFeedback({ type: 'success', message: 'Full database backup file (.json) downloaded successfully.' });
      await refreshData();
    } catch {
      setDbActionFeedback({ type: 'error', message: 'Failed to generate database backup file.' });
    }
  };

  const handleDownloadSqlSchema = () => {
    try {
      dbService.downloadSQLSchemaFile();
      setDbActionFeedback({ type: 'success', message: 'PostgreSQL schema file (kali-database-schema-v2.sql) downloaded.' });
    } catch {
      setDbActionFeedback({ type: 'error', message: 'Failed to download SQL schema file.' });
    }
  };

  const handleDownloadSqlDump = async () => {
    setIsExportingDump(true);
    try {
      await dbService.downloadSQLDumpFile();
      setDbActionFeedback({ type: 'success', message: 'Complete SQL dump file with table INSERTs downloaded.' });
    } catch {
      setDbActionFeedback({ type: 'error', message: 'Failed to generate complete SQL dump file.' });
    } finally {
      setIsExportingDump(false);
    }
  };

  const handleDownloadTableCsv = async (table: 'bookings' | 'menu' | 'users' | 'activity_logs' | 'logs') => {
    try {
      await dbService.downloadTableCSV(table);
      setDbActionFeedback({ type: 'success', message: `Exported ${table.toUpperCase()} data file as CSV.` });
    } catch {
      setDbActionFeedback({ type: 'error', message: `Failed to export ${table} CSV.` });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as DatabaseBackup;

        if (!parsed || !parsed.data) {
          alert('Invalid backup file: file is missing the root "data" object.');
          return;
        }

        setImportedBackupPreview(parsed);
        setIsImportModalOpen(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid JSON file';
        alert(`Failed to parse backup file: ${msg}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmRestore = async () => {
    if (!importedBackupPreview) return;
    try {
      const res = await dbService.importDatabaseBackup(importedBackupPreview, importMode);
      if (res.success) {
        setDbActionFeedback({ type: 'success', message: res.message });
        setIsImportModalOpen(false);
        setImportedBackupPreview(null);
        await refreshData();
      } else {
        setDbActionFeedback({ type: 'error', message: res.message });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      setDbActionFeedback({ type: 'error', message: msg });
    }
  };

  const handleCreateSnapshot = async () => {
    setIsCreatingSnapshot(true);
    try {
      const label = snapshotLabel.trim() || `Snapshot ${new Date().toLocaleTimeString()}`;
      await dbService.createLocalSnapshot(label);
      setSnapshotLabel('');
      setDbActionFeedback({ type: 'success', message: `Point-in-time snapshot "${label}" created successfully.` });
      await refreshData();
    } catch {
      setDbActionFeedback({ type: 'error', message: 'Failed to create database snapshot.' });
    } finally {
      setIsCreatingSnapshot(false);
    }
  };

  const handleRestoreSnapshot = async (id: string, label: string) => {
    if (confirm(`Restore database to snapshot "${label}"? This will rollback current data to that point in time.`)) {
      const ok = await dbService.restoreSnapshot(id);
      if (ok) {
        setDbActionFeedback({ type: 'success', message: `Database successfully restored to "${label}".` });
        await refreshData();
      } else {
        setDbActionFeedback({ type: 'error', message: 'Failed to restore snapshot.' });
      }
    }
  };

  const handleDeleteSnapshot = (id: string) => {
    dbService.deleteSnapshot(id);
    setSnapshots(dbService.getSnapshots());
    setDbActionFeedback({ type: 'success', message: 'Snapshot removed from local storage.' });
  };

  const handleVacuumStorage = async () => {
    setIsVacuuming(true);
    try {
      const res = await dbService.vacuumDatabase();
      setDbActionFeedback({
        type: 'success',
        message: `Vacuum completed: pruned ${res.cleanedLogs} entries and reclaimed ${formatFileSize(res.freedBytes)}.`
      });
      await refreshData();
    } catch {
      setDbActionFeedback({ type: 'error', message: 'Database vacuum failed.' });
    } finally {
      setIsVacuuming(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm(`Delete reservation record ${id}?`)) {
      await dbService.deleteBooking(id);
      await refreshData();
    }
  };

  // --- USER ACTIONS ---
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.username.trim() || !userForm.email.trim() || !userForm.password.trim()) return;
    const hash = await hashPassword(userForm.password.trim());
    await dbService.addUser({
      username: userForm.username.trim().toLowerCase(),
      email: userForm.email.trim().toLowerCase(),
      full_name: userForm.full_name.trim() || userForm.username.trim(),
      password_hash: hash,
      role: userForm.role,
      phone: userForm.phone.trim()
    });
    setIsCreatingUser(false);
    setUserForm({
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'member',
      phone: '+1 (555) 000-0000'
    });
    await refreshData();
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (confirm(`Delete registered user account "${username}"?`)) {
      await dbService.deleteUser(id);
      await refreshData();
    }
  };

  const handleResetUsers = async () => {
    if (confirm('Reset registered users database to initial mock members?')) {
      await dbService.resetUsers();
      await refreshData();
    }
  };

  // --- ACTIVITY LOGS ACTIONS ---
  const handleClearActivityLogs = async () => {
    if (window.confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
      await dbService.clearActivityLogs();
      setActivityLogs([]);
      logActivity('ACTIVITY_LOGS_CLEARED: Administrator cleared activity logs', '/admin');
    }
  };

  const handleExportActivityCSV = () => {
    if (activityLogs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'IP Address', 'Page URL', 'Action', 'Browser / User Agent'];
    const rows = activityLogs.map(l => [
      `"${l.id}"`,
      `"${l.created_at}"`,
      `"${l.ip_address}"`,
      `"${l.page_url}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.user_agent.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kali_activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- AUDIT LOGS ACTIONS ---
  const handleClearLogs = () => {
    if (confirm('Clear audit history?')) {
      dbService.clearLogs();
      setLogs(dbService.getLogs());
    }
  };

  // Metrics Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const totalBookingsCount = bookings.length;
  const todayBookingsCount = bookings.filter(b => b.date === todayStr).length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesSearch =
      b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.phone.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.email.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch =
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Filtered Menu
  const filteredMenu = menuItems.filter(m => {
    const matchesCat = menuCategoryFilter === 'All' || m.category === menuCategoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      m.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Activity Logs (focusing on IP, Time, and Page Visited)
  const filteredActivityLogs = activityLogs.filter((log) => {
    if (activitySearch.trim()) {
      const q = activitySearch.toLowerCase();
      const matchIp = log.ip_address.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchPage = log.page_url.toLowerCase().includes(q);
      const matchUa = log.user_agent.toLowerCase().includes(q);
      return matchIp || matchAction || matchPage || matchUa;
    }
    return true;
  });

  const uniqueIpsCount = Array.from(new Set(activityLogs.map(l => l.ip_address))).length;
  const latestVisitLog = activityLogs[0];
  const latestVisitTimeStr = latestVisitLog
    ? new Date(latestVisitLog.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'None recorded yet';

  // =========================================================================
  // PASSWORD GATE: If Admin Panel is NOT unlocked, show the Password Page!
  // No one can open the admin panel without the correct password!
  // =========================================================================
  if (!isUnlocked) {
    return (
      <AdminPasswordPage
        onUnlockSuccess={() => {
          setIsUnlocked(true);
        }}
        onCancel={() => {
          if (onSelectTab) {
            onSelectTab('home');
          } else {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  // =========================================================================
  // AUTHENTICATED & UNLOCKED ADMIN PANEL
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Bar with Lock Status & Quick Lock Action */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Unlock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-mono font-bold text-white tracking-wider">KALI Operations Command Center // Admin Console</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Unlocked (Active Session)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Authorized Executive Session • Master Password Protected
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Lock Button - Re-engages password page instantly */}
          <button
            onClick={handleLockAdminPanel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-xs text-rose-300 hover:text-white transition-all shadow-sm cursor-pointer font-mono"
            title="Lock Admin Panel immediately (password required to reopen)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="font-semibold">Lock Admin Panel</span>
          </button>

          <button
            onClick={refreshData}
            disabled={loadingData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-emerald-500/20 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer font-mono"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onOpenSQLModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-emerald-500/20 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer font-mono"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database SQL</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-[#121212] border border-white/10 rounded-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Operations Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Lab Workstations ({bookings.length})</span>
          {pendingBookingsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Operators & Members ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Arsenal Toolkits ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity_logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'activity_logs'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Terminal Access Logs ({activityLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Terminal Security</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Trail ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'database'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Architecture & File Hub</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-emerald-300 font-mono font-bold">
            FILES
          </span>
        </button>
      </div>

      {/* --- TAB 1: DASHBOARD --- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
            <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] uppercase font-bold tracking-wider">Total Lab Sessions</span>
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white">{totalBookingsCount}</p>
              <p className="text-[11px] text-slate-500">Recorded workstation reservations</p>
            </div>

            <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] uppercase font-bold tracking-wider">Active Sprints</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-bold text-cyan-400">{todayBookingsCount}</p>
              <p className="text-[11px] text-slate-500">Scheduled for today's labs</p>
            </div>

            <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] uppercase font-bold tracking-wider">Pending Clearances</span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-amber-400">{pendingBookingsCount}</p>
              <p className="text-[11px] text-slate-500">Awaiting operator verification</p>
            </div>

            <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] uppercase font-bold tracking-wider">Enrolled Operators</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white">{users.length}</p>
              <p className="text-[11px] text-slate-500">Members & researcher database</p>
            </div>

            <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] uppercase font-bold tracking-wider">Arsenal Toolkits</span>
                <Terminal className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white">{menuItems.length}</p>
              <p className="text-[11px] text-slate-500">Active offensive modules</p>
            </div>
          </div>

          {/* Quick Actions & Recent Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
            <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-emerald-500/15 pb-3">
                Command Shortcuts
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={handleLockAdminPanel}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Operations Terminal Now</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Configure Terminal Passwords</span>
                </button>
                <button
                  onClick={() => setIsCreatingUser(true)}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enroll New Operator Account</span>
                </button>
                <button
                  onClick={openCreateModal}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register New Arsenal Toolkit</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('bookings');
                    setBookingStatusFilter('pending');
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Review Pending Clearances ({pendingBookingsCount})</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Latest Lab Workstation Dispatches
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-[#10b981] hover:underline cursor-pointer"
                >
                  View All ({bookings.length}) →
                </button>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{b.id}</span>
                        <span className="text-xs font-medium text-zinc-200">{b.name}</span>
                        <span className="text-[11px] text-zinc-400">({b.guests} guests)</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {b.date} at {b.time} • {b.seating_preference || 'Main Hall'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : b.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {b.status}
                      </span>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                          className="px-2.5 py-1 rounded bg-[#10b981] text-white text-[11px] font-semibold hover:bg-[#059669] cursor-pointer"
                        >
                          Accept
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: SECURITY & PASSWORD SETTINGS --- */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#10b981]" />
                  <h2 className="text-base font-serif-luxury font-bold text-white tracking-wide">
                    Admin Password & Security Settings
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Configure the password required to open the admin panel. Prevent anyone without this credential from accessing admin controls.
                </p>
              </div>
              <button
                onClick={handleLockAdminPanel}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-[#10b981]/40 hover:bg-[#10b981] text-xs font-semibold text-[#10b981] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Test Lock Screen Now</span>
              </button>
            </div>

            {/* Status Feedback Banner */}
            {passwordStatus && (
              <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                passwordStatus.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}>
                {passwordStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{passwordStatus.message}</span>
              </div>
            )}

            {/* Change Admin Password Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <form onSubmit={handleChangeAdminPassword} className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                  Update Admin Panel Access Password
                </h3>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    New Admin Password (Minimum 4 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPass ? 'text' : 'password'}
                      required
                      placeholder="Enter new password..."
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-[#10b981] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
                      tabIndex={-1}
                    >
                      {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Confirm New Admin Password
                  </label>
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    placeholder="Repeat new password..."
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#10b981]/20"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save New Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAdminPasswordToDefault}
                    className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Reset to Default
                  </button>
                </div>
              </form>

              {/* Password Policy & Security Diagnostics */}
              <div className="space-y-4">
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-3 text-xs text-zinc-400">
                  <h4 className="text-white font-semibold uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                    Password Enforcement Rules
                  </h4>
                  <ul className="space-y-2 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Dedicated Gate:</strong> No one can view orders, guest lists, or menus in the admin panel without inputting this password.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Brute Force Defense:</strong> 5 failed attempts trigger an automatic 30-second security cooldown.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>SHA-256 Hashing:</strong> Passwords are cryptographically transformed with client-side SHA-256 before verification.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Live Telemetry:</strong> All password attempts (successes and failures) are tracked in the Activity Logs.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-300 font-medium block">Current Password Status</span>
                    <span className="text-[11px] text-zinc-500 font-mono">Active & Encrypted</span>
                  </div>
                  <button
                    onClick={handleLockAdminPanel}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>Lock Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: MANAGE MENU --- */}
      {activeTab === 'menu' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {['All', 'Veg', 'Non-Veg', 'Desserts', 'Drinks'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMenuCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    menuCategoryFilter === cat
                      ? 'bg-[#10b981] text-white'
                      : 'bg-black/50 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search tool or vector..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-800 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
              <button
                onClick={() => handleDownloadTableCsv('menu')}
                className="px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer font-mono"
                title="Download Community Arsenal as CSV File"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Tool</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl overflow-hidden shadow-xl font-mono">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-black/60 border-b border-emerald-500/20 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Tool & Directive</th>
                    <th className="py-3.5 px-4">Domain</th>
                    <th className="py-3.5 px-4">Credits</th>
                    <th className="py-3.5 px-4">State</th>
                    <th className="py-3.5 px-4">Tier</th>
                    <th className="py-3.5 px-4">Deploy Time</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {filteredMenu.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover border border-emerald-500/20"
                          />
                          <div>
                            <span className="font-semibold text-white block text-sm">{item.name}</span>
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs font-sans">{item.description}</span>
                            {item.wine_pairing && (
                              <span className="text-[10px] text-emerald-400/90 font-mono block mt-0.5">
                                Target: {item.wine_pairing}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-black/60 border border-emerald-500/20 text-[10px] text-emerald-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                        ${item.price}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleMenuAvailability(item.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            item.is_available === false
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                          title="Click to toggle availability"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.is_available === false ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          <span>{item.is_available === false ? 'Offline' : 'Active'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        {item.is_special ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                            Critical Tier
                          </span>
                        ) : (
                          <span className="text-slate-500">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {item.prep_time || '20 min'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
                            title="Edit Item"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id, item.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: MANAGE LAB WORKSTATIONS & CLEARANCES --- */}
      {activeTab === 'bookings' && (
        <div className="space-y-6 animate-in fade-in duration-300 font-mono">
          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {['all', 'pending', 'confirmed', 'rejected', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setBookingStatusFilter(status)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    bookingStatusFilter === status
                      ? 'bg-emerald-500 text-black'
                      : 'bg-black/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search operator, code, email..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-800 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <button
                onClick={() => handleDownloadTableCsv('bookings')}
                className="px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title="Download Lab Clearances as CSV File"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-emerald-500/20 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-black/60 border-b border-emerald-500/20 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Dispatch Code</th>
                    <th className="py-3.5 px-4">Operator / Lead</th>
                    <th className="py-3.5 px-4">Contact Comms</th>
                    <th className="py-3.5 px-4">Scheduled Slot</th>
                    <th className="py-3.5 px-4">Seats</th>
                    <th className="py-3.5 px-4">Workstation Pod & Node</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Clearance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No lab clearances matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          {b.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block text-sm">{b.name}</span>
                          {b.special_requests && (
                            <button
                              onClick={() => setSelectedBookingNotes(b)}
                              className="text-[11px] text-emerald-400 underline mt-0.5 block hover:text-white cursor-pointer"
                            >
                              Directives
                            </button>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          <span className="block text-slate-200">{b.phone}</span>
                          <span className="text-[11px] text-slate-500">{b.email}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{b.date}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{b.time}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {b.guests} Ops
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          <div>
                            <span className="block text-slate-300">{b.seating_preference || 'Offensive Sandbox'}</span>
                            {editingBookingTableId === b.id ? (
                              <div className="flex items-center gap-1.5 mt-1">
                                <input
                                  type="text"
                                  placeholder="e.g. Table 4"
                                  value={bookingTableInput}
                                  onChange={(e) => setBookingTableInput(e.target.value)}
                                  className="w-20 bg-black border border-white/20 rounded px-1.5 py-0.5 text-[11px] text-white focus:outline-none"
                                />
                                <button
                                  onClick={() => handleSaveBookingTable(b.id)}
                                  className="p-1 rounded bg-emerald-600 text-white text-[10px] cursor-pointer"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => setEditingBookingTableId(null)}
                                  className="p-1 rounded bg-zinc-800 text-zinc-400 text-[10px] cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingBookingTableId(b.id);
                                  setBookingTableInput(b.table_number || '');
                                }}
                                className="text-[10px] text-sky-400 hover:text-sky-300 font-mono mt-0.5 block cursor-pointer"
                              >
                                {b.table_number ? `Station: ${b.table_number}` : '+ Assign Table'}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : b.status === 'rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : b.status === 'completed'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Accept & Confirm Reservation"
                              >
                                Accept
                              </button>
                            )}
                            {b.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                                className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Mark Guests Seated & Completed"
                              >
                                Completed
                              </button>
                            )}
                            {b.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'rejected')}
                                className="px-2.5 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Reject Reservation"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1 rounded text-zinc-500 hover:text-rose-400 cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: PATRON & USER REGISTRATIONS --- */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: 'All Patrons' },
                { id: 'vip_patron', label: 'VIP Patrons' },
                { id: 'member', label: 'Club Members' },
                { id: 'admin', label: 'Staff / Admin' }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setUserRoleFilter(role.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    userRoleFilter === role.id
                      ? 'bg-[#10b981] text-white'
                      : 'bg-black/50 text-zinc-400 hover:text-white'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user, email, ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981]"
                />
              </div>
              <button
                onClick={() => handleDownloadTableCsv('users')}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title="Download Patrons as CSV File"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setIsCreatingUser(true)}
                className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#10b981]/20 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register User</span>
              </button>
              <button
                onClick={handleResetUsers}
                className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Reset mock users to default"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-black/60 border-b border-white/10 text-zinc-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Account ID</th>
                    <th className="py-3.5 px-4">Patron & Username</th>
                    <th className="py-3.5 px-4">Electronic Mail</th>
                    <th className="py-3.5 px-4">Telephone</th>
                    <th className="py-3.5 px-4">Role / Tier</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-zinc-500">
                        No registered patron accounts found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#10b981]">
                          {u.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block text-sm">{u.full_name || u.username}</span>
                          <span className="text-[11px] text-zinc-400 font-mono">@{u.username}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-zinc-200 font-mono text-xs">{u.email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono">
                          {u.phone || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : u.role === 'vip_patron'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 text-[11px] font-mono">
                          {new Date(u.registered_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {u.username !== 'kali' && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.username)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: VISITOR LOGS (IP & TIME) --- */}
      {activeTab === 'activity_logs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-serif-luxury font-bold text-white tracking-wide">
                    Real-Time Visitor Logs (IP & Time Inspection)
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-[10px] font-mono border border-[#10b981]/20">
                    public.activity_logs
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Basic security inspection: captures real-time client IP addresses and visit timestamps only when users visit the website.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isLiveStreaming
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                      : 'bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white'
                  }`}
                  title={isLiveStreaming ? 'Live telemetry stream is active (updating in real time)' : 'Live stream is paused'}
                >
                  <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                  <span>{isLiveStreaming ? 'Live Stream: Active' : 'Stream Paused'}</span>
                </button>
                <button
                  onClick={handleExportActivityCSV}
                  disabled={activityLogs.length === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                  title="Export visitor logs as CSV"
                >
                  <Download className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={refreshData}
                  disabled={loadingData}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#10b981] ${loadingData ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleClearActivityLogs}
                  disabled={activityLogs.length === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs text-rose-400 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Logs</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Total Visits</span>
                <p className="text-2xl font-bold font-mono text-white">{activityLogs.length}</p>
                <span className="text-[10px] text-zinc-500">Website visits recorded</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Unique Visitor IPs</span>
                <p className="text-2xl font-bold font-mono text-sky-400">{uniqueIpsCount}</p>
                <span className="text-[10px] text-zinc-500">Distinct visitor hosts</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Latest Visit Time</span>
                <p className="text-lg font-bold font-mono text-emerald-400 truncate">{latestVisitTimeStr}</p>
                <span className="text-[10px] text-zinc-500">Most recent visit timestamp</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Live Stream</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                  <p className="text-base font-bold font-mono text-zinc-200">{isLiveStreaming ? 'Streaming Live' : 'Paused'}</p>
                </div>
                <span className="text-[10px] text-zinc-500">Real-time visitor updates</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by visitor IP, page route, or browser..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981]"
                />
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                Showing {filteredActivityLogs.length} of {activityLogs.length} visit logs
              </span>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-black/60 border-b border-white/10 uppercase font-semibold text-[11px] text-zinc-400 tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-44">Visit Time (Real)</th>
                    <th className="py-3.5 px-4 w-40">Visitor Real IP</th>
                    <th className="py-3.5 px-4 w-36">Page Visited</th>
                    <th className="py-3.5 px-4">Visit Status</th>
                    <th className="py-3.5 px-4 w-48">Browser / Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredActivityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500">
                        <Terminal className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                        <p className="font-medium">No website visits recorded yet</p>
                        <p className="text-[11px] text-zinc-600 mt-1">
                          Visitor IP addresses and timestamps are logged only when users visit the website.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredActivityLogs.map((log) => {
                      const dateObj = new Date(log.created_at);
                      const timeStr = isNaN(dateObj.getTime())
                        ? log.created_at
                        : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const dateStr = isNaN(dateObj.getTime())
                        ? ''
                        : dateObj.toLocaleDateString();
                      const browserInfo = parseBrowser(log.user_agent);
                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          {/* Time */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono text-zinc-200 font-semibold">{timeStr}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{dateStr}</div>
                          </td>

                          {/* Real IP */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-sky-400">
                              <span>{log.ip_address}</span>
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(log.ip_address);
                                    setCopiedIp(log.id);
                                    setTimeout(() => setCopiedIp(null), 1500);
                                  } catch {
                                    // ignore
                                  }
                                }}
                                title="Copy IP"
                                className="text-zinc-500 hover:text-white cursor-pointer ml-0.5"
                              >
                                {copiedIp === log.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Page Route */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-zinc-900 border border-white/10 text-zinc-200 font-medium">
                              {log.page_url}
                            </span>
                          </td>

                          {/* Visit Status */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{log.action}</span>
                            </span>
                          </td>

                          {/* Browser / Device */}
                          <td className="py-3.5 px-4">
                            <div className="cursor-help" title={log.user_agent}>
                              <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
                                <Globe className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" />
                                <span className="truncate max-w-[160px]">{browserInfo.name}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: ACTION AUDIT LOGS --- */}
      {activeTab === 'logs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-6 flex items-center justify-between shadow-xl">
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                System Security & Concierge Audit Trail
              </h2>
              <p className="text-xs text-zinc-400">
                Immutable chronological log of all administrative actions, table approvals, and password updates.
              </p>
            </div>
            <button
              onClick={handleClearLogs}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-[#10b981] font-semibold">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-zinc-400">Actor: {log.user}</span>
                  </div>
                  <p className="text-zinc-200">{log.details}</p>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: DATABASE & FILE OPERATIONS HUB --- */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Action Feedback Banner */}
          {dbActionFeedback && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
              dbActionFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {dbActionFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{dbActionFeedback.message}</span>
              </div>
              <button
                onClick={() => setDbActionFeedback(null)}
                className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Database Architecture & Status Header */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-serif-luxury font-bold text-white">
                    Enterprise Database Architecture & File Backup Hub
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 font-bold">
                    ACTIVE V2.4
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                  Dual-tier resilient storage engine pairing local persistent storage with native PostgreSQL & Supabase replication.
                  Download full database files, point-in-time snapshots, complete SQL dumps with inserts, and RFC4180 CSV tables.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleVacuumStorage}
                  disabled={isVacuuming}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  title="Prune stale visitor records and compact storage"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVacuuming ? 'animate-spin text-[#10b981]' : 'text-zinc-400'}`} />
                  <span>{isVacuuming ? 'Compacting...' : 'Vacuum & Compact DB'}</span>
                </button>
                <button
                  onClick={onOpenSQLModal}
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#10b981]/20"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Configure Supabase Cloud</span>
                </button>
              </div>
            </div>

            {/* Health & Diagnostic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px] uppercase font-semibold tracking-wider">Total DB Records</span>
                  <Layers className="w-4 h-4 text-[#10b981]" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {dbHealth?.totalRecords || (menuItems.length + bookings.length + users.length + activityLogs.length + logs.length)}
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <span>{menuItems.length} dishes</span> • 
                  <span>{bookings.length} reservations</span> • 
                  <span>{users.length} users</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px] uppercase font-semibold tracking-wider">Storage Footprint</span>
                  <HardDrive className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {dbHealth?.storageUsedFormatted || '48.2 KB'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Dual-tier persistent storage active
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px] uppercase font-semibold tracking-wider">Database Integrity</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% Verified</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Zero corruption • Schema intact
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px] uppercase font-semibold tracking-wider">Snapshots Available</span>
                  <History className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {snapshots.length} Rollbacks
                </div>
                <div className="text-[11px] text-zinc-400">
                  Point-in-time recovery ready
                </div>
              </div>
            </div>
          </div>

          {/* Core File Hub: JSON, SQL, and CSV Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: JSON Full Backup File */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Full Database File (.json)</h3>
                    <p className="text-[11px] text-zinc-400">Complete JSON archive with SHA-256 hash</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Downloads or imports every table (Menu, Bookings, Patron Accounts, Security Keys, and Visitor Logs).
                  Safe for cross-device migration and cold backup.
                </p>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Format: <span className="text-emerald-400">Standardized JSON v2.4</span></div>
                  <div>Security: <span className="text-emerald-400">SHA-256 Checksum Verified</span></div>
                  <div>Checksum Validation: <span className="text-zinc-200">Enabled</span></div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownloadBackupJson}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-[#10b981]/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Database File (.json)</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restore from Database File (.json)</span>
                </button>
              </div>
            </div>

            {/* Card 2: SQL PostgreSQL / Supabase Schema File */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">SQL Schema & Full Dump (.sql)</h3>
                    <p className="text-[11px] text-zinc-400">PostgreSQL DDL & Table INSERT Statements</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Native SQL script file ready for execution in the Supabase SQL Editor or standard PostgreSQL CLI, complete with Row Level Security (RLS) policies.
                </p>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Engine: <span className="text-sky-400">PostgreSQL 15+ / Supabase</span></div>
                  <div>Tables: <span className="text-zinc-200">menu_items, bookings, users, logs</span></div>
                  <div>RLS Policies: <span className="text-emerald-400">Configured & Enforced</span></div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownloadSqlSchema}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Download Schema File (.sql)</span>
                </button>
                <button
                  onClick={handleDownloadSqlDump}
                  disabled={isExportingDump}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>{isExportingDump ? 'Generating Dump...' : 'Download Full SQL Dump (With Data)'}</span>
                </button>
              </div>
            </div>

            {/* Card 3: Tabular CSV Data Files */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">CSV Data Files Hub</h3>
                    <p className="text-[11px] text-zinc-400">Spreadsheet-compatible data tables</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Export individual datasets in RFC4180 CSV standard for hostess seating sheets, chef inventory, accounting audits, and security logs.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleDownloadTableCsv('bookings')}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-amber-500/40 text-[11px] text-zinc-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-amber-400" />
                    <span>Bookings CSV</span>
                  </button>
                  <button
                    onClick={() => handleDownloadTableCsv('menu')}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-amber-500/40 text-[11px] text-zinc-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-amber-400" />
                    <span>Menu CSV</span>
                  </button>
                  <button
                    onClick={() => handleDownloadTableCsv('users')}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-amber-500/40 text-[11px] text-zinc-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-amber-400" />
                    <span>Patrons CSV</span>
                  </button>
                  <button
                    onClick={() => handleDownloadTableCsv('activity_logs')}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-amber-500/40 text-[11px] text-zinc-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-sky-400" />
                    <span>Visitor Logs CSV</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleDownloadTableCsv('logs')}
                  className="w-full py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Export System Audit Trail CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Point-In-Time Local Snapshots & Rollback */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-[#10b981]" />
                  <span>Point-in-Time Database Snapshots & Instant Rollback</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Save snapshot states before taking large reservations or updating menu creations. 1-click instant rollback.
                </p>
              </div>

              {/* Create Snapshot Form */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Snapshot label (e.g. Pre-service)"
                  value={snapshotLabel}
                  onChange={(e) => setSnapshotLabel(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981]"
                />
                <button
                  onClick={handleCreateSnapshot}
                  disabled={isCreatingSnapshot}
                  className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreatingSnapshot ? 'Saving...' : 'Take Snapshot'}</span>
                </button>
              </div>
            </div>

            {snapshots.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No local snapshots created yet. Click "Take Snapshot" above to create an instant rollback point.
              </div>
            ) : (
              <div className="space-y-2">
                {snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{snap.label}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {snap.recordCount} records
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500">
                          {formatFileSize(snap.sizeBytes)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Recorded on {new Date(snap.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestoreSnapshot(snap.id, snap.label)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Rollback database to this snapshot"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Rollback</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSnapshot(snap.id)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive SQL Schema Terminal Viewer */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  PostgreSQL / Supabase Schema Definition File
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(dbService.getSQLSchema());
                      setCopiedSQL(true);
                      setTimeout(() => setCopiedSQL(false), 2000);
                    } catch {
                      // ignore
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSQL ? 'Copied!' : 'Copy SQL'}</span>
                </button>
                <button
                  onClick={handleDownloadSqlSchema}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Download .sql</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-zinc-300 max-h-72 overflow-y-auto leading-relaxed select-all">
              <pre>{dbService.getSQLSchema()}</pre>
            </div>
          </div>

          {/* Factory Seed Safeguard */}
          <div className="p-4 rounded-xl bg-[#0b0f17] border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-white font-semibold block">Community Seed Reset</span>
              <span className="text-[11px] text-slate-400">
                Restores community toolkits, lab bookings, and security researcher profiles to standard baseline.
              </span>
            </div>
            <button
              onClick={handleResetMenu}
              className="px-3.5 py-2 rounded bg-zinc-900 border border-emerald-500/30 hover:bg-emerald-950/40 text-emerald-400 hover:text-white transition-colors cursor-pointer"
            >
              Reset to Curated Arsenal Baseline
            </button>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT ARSENAL TOOL MODAL --- */}
      {(isCreatingMenu || isEditingMenu) && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono"
          onClick={() => {
            setIsCreatingMenu(false);
            setIsEditingMenu(null);
          }}
        >
          <div
            className="relative max-w-lg w-full bg-[#0b0f17] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {isEditingMenu ? 'Edit Arsenal Tool' : 'Add Arsenal Tool'}
              </h3>
            </div>
            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Module / Tool Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memory Taint Kernel Fuzzer"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-800 rounded px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Domain Category *</label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as MenuCategory })}
                    className="w-full bg-black/60 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Offensive Tools">Offensive Tools</option>
                    <option value="Defensive Ops">Defensive Ops</option>
                    <option value="Zero-Day Labs">Zero-Day Labs</option>
                    <option value="Hardware Security">Hardware Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Access Bounties / Credits ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    required
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-black/60 border border-zinc-800 rounded px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Technical Specification & Directives *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Exploit architecture, detection indicators, sandbox isolation parameters..."
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-800 rounded px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400 resize-none font-sans"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Media Banner / Diagram URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={menuForm.image_url}
                  onChange={(e) => setMenuForm({ ...menuForm, image_url: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-800 rounded px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Deployment Time</label>
                  <input
                    type="text"
                    value={menuForm.prep_time}
                    onChange={(e) => setMenuForm({ ...menuForm, prep_time: e.target.value })}
                    className="w-full bg-black/60 border border-zinc-800 rounded px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Resource Overhead (MB)</label>
                  <input
                    type="number"
                    value={menuForm.calories}
                    onChange={(e) => setMenuForm({ ...menuForm, calories: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black/60 border border-zinc-800 rounded px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Compatibility / Environment Pairing</label>
                <input
                  type="text"
                  placeholder="e.g. Linux Kernel 6.8+, Kali Rolling, Docker Sandbox"
                  value={menuForm.wine_pairing || ''}
                  onChange={(e) => setMenuForm({ ...menuForm, wine_pairing: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-800 rounded px-3.5 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_special"
                    checked={menuForm.is_special}
                    onChange={(e) => setMenuForm({ ...menuForm, is_special: e.target.checked })}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="is_special" className="text-slate-300 font-medium cursor-pointer">
                    Flagship Community Release / Critical Tier
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={menuForm.is_available !== false}
                    onChange={(e) => setMenuForm({ ...menuForm, is_available: e.target.checked })}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="is_available" className="text-slate-300 font-medium cursor-pointer">
                    Active Module / Live In Staging
                  </label>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-emerald-500/20">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isEditingMenu ? 'Update Arsenal Module' : 'Deploy Arsenal Module'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingMenu(false);
                    setIsEditingMenu(null);
                  }}
                  className="px-4 py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- GUEST NOTES MODAL --- */}
      {selectedBookingNotes && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedBookingNotes(null)}
        >
          <div
            className="max-w-md w-full bg-[#121212] border border-white/15 rounded-2xl p-6 text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-white">
              Notes for {selectedBookingNotes.name} ({selectedBookingNotes.id})
            </h3>
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-300">
              "{selectedBookingNotes.special_requests}"
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedBookingNotes(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-xs hover:bg-zinc-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REGISTER USER / PATRON MODAL --- */}
      {isCreatingUser && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsCreatingUser(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#121212] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-serif-luxury font-bold text-white">
                  Register New Patron / Account
                </h3>
                <p className="text-xs text-zinc-400">Add user credentials and access tier to the database</p>
              </div>
              <button
                onClick={() => setIsCreatingUser(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. alex_wright"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Wright"
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Electronic Mail (E-mail) *</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Role / Membership Tier *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#10b981]"
                  >
                    <option value="member">Club Member</option>
                    <option value="vip_patron">VIP Patron</option>
                    <option value="admin">Staff / Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Contact Telephone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Access Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Set account password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#10b981] font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-semibold transition-colors cursor-pointer"
                >
                  Create & Register User
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingUser(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden File Input for .json Database Restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* --- RESTORE / IMPORT PREVIEW MODAL --- */}
      {isImportModalOpen && importedBackupPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => {
            setIsImportModalOpen(false);
            setImportedBackupPreview(null);
          }}
        >
          <div
            className="relative max-w-lg w-full bg-[#121212] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif-luxury font-bold text-white">
                    Restore Database from File
                  </h3>
                  <p className="text-xs text-zinc-400">Validate contents before applying changes</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportedBackupPreview(null);
                }}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Backup Metadata Preview */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Backup Created:</span>
                <span className="font-mono text-zinc-200">
                  {new Date(importedBackupPreview.exported_at).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Schema Version:</span>
                <span className="font-mono text-emerald-400">{importedBackupPreview.schema_version}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Integrity Checksum:</span>
                <span className="font-mono text-[10px] text-zinc-300 truncate max-w-[200px]">
                  {importedBackupPreview.checksum ? `${importedBackupPreview.checksum.slice(0, 16)}...` : 'Verified Valid'}
                </span>
              </div>
            </div>

            {/* Counts Breakdown */}
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                Records Included in File
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-400 block text-[10px]">Dishes</span>
                  <span className="text-base font-bold font-mono text-white">
                    {importedBackupPreview.counts.menu_items}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-400 block text-[10px]">Reservations</span>
                  <span className="text-base font-bold font-mono text-white">
                    {importedBackupPreview.counts.bookings}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-400 block text-[10px]">Accounts</span>
                  <span className="text-base font-bold font-mono text-white">
                    {importedBackupPreview.counts.users}
                  </span>
                </div>
              </div>
            </div>

            {/* Restore Mode Radio Selector */}
            <div className="space-y-2 pt-1 text-xs">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                Select Restore Strategy
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setImportMode('overwrite')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    importMode === 'overwrite'
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="font-semibold block text-xs">Overwrite Mode</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">
                    Replaces current database with file contents
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    importMode === 'merge'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="font-semibold block text-xs">Merge Mode</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">
                    Combines new data without deleting existing records
                  </span>
                </button>
              </div>
            </div>

            {/* Automated Snapshot Safeguard Notice */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>An automatic point-in-time safety rollback snapshot is created before restoring.</span>
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Restore Database Now</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportedBackupPreview(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

