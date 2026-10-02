import { EDITIONS, HARDWARE_ADDONS } from '../data/mockData';
import { EditionDetail, HardwareAddon, HardwareAvailability, HardwareCategory } from '../types';

export interface PlanTierPrice {
  priceNGN: number;
  priceUSD: number;
}

export interface StaffAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'admin' | 'store_manager' | 'pricing_officer';
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface PricingAuditLogEntry {
  id: string;
  timestamp: string;
  formattedDate: string;
  username: string;
  role: string;
  staffName: string;
  action: 'price_update' | 'hardware_added' | 'hardware_updated' | 'hardware_deleted' | 'fx_rate_update' | 'staff_created' | 'factory_reset';
  summary: string;
  details?: string;
}

export interface PricingConfig {
  blackMarketRateNGN: number;
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

export const INITIAL_HARDWARE_ITEMS: HardwareAddon[] = [
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

export const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
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

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  blackMarketRateNGN: 1620, // ₦1,620 / $1
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
  hardwareItems: INITIAL_HARDWARE_ITEMS,
  auditLog: [],
  staffAccounts: INITIAL_STAFF_ACCOUNTS,
  updatedAt: new Date().toISOString(),
  updatedBy: 'Chief Systems Administrator',
  updatedByRole: 'admin',
};

const STORAGE_KEY = 'kaylix_custom_pricing_v2';
const USER_SESSION_KEY = 'kaylix_staff_session_v1';

// Convert Naira to USD via Black Market parallel rate
export function calculateDollarFromNaira(naira: number, fxRate: number): number {
  if (naira <= 0 || fxRate <= 0) return 0;
  const raw = naira / fxRate;
  return Math.max(1, Math.round(raw));
}

export function getCurrentStaffSession(): StaffAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {}
  // Default to Lead Admin if not logged out
  return INITIAL_STAFF_ACCOUNTS[0];
}

export function setStaffSession(staff: StaffAccount | null) {
  if (typeof window === 'undefined') return;
  if (!staff) {
    localStorage.removeItem(USER_SESSION_KEY);
  } else {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(staff));
  }
}

export function getCustomPricing(): PricingConfig {
  if (typeof window === 'undefined') return DEFAULT_PRICING_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PRICING_CONFIG,
        ...parsed,
        blackMarketRateNGN: parsed.blackMarketRateNGN || DEFAULT_PRICING_CONFIG.blackMarketRateNGN,
        autoSyncUSD: parsed.autoSyncUSD ?? DEFAULT_PRICING_CONFIG.autoSyncUSD,
        plans: {
          basic: { ...DEFAULT_PRICING_CONFIG.plans.basic, ...parsed?.plans?.basic },
          standard: { ...DEFAULT_PRICING_CONFIG.plans.standard, ...parsed?.plans?.standard },
          enterprise: { ...DEFAULT_PRICING_CONFIG.plans.enterprise, ...parsed?.plans?.enterprise },
        },
        hardwareItems: Array.isArray(parsed?.hardwareItems) && parsed.hardwareItems.length > 0
          ? parsed.hardwareItems
          : INITIAL_HARDWARE_ITEMS,
        auditLog: Array.isArray(parsed?.auditLog) ? parsed.auditLog : [],
        staffAccounts: Array.isArray(parsed?.staffAccounts) && parsed.staffAccounts.length > 0
          ? parsed.staffAccounts
          : INITIAL_STAFF_ACCOUNTS,
      };
    }
  } catch (err) {
    console.error('Failed to read custom pricing from localStorage', err);
  }
  return DEFAULT_PRICING_CONFIG;
}

export function getEffectiveEditions(): Record<string, EditionDetail> {
  const custom = getCustomPricing();
  const cloned: Record<string, EditionDetail> = JSON.parse(JSON.stringify(EDITIONS));

  (['basic', 'standard', 'enterprise'] as const).forEach((planKey) => {
    if (cloned[planKey]?.plans && custom.plans[planKey]) {
      const tiers = custom.plans[planKey];
      if (cloned[planKey].plans['1_year'] && tiers['1_year']) {
        cloned[planKey].plans['1_year'].priceNGN = tiers['1_year'].priceNGN;
        cloned[planKey].plans['1_year'].priceUSD = tiers['1_year'].priceUSD;
      }
      if (cloned[planKey].plans['3_years'] && tiers['3_years']) {
        cloned[planKey].plans['3_years'].priceNGN = tiers['3_years'].priceNGN;
        cloned[planKey].plans['3_years'].priceUSD = tiers['3_years'].priceUSD;
      }
      if (cloned[planKey].plans['lifetime'] && tiers['lifetime']) {
        cloned[planKey].plans['lifetime'].priceNGN = tiers['lifetime'].priceNGN;
        cloned[planKey].plans['lifetime'].priceUSD = tiers['lifetime'].priceUSD;
      }
    }
  });

  return cloned;
}

export function getEffectiveHardware(): HardwareAddon[] {
  const custom = getCustomPricing();
  return custom.hardwareItems && custom.hardwareItems.length > 0
    ? custom.hardwareItems
    : INITIAL_HARDWARE_ITEMS;
}

export async function savePricing(
  updated: PricingConfig,
  userSession?: { username: string; role: string; name: string },
  actionType: PricingAuditLogEntry['action'] = 'price_update',
  actionSummary?: string
): Promise<PricingConfig> {
  const now = new Date();
  const session = userSession || {
    username: 'admin',
    role: 'admin',
    name: 'Chief Systems Administrator',
  };

  const newLogEntry: PricingAuditLogEntry = {
    id: `LOG-${Date.now()}`,
    timestamp: now.toISOString(),
    formattedDate: now.toLocaleString('en-GB', {
      timeZone: 'Africa/Lagos',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ' WAT',
    username: session.username,
    role: session.role,
    staffName: session.name,
    action: actionType,
    summary: actionSummary || `Updated pricing matrix at FX: ₦${updated.blackMarketRateNGN}/$`,
  };

  const toSave: PricingConfig = {
    ...updated,
    auditLog: [newLogEntry, ...(updated.auditLog || [])].slice(0, 100),
    updatedAt: now.toISOString(),
    updatedBy: session.name,
    updatedByRole: session.role,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    window.dispatchEvent(new CustomEvent('kaylix_pricing_updated', { detail: toSave }));
  }

  try {
    const res = await fetch('/api/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pricing: toSave,
        userSession: session,
        actionType,
        actionSummary,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.pricing) {
        return data.pricing;
      }
    }
  } catch (err) {
    console.warn('Could not sync pricing to server (offline or preview mode):', err);
  }

  return toSave;
}

export async function resetPricingToDefaults(
  userSession?: { username: string; role: string; name: string }
): Promise<PricingConfig> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('kaylix_pricing_updated', { detail: DEFAULT_PRICING_CONFIG }));
  }

  try {
    const res = await fetch('/api/pricing/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminSession: userSession }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.pricing) {
        return data.pricing;
      }
    }
  } catch (err) {
    console.warn('Could not reset pricing on server:', err);
  }

  return DEFAULT_PRICING_CONFIG;
}

export async function syncPricingWithServer(): Promise<PricingConfig> {
  try {
    const res = await fetch('/api/pricing');
    if (res.ok) {
      const data = await res.json();
      if (data?.pricing) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.pricing));
          window.dispatchEvent(new CustomEvent('kaylix_pricing_updated', { detail: data.pricing }));
        }
        return data.pricing;
      }
    }
  } catch (err) {}
  return getCustomPricing();
}
