import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EditionType, DurationTier, CustomerRecord } from '../src/types.ts';
import { generateServerMasterKey } from './licenseService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Seed records to showcase realistic eatery operations
const INITIAL_SEEDS: CustomerRecord[] = [
  {
    id: 'KYLX-REC-1001',
    customerName: 'Alhaji Musa Ibrahim',
    businessName: 'Arewa Palace Restaurant & Grills',
    phone: '234 806 0395 329',
    email: 'musa.ibrahim@arewapalace.ng',
    cityState: 'Wuse 2, Abuja',
    packageSubscribed: 'Enterprises Package',
    edition: 'enterprise',
    durationTier: 'lifetime',
    tenureLabel: 'Perpetual Lifetime',
    amountPaid: 200000,
    currency: 'NGN',
    licenseCode: 'ENTR-9B41D-5F72A-LF-9E41',
    status: 'active',
    selectedAddons: ['thermal-printer-80mm', 'cash-drawer-rj11', 'barcode-scanner-2d'],
    deploymentType: 'onsite',
    paymentMethod: 'bank_transfer',
    notes: 'Full multi-counter setup with VIP lounge and central kitchen KDS.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'KYLX-REC-1002',
    customerName: 'Chief Emeka Okonkwo',
    businessName: 'Native Pot Eateries Ltd',
    phone: '234 806 0395 329',
    email: 'emekapot@nativepoteatery.com',
    cityState: 'Victoria Island, Lagos',
    packageSubscribed: 'Standard Package',
    edition: 'standard',
    durationTier: '3_years',
    tenureLabel: '3 Years License',
    amountPaid: 57000,
    currency: 'NGN',
    licenseCode: 'STND-3A9F1-7C42E-3Y-8F21',
    status: 'active',
    selectedAddons: ['thermal-printer-80mm'],
    deploymentType: 'remote',
    paymentMethod: 'bank_transfer',
    notes: 'KDS display in kitchen and 2 mobile waiter ordering tablets.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'KYLX-REC-1003',
    customerName: 'Mrs. Folake Adebayo',
    businessName: 'Iya Folake Buka & Grills',
    phone: '234 806 0395 329',
    email: 'folake.buka@gmail.com',
    cityState: 'Bodija, Ibadan',
    packageSubscribed: 'Basic Package',
    edition: 'basic',
    durationTier: '1_year',
    tenureLabel: '1 Year License',
    amountPaid: 10000,
    currency: 'NGN',
    licenseCode: 'BASC-4D7A1-8E29F-1Y-C83E',
    status: 'active',
    selectedAddons: [],
    deploymentType: 'remote',
    paymentMethod: 'bank_transfer',
    notes: 'Single counter cashier POS + 1 wireless Android phone ordering.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'KYLX-REC-1004',
    customerName: 'Capt. David Briggs',
    businessName: 'Creekview Seafood Lounge',
    phone: '234 806 0395 329',
    email: 'info@creekviewlounge.com',
    cityState: 'GRA Phase 2, Port Harcourt',
    packageSubscribed: 'Standard Package',
    edition: 'standard',
    durationTier: '1_year',
    tenureLabel: '1 Year License',
    amountPaid: 20000,
    currency: 'NGN',
    licenseCode: 'Pending Generation',
    status: 'pending',
    selectedAddons: ['thermal-printer-80mm', 'cash-drawer-rj11'],
    deploymentType: 'remote',
    paymentMethod: 'bank_transfer',
    notes: 'Awaiting Zenith Bank payment clearance receipt via WhatsApp.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'KYLX-REC-1005',
    customerName: 'Dr. Stella Onyeka',
    businessName: 'Sweet Tooth Cafe & Patisserie',
    phone: '234 806 0395 329',
    email: 'stella.onyeka@sweettooth.ng',
    cityState: 'Independence Layout, Enugu',
    packageSubscribed: 'Trial Edition',
    edition: 'trial',
    durationTier: '7_days',
    tenureLabel: '7-Day Free Evaluation',
    amountPaid: 0,
    currency: 'NGN',
    licenseCode: 'TRAL-7F12A-3D90E-7D-4A12',
    status: 'active',
    selectedAddons: [],
    deploymentType: 'self',
    paymentMethod: 'free_trial',
    notes: 'Downloaded 7-Day trial installer to test bakery inventory features.',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

function ensureDbFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEEDS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring database file exists:', err);
  }
}

export function getAllCustomers(): CustomerRecord[] {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error reading customer database:', err);
    return INITIAL_SEEDS;
  }
}

export function saveAllCustomers(records: CustomerRecord[]): boolean {
  ensureDbFile();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing customer database:', err);
    return false;
  }
}

export function createCustomerRecord(data: Partial<CustomerRecord>): CustomerRecord {
  const records = getAllCustomers();
  const nextNum = 1000 + records.length + 1;
  const id = `KYLX-REC-${nextNum}`;

  // Calculate validity days
  let validityDays = 365;
  if (data.durationTier === '3_years') validityDays = 1095;
  else if (data.durationTier === 'lifetime') validityDays = 0;
  else if (data.durationTier === '7_days' || data.edition === 'trial') validityDays = 7;

  // Auto-generate license code or assign pending
  let assignedLicenseCode = data.licenseCode || 'Pending Generation';
  if (data.edition === 'none') {
    assignedLicenseCode = 'N/A (Hardware Only - No License Needed)';
  } else if (!data.licenseCode && (data.edition === 'trial' || data.status === 'active')) {
    try {
      const generated = generateServerMasterKey({
        businessName: data.businessName || 'Kaylix Eatery Client',
        edition: (data.edition as EditionType) || 'basic',
        validityDays,
        terminalLimit: data.edition === 'enterprise' ? 999 : data.edition === 'standard' ? 3 : 1,
      });
      assignedLicenseCode = generated.licenseKey;
    } catch {
      assignedLicenseCode = `KYLX-${(data.edition || 'BASIC').toUpperCase().slice(0, 3)}-${new Date().getFullYear()}-AUTO-KEY`;
    }
  }

  const newRecord: CustomerRecord = {
    id,
    customerName: data.customerName || 'Anonymous Eatery Owner',
    businessName: data.businessName || 'Kaylix Restaurant Client',
    phone: data.phone || 'N/A',
    email: data.email || 'N/A',
    cityState: data.cityState || 'Nigeria',
    packageSubscribed: data.packageSubscribed || (data.edition === 'none' ? 'Hardware & Add-ons Only' : 'Basic Package'),
    edition: data.edition || (data.packageSubscribed?.includes('Hardware') ? 'none' : 'basic'),
    durationTier: data.durationTier || '1_year',
    tenureLabel: data.tenureLabel || (data.edition === 'none' ? 'Hardware Only (No Plan)' : '1 Year License'),
    amountPaid: Number(data.amountPaid) || 0,
    currency: data.currency || 'NGN',
    licenseCode: assignedLicenseCode,
    status: data.status || (data.edition === 'trial' ? 'active' : 'pending'),
    selectedAddons: data.selectedAddons || [],
    deploymentType: data.deploymentType || 'remote',
    paymentMethod: data.paymentMethod || 'bank_transfer',
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to start of records list
  records.unshift(newRecord);
  saveAllCustomers(records);
  return newRecord;
}

export function updateCustomerRecord(id: string, updates: Partial<CustomerRecord>): CustomerRecord | null {
  const records = getAllCustomers();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;

  records[index] = {
    ...records[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveAllCustomers(records);
  return records[index];
}

export function deleteCustomerRecord(id: string): boolean {
  const records = getAllCustomers();
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length === records.length) return false;
  return saveAllCustomers(filtered);
}

export function generateLicenseForExistingCustomer(id: string): { customer: CustomerRecord; licenseKey: string } | null {
  const records = getAllCustomers();
  const customer = records.find((r) => r.id === id);
  if (!customer) return null;

  let validityDays = 365;
  if (customer.durationTier === '3_years') validityDays = 1095;
  else if (customer.durationTier === 'lifetime') validityDays = 0;
  else if (customer.durationTier === '7_days' || customer.edition === 'trial') validityDays = 7;

  const terminalLimit =
    customer.edition === 'enterprise' ? 999 : customer.edition === 'standard' ? 3 : 1;

  const targetEdition: EditionType = customer.edition === 'none' ? 'standard' : customer.edition;

  const generated = generateServerMasterKey({
    businessName: customer.businessName,
    edition: targetEdition,
    validityDays,
    terminalLimit,
  });

  customer.licenseCode = generated.licenseKey;
  customer.status = 'active';
  customer.updatedAt = new Date().toISOString();

  saveAllCustomers(records);
  return { customer, licenseKey: generated.licenseKey };
}

export function exportDatabaseCsv(): string {
  const records = getAllCustomers();
  const headers = [
    'Record ID',
    'Date Submitted',
    'Customer Name',
    'Business / Eatery Name',
    'Phone / WhatsApp',
    'Email',
    'Location',
    'Package Subscribed',
    'Edition Code',
    'Duration Tier',
    'Tenure',
    'Amount Paid (NGN)',
    'License Code',
    'Status',
    'Payment Method',
    'Deployment Mode',
    'Notes',
  ];

  const rows = records.map((r) => [
    `"${r.id}"`,
    `"${new Date(r.createdAt).toLocaleString()}"`,
    `"${(r.customerName || '').replace(/"/g, '""')}"`,
    `"${(r.businessName || '').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${(r.cityState || '').replace(/"/g, '""')}"`,
    `"${(r.packageSubscribed || '').replace(/"/g, '""')}"`,
    `"${r.edition}"`,
    `"${r.durationTier}"`,
    `"${(r.tenureLabel || '').replace(/"/g, '""')}"`,
    r.amountPaid,
    `"${(r.licenseCode || '').replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${(r.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(r.deploymentType || '').replace(/"/g, '""')}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
