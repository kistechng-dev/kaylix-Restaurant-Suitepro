import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HardwareAddon } from '../src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const PRICING_FILE = path.join(DATA_DIR, 'pricing.json');

export interface PlanTierPrice {
  priceNGN: number;
  priceUSD: number;
}

export interface StaffAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'store_manager' | 'pricing_officer';
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface PricingAuditLogEntry {
  id: string;
  timestamp: string; // ISO
  formattedDate: string; // WAT format
  username: string;
  role: string;
  staffName: string;
  action: 'price_update' | 'hardware_added' | 'hardware_updated' | 'hardware_deleted' | 'fx_rate_update' | 'staff_created' | 'factory_reset';
  summary: string;
  details?: string;
}

export interface PricingConfig {
  blackMarketRateNGN: number; // e.g. 1620 (Naira per $1 USD)
  autoSyncUSD: boolean;
  plans: {
    basic: {
      '1_year': PlanTierPrice;
      '3_years': PlanTierPrice;
      'lifetime': PlanTierPrice;
    };
    standard: {
      '1_year': PlanTierPrice;
      '3_years': PlanTierPrice;
      'lifetime': PlanTierPrice;
    };
    enterprise: {
      '1_year': PlanTierPrice;
      '3_years': PlanTierPrice;
      'lifetime': PlanTierPrice;
    };
  };
  hardwareItems: HardwareAddon[];
  auditLog: PricingAuditLogEntry[];
  staffAccounts: StaffAccount[];
  updatedAt: string;
  updatedBy: string;
  updatedByRole: string;
}

// Initial default hardware addons with availability & new tech
export const DEFAULT_HARDWARE_ITEMS: HardwareAddon[] = [
  {
    id: 'thermal-printer-80mm',
    name: '80mm High-Speed Thermal Receipt & Kitchen Printer',
    category: 'printer',
    priceNGN: 48000,
    priceUSD: 30,
    description: 'Auto-cutter, USB + Ethernet LAN interface for kitchen ticket alerts, 260mm/s ultra fast.',
    specs: 'Direct thermal, 80mm paper, LAN + USB, buzzer alert for new orders.',
    availability: 'in_stock',
    badge: 'Fast 260mm/s',
    isFeatured: true,
  },
  {
    id: 'barcode-scanner-2d',
    name: 'Hands-Free 2D QR & Barcode Desktop Scanner',
    category: 'scanner',
    priceNGN: 32000,
    priceUSD: 20,
    description: 'Omnidirectional high-speed scanning for pre-packaged meals, drinks, and customer loyalty cards.',
    specs: 'USB plug-and-play, scans phone screens & crinkled labels.',
    availability: 'in_stock',
    badge: 'Instant QR Scan',
  },
  {
    id: 'cash-drawer-rj11',
    name: 'Heavy-Duty 5-Bill Steel Cash Drawer',
    category: 'drawer',
    priceNGN: 38000,
    priceUSD: 23,
    description: 'Auto-kick RJ11 trigger connected to thermal printer, metal rollers, dual security keylock.',
    specs: '5 bill trays, 8 coin cups, 2 media slots for transfer receipts.',
    availability: 'in_stock',
    badge: 'Auto-Kick Metal',
  },
  {
    id: 'touch-terminal-pos',
    name: '15.6" All-in-One Commercial Touchscreen POS Terminal',
    category: 'terminal',
    priceNGN: 240000,
    priceUSD: 148,
    description: 'Industrial spill-resistant true-flat touchscreen PC, Intel Core processor, 8GB RAM, 128GB SSD.',
    specs: 'Full HD 1080p, aluminium die-cast base, Windows 11 Pro pre-installed.',
    availability: 'in_stock',
    badge: 'Aluminium Die-Cast',
    isFeatured: true,
  },
  {
    id: 'waiter-tablet-10',
    name: '10.1" Rugged Android Waiter Mobile Order Tablet',
    category: 'tablet',
    priceNGN: 95000,
    priceUSD: 59,
    description: 'Handheld tablet for table-side ordering with shockproof silicone bumper and hand-strap.',
    specs: '6000mAh all-day battery, Dual-band WiFi, 4GB RAM + 64GB storage.',
    availability: 'in_stock',
    badge: '6000mAh Battery',
  },
  {
    id: 'sunmi-v2-pro-4g',
    name: 'Sunmi V2 Pro 4G Smart Handheld POS & Thermal Printer',
    category: 'handheld',
    priceNGN: 165000,
    priceUSD: 102,
    description: 'Next-gen wireless mobile POS with built-in 58mm Seiko printer, 4G LTE SIM slot, GPS, and NFC contactless.',
    specs: '5.5" HD+ IPS screen, Android 13, 4G + WiFi, 2580mAh rechargeable battery.',
    availability: 'in_stock',
    badge: 'New 4G Technology',
    isFeatured: true,
  },
  {
    id: 'kds-screen-15',
    name: '15.6" Commercial Kitchen Order Display Screen (KDS)',
    category: 'display',
    priceNGN: 135000,
    priceUSD: 83,
    description: 'Wall-mountable high-durability kitchen screen for cook order status, bump bar pass, and order timing.',
    specs: 'Anti-grease coating, VESA mount, HDMI/LAN input, silent fanless cooling.',
    availability: 'in_stock',
    badge: 'Zero-Delay Kitchen Pass',
  },
];

// Predefined Staff Accounts
export const DEFAULT_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'STAFF-001',
    username: 'admin',
    password: 'Admin@Kaylix2026',
    name: 'Chief Systems Administrator',
    role: 'admin',
    phone: '234 806 0395 329',
    createdAt: '2026-10-01T08:00:00.000Z',
    isActive: true,
  },
  {
    id: 'STAFF-002',
    username: 'store_manager',
    password: 'Store@Kaylix2026',
    name: 'Central Warehouse & Store Manager',
    role: 'store_manager',
    phone: '234 806 0395 329',
    createdAt: '2026-10-01T08:00:00.000Z',
    isActive: true,
  },
  {
    id: 'STAFF-003',
    username: 'pricing_desk',
    password: 'Desk@Kaylix2026',
    name: 'Commercial Pricing & FX Officer',
    role: 'pricing_officer',
    phone: '234 806 0395 329',
    createdAt: '2026-10-01T08:00:00.000Z',
    isActive: true,
  },
];

export const DEFAULT_PRICING: PricingConfig = {
  blackMarketRateNGN: 1620, // ₦1,620 per $1 USD Nigeria Parallel Market
  autoSyncUSD: true,
  plans: {
    basic: {
      '1_year': { priceNGN: 10000, priceUSD: 6 },
      '3_years': { priceNGN: 28000, priceUSD: 17 },
      'lifetime': { priceNGN: 60000, priceUSD: 37 },
    },
    standard: {
      '1_year': { priceNGN: 20000, priceUSD: 12 },
      '3_years': { priceNGN: 57000, priceUSD: 35 },
      'lifetime': { priceNGN: 100000, priceUSD: 62 },
    },
    enterprise: {
      '1_year': { priceNGN: 60000, priceUSD: 37 },
      '3_years': { priceNGN: 150000, priceUSD: 93 },
      'lifetime': { priceNGN: 250000, priceUSD: 154 },
    },
  },
  hardwareItems: DEFAULT_HARDWARE_ITEMS,
  auditLog: [
    {
      id: 'LOG-INIT-001',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      formattedDate: formatWatDate(new Date(Date.now() - 3600000 * 24)),
      username: 'admin',
      role: 'admin',
      staffName: 'Chief Systems Administrator',
      action: 'price_update',
      summary: 'Initialized official Naira pricing matrix pegged to Nigeria Parallel Market ($1 = ₦1,620).',
    },
    {
      id: 'LOG-INIT-002',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      formattedDate: formatWatDate(new Date(Date.now() - 3600000 * 12)),
      username: 'store_manager',
      role: 'store_manager',
      staffName: 'Central Warehouse & Store Manager',
      action: 'hardware_added',
      summary: 'Provisioned Sunmi V2 Pro 4G Handheld POS and 15.6" KDS Display into active hardware inventory.',
    },
  ],
  staffAccounts: DEFAULT_STAFF_ACCOUNTS,
  updatedAt: new Date().toISOString(),
  updatedBy: 'Chief Systems Administrator',
  updatedByRole: 'admin',
};

function formatWatDate(d: Date): string {
  // WAT is UTC+1
  return d.toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }) + ' WAT';
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getPricingConfig(): PricingConfig {
  ensureDataDir();
  try {
    if (fs.existsSync(PRICING_FILE)) {
      const raw = fs.readFileSync(PRICING_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PRICING,
        ...parsed,
        blackMarketRateNGN: parsed.blackMarketRateNGN || DEFAULT_PRICING.blackMarketRateNGN,
        autoSyncUSD: parsed.autoSyncUSD ?? DEFAULT_PRICING.autoSyncUSD,
        plans: {
          basic: { ...DEFAULT_PRICING.plans.basic, ...parsed?.plans?.basic },
          standard: { ...DEFAULT_PRICING.plans.standard, ...parsed?.plans?.standard },
          enterprise: { ...DEFAULT_PRICING.plans.enterprise, ...parsed?.plans?.enterprise },
        },
        hardwareItems: Array.isArray(parsed?.hardwareItems) && parsed.hardwareItems.length > 0
          ? parsed.hardwareItems
          : DEFAULT_HARDWARE_ITEMS,
        auditLog: Array.isArray(parsed?.auditLog) ? parsed.auditLog : DEFAULT_PRICING.auditLog,
        staffAccounts: Array.isArray(parsed?.staffAccounts) && parsed.staffAccounts.length > 0
          ? parsed.staffAccounts
          : DEFAULT_STAFF_ACCOUNTS,
      };
    }
  } catch (err) {
    console.error('Error reading pricing.json:', err);
  }
  return DEFAULT_PRICING;
}

export function updatePricingConfig(
  updates: Partial<PricingConfig>,
  userSession?: { username: string; role: string; name: string },
  actionType: PricingAuditLogEntry['action'] = 'price_update',
  actionSummary?: string
): PricingConfig {
  ensureDataDir();
  const current = getPricingConfig();
  const now = new Date();

  const username = userSession?.username || 'admin';
  const role = userSession?.role || 'admin';
  const staffName = userSession?.name || 'Staff User';

  // Calculate new audit log entry
  const newAuditEntry: PricingAuditLogEntry = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: now.toISOString(),
    formattedDate: formatWatDate(now),
    username,
    role,
    staffName,
    action: actionType,
    summary: actionSummary || `Updated pricing & inventory settings (FX: ₦${updates.blackMarketRateNGN || current.blackMarketRateNGN}/$).`,
  };

  const updatedLog = [newAuditEntry, ...current.auditLog].slice(0, 100); // keep last 100 entries

  const updated: PricingConfig = {
    ...current,
    ...updates,
    blackMarketRateNGN: updates.blackMarketRateNGN ?? current.blackMarketRateNGN,
    autoSyncUSD: updates.autoSyncUSD ?? current.autoSyncUSD,
    plans: {
      basic: { ...current.plans.basic, ...updates?.plans?.basic },
      standard: { ...current.plans.standard, ...updates?.plans?.standard },
      enterprise: { ...current.plans.enterprise, ...updates?.plans?.enterprise },
    },
    hardwareItems: updates.hardwareItems || current.hardwareItems,
    auditLog: updatedLog,
    staffAccounts: updates.staffAccounts || current.staffAccounts,
    updatedAt: now.toISOString(),
    updatedBy: staffName,
    updatedByRole: role,
  };

  fs.writeFileSync(PRICING_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export function verifyStaffCredentials(username: string, password: string): StaffAccount | null {
  const config = getPricingConfig();
  const account = config.staffAccounts.find(
    (acc) => acc.username.toLowerCase() === username.trim().toLowerCase() && acc.isActive
  );
  if (account && account.password === password.trim()) {
    // Update last login
    account.lastLogin = new Date().toISOString();
    updatePricingConfig({ staffAccounts: config.staffAccounts }, {
      username: account.username,
      role: account.role,
      name: account.name,
    }, 'price_update', `Staff member ${account.name} (@${account.username}) logged in.`);
    return account;
  }
  return null;
}

export function createStaffAccount(newStaff: Omit<StaffAccount, 'id' | 'createdAt' | 'isActive'>, adminSession: { username: string; role: string; name: string }): StaffAccount {
  const config = getPricingConfig();
  const created: StaffAccount = {
    id: `STAFF-${Date.now().toString().slice(-4)}`,
    username: newStaff.username.trim().toLowerCase(),
    password: newStaff.password.trim(),
    name: newStaff.name.trim(),
    role: newStaff.role,
    phone: newStaff.phone?.trim() || '234 806 0395 329',
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  const updatedAccounts = [...config.staffAccounts.filter(a => a.username !== created.username), created];
  updatePricingConfig(
    { staffAccounts: updatedAccounts },
    adminSession,
    'staff_created',
    `Created new staff credentials for ${created.name} (@${created.username}) with role: ${created.role}.`
  );

  return created;
}

export function resetPricingConfig(adminSession?: { username: string; role: string; name: string }): PricingConfig {
  ensureDataDir();
  const now = new Date();
  const resetLogEntry: PricingAuditLogEntry = {
    id: `LOG-${Date.now()}`,
    timestamp: now.toISOString(),
    formattedDate: formatWatDate(now),
    username: adminSession?.username || 'admin',
    role: adminSession?.role || 'admin',
    staffName: adminSession?.name || 'Administrator',
    action: 'factory_reset',
    summary: 'Restored pricing matrix, Black Market FX rate, and hardware items to factory defaults.',
  };

  const resetConfig: PricingConfig = {
    ...DEFAULT_PRICING,
    auditLog: [resetLogEntry, ...DEFAULT_PRICING.auditLog],
    updatedAt: now.toISOString(),
    updatedBy: adminSession?.name || 'Factory Default Reset',
    updatedByRole: adminSession?.role || 'admin',
  };

  fs.writeFileSync(PRICING_FILE, JSON.stringify(resetConfig, null, 2), 'utf-8');
  return resetConfig;
}

export function exportAuditLogCsv(): string {
  const config = getPricingConfig();
  const headers = ['ID', 'Timestamp (WAT)', 'Username', 'Staff Name', 'Role', 'Action Type', 'Summary'];
  const rows = config.auditLog.map((entry) => [
    `"${entry.id}"`,
    `"${entry.formattedDate}"`,
    `"${entry.username}"`,
    `"${entry.staffName}"`,
    `"${entry.role}"`,
    `"${entry.action}"`,
    `"${(entry.summary || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
