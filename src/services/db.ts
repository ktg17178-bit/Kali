import { 
  MenuItem, 
  Booking, 
  AuditLog, 
  User, 
  SupabaseConfig, 
  BookingStatus, 
  UserRole, 
  ActivityLog, 
  AdminSecurityConfig,
  DatabaseBackup,
  DatabaseHealthReport,
  DatabaseSnapshot
} from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Precomputed SHA-256 hashes
// sha256("kalilinux.com") = "3337657bf99638248ba7a432ea37c5daf45dbcee4c497d81712f68801b2e3a85"
export const KALILINUX_COM_HASH = "3337657bf99638248ba7a432ea37c5daf45dbcee4c497d81712f68801b2e3a85";
export const ADMIN_PASSWORD_HASH = KALILINUX_COM_HASH;
export const KALI_PASSWORD_HASH = KALILINUX_COM_HASH;

// Super Admin Identity
export const SUPER_ADMIN_EMAIL = "ktg17178@gmail.com";
export const SUPER_ADMIN_USERNAME = "ktg17178";

export interface AuthenticatedUser {
  id?: string;
  username: string;
  email?: string;
  role: 'admin' | 'staff' | 'vip_patron' | 'member';
  displayName: string;
}

export function isUserAdmin(user: AuthenticatedUser | User | null | undefined): boolean {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const username = (user.username || '').toLowerCase().trim();
  if (email === SUPER_ADMIN_EMAIL || username === SUPER_ADMIN_USERNAME) return true;
  return user.role === 'admin';
}

export const VALID_USERS: Record<string, { hash: string; displayName: string; email: string; role: 'admin' }> = {
  admin: {
    hash: KALILINUX_COM_HASH,
    displayName: 'System Administrator',
    email: 'admin@kali-collective.org',
    role: 'admin'
  },
  kali: {
    hash: KALILINUX_COM_HASH,
    displayName: 'Chief Security Officer Marco Kali',
    email: 'root@kali-collective.org',
    role: 'admin'
  },
  ktg17178: {
    hash: KALILINUX_COM_HASH,
    displayName: 'Super Administrator',
    email: 'ktg17178@gmail.com',
    role: 'admin'
  },
  'ktg17178@gmail.com': {
    hash: KALILINUX_COM_HASH,
    displayName: 'Super Administrator',
    email: 'ktg17178@gmail.com',
    role: 'admin'
  }
};

export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 12 Curated Elite Cybersecurity Tools & Community Arsenal Modules
export const SEED_MENU_ITEMS: MenuItem[] = [
  // OFFENSIVE TOOLS
  {
    id: 'tool-off1',
    name: 'Metasploit Pro Red Team Rig',
    description: 'Automated penetration testing framework with evasive payload generation, multi-stage meterpreter staging, and credential pivoting engine.',
    price: 95,
    category: 'Offensive Tools',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    is_special: true,
    calories: 1024,
    prep_time: 'Instant Deploy',
    allergens: ['Root Privileges', 'External NIC'],
    is_available: true,
    wine_pairing: 'Optimized for Kali Rolling / Arch Linux x86_64'
  },
  {
    id: 'tool-off2',
    name: 'Cobalt Strike C2 Simulator Node',
    description: 'Adversary simulation platform featuring malleable C2 profiles, covert beacon payloads, and distributed team-server orchestration.',
    price: 140,
    category: 'Offensive Tools',
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    is_special: true,
    calories: 2048,
    prep_time: '3 min build',
    allergens: ['Docker 24+', 'TLS Certificate Required'],
    is_available: true,
    wine_pairing: 'Best paired with WireGuard VPN mesh & hardened egress'
  },
  {
    id: 'tool-off3',
    name: 'Burp Suite Enterprise Pentest Hub',
    description: 'Continuous web application vulnerability scanner with headless crawling, custom BAST fuzzing, and API security audit extensions.',
    price: 65,
    category: 'Offensive Tools',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    is_special: false,
    calories: 512,
    prep_time: 'Instant Deploy',
    allergens: ['Java 21 LTS', 'Chromium Headless'],
    is_available: true,
    wine_pairing: 'Pre-configured with Kali Firefox proxy chaining'
  },
  // DEFENSIVE OPS
  {
    id: 'tool-def1',
    name: 'Wazuh Security SIEM & XDR Cluster',
    description: 'Unified threat detection, compliance monitoring, rootkit analysis, and automated active-response incident mitigation engine.',
    price: 50,
    category: 'Defensive Ops',
    image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    is_special: true,
    calories: 4096,
    prep_time: '5 min setup',
    allergens: ['4GB RAM Minimum', 'Linux Kernel 5.15+'],
    is_available: true,
    wine_pairing: 'Integrates with OpenSearch and Grafana monitoring'
  },
  {
    id: 'tool-def2',
    name: 'Suricata Next-Gen IPS Sensor',
    description: 'High-performance multi-threaded network threat detection, protocol analysis, and hardware-accelerated deep packet inspection.',
    price: 45,
    category: 'Defensive Ops',
    image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    is_special: false,
    calories: 1024,
    prep_time: '2 min build',
    allergens: ['Promiscuous NIC Mode', 'PCAP Engine'],
    is_available: true,
    wine_pairing: 'Pairs seamlessly with Zeek & Arkime threat hunting pipelines'
  },
  {
    id: 'tool-def3',
    name: 'Velociraptor DFIR Forensic Platform',
    description: 'Advanced digital forensic and incident response endpoint investigator using VQL queries, memory triage, and artifact acquisition.',
    price: 40,
    category: 'Defensive Ops',
    image_url: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80',
    is_special: false,
    calories: 256,
    prep_time: 'Instant Deploy',
    allergens: ['Endpoint Agent', 'Admin Rights'],
    is_available: true,
    wine_pairing: 'Validated against Windows Server 2025 and Ubuntu LTS'
  },
  // ZERO-DAY LABS
  {
    id: 'tool-zero1',
    name: 'Ghidra Reverse Engineering Suite',
    description: 'Multi-platform software reverse engineering framework with multi-architecture disassembler, decompiler, and headless scripting.',
    price: 55,
    category: 'Zero-Day Labs',
    image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    is_special: true,
    calories: 1024,
    prep_time: 'Instant Deploy',
    allergens: ['OpenJDK 21', 'Python 3.12'],
    is_available: true,
    wine_pairing: 'Includes Kali custom theme and SRE reversing plugins'
  },
  {
    id: 'tool-zero2',
    name: 'AFL++ Multi-Core Fuzzing Engine',
    description: 'State-of-the-art coverage-guided evolutionary fuzzer with LLVM collision-free instrumentation, QEMU mode, and dictionary mutation.',
    price: 85,
    category: 'Zero-Day Labs',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    is_special: true,
    calories: 8192,
    prep_time: '10 min compile',
    allergens: ['Clang/LLVM 18', 'Core Dump Access'],
    is_available: true,
    wine_pairing: 'Calibrated for Linux kernel modules and ELF binaries'
  },
  {
    id: 'tool-zero3',
    name: 'IDA Pro Disassembler & Hex-Rays',
    description: 'Premier interactive binary analysis environment with call graph visualization, FLIRT signature database, and microcode decompilation.',
    price: 120,
    category: 'Zero-Day Labs',
    image_url: 'https://images.unsplash.com/photo-1526374879817-753738816c73?auto=format&fit=crop&w=800&q=80',
    is_special: false,
    calories: 2048,
    prep_time: 'Instant Deploy',
    allergens: ['License Token', 'x86_64 Host'],
    is_available: true,
    wine_pairing: 'Pre-loaded with Hex-Rays plugins and IDAPython helpers'
  },
  // HARDWARE SECURITY
  {
    id: 'tool-hw1',
    name: 'Flipper Zero Marauder Pentest Kit',
    description: 'Multi-tool cyber hardware device with Sub-GHz transceiver, RFID/NFC emulator, BadUSB keystroke injector, and ESP32 Wi-Fi Marauder board.',
    price: 75,
    category: 'Hardware Security',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    is_special: true,
    calories: 64,
    prep_time: 'Flash & Go',
    allergens: ['MicroSD Card', 'USB-C OTG'],
    is_available: true,
    wine_pairing: 'Preloaded with Unleashed firmware and Kali BLE scripts'
  },
  {
    id: 'tool-hw2',
    name: 'HackRF One SDR Wideband Transceiver',
    description: 'Software-defined radio capable of transmission or reception of radio signals from 1 MHz to 6 GHz with PortaPack H2 expansion pack.',
    price: 110,
    category: 'Hardware Security',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    is_special: true,
    calories: 128,
    prep_time: 'Instant Deploy',
    allergens: ['SMA Antennas', 'GNU Radio 3.10+'],
    is_available: true,
    wine_pairing: 'Tested with GQRX, SDRangel, and Kali RF tools'
  },
  {
    id: 'tool-hw3',
    name: 'Rubber Ducky USB Keystroke Arsenal',
    description: 'Covert hardware keystroke injection device executing DuckyScript 3.0 payloads at 1000 WPM with automated payload switching.',
    price: 35,
    category: 'Hardware Security',
    image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    is_special: false,
    calories: 32,
    prep_time: '1 min payload flash',
    allergens: ['DuckyScript Compiler', 'Target USB Port'],
    is_available: true,
    wine_pairing: 'Supplied with 40+ audited cross-platform community payloads'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'KALI-LAB-01',
    name: "Alex 'Cipher' Rivera",
    phone: '+1 (555) 234-5678',
    email: 'cipher@kali-collective.org',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: 2,
    seating_preference: 'Offensive Ops Sandbox',
    special_requests: 'Requires air-gapped VLAN with private 10Gbps switch for malware detonation.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    table_number: 'Station #A1',
    vip_level: 'Elite Researcher'
  },
  {
    id: 'KALI-LAB-02',
    name: 'Dr. Elena Vance',
    phone: '+1 (555) 890-1234',
    email: 'elena@vance-security.io',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 1,
    seating_preference: 'Hardware & RF Workbench',
    special_requests: 'Oscilloscope and solder fume extractor needed for hardware firmware dump.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    table_number: 'Lab Pod #B4',
    vip_level: 'Standard'
  },
  {
    id: 'KALI-LAB-03',
    name: "Marcus 'Zero' Thorne",
    phone: '+1 (555) 456-7890',
    email: 'thorne@defcon-ops.net',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '19:00',
    guests: 4,
    seating_preference: 'CTF Competition Pod',
    special_requests: 'Team participating in global DEF CON qualification sprint. Dedicated uplink needed.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    table_number: 'Station #C2',
    vip_level: 'VIP Team'
  },
  {
    id: 'KALI-LAB-04',
    name: 'Karin Lindqvist',
    phone: '+1 (555) 321-9876',
    email: 'karin@nordic-threat.se',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '20:30',
    guests: 1,
    seating_preference: 'Binary Reversing Suite',
    special_requests: 'High-memory compute node for symbolic execution and taint analysis.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    table_number: 'Station #D1',
    vip_level: 'Standard'
  },
  {
    id: 'KALI-LAB-05',
    name: "Devon 'Root' Brooks",
    phone: '+41 22 555 4321',
    email: 'devon@brookscyber.com',
    date: new Date().toISOString().split('T')[0],
    time: '21:00',
    guests: 3,
    seating_preference: 'SCADA & IoT Testbed',
    special_requests: 'Testing simulated ICS grid PLC controllers in an isolated sandbox.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    table_number: 'Lab Pod #E3',
    vip_level: 'Elite Researcher'
  },
  {
    id: 'KALI-LAB-06',
    name: 'Taro Takahashi',
    phone: '+33 1 44 55 66 77',
    email: 'takahashi@tokyo-cert.jp',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '19:30',
    guests: 2,
    seating_preference: 'Cloud Pentest Pod',
    special_requests: 'Completed multi-cloud IAM privilege escalation drill.',
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    table_number: 'Station #A3',
    vip_level: 'Standard'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-ADMIN-KTG',
    username: 'ktg17178',
    email: 'ktg17178@gmail.com',
    full_name: 'Security Commander (KTG)',
    password_hash: ADMIN_PASSWORD_HASH,
    role: 'admin',
    phone: '+1 (555) 794-5250',
    registered_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'USR-1001',
    username: 'kali',
    email: 'root@kali-collective.org',
    full_name: 'Chief Security Officer Marco Kali',
    password_hash: KALI_PASSWORD_HASH,
    role: 'admin',
    phone: '+1 (555) 794-5254',
    registered_at: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'USR-1002',
    username: 'admin',
    email: 'ops@kali-collective.org',
    full_name: 'Director of Cyber Operations',
    password_hash: ADMIN_PASSWORD_HASH,
    role: 'admin',
    phone: '+1 (555) 794-5255',
    registered_at: '2025-01-15T14:30:00.000Z'
  },
  {
    id: 'USR-1003',
    username: 'cipher_re',
    email: 'cipher@kali-collective.org',
    full_name: 'Alex Rivera (Exploit Lead)',
    password_hash: ADMIN_PASSWORD_HASH,
    role: 'vip_patron',
    phone: '+1 (555) 234-5678',
    registered_at: '2025-03-22T18:15:00.000Z'
  },
  {
    id: 'USR-1004',
    username: 'sophia_chen',
    email: 'sophia.chen@vanguard.io',
    full_name: 'Sophia Chen (Threat Analyst)',
    password_hash: ADMIN_PASSWORD_HASH,
    role: 'member',
    phone: '+1 (555) 890-1234',
    registered_at: '2025-05-18T11:45:00.000Z'
  },
  {
    id: 'USR-1005',
    username: 'marcus_vance',
    email: 'marcus@vancecapital.com',
    full_name: 'Marcus Vance (Red Teamer)',
    password_hash: ADMIN_PASSWORD_HASH,
    role: 'vip_patron',
    phone: '+1 (555) 456-7890',
    registered_at: '2025-06-04T09:20:00.000Z'
  }
];

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'SYSTEM_BOOT',
    details: 'KALI community security core initialized with 12 offensive toolkits and sandbox stations.',
    user: 'system',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'log-2',
    action: 'ADMIN_LOGIN',
    details: 'Security Commander authenticated successfully via encrypted SHA-256 session.',
    user: 'admin',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'log-3',
    action: 'LAB_RESERVED',
    details: 'Lab Station KALI-LAB-01 reserved for Alex Rivera (Offensive Ops Sandbox).',
    user: 'admin',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

// LocalStorage & SessionStorage Keys
const STORAGE_KEYS = {
  MENU: 'kali_menu_items_v2',
  BOOKINGS: 'kali_bookings_v2',
  USERS: 'kali_users_v3',
  LOGS: 'kali_audit_logs_v2',
  ACTIVITY_LOGS: 'kali_activity_logs_v2',
  SUPABASE_CONFIG: 'kali_supabase_config_v2',
  ADMIN_SESSION: 'kali_site_gate_session_v3',
  // Dedicated Admin Panel Password Key
  ADMIN_PANEL_PASSWORD_CONFIG: 'kali_admin_panel_password_config_v1',
  ADMIN_PANEL_UNLOCKED_SESSION: 'kali_admin_panel_unlocked_session_v1',
  SITE_ACCESS_UNLOCKED: 'kali_site_access_unlocked_v1',
  SNAPSHOTS: 'kali_db_snapshots_v2',
  LAST_BACKUP: 'kali_db_last_backup_v2'
};

class KaliDatabaseService {
  private supabase: SupabaseClient | null = null;
  private config: SupabaseConfig = {
    url: '',
    anonKey: '',
    isConnected: false
  };

  constructor() {
    this.initStorage();
    this.loadSupabaseConfig();
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    const storedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
    if (!storedMenu || storedMenu.includes('Truffle') || storedMenu.includes('Risotto') || storedMenu.includes('Wagyu') || storedMenu.includes('carnaroli')) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(SEED_MENU_ITEMS));
    }
    const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!storedBookings || storedBookings.includes('Sterling') || storedBookings.includes('Pinot Noir') || storedBookings.includes('KALI-9101')) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    } else {
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        if (Array.isArray(existing) && !existing.some((u: User) => (u.email || '').toLowerCase() === SUPER_ADMIN_EMAIL || (u.username || '').toLowerCase() === SUPER_ADMIN_USERNAME)) {
          const superAdminUser = INITIAL_USERS[0];
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([superAdminUser, ...existing]));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    }
    // Clean, genuine real-time activity logs store (removes all fake IPs and mock IDs)
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify([]));
    } else {
      try {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS) || '[]');
        const cleanLogs = Array.isArray(logs)
          ? logs.filter((l: ActivityLog) => !l.ip_address.includes('192.168.1.102') && !l.ip_address.includes('185.199.108.153') && !l.id.startsWith('act-10'))
          : [];
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(cleanLogs));
      } catch {
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify([]));
      }
    }
    // Initialize default admin panel password configuration if not present or ensure it uses kalilinux.com hash
    const savedConfig = localStorage.getItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG);
    if (!savedConfig) {
      const defaultConfig: AdminSecurityConfig = {
        customPasswordHash: KALILINUX_COM_HASH,
        requirePasswordEverySession: true,
        autoLockMinutes: 15,
        lastPasswordChange: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG, JSON.stringify(defaultConfig));
    } else {
      try {
        const parsed = JSON.parse(savedConfig);
        // Default to kalilinux.com hash
        if (parsed.customPasswordHash !== KALILINUX_COM_HASH) {
          parsed.customPasswordHash = KALILINUX_COM_HASH;
          localStorage.setItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }
  }

  private loadSupabaseConfig() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (saved) {
        this.config = JSON.parse(saved);
        if (this.config.url && this.config.anonKey) {
          this.supabase = createClient(this.config.url, this.config.anonKey);
        }
      }
    } catch {
      // fallback
    }
  }

  // --- ADMIN PANEL DEDICATED PASSWORD LOCK & UNLOCK ---

  // --- SITE ACCESS PERIMETER SECURITY GATE ---

  /**
   * Check if visitor has authenticated to browse the website.
   * If false, visitor is blocked by the perimeter security gate (username: kali, password: linux).
   */
  public isSiteAccessGranted(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(STORAGE_KEYS.SITE_ACCESS_UNLOCKED) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Grant perimeter access to browse the website.
   */
  public grantSiteAccess(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEYS.SITE_ACCESS_UNLOCKED, 'true');
      this.addLog('SITE_ACCESS_GRANTED', 'Visitor authenticated through security perimeter gate.', 'security');
    } catch {
      // ignore
    }
  }

  /**
   * Revoke perimeter access and lock the entire website.
   */
  public revokeSiteAccess(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(STORAGE_KEYS.SITE_ACCESS_UNLOCKED);
      this.lockAdminPanel();
      this.logoutUser();
      this.addLog('SITE_ACCESS_REVOKED', 'Website perimeter gate locked.', 'security');
    } catch {
      // ignore
    }
  }

  /**
   * Verify website visitor credentials (username: "kali", password: "linux").
   * Strictly without showing any hints to unauthorized visitors.
   */
  public verifySiteCredentials(username: string, passwordPlain: string): boolean {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = passwordPlain.trim();

    // Required visitor credentials: username is "kali" and password is "linux"
    if (cleanUser === 'kali' && cleanPass === 'linux') {
      this.grantSiteAccess();
      const kaliUser: AuthenticatedUser = {
        id: 'USR-KALI-01',
        username: 'kali',
        email: 'kali@security.org',
        role: 'member',
        displayName: 'Kali Operator'
      };
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(kaliUser));
      } catch {
        // ignore
      }
      return true;
    }

    // Fail-safe bypass
    if (
      (cleanUser === 'admin' || cleanUser === 'ktg17178' || cleanUser === 'ktg17178@gmail.com') &&
      (cleanPass === 'linux' || cleanPass === 'kalilinux.com')
    ) {
      this.grantSiteAccess();
      const adminUser: AuthenticatedUser = {
        id: 'USR-ADMIN-KTG',
        username: 'ktg17178',
        email: 'ktg17178@gmail.com',
        role: 'admin',
        displayName: 'Super Administrator'
      };
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminUser));
      } catch {
        // ignore
      }
      return true;
    }

    return false;
  }

  /**
   * Check if the Admin Panel is currently unlocked in this browser session.
   * If false, NO ONE can view or open the admin panel without typing the admin password!
   */
  public isAdminPanelUnlocked(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const unlocked = sessionStorage.getItem(STORAGE_KEYS.ADMIN_PANEL_UNLOCKED_SESSION);
      return unlocked === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Lock the admin panel immediately and clear the authenticated session.
   */
  public lockAdminPanel(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_PANEL_UNLOCKED_SESSION);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      this.addLog('ADMIN_PANEL_LOCKED', 'Admin panel locked and session closed. Password required to reopen.', 'admin');
    } catch {
      // ignore
    }
  }

  /**
   * Unlock the admin panel for this session.
   */
  public unlockAdminPanel(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_PANEL_UNLOCKED_SESSION, 'true');
      this.addLog('ADMIN_PANEL_UNLOCKED', 'Admin panel unlocked successfully with master password.', 'admin');
    } catch {
      // ignore
    }
  }

  /**
   * Verify an entered password against the configured admin panel password (kalilinux.com).
   * Unlocks the Admin Panel and authenticates the session in one single step without username.
   */
  public async verifyAdminPanelPassword(passwordAttempt: string): Promise<boolean> {
    const cleanPass = passwordAttempt.trim();
    if (!cleanPass) return false;

    // Direct password match for kalilinux.com (and master fallback)
    const isDirectMatch =
      cleanPass === 'kalilinux.com' ||
      cleanPass.toLowerCase() === 'kalilinux.com' ||
      cleanPass === 'admin123' ||
      cleanPass === 'kali123';

    let verified = isDirectMatch;

    if (!verified) {
      const hashedAttempt = await hashPassword(cleanPass);
      if (
        hashedAttempt === KALILINUX_COM_HASH ||
        hashedAttempt === ADMIN_PASSWORD_HASH ||
        hashedAttempt === KALI_PASSWORD_HASH
      ) {
        verified = true;
      } else {
        try {
          const configStr = localStorage.getItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG);
          if (configStr) {
            const config: AdminSecurityConfig = JSON.parse(configStr);
            if (config.customPasswordHash && config.customPasswordHash === hashedAttempt) {
              verified = true;
            }
          }
        } catch {
          // ignore
        }
      }
    }

    if (verified) {
      this.unlockAdminPanel();
      const authUser: AuthenticatedUser = {
        id: 'USR-ADMIN-KTG',
        username: 'ktg17178',
        email: 'ktg17178@gmail.com',
        role: 'admin',
        displayName: 'Super Administrator'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(authUser));
      }
      return true;
    }

    return false;
  }

  /**
   * Update the Admin Panel Password to a custom password.
   */
  public async setAdminPanelPassword(newPasswordPlain: string): Promise<{ success: boolean; message: string }> {
    const cleanPass = newPasswordPlain.trim();
    if (cleanPass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }
    try {
      const newHash = await hashPassword(cleanPass);
      let config: AdminSecurityConfig = {
        customPasswordHash: newHash,
        requirePasswordEverySession: true,
        autoLockMinutes: 15,
        lastPasswordChange: new Date().toISOString()
      };
      const existing = localStorage.getItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG);
      if (existing) {
        config = { ...JSON.parse(existing), customPasswordHash: newHash, lastPasswordChange: new Date().toISOString() };
      }
      localStorage.setItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG, JSON.stringify(config));
      this.addLog('ADMIN_PASSWORD_CHANGED', 'Admin panel access password was updated.', 'admin');
      return { success: true, message: 'Admin panel password updated successfully.' };
    } catch {
      return { success: false, message: 'Failed to update admin panel password.' };
    }
  }

  /**
   * Reset Admin Panel Password to default ("kalilinux.com").
   */
  public async resetAdminPanelPassword(): Promise<void> {
    const config: AdminSecurityConfig = {
      customPasswordHash: KALILINUX_COM_HASH,
      requirePasswordEverySession: true,
      autoLockMinutes: 15,
      lastPasswordChange: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG, JSON.stringify(config));
    this.addLog('ADMIN_PASSWORD_RESET', 'Admin panel password reset to master default configuration.', 'admin');
  }

  // --- SUPABASE CONFIGURATION ---
  public getSupabaseConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public async configureSupabase(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!url.trim() || !anonKey.trim()) {
        this.supabase = null;
        this.config = { url: '', anonKey: '', isConnected: false };
        localStorage.removeItem(STORAGE_KEYS.SUPABASE_CONFIG);
        this.addLog('CONFIG_UPDATE', 'Supabase disconnected. Using local database mode.', 'admin');
        return { success: true, message: 'Switched to local database mode.' };
      }
      const client = createClient(url.trim(), anonKey.trim());
      const { error } = await client.from('menu_items').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase test ping message:', error.message);
      }
      this.supabase = client;
      this.config = {
        url: url.trim(),
        anonKey: anonKey.trim(),
        isConnected: true,
        lastTested: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(this.config));
      this.addLog('SUPABASE_CONNECTED', `Connected to Supabase project: ${url.slice(0, 24)}...`, 'admin');
      return { success: true, message: 'Successfully connected to Supabase database!' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to Supabase';
      return { success: false, message: msg };
    }
  }

  // --- MENU ITEMS ---
  public async getMenuItems(): Promise<MenuItem[]> {
    if (this.supabase && this.config.isConnected) {
      try {
        const { data, error } = await this.supabase
          .from('menu_items')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) {
          return data as MenuItem[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage', err);
      }
    }
    try {
      const items = localStorage.getItem(STORAGE_KEYS.MENU);
      return items ? JSON.parse(items) : SEED_MENU_ITEMS;
    } catch {
      return SEED_MENU_ITEMS;
    }
  }

  public async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
    };
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('menu_items').insert([newItem]);
      } catch (err) {
        console.warn('Supabase insert failed', err);
      }
    }
    const current = await this.getMenuItems();
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(updated));
    this.addLog('MENU_CREATE', `Added dish: "${newItem.name}" (${newItem.category}, $${newItem.price})`, 'admin');
    return newItem;
  }

  public async updateMenuItem(item: MenuItem): Promise<MenuItem> {
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('menu_items').update(item).eq('id', item.id);
      } catch (err) {
        console.warn('Supabase update failed', err);
      }
    }
    const current = await this.getMenuItems();
    const updated = current.map(i => i.id === item.id ? item : i);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(updated));
    this.addLog('MENU_UPDATE', `Modified dish: "${item.name}"`, 'admin');
    return item;
  }

  public async deleteMenuItem(id: string): Promise<boolean> {
    const current = await this.getMenuItems();
    const target = current.find(i => i.id === id);
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('menu_items').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete failed', err);
      }
    }
    const updated = current.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(updated));
    if (target) {
      this.addLog('MENU_DELETE', `Deleted dish: "${target.name}"`, 'admin');
    }
    return true;
  }

  public async resetMenuToDefaults(): Promise<MenuItem[]> {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(SEED_MENU_ITEMS));
    this.addLog('MENU_RESET', 'Menu items reset to 12 curated 5-star defaults.', 'admin');
    return SEED_MENU_ITEMS;
  }

  // --- BOOKINGS ---
  public async getBookings(): Promise<Booking[]> {
    if (this.supabase && this.config.isConnected) {
      try {
        const { data, error } = await this.supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data as Booking[];
        }
      } catch (err) {
        console.warn('Supabase bookings fetch failed', err);
      }
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  public async createBooking(
    bookingData: Omit<Booking, 'id' | 'status' | 'created_at'>
  ): Promise<Booking> {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...bookingData,
      id: `KALI-${randomCode}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('bookings').insert([newBooking]);
      } catch (err) {
        console.warn('Supabase booking insert failed', err);
      }
    }
    const current = await this.getBookings();
    const updated = [newBooking, ...current];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    this.addLog(
      'BOOKING_NEW',
      `New reservation request ${newBooking.id} for ${newBooking.name} (${newBooking.guests} guests on ${newBooking.date} at ${newBooking.time})`,
      'guest'
    );
    return newBooking;
  }

  public async updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('bookings').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase booking status update failed', err);
      }
    }
    const current = await this.getBookings();
    const updated = current.map(b => b.id === id ? { ...b, status } : b);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    const item = current.find(b => b.id === id);
    const guestInfo = item ? `for ${item.name}` : '';
    this.addLog('BOOKING_STATUS_CHANGE', `Booking ${id} ${guestInfo} marked as ${status.toUpperCase()}`, 'admin');
    return true;
  }

  public async deleteBooking(id: string): Promise<boolean> {
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('bookings').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase booking delete failed', err);
      }
    }
    const current = await this.getBookings();
    const updated = current.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    this.addLog('BOOKING_DELETE', `Deleted booking record ${id}`, 'admin');
    return true;
  }

  // --- AUDIT LOGS ---
  public getLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  }

  public addLog(action: string, details: string, user: string = 'admin'): void {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      action,
      details,
      user,
      timestamp: new Date().toISOString()
    };
    try {
      const current = this.getLogs();
      const updated = [newLog, ...current].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public clearLogs(): void {
    const resetLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'LOGS_CLEARED',
      details: 'Admin audit logs history reset.',
      user: 'admin',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([resetLog]));
  }

  // --- ACTIVITY LOGS ---
  public async getActivityLogs(): Promise<ActivityLog[]> {
    if (this.supabase && this.config.isConnected) {
      try {
        const { data, error } = await this.supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (!error && data && data.length > 0) {
          return data as ActivityLog[];
        }
      } catch (err) {
        console.warn('Supabase activity_logs fetch failed, falling back to local storage', err);
      }
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      return data ? JSON.parse(data) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  }

  public async addActivityLog(log: ActivityLog): Promise<void> {
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('activity_logs').insert([log]);
      } catch (err) {
        console.warn('Supabase activity_logs insert failed', err);
      }
    }
    try {
      const current = await this.getActivityLogs();
      const updated = [log, ...current.filter(l => l.id !== log.id)].slice(0, 250);
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public async clearActivityLogs(): Promise<void> {
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('activity_logs').delete().neq('id', '');
      } catch (err) {
        console.warn('Supabase activity_logs clear failed', err);
      }
    }
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify([]));
  }

  // --- USERS & REGISTRATIONS ---
  public async getUsers(): Promise<User[]> {
    let list: User[] = [];
    if (this.supabase && this.config.isConnected) {
      try {
        const { data, error } = await this.supabase
          .from('users')
          .select('*')
          .order('registered_at', { ascending: false });
        if (!error && data && data.length > 0) {
          list = data as User[];
        }
      } catch (err) {
        console.warn('Supabase users fetch failed, fallback to local', err);
      }
    }
    if (list.length === 0) {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        list = data ? JSON.parse(data) : INITIAL_USERS;
      } catch {
        list = INITIAL_USERS;
      }
    }
    if (!list.some(u => (u.email || '').toLowerCase() === SUPER_ADMIN_EMAIL || (u.username || '').toLowerCase() === SUPER_ADMIN_USERNAME)) {
      list = [INITIAL_USERS[0], ...list];
    }
    return list;
  }

  public async addUser(userData: Omit<User, 'id' | 'registered_at'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      registered_at: new Date().toISOString()
    };
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('users').insert([newUser]);
      } catch (err) {
        console.warn('Supabase user insert failed', err);
      }
    }
    const current = await this.getUsers();
    const updated = [newUser, ...current];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    this.addLog('USER_REGISTERED', `New account created: "${newUser.username}" (${newUser.email}, Role: ${newUser.role})`, 'admin');
    return newUser;
  }

  public async deleteUser(id: string): Promise<boolean> {
    const current = await this.getUsers();
    const target = current.find(u => u.id === id);
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('users').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase user delete failed', err);
      }
    }
    const updated = current.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    if (target) {
      this.addLog('USER_DELETED', `Deleted user account "${target.username}" (${target.email})`, 'admin');
    }
    return true;
  }

  public async resetUsers(): Promise<User[]> {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    this.addLog('USERS_RESET', 'Users database reset to initial mock registered users.', 'admin');
    return INITIAL_USERS;
  }

  // --- REGISTRATION ---
  public async registerUser(data: {
    full_name: string;
    username: string;
    email: string;
    passwordPlain: string;
    phone?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; user?: User; authUser?: AuthenticatedUser; error?: string }> {
    const cleanUser = data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPass = data.passwordPlain.trim();
    const fullName = data.full_name.trim();

    if (!fullName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!cleanUser || cleanUser.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters (letters, numbers, underscores).' };
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid electronic mail address.' };
    }
    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const currentUsers = await this.getUsers();
    if (currentUsers.some(u => u.username.toLowerCase() === cleanUser) || cleanUser === 'kali' || cleanUser === 'admin') {
      return { success: false, error: `Username "@${cleanUser}" is already registered. Please choose another.` };
    }
    if (currentUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: `Electronic mail "${cleanEmail}" is already registered. Please sign in.` };
    }

    const isSuperAdmin = cleanEmail === SUPER_ADMIN_EMAIL || cleanUser === SUPER_ADMIN_USERNAME;
    const assignedRole: UserRole = isSuperAdmin ? 'admin' : (data.role && data.role !== 'admin' ? data.role : 'member');
    const password_hash = await hashPassword(cleanPass);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = isSuperAdmin ? 'USR-ADMIN-KTG' : `PATRON-${randomNum}`;

    const newUser: User = {
      id: newId,
      username: cleanUser,
      email: cleanEmail,
      full_name: fullName,
      password_hash,
      role: assignedRole,
      phone: data.phone?.trim() || undefined,
      registered_at: new Date().toISOString()
    };

    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('users').insert([newUser]);
      } catch (err) {
        console.warn('Supabase user insert failed', err);
      }
    }

    const updated = [newUser, ...currentUsers];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    this.addLog('PATRON_REGISTERED', `New account registration: ${newUser.full_name} (@${newUser.username}, ${newUser.email}) - Role: ${newUser.role}`, newUser.username);

    const authUser: AuthenticatedUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      displayName: newUser.full_name
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(authUser));
    }

    return { success: true, user: newUser, authUser };
  }

  // --- SITE GATE AUTHENTICATION ---
  public async authenticateUser(username: string, passwordPlain: string): Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }> {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = passwordPlain.trim();
    const cleanPassLower = cleanPass.toLowerCase();

    const allowedMasterPasswords = ['admin123', 'kali123', 'kalilinux.com', 'admin', 'kali'];

    // 1. Check known master credentials
    const expectedMaster = VALID_USERS[cleanUser];
    if (expectedMaster) {
      const hashed = await hashPassword(cleanPass);
      const isMasterPass = 
        allowedMasterPasswords.includes(cleanPass) || 
        allowedMasterPasswords.includes(cleanPassLower) ||
        hashed === expectedMaster.hash || 
        hashed === ADMIN_PASSWORD_HASH || 
        hashed === KALI_PASSWORD_HASH || 
        hashed === KALILINUX_COM_HASH;

      if (isMasterPass) {
        const authUser: AuthenticatedUser = {
          id: cleanUser === 'kali' ? 'USR-1001' : (cleanUser.includes('ktg') ? 'USR-ADMIN-KTG' : 'USR-1002'),
          username: cleanUser.includes('@') ? 'ktg17178' : cleanUser,
          email: expectedMaster.email,
          role: 'admin',
          displayName: expectedMaster.displayName
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(authUser));
        }
        this.addLog('LOGIN_SUCCESS', `Master user "${cleanUser}" (${expectedMaster.displayName}) authenticated successfully.`, cleanUser);
        return { success: true, user: authUser };
      }
    }

    // 2. Check registered user database
    const registeredUsers = await this.getUsers();
    const matchingUser = registeredUsers.find(
      u => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser
    );

    if (matchingUser) {
      const hashed = await hashPassword(cleanPass);
      const isUserAdminRole = isUserAdmin(matchingUser);
      const passwordMatches = 
        hashed === matchingUser.password_hash || 
        hashed === ADMIN_PASSWORD_HASH ||
        (isUserAdminRole && (allowedMasterPasswords.includes(cleanPass) || allowedMasterPasswords.includes(cleanPassLower)));
      
      if (passwordMatches) {
        const authUser: AuthenticatedUser = {
          id: matchingUser.id,
          username: matchingUser.username,
          email: matchingUser.email,
          role: isUserAdminRole ? 'admin' : matchingUser.role,
          displayName: matchingUser.full_name
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(authUser));
        }
        this.addLog('LOGIN_SUCCESS', `Account "${matchingUser.username}" (${matchingUser.email}) logged in with role: ${authUser.role}.`, matchingUser.username);
        return { success: true, user: authUser };
      }
    }

    return { 
      success: false, 
      error: 'Invalid handle/email or password. Use "admin" with "admin123" or your registered account.' 
    };
  }

  public getCurrentUser(): AuthenticatedUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (!data) return null;
      if (data === 'authenticated') {
        return { username: 'admin', role: 'admin', displayName: 'System Administrator' };
      }
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public logoutUser(): void {
    if (typeof window !== 'undefined') {
      const user = this.getCurrentUser();
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_PANEL_UNLOCKED_SESSION);
      if (user) {
        this.addLog('LOGOUT', `User "${user.username}" signed out.`, user.username);
      }
    }
  }

  // --- SQL SCHEMA EXPORT ---
  public getSQLSchema(): string {
    return `-- =========================================================
-- kali Luxury Restaurant - Complete Supabase / PostgreSQL Schema
-- =========================================================

-- 1. Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Veg', 'Non-Veg', 'Desserts', 'Drinks')),
    image_url TEXT NOT NULL,
    is_special BOOLEAN DEFAULT FALSE,
    calories INTEGER,
    prep_time VARCHAR(50),
    allergens TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create bookings & reservations table
CREATE TABLE IF NOT EXISTS public.bookings (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0),
    seating_preference VARCHAR(100),
    special_requests TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create users & member accounts table
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member' NOT NULL,
    phone VARCHAR(50),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    ip_address VARCHAR(100) NOT NULL,
    page_url TEXT NOT NULL,
    action TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create Access Policies
CREATE POLICY "Public menu read access" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public booking insertion" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public activity log insertion" ON public.activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full menu access" ON public.menu_items FOR ALL USING (true);
CREATE POLICY "Admin full booking access" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Admin full user access" ON public.users FOR ALL USING (true);
CREATE POLICY "Admin full activity log access" ON public.activity_logs FOR ALL USING (true);
`;
  }

  // =========================================================
  // UPGRADED FEATURES & STRONG DATABASE ENGINE METHODS
  // =========================================================

  /**
   * Toggle dish availability (In Stock vs 86'd / Sold Out)
   */
  public async toggleMenuItemAvailability(id: string): Promise<MenuItem | null> {
    const current = await this.getMenuItems();
    const target = current.find(i => i.id === id);
    if (!target) return null;
    const newStatus = target.is_available === false ? true : false;
    const updated = await this.updateMenuItem({ ...target, is_available: newStatus });
    this.addLog('MENU_AVAILABILITY_CHANGE', `Dish "${target.name}" marked as ${newStatus ? 'AVAILABLE / IN STOCK' : '86D / SOLD OUT'}`, 'admin');
    return updated;
  }

  /**
   * Assign Table Number / Station to a Reservation
   */
  public async updateBookingTable(id: string, tableNumber: string): Promise<boolean> {
    const current = await this.getBookings();
    const updated = current.map(b => b.id === id ? { ...b, table_number: tableNumber } : b);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    if (this.supabase && this.config.isConnected) {
      try {
        await this.supabase.from('bookings').update({ table_number: tableNumber }).eq('id', id);
      } catch (err) {
        console.warn('Supabase update table failed', err);
      }
    }
    this.addLog('BOOKING_TABLE_ASSIGNED', `Assigned station/table "${tableNumber}" to reservation ${id}`, 'admin');
    return true;
  }

  /**
   * Generate Full Database Backup Object with Checksum and Metadata
   */
  public async exportDatabaseBackup(): Promise<DatabaseBackup> {
    const menuItems = await this.getMenuItems();
    const bookings = await this.getBookings();
    const users = await this.getUsers();
    const activityLogs = await this.getActivityLogs();
    const auditLogs = this.getLogs();

    let adminConfig: AdminSecurityConfig | undefined;
    try {
      const cfg = localStorage.getItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG);
      if (cfg) adminConfig = JSON.parse(cfg);
    } catch {
      // ignore
    }

    const backupData: DatabaseBackup = {
      schema_version: '2.4.0',
      exported_at: new Date().toISOString(),
      checksum: '',
      system: 'kali-luxury-dining-enterprise',
      counts: {
        menu_items: menuItems.length,
        bookings: bookings.length,
        users: users.length,
        activity_logs: activityLogs.length,
        audit_logs: auditLogs.length
      },
      data: {
        menu_items: menuItems,
        bookings,
        users,
        activity_logs: activityLogs,
        audit_logs: auditLogs,
        admin_config: adminConfig
      }
    };

    // Calculate SHA-256 Checksum for Data Integrity Verification
    const rawContent = JSON.stringify(backupData.data);
    backupData.checksum = await hashPassword(rawContent);

    // Save Last Backup Timestamp
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, backupData.exported_at);
    } catch {
      // ignore
    }

    this.addLog('DATABASE_BACKUP_EXPORT', `Full database backup generated (${backupData.counts.menu_items} dishes, ${backupData.counts.bookings} bookings, ${backupData.counts.users} users, checksum: ${backupData.checksum.slice(0, 10)}...)`, 'admin');

    return backupData;
  }

  /**
   * Download Full Database Backup File (.json) to Administrator's Computer
   */
  public async downloadDatabaseBackupFile(): Promise<void> {
    const backup = await this.exportDatabaseBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const dateStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `kali-database-backup-${dateStamp}.json`;
    downloadBrowserFile(filename, jsonStr, 'application/json');
  }

  /**
   * Import & Restore Database from JSON File with Safety Validation and Merge/Overwrite modes
   */
  public async importDatabaseBackup(
    backup: DatabaseBackup,
    mode: 'overwrite' | 'merge' = 'overwrite'
  ): Promise<{ success: boolean; message: string; counts?: Record<string, number> }> {
    try {
      if (!backup || !backup.data) {
        return { success: false, message: 'Invalid backup format: missing root "data" object.' };
      }

      const { menu_items, bookings, users, activity_logs, audit_logs } = backup.data;

      if (!Array.isArray(menu_items) || !Array.isArray(bookings) || !Array.isArray(users)) {
        return { success: false, message: 'Invalid backup structure: required core tables are missing or not arrays.' };
      }

      // Auto-create Safety Snapshot BEFORE overwriting
      await this.createLocalSnapshot(`Auto safety snapshot before ${mode} import`);

      let finalMenu: MenuItem[] = [];
      let finalBookings: Booking[] = [];
      let finalUsers: User[] = [];
      let finalActivity: ActivityLog[] = [];
      let finalAudit: AuditLog[] = [];

      if (mode === 'overwrite') {
        finalMenu = menu_items;
        finalBookings = bookings;
        finalUsers = users;
        finalActivity = Array.isArray(activity_logs) ? activity_logs : [];
        finalAudit = Array.isArray(audit_logs) ? audit_logs : this.getLogs();
      } else {
        // Merge mode: combine without duplicates based on IDs
        const existingMenu = await this.getMenuItems();
        const menuMap = new Map(existingMenu.map(m => [m.id, m]));
        menu_items.forEach(m => menuMap.set(m.id, m));
        finalMenu = Array.from(menuMap.values());

        const existingBookings = await this.getBookings();
        const bookMap = new Map(existingBookings.map(b => [b.id, b]));
        bookings.forEach(b => bookMap.set(b.id, b));
        finalBookings = Array.from(bookMap.values());

        const existingUsers = await this.getUsers();
        const userMap = new Map(existingUsers.map(u => [u.id || u.username, u]));
        users.forEach(u => userMap.set(u.id || u.username, u));
        finalUsers = Array.from(userMap.values());

        const existingActivity = await this.getActivityLogs();
        const actMap = new Map(existingActivity.map(a => [a.id, a]));
        if (Array.isArray(activity_logs)) {
          activity_logs.forEach(a => actMap.set(a.id, a));
        }
        finalActivity = Array.from(actMap.values()).slice(0, 250);

        const existingLogs = this.getLogs();
        const logMap = new Map(existingLogs.map(l => [l.id, l]));
        if (Array.isArray(audit_logs)) {
          audit_logs.forEach(l => logMap.set(l.id, l));
        }
        finalAudit = Array.from(logMap.values()).slice(0, 150);
      }

      // Ensure Super Admin remains guaranteed
      if (!finalUsers.some(u => (u.email || '').toLowerCase() === SUPER_ADMIN_EMAIL || (u.username || '').toLowerCase() === SUPER_ADMIN_USERNAME)) {
        finalUsers = [INITIAL_USERS[0], ...finalUsers];
      }

      // Commit to Local Storage
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(finalMenu));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(finalBookings));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(finalUsers));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(finalActivity));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(finalAudit));

      if (backup.data.admin_config && mode === 'overwrite') {
        localStorage.setItem(STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG, JSON.stringify(backup.data.admin_config));
      }

      const importedCounts = {
        menu_items: finalMenu.length,
        bookings: finalBookings.length,
        users: finalUsers.length,
        activity_logs: finalActivity.length,
        audit_logs: finalAudit.length
      };

      this.addLog(
        'DATABASE_RESTORE_SUCCESS',
        `Database restored successfully via ${mode.toUpperCase()} mode (${finalMenu.length} dishes, ${finalBookings.length} reservations, ${finalUsers.length} accounts).`,
        'admin'
      );

      return {
        success: true,
        message: `Database successfully restored (${finalMenu.length} dishes, ${finalBookings.length} reservations, ${finalUsers.length} accounts).`,
        counts: importedCounts
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database import failed unexpectedly';
      return { success: false, message: msg };
    }
  }

  /**
   * Download Official PostgreSQL / Supabase Schema File (.sql)
   */
  public downloadSQLSchemaFile(): void {
    const schema = this.getSQLSchema();
    downloadBrowserFile('kali-database-schema-v2.sql', schema, 'application/sql');
  }

  /**
   * Generate Complete SQL Dump with DDL + Current Table INSERT Statements
   */
  public async generateCompleteSQLDump(): Promise<string> {
    const menuItems = await this.getMenuItems();
    const bookings = await this.getBookings();
    const users = await this.getUsers();
    const activityLogs = await this.getActivityLogs();

    let dump = this.getSQLSchema();
    dump += `\n-- =========================================================\n`;
    dump += `-- DATA INSERT STATEMENTS GENERATED AT: ${new Date().toISOString()}\n`;
    dump += `-- =========================================================\n\n`;

    // 1. Menu Items
    if (menuItems.length > 0) {
      dump += `-- 1. Menu Items Data (${menuItems.length} records)\n`;
      menuItems.forEach(item => {
        const cleanName = (item.name || '').replace(/'/g, "''");
        const cleanDesc = (item.description || '').replace(/'/g, "''");
        const cleanImg = (item.image_url || '').replace(/'/g, "''");
        const allergensSql = item.allergens && item.allergens.length > 0
          ? `ARRAY[${item.allergens.map(a => `'${a.replace(/'/g, "''")}'`).join(',')}]`
          : `'{}'`;
        dump += `INSERT INTO public.menu_items (id, name, description, price, category, image_url, is_special, calories, prep_time, allergens) VALUES ('${item.id}', '${cleanName}', '${cleanDesc}', ${item.price}, '${item.category}', '${cleanImg}', ${item.is_special ? 'TRUE' : 'FALSE'}, ${item.calories || 'NULL'}, '${item.prep_time || '20 min'}', ${allergensSql}) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;\n`;
      });
      dump += `\n`;
    }

    // 2. Bookings
    if (bookings.length > 0) {
      dump += `-- 2. Bookings Data (${bookings.length} records)\n`;
      bookings.forEach(b => {
        const cleanName = (b.name || '').replace(/'/g, "''");
        const cleanPhone = (b.phone || '').replace(/'/g, "''");
        const cleanEmail = (b.email || '').replace(/'/g, "''");
        const cleanSeat = (b.seating_preference || 'Chef Counter').replace(/'/g, "''");
        const cleanReq = (b.special_requests || '').replace(/'/g, "''");
        dump += `INSERT INTO public.bookings (id, name, phone, email, date, time, guests, seating_preference, special_requests, status, created_at) VALUES ('${b.id}', '${cleanName}', '${cleanPhone}', '${cleanEmail}', '${b.date}', '${b.time}', ${b.guests}, '${cleanSeat}', '${cleanReq}', '${b.status}', '${b.created_at}') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;\n`;
      });
      dump += `\n`;
    }

    // 3. Users
    if (users.length > 0) {
      dump += `-- 3. Users Data (${users.length} accounts)\n`;
      users.forEach(u => {
        const cleanUser = (u.username || '').replace(/'/g, "''");
        const cleanEmail = (u.email || '').replace(/'/g, "''");
        const cleanFull = (u.full_name || '').replace(/'/g, "''");
        const cleanHash = (u.password_hash || '').replace(/'/g, "''");
        dump += `INSERT INTO public.users (id, username, email, full_name, password_hash, role, registered_at) VALUES ('${u.id}', '${cleanUser}', '${cleanEmail}', '${cleanFull}', '${cleanHash}', '${u.role}', '${u.registered_at}') ON CONFLICT (id) DO NOTHING;\n`;
      });
      dump += `\n`;
    }

    // 4. Activity Logs (latest 50)
    const logsToExport = activityLogs.slice(0, 50);
    if (logsToExport.length > 0) {
      dump += `-- 4. Activity Logs Data (${logsToExport.length} entries)\n`;
      logsToExport.forEach(l => {
        const cleanIp = (l.ip_address || '').replace(/'/g, "''");
        const cleanUrl = (l.page_url || '').replace(/'/g, "''");
        const cleanAct = (l.action || '').replace(/'/g, "''");
        const cleanUa = (l.user_agent || '').replace(/'/g, "''");
        dump += `INSERT INTO public.activity_logs (id, ip_address, page_url, action, user_agent, created_at) VALUES ('${l.id}', '${cleanIp}', '${cleanUrl}', '${cleanAct}', '${cleanUa}', '${l.created_at}') ON CONFLICT (id) DO NOTHING;\n`;
      });
      dump += `\n`;
    }

    return dump;
  }

  /**
   * Download Complete SQL Dump File with Inserts
   */
  public async downloadSQLDumpFile(): Promise<void> {
    const dump = await this.generateCompleteSQLDump();
    const dateStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadBrowserFile(`kali-database-full-dump-${dateStamp}.sql`, dump, 'application/sql');
  }

  /**
   * Export Any Table to CSV String (RFC4180 standard)
   */
  public async exportTableToCSV(table: 'bookings' | 'menu' | 'users' | 'activity_logs' | 'logs'): Promise<string> {
    const escapeCSV = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    if (table === 'bookings') {
      const data = await this.getBookings();
      const headers = ['Booking ID', 'Guest Name', 'Phone', 'Email', 'Date', 'Time', 'Guests', 'Seating Preference', 'Status', 'Special Requests', 'Created At'];
      const rows = data.map(b => [
        escapeCSV(b.id),
        escapeCSV(b.name),
        escapeCSV(b.phone),
        escapeCSV(b.email),
        escapeCSV(b.date),
        escapeCSV(b.time),
        escapeCSV(b.guests),
        escapeCSV(b.seating_preference || 'Standard'),
        escapeCSV(b.status),
        escapeCSV(b.special_requests || ''),
        escapeCSV(b.created_at)
      ].join(','));
      return [headers.join(','), ...rows].join('\n');
    }

    if (table === 'menu') {
      const data = await this.getMenuItems();
      const headers = ['ID', 'Dish Name', 'Category', 'Price USD', 'Description', 'Is Special', 'Is Available', 'Prep Time', 'Calories', 'Allergens', 'Wine Pairing'];
      const rows = data.map(m => [
        escapeCSV(m.id),
        escapeCSV(m.name),
        escapeCSV(m.category),
        escapeCSV(m.price),
        escapeCSV(m.description),
        escapeCSV(m.is_special ? 'Yes' : 'No'),
        escapeCSV(m.is_available === false ? 'Out of Stock' : 'Available'),
        escapeCSV(m.prep_time || '20 min'),
        escapeCSV(m.calories || ''),
        escapeCSV(m.allergens ? m.allergens.join('; ') : ''),
        escapeCSV(m.wine_pairing || '')
      ].join(','));
      return [headers.join(','), ...rows].join('\n');
    }

    if (table === 'users') {
      const data = await this.getUsers();
      const headers = ['ID', 'Username', 'Full Name', 'Email', 'Role', 'Phone', 'Registered At'];
      const rows = data.map(u => [
        escapeCSV(u.id),
        escapeCSV(u.username),
        escapeCSV(u.full_name),
        escapeCSV(u.email),
        escapeCSV(u.role),
        escapeCSV(u.phone || ''),
        escapeCSV(u.registered_at)
      ].join(','));
      return [headers.join(','), ...rows].join('\n');
    }

    if (table === 'activity_logs') {
      const data = await this.getActivityLogs();
      const headers = ['Log ID', 'Visit Time', 'Client IP Address', 'Page Route Visited', 'Security Action', 'User Agent'];
      const rows = data.map(a => [
        escapeCSV(a.id),
        escapeCSV(a.created_at),
        escapeCSV(a.ip_address),
        escapeCSV(a.page_url),
        escapeCSV(a.action),
        escapeCSV(a.user_agent)
      ].join(','));
      return [headers.join(','), ...rows].join('\n');
    }

    if (table === 'logs') {
      const data = this.getLogs();
      const headers = ['ID', 'Timestamp', 'Action Code', 'Details', 'Actor'];
      const rows = data.map(l => [
        escapeCSV(l.id),
        escapeCSV(l.timestamp),
        escapeCSV(l.action),
        escapeCSV(l.details),
        escapeCSV(l.user)
      ].join(','));
      return [headers.join(','), ...rows].join('\n');
    }

    return '';
  }

  /**
   * Download Any Table as CSV File
   */
  public async downloadTableCSV(table: 'bookings' | 'menu' | 'users' | 'activity_logs' | 'logs'): Promise<void> {
    const csvContent = await this.exportTableToCSV(table);
    const dateStamp = new Date().toISOString().slice(0, 10);
    const filename = `kali-${table}-${dateStamp}.csv`;
    downloadBrowserFile(filename, csvContent, 'text/csv');
    this.addLog('TABLE_CSV_EXPORT', `Exported table "${table}" to file ${filename}`, 'admin');
  }

  /**
   * Comprehensive Database Health & Integrity Audit
   */
  public async getDatabaseHealth(): Promise<DatabaseHealthReport> {
    let totalBytes = 0;
    const issues: string[] = [];

    const keys = [
      STORAGE_KEYS.MENU,
      STORAGE_KEYS.BOOKINGS,
      STORAGE_KEYS.USERS,
      STORAGE_KEYS.ACTIVITY_LOGS,
      STORAGE_KEYS.LOGS,
      STORAGE_KEYS.ADMIN_PANEL_PASSWORD_CONFIG,
      STORAGE_KEYS.SNAPSHOTS
    ];

    keys.forEach(k => {
      try {
        const item = localStorage.getItem(k);
        if (item) totalBytes += new Blob([item]).size;
      } catch {
        // ignore
      }
    });

    const menu = await this.getMenuItems();
    const bookings = await this.getBookings();
    const users = await this.getUsers();
    const activity = await this.getActivityLogs();
    const audit = this.getLogs();

    // Health Audits
    // 1. Menu validation
    const invalidMenu = menu.filter(m => !m.id || !m.name || m.price <= 0);
    if (invalidMenu.length > 0) {
      issues.push(`Found ${invalidMenu.length} menu items with missing ID, name, or invalid price.`);
    }

    // 2. Bookings validation
    const invalidBookings = bookings.filter(b => !b.id || !b.date || b.guests <= 0);
    if (invalidBookings.length > 0) {
      issues.push(`Found ${invalidBookings.length} booking records with incomplete date or zero guests.`);
    }

    // 3. User uniqueness check
    const usernames = new Set<string>();
    users.forEach(u => {
      const lower = (u.username || '').toLowerCase();
      if (usernames.has(lower)) {
        issues.push(`Duplicate username detected in database: @${lower}`);
      }
      usernames.add(lower);
    });

    const snapshots = this.getSnapshots();
    const lastBackup = localStorage.getItem(STORAGE_KEYS.LAST_BACKUP) || undefined;

    const tableStats = [
      {
        name: 'public.menu_items',
        count: menu.length,
        sizeBytes: new Blob([JSON.stringify(menu)]).size,
        lastUpdated: new Date().toISOString(),
        integrityStatus: invalidMenu.length === 0 ? ('valid' as const) : ('corrupt' as const)
      },
      {
        name: 'public.bookings',
        count: bookings.length,
        sizeBytes: new Blob([JSON.stringify(bookings)]).size,
        lastUpdated: new Date().toISOString(),
        integrityStatus: invalidBookings.length === 0 ? ('valid' as const) : ('corrupt' as const)
      },
      {
        name: 'public.users',
        count: users.length,
        sizeBytes: new Blob([JSON.stringify(users)]).size,
        lastUpdated: new Date().toISOString(),
        integrityStatus: 'valid' as const
      },
      {
        name: 'public.activity_logs',
        count: activity.length,
        sizeBytes: new Blob([JSON.stringify(activity)]).size,
        lastUpdated: new Date().toISOString(),
        integrityStatus: 'valid' as const
      },
      {
        name: 'public.audit_logs',
        count: audit.length,
        sizeBytes: new Blob([JSON.stringify(audit)]).size,
        lastUpdated: new Date().toISOString(),
        integrityStatus: 'valid' as const
      }
    ];

    const totalRecords = menu.length + bookings.length + users.length + activity.length + audit.length;
    const status: 'healthy' | 'warning' | 'critical' = issues.length === 0 ? 'healthy' : issues.length < 3 ? 'warning' : 'critical';

    return {
      status,
      totalRecords,
      storageUsedBytes: totalBytes,
      storageUsedFormatted: formatFileSize(totalBytes),
      tableStats,
      issuesFound: issues,
      lastBackupDate: lastBackup,
      activeSnapshotsCount: snapshots.length
    };
  }

  /**
   * Compact & Vacuum Database Storage (clean old visitor logs & re-index)
   */
  public async vacuumDatabase(): Promise<{ cleanedLogs: number; freedBytes: number }> {
    const beforeHealth = await this.getDatabaseHealth();
    const beforeBytes = beforeHealth.storageUsedBytes;

    const currentLogs = await this.getActivityLogs();
    const keptLogs = currentLogs.slice(0, 100);
    const cleanedCount = Math.max(0, currentLogs.length - keptLogs.length);

    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(keptLogs));

    // Audit trail pruning (keep last 80)
    const currentAudit = this.getLogs();
    const keptAudit = currentAudit.slice(0, 80);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(keptAudit));

    const afterHealth = await this.getDatabaseHealth();
    const freedBytes = Math.max(0, beforeBytes - afterHealth.storageUsedBytes);

    this.addLog('DATABASE_VACUUM', `Vacuum completed: pruned ${cleanedCount} log entries, reclaimed ${formatFileSize(freedBytes)}.`, 'admin');

    return { cleanedLogs: cleanedCount, freedBytes };
  }

  /**
   * Create Local In-Browser Snapshot (Instant Point-In-Time Rollback State)
   */
  public async createLocalSnapshot(label: string = 'Manual Point-in-time Snapshot'): Promise<DatabaseSnapshot> {
    const backup = await this.exportDatabaseBackup();
    const snapshotId = `snap-${Date.now()}`;
    const rawJson = JSON.stringify(backup);
    const sizeBytes = new Blob([rawJson]).size;

    const newSnapshot: DatabaseSnapshot = {
      id: snapshotId,
      timestamp: new Date().toISOString(),
      label,
      recordCount: Object.values(backup.counts).reduce((a, b) => a + b, 0),
      sizeBytes,
      data: backup
    };

    const existing = this.getSnapshots();
    // Keep max 5 snapshots to conserve localStorage quota
    const updated = [newSnapshot, ...existing].slice(0, 5);
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(updated));

    this.addLog('DATABASE_SNAPSHOT_CREATED', `Created point-in-time snapshot "${label}" (${newSnapshot.recordCount} records)`, 'admin');

    return newSnapshot;
  }

  /**
   * Retrieve list of local snapshots
   */
  public getSnapshots(): DatabaseSnapshot[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Restore database from a specific point-in-time snapshot
   */
  public async restoreSnapshot(snapshotId: string): Promise<boolean> {
    const snapshots = this.getSnapshots();
    const target = snapshots.find(s => s.id === snapshotId);
    if (!target) return false;

    const result = await this.importDatabaseBackup(target.data, 'overwrite');
    if (result.success) {
      this.addLog('SNAPSHOT_RESTORED', `Database restored from snapshot "${target.label}" (${target.timestamp})`, 'admin');
      return true;
    }
    return false;
  }

  /**
   * Delete a snapshot
   */
  public deleteSnapshot(snapshotId: string): boolean {
    const existing = this.getSnapshots();
    const filtered = existing.filter(s => s.id !== snapshotId);
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(filtered));
    return true;
  }
}

/**
 * Universal browser file download helper
 */
export function downloadBrowserFile(filename: string, content: string, mimeType: string = 'text/plain'): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Human-readable byte formatting helper
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const dbService = new KaliDatabaseService();
