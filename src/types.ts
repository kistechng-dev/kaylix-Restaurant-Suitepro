export type EditionType = 'trial' | 'basic' | 'standard' | 'enterprise';
export type OrderEditionType = EditionType | 'none';

export type DurationTier = '1_year' | '3_years' | 'lifetime' | '7_days';

export interface PricingPlan {
  tier: DurationTier;
  label: string;
  periodText: string;
  priceNGN: number;
  priceUSD: number;
  validityDays: number; // 0 for lifetime, 7 for trial, 365 for 1 yr, 1095 for 3 yr
  savingsBadge?: string;
}

export interface EditionDetail {
  id: EditionType;
  name: string;
  badge: string;
  tagline: string;
  defaultTier: DurationTier;
  plans: Record<string, PricingPlan>;
  terminals: string;
  idealFor: string;
  features: string[];
  limitations?: string[];
  installerFileName: string;
  fileSize: string;
  checksum: string;
  version: string;
  isPopular?: boolean;
  googleDriveUrl?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode?: string;
  swiftCode?: string;
  ussdCode: string;
  currency: 'NGN' | 'USD';
  bankBranch?: string;
  accentColor: string;
  isPrimary?: boolean;
}

export type HardwareCategory = 'printer' | 'scanner' | 'drawer' | 'tablet' | 'terminal' | 'handheld' | 'display' | 'accessory';
export type HardwareAvailability = 'in_stock' | 'low_stock' | 'pre_order' | 'out_of_stock';

export interface HardwareAddon {
  id: string;
  name: string;
  category: HardwareCategory;
  priceNGN: number;
  priceUSD: number;
  description: string;
  specs: string;
  availability?: HardwareAvailability;
  badge?: string;
  isFeatured?: boolean;
}

export interface OrderFormData {
  customerName: string;
  businessName: string;
  phone: string;
  email: string;
  cityState: string;
  edition: OrderEditionType;
  durationTier: DurationTier;
  selectedAddons: string[];
  deploymentType: 'remote' | 'self' | 'onsite';
  paymentMethod: 'bank_transfer' | 'card' | 'cash';
  notes: string;
}

export interface LicenseParams {
  businessName: string;
  clientPhone?: string;
  edition: EditionType;
  hwid: string;
  validityDays: number; // 0 for lifetime
  terminalLimit: number;
  modules: {
    posTerminal: boolean;
    kitchenDisplay: boolean;
    recipeCosting: boolean;
    waiterApp: boolean;
    multiBranch: boolean;
    cloudSync: boolean;
    smsWhatsappAlerts: boolean;
  };
  resellerName: string;
  notes?: string;
}

export interface GeneratedLicense {
  licenseKey: string;
  serialNumber: string;
  businessName: string;
  edition: EditionType;
  hwid: string;
  terminals: number;
  issuedAt: string;
  expiresAt: string;
  isLifetime: boolean;
  modules: string[];
  checksum: string;
  rawPayload: string;
  durationLabel?: string;
}

export interface LicenseValidationResult {
  isValid: boolean;
  edition?: EditionType;
  businessName?: string;
  hwid?: string;
  expiresAt?: string;
  isLifetime?: boolean;
  terminals?: number;
  modules?: string[];
  error?: string;
}

export interface CustomerRecord {
  id: string;
  customerName: string;
  businessName: string;
  phone: string;
  email: string;
  cityState: string;
  packageSubscribed: string;
  edition: OrderEditionType;
  durationTier: DurationTier;
  tenureLabel: string;
  amountPaid: number;
  currency: 'NGN' | 'USD';
  licenseCode: string;
  status: 'pending' | 'confirmed' | 'active' | 'expired';
  selectedAddons?: string[];
  deploymentType?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
