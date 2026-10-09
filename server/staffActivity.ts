import fs from 'fs';
import path from 'path';

export interface StaffActivityRecord {
  id: string;
  timestamp: string;
  staffIdentifier: string;
  actionType:
    | 'STAFF_LOGIN'
    | 'LICENSE_SOLD'
    | 'LICENSE_GENERATED'
    | 'CUSTOMER_UPDATED'
    | 'ORDER_REGISTERED'
    | 'LICENSE_VALIDATED'
    | 'DISTRIBUTION_DOWNLOADED'
    | 'STATUS_CHANGED';
  targetCustomer?: string;
  targetBusiness?: string;
  planPackage?: string;
  amount?: number;
  licenseCode?: string;
  changesMade: string;
  ipAddress?: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const ACTIVITY_FILE = path.join(DATA_DIR, 'staff_activity.json');

const INITIAL_ACTIVITIES: StaffActivityRecord[] = [
  {
    id: 'ACT-20261009-001',
    timestamp: '2026-10-09T05:42:10.000Z',
    staffIdentifier: 'Staff Operator (08089697390)',
    actionType: 'STAFF_LOGIN',
    changesMade: 'Staff signed in to Staff Operations Portal via 2FA verification.',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'ACT-20261009-002',
    timestamp: '2026-10-09T05:45:22.000Z',
    staffIdentifier: 'Staff Operator (08089697390)',
    actionType: 'LICENSE_SOLD',
    targetCustomer: 'Chef Emeka Obi',
    targetBusiness: "Mama's Delight Kitchen & Lounge",
    planPackage: 'Standard Plan (1 Year)',
    amount: 20000,
    licenseCode: 'KYLX-STND-0365-8F3A2-9C14B-1Y-7C49',
    changesMade: 'Issued & activated 1 Year Standard License. Verified Zenith Bank payment ₦20,000.',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'ACT-20261009-003',
    timestamp: '2026-10-09T05:50:18.000Z',
    staffIdentifier: 'Staff Operator (08089697390)',
    actionType: 'STATUS_CHANGED',
    targetCustomer: 'Alhaji Musa Danjuma',
    targetBusiness: 'Arewa Continental Buffet',
    planPackage: 'Enterprises Plan (3 Years)',
    amount: 75000,
    changesMade: 'Updated subscription status from "pending" to "active" after bank settlement confirmation.',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'ACT-20261009-004',
    timestamp: '2026-10-09T06:01:05.000Z',
    staffIdentifier: 'Staff Desk (08060395329)',
    actionType: 'LICENSE_VALIDATED',
    targetBusiness: 'Bukka Royal Lounge',
    licenseCode: 'KYLX-BASC-0365-7A19B-4D82C-1Y-4E11',
    changesMade: 'Validated customer license key integrity against cryptographic master database.',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'ACT-20261009-005',
    timestamp: '2026-10-09T06:12:44.000Z',
    staffIdentifier: 'Staff Operator (08089697390)',
    actionType: 'ORDER_REGISTERED',
    targetCustomer: 'Chief Alade Victoria',
    targetBusiness: 'Ikeja Fastfood & Bakery',
    planPackage: 'Basic Plan (1 Year)',
    amount: 10000,
    changesMade: 'Registered walk-in customer purchase and uploaded bank payment proof receipt.',
    ipAddress: '127.0.0.1',
  },
];

function ensureStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ACTIVITY_FILE)) {
      fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(INITIAL_ACTIVITIES, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring staff activity storage:', err);
  }
}

export function getAllStaffActivities(): StaffActivityRecord[] {
  ensureStorage();
  try {
    const data = fs.readFileSync(ACTIVITY_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
  } catch (err) {
    console.error('Error reading staff activities:', err);
  }
  return INITIAL_ACTIVITIES;
}

export function recordStaffActivity(
  input: Omit<StaffActivityRecord, 'id' | 'timestamp'> & { timestamp?: string }
): StaffActivityRecord {
  ensureStorage();
  const activities = getAllStaffActivities();
  const newRecord: StaffActivityRecord = {
    id: `ACT-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
    timestamp: input.timestamp || new Date().toISOString(),
    staffIdentifier: input.staffIdentifier || 'Staff Operator',
    actionType: input.actionType,
    targetCustomer: input.targetCustomer,
    targetBusiness: input.targetBusiness,
    planPackage: input.planPackage,
    amount: input.amount,
    licenseCode: input.licenseCode,
    changesMade: input.changesMade,
    ipAddress: input.ipAddress || '127.0.0.1',
  };

  activities.unshift(newRecord);

  // Keep latest 500 records
  const trimmed = activities.slice(0, 500);

  try {
    fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving staff activity:', err);
  }

  return newRecord;
}

export function exportStaffActivitiesCsv(): string {
  const activities = getAllStaffActivities();
  const headers = [
    'Activity ID',
    'Timestamp (UTC)',
    'Staff Identifier',
    'Action Type',
    'Target Business',
    'Target Customer',
    'Plan Package',
    'Amount (NGN)',
    'License Code',
    'Changes Made / Details',
  ];

  const escapeCsv = (str?: string | number) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = activities.map((act) => [
    escapeCsv(act.id),
    escapeCsv(act.timestamp),
    escapeCsv(act.staffIdentifier),
    escapeCsv(act.actionType),
    escapeCsv(act.targetBusiness || ''),
    escapeCsv(act.targetCustomer || ''),
    escapeCsv(act.planPackage || ''),
    escapeCsv(act.amount || 0),
    escapeCsv(act.licenseCode || ''),
    escapeCsv(act.changesMade),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}
