/**
 * Kali Luxury Restaurant - Activity Logger & Console Middleware
 * Logs system, client, and patron events to console and Supabase activity_logs table.
 */
import { ActivityLog } from '../types';
import { dbService } from './db';

// Cache for client IP address
let cachedClientIp: string | null = null;

/**
 * Format timestamp to clean [YYYY-MM-DD HH:mm:ss]
 */
export function formatLoggerTime(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parses user agent string into friendly browser and OS labels
 */
export function parseBrowser(ua: string): { name: string; icon: string; os: string } {
  if (!ua || ua === 'Unknown') {
    return { name: 'Unknown Browser', icon: 'Globe', os: 'Unknown OS' };
  }

  let os = 'Unknown OS';
  if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/iPhone/i.test(ua)) os = 'iOS (iPhone)';
  else if (/iPad/i.test(ua)) os = 'iPadOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let name = 'Web Browser';
  let icon = 'Globe';
  if (/Edg\//i.test(ua)) {
    const match = ua.match(/Edg\/(\d+)/);
    name = `Edge ${match ? match[1] : ''}`;
    icon = 'Compass';
  } else if (/Chrome\//i.test(ua) && !/Chromium|Edg/i.test(ua)) {
    const match = ua.match(/Chrome\/(\d+)/);
    name = `Chrome ${match ? match[1] : ''}`;
    icon = 'Chrome';
  } else if (/Safari\//i.test(ua) && !/Chrome|Chromium/i.test(ua)) {
    const match = ua.match(/Version\/(\d+)/);
    name = `Safari ${match ? match[1] : ''}`;
    icon = 'Compass';
  } else if (/Firefox\//i.test(ua)) {
    const match = ua.match(/Firefox\/(\d+)/);
    name = `Firefox ${match ? match[1] : ''}`;
    icon = 'Globe';
  } else if (/Opera|OPR\//i.test(ua)) {
    name = 'Opera';
    icon = 'Globe';
  }

  return { name: `${name} (${os})`, icon, os };
}

/**
 * Get or detect genuine client IP address using public lookups
 */
export async function getClientIp(): Promise<string> {
  if (cachedClientIp) return cachedClientIp;
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('kali_client_ip');
      if (stored && stored !== '192.168.1.105') {
        cachedClientIp = stored;
        return stored;
      }
    } catch {
      // ignore
    }
  }

  // Primary: ipify IPv4/IPv6
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('https://api64.ipify.org?format=json', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip) {
        cachedClientIp = data.ip;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('kali_client_ip', data.ip);
        }
        return data.ip;
      }
    }
  } catch {
    // try secondary
  }

  // Secondary: icanhazip
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch('https://icanhazip.com', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const text = (await res.text()).trim();
      if (text && text.length >= 7 && text.length <= 45) {
        cachedClientIp = text;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('kali_client_ip', text);
        }
        return text;
      }
    }
  } catch {
    // fallback to runtime host
  }

  // Authentic local browser hostname/connection identification (no fake hardcoded IP)
  const hostIdentity = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? '127.0.0.1'
        : window.location.hostname || 'Client Connected')
    : '127.0.0.1';

  cachedClientIp = hostIdentity;
  return hostIdentity;
}

/**
 * Console Logger Middleware:
 * Prints format: [TIME] [IP] [ACTION]
 */
export function consoleLoggerMiddleware(timeStr: string, ip: string, action: string, pageUrl?: string) {
  const logMessage = `[${timeStr}] [${ip}] [${action}]`;
  if (typeof window !== 'undefined' && console && console.log) {
    console.log(
      `%c[${timeStr}] %c[${ip}] %c[${action}]` + (pageUrl ? ` %c(${pageUrl})` : ''),
      'color: #888; font-weight: normal;',
      'color: #38bdf8; font-weight: bold;',
      'color: #10b981; font-weight: bold;',
      'color: #a1a1aa; font-style: italic;'
    );
  } else {
    console.log(logMessage);
  }
}

let lastVisitedPage = '';
let lastVisitedTime = 0;

/**
 * Captures basic visitor information (Real IP and Time) ONLY when visiting the website or pages.
 * Does not record what the user types or keystrokes.
 */
export async function logVisitorVisit(page_url: string): Promise<ActivityLog | null> {
  const currentUrl = page_url || (typeof window !== 'undefined'
    ? (window.location.pathname + (window.location.hash || '')) || '/'
    : '/');

  const nowTime = Date.now();
  // Throttle logging for the same page within 3 seconds to avoid duplicate re-render spam
  if (lastVisitedPage === currentUrl && (nowTime - lastVisitedTime) < 3000) {
    return null;
  }
  lastVisitedPage = currentUrl;
  lastVisitedTime = nowTime;

  const now = new Date();
  const timeFormatted = formatLoggerTime(now);
  const ip = await getClientIp();
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client';
  const pageLabel = currentUrl === '/' || currentUrl === '/home' ? 'Home' : currentUrl.replace('/', '').toUpperCase();

  consoleLoggerMiddleware(timeFormatted, ip, `VISIT: ${pageLabel}`, currentUrl);

  const newLog: ActivityLog = {
    id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ip_address: ip,
    page_url: currentUrl,
    action: `Website Visit: ${currentUrl}`,
    user_agent: userAgent,
    created_at: now.toISOString(),
    user_identity: 'Website Visitor'
  };

  try {
    await dbService.addActivityLog(newLog);
  } catch (err) {
    console.warn('Failed to persist visitor log:', err);
  }

  // Dispatch real-time live event for instant UI streaming
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kali-live-activity', { detail: newLog }));
  }

  return newLog;
}

/**
 * Activity Logging Function for security access points
 */
export async function logActivity(action: string, page_url?: string, user_identity?: string): Promise<ActivityLog> {
  const now = new Date();
  const timeFormatted = formatLoggerTime(now);
  const ip = await getClientIp();
  const currentUrl = page_url || (typeof window !== 'undefined'
    ? (window.location.pathname + (window.location.hash || '')) || '/'
    : '/');
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Server/Node Environment';

  consoleLoggerMiddleware(timeFormatted, ip, action, currentUrl);

  const newLog: ActivityLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ip_address: ip,
    page_url: currentUrl,
    action: action.trim(),
    user_agent: userAgent,
    created_at: now.toISOString(),
    user_identity: user_identity || (typeof window !== 'undefined' && sessionStorage.getItem('kali_current_user_name') || 'Guest Visitor')
  };

  try {
    await dbService.addActivityLog(newLog);
  } catch (err) {
    console.warn('Failed to persist activity log:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kali-live-activity', { detail: newLog }));
  }

  return newLog;
}

if (typeof window !== 'undefined') {
  (window as unknown as { logActivity: typeof logActivity }).logActivity = logActivity;
  (window as unknown as { logVisitorVisit: typeof logVisitorVisit }).logVisitorVisit = logVisitorVisit;
}


