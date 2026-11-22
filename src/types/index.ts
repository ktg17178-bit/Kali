export type MenuCategory = 
  | 'Offensive Tools' 
  | 'Defensive Ops' 
  | 'Zero-Day Labs' 
  | 'Hardware Security' 
  | 'Veg' 
  | 'Non-Veg' 
  | 'Desserts' 
  | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image_url: string;
  is_special: boolean;
  calories?: number;
  prep_time?: string;
  allergens?: string[];
  is_available?: boolean;
  wine_pairing?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seating_preference?: string;
  special_requests?: string;
  status: BookingStatus;
  created_at: string;
  table_number?: string;
  vip_level?: string;
}

export type UserRole = 'admin' | 'staff' | 'vip_patron' | 'member';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: UserRole;
  phone?: string;
  registered_at: string;
  loyalty_tier?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  ip_address: string;
  page_url: string;
  action: string;
  user_agent: string;
  created_at: string;
  user_identity?: string;
  session_id?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialNote?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastTested?: string;
}

export interface AdminSecurityConfig {
  customPasswordHash?: string;
  requirePasswordEverySession: boolean;
  autoLockMinutes: number;
  lastPasswordChange?: string;
}

export interface DatabaseBackup {
  schema_version: string;
  exported_at: string;
  checksum: string;
  system: string;
  counts: {
    menu_items: number;
    bookings: number;
    users: number;
    activity_logs: number;
    audit_logs: number;
  };
  data: {
    menu_items: MenuItem[];
    bookings: Booking[];
    users: User[];
    activity_logs: ActivityLog[];
    audit_logs: AuditLog[];
    admin_config?: AdminSecurityConfig;
  };
}

export interface DatabaseHealthReport {
  status: 'healthy' | 'warning' | 'critical';
  totalRecords: number;
  storageUsedBytes: number;
  storageUsedFormatted: string;
  tableStats: Array<{
    name: string;
    count: number;
    sizeBytes: number;
    lastUpdated: string;
    integrityStatus: 'valid' | 'corrupt';
  }>;
  issuesFound: string[];
  lastBackupDate?: string;
  activeSnapshotsCount: number;
}

export interface DatabaseSnapshot {
  id: string;
  timestamp: string;
  label: string;
  recordCount: number;
  sizeBytes: number;
  data: DatabaseBackup;
}
