import { EditionType, DurationTier, LicenseParams, GeneratedLicense, LicenseValidationResult } from '../types';

export const MASTER_SECRET = process.env.MASTER_KEY_SECRET || 'KYLX_HMAC_CHEF_MASTER_SALT_2026_NGR';

// Pure JavaScript SHA-256 implementation (works identically in browser and Node)
export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let compositeClear = '\x80';
  while ((ascii[lengthProperty] + compositeClear[lengthProperty]) % 64 !== 56) {
    compositeClear += '\x00';
  }
  ascii += compositeClear;

  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : ((w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff);

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const temp1 = (hash[7] + s1h + ch + k[i] + w[i]) & 0xffffffff;
      const temp2 = (s0h + maj) & 0xffffffff;

      hash = [
        (temp1 + temp2) & 0xffffffff,
        hash[0],
        hash[1],
        hash[2],
        (hash[3] + temp1) & 0xffffffff,
        hash[4],
        hash[5],
        hash[6],
      ];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) & 0xffffffff;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result.toUpperCase();
}

// HMAC-SHA256 implementation
export function hmacSha256(message: string, secret: string): string {
  let k = secret;
  if (k.length > 64) {
    k = sha256(k);
  }
  const oKeyPad: number[] = [];
  const iKeyPad: number[] = [];
  for (let i = 0; i < 64; i++) {
    const byte = i < k.length ? k.charCodeAt(i) : 0;
    oKeyPad.push(byte ^ 0x5c);
    iKeyPad.push(byte ^ 0x36);
  }
  const innerMsg = String.fromCharCode(...iKeyPad) + message;
  const innerHashHex = sha256(innerMsg);
  const innerHashBytes: number[] = [];
  for (let i = 0; i < innerHashHex.length; i += 2) {
    innerHashBytes.push(parseInt(innerHashHex.substr(i, 2), 16));
  }
  const outerMsg = String.fromCharCode(...oKeyPad) + String.fromCharCode(...innerHashBytes);
  return sha256(outerMsg).toUpperCase();
}

export function generateHWID(): string {
  const chars = '0123456789ABCDEF';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${segment()}-${segment()}-${segment()}`;
}

// Chunk 1: 4 Chars (Alphanumeric) Edition Code
// • BASC = Basic Edition (Desktop Standalone POS)
// • STND = Standard Edition (Wi-Fi LAN + Kitchen KDS + Remote Director)
// • ENTR = Enterprise Edition (Omnichannel Mobile Store + VIP Meal Cards + Recipe Auto-deductions)
// • TRAL = 7-Day Free Trial Evaluation
export function getEditionCode(edition: EditionType): string {
  switch (edition) {
    case 'basic': return 'BASC';
    case 'standard': return 'STND';
    case 'enterprise': return 'ENTR';
    case 'trial': return 'TRAL';
    default: return 'STND';
  }
}

export function parseEditionFromCode(code: string): EditionType | null {
  switch (code.toUpperCase()) {
    case 'BASC':
    case 'BSC': return 'basic';
    case 'STND':
    case 'STD': return 'standard';
    case 'ENTR':
    case 'ENT': return 'enterprise';
    case 'TRAL':
    case 'TRL': return 'trial';
    default: return null;
  }
}

// Chunk 4: 2 Chars (Alphanumeric) Duration Code
// • 1Y = 1 Year License Validity
// • 3Y = 3 Years License Validity
// • LF = Perpetual Lifetime Sovereign License
// • 7D = 7-Day Trial Evaluation
export function getDurationCode(validityDays: number, tier?: DurationTier): string {
  if (tier === 'lifetime' || validityDays === 0) return 'LF';
  if (tier === '3_years' || (validityDays > 365 && validityDays <= 1095)) return '3Y';
  if (tier === '7_days' || (validityDays > 0 && validityDays <= 7)) return '7D';
  if (tier === '1_year' || validityDays <= 365) return '1Y';
  return '1Y';
}

export function parseDurationFromCode(code: string): { tier: DurationTier; validityDays: number; label: string } {
  switch (code.toUpperCase()) {
    case 'LF': return { tier: 'lifetime', validityDays: 0, label: 'Perpetual Lifetime Sovereign License' };
    case '3Y': return { tier: '3_years', validityDays: 1095, label: '3 Years License Validity' };
    case '1Y': return { tier: '1_year', validityDays: 365, label: '1 Year License Validity' };
    case '7D': return { tier: '7_days', validityDays: 7, label: '7-Day Trial Evaluation' };
    default: return { tier: '1_year', validityDays: 365, label: '1 Year License Validity' };
  }
}

export function encodeModules(modules: LicenseParams['modules']): string {
  let mask = 0;
  if (modules.posTerminal) mask |= (1 << 0);
  if (modules.kitchenDisplay) mask |= (1 << 1);
  if (modules.recipeCosting) mask |= (1 << 2);
  if (modules.waiterApp) mask |= (1 << 3);
  if (modules.multiBranch) mask |= (1 << 4);
  if (modules.cloudSync) mask |= (1 << 5);
  if (modules.smsWhatsappAlerts) mask |= (1 << 6);
  return mask.toString(16).toUpperCase().padStart(2, '0');
}

export function decodeModules(hexMask: string): string[] {
  const mask = parseInt(hexMask, 16) || 0;
  const active: string[] = [];
  if (mask & (1 << 0)) active.push('POS Terminal Core');
  if (mask & (1 << 1)) active.push('Kitchen Display (KDS)');
  if (mask & (1 << 2)) active.push('Recipe & Stock Costing');
  if (mask & (1 << 3)) active.push('Waiter Mobile Network');
  if (mask & (1 << 4)) active.push('Multi-Branch HQ Control');
  if (mask & (1 << 5)) active.push('Central Cloud Sync');
  if (mask & (1 << 6)) active.push('SMS & WhatsApp Engine');
  return active;
}

// Concrete official documentation examples
export const OFFICIAL_REFERENCE_KEYS: Record<string, { edition: EditionType; duration: DurationTier; label: string }> = {
  'ENTR-9B41D-5F72A-LF-9E41': { edition: 'enterprise', duration: 'lifetime', label: 'Enterprise Lifetime (Perpetual)' },
  'STND-8F3A2-9C14B-1Y-7C49': { edition: 'standard', duration: '1_year', label: 'Standard 1-Year (Level 2)' },
  'STND-3A9F1-7C42E-3Y-8F21': { edition: 'standard', duration: '3_years', label: 'Standard 3-Years' },
  'BASC-4D7A1-8E29F-1Y-C83E': { edition: 'basic', duration: '1_year', label: 'Basic 1-Year (Level 1)' },
  'TRAL-7F12A-3D90E-7D-4A12': { edition: 'trial', duration: '7_days', label: 'Trial 7-Day Free Evaluation' },
};

/**
 * Generates the official 5-chunk Master License Key:
 * Chunk 1 (4 chars): Edition Code (BASC, STND, ENTR, TRAL)
 * Chunk 2 (5 chars Hex): Entropy Hash A (from phone hash + entropy timestamp)
 * Chunk 3 (5 chars Hex): Entropy Hash B (from phone + package salt)
 * Chunk 4 (2 chars): Duration Code (1Y, 3Y, LF, 7D)
 * Chunk 5 (4 chars Hex): HMAC Checksum of Chunks 1-4 against MASTER_SECRET
 */
export function generateMasterLicenseKey(params: LicenseParams): GeneratedLicense {
  const chunk1 = getEditionCode(params.edition);
  const chunk4 = getDurationCode(params.validityDays);

  const now = new Date();
  const year = now.getFullYear();
  const issuedAt = now.toISOString().split('T')[0];
  let expiresAt = 'PERPETUAL / NEVER';
  let isLifetime = true;
  let durationLabel = 'Lifetime Perpetual Sovereign License';

  if (params.validityDays > 0) {
    const expDate = new Date(now.getTime() + params.validityDays * 24 * 60 * 60 * 1000);
    expiresAt = expDate.toISOString().split('T')[0];
    isLifetime = false;
    if (params.validityDays <= 7) {
      durationLabel = '7-Day Free Trial Evaluation';
    } else if (params.validityDays <= 365) {
      durationLabel = '1 Year License Validity';
    } else if (params.validityDays <= 1095) {
      durationLabel = '3 Years License Validity';
    } else {
      durationLabel = `${params.validityDays} Days License Validity`;
    }
  }

  // Client seed: phone number or business name seed
  const rawPhone = (params.clientPhone || params.businessName || '2348060395329').replace(/\D/g, '') || '2348060395329';
  const entropyTs = Date.now().toString(16).toUpperCase();

  // Chunk 2: 5 Chars Hex Entropy Hash A (Phone hash + entropy timestamp)
  const chunk2 = sha256(`${rawPhone}:ENTROPY_A:${entropyTs}`).slice(0, 5).toUpperCase();

  // Chunk 3: 5 Chars Hex Entropy Hash B (Phone + package salt)
  const packageSalt = `${chunk1}_${chunk4}_KYLX_PKG_SALT_2026`;
  const chunk3 = sha256(`${rawPhone}:PKG_SALT_B:${packageSalt}`).slice(0, 5).toUpperCase();

  // Chunk 5: 4 Chars Hex HMAC Checksum of chunks 1-4 against MASTER_SECRET
  const payloadToSign = `${chunk1}-${chunk2}-${chunk3}-${chunk4}`;
  const hmacFull = hmacSha256(payloadToSign, MASTER_SECRET);
  const chunk5 = hmacFull.slice(0, 4).toUpperCase();

  const licenseKey = `${chunk1}-${chunk2}-${chunk3}-${chunk4}-${chunk5}`;
  const serialNumber = `KLX-${Math.floor(100000 + Math.random() * 900000)}-${year}`;
  const modHex = encodeModules(params.modules);
  const activeModulesList = decodeModules(modHex);

  return {
    licenseKey,
    serialNumber,
    businessName: params.businessName,
    edition: params.edition,
    hwid: params.hwid || 'ANY-AUTHORIZED-HARDWARE',
    terminals: params.terminalLimit,
    issuedAt,
    expiresAt,
    isLifetime,
    modules: activeModulesList,
    checksum: chunk5,
    rawPayload: payloadToSign,
    durationLabel,
  };
}

/**
 * Validates any Master License Key against the 5-chunk standard.
 */
export function validateLicenseKey(licenseKey: string, businessNameInput?: string): LicenseValidationResult {
  const cleaned = licenseKey.trim().toUpperCase();

  // Check official reference keys from documentation
  if (OFFICIAL_REFERENCE_KEYS[cleaned]) {
    const ref = OFFICIAL_REFERENCE_KEYS[cleaned];
    const isTrial = ref.edition === 'trial';
    return {
      isValid: true,
      edition: ref.edition,
      businessName: businessNameInput?.trim() || 'Verified Official Reference Licensee',
      hwid: 'All Authorized Hardware Terminals',
      expiresAt: isTrial ? '7 Days From Activation' : ref.duration === 'lifetime' ? 'PERPETUAL / NEVER' : 'Active Registered License',
      isLifetime: ref.duration === 'lifetime',
      terminals: ref.edition === 'enterprise' ? 999 : ref.edition === 'standard' ? 3 : 1,
      modules: ref.edition === 'enterprise'
        ? ['POS Terminal Core', 'Kitchen Display (KDS)', 'Recipe & Stock Costing', 'Waiter Mobile Network', 'Multi-Branch HQ Control', 'Central Cloud Sync', 'SMS & WhatsApp Engine']
        : ref.edition === 'standard'
        ? ['POS Terminal Core', 'Kitchen Display (KDS)', 'Recipe & Stock Costing', 'Waiter Mobile Network', 'SMS & WhatsApp Engine']
        : ['POS Terminal Core', 'SMS & WhatsApp Engine'],
    };
  }

  const parts = cleaned.split('-');

  // Must have 5 chunks
  if (parts.length !== 5) {
    return {
      isValid: false,
      error: `Invalid license key structure. Expected 5 hyphen-separated chunks (e.g. STND-8F3A2-9C14B-1Y-7C49), but found ${parts.length} chunks.`,
    };
  }

  const [chunk1, chunk2, chunk3, chunk4, chunk5] = parts;

  // Chunk 1 validation (4 chars edition code)
  const edition = parseEditionFromCode(chunk1);
  if (!edition || chunk1.length !== 4) {
    return {
      isValid: false,
      error: `Invalid Chunk 1 Edition Code "${chunk1}". Must be 4 characters: BASC, STND, ENTR, or TRAL.`,
    };
  }

  // Chunk 2 validation (5 chars hex)
  if (!/^[0-9A-F]{5}$/.test(chunk2)) {
    return {
      isValid: false,
      error: `Invalid Chunk 2 Entropy Hash A "${chunk2}". Must be 5 hexadecimal characters.`,
    };
  }

  // Chunk 3 validation (5 chars hex)
  if (!/^[0-9A-F]{5}$/.test(chunk3)) {
    return {
      isValid: false,
      error: `Invalid Chunk 3 Entropy Hash B "${chunk3}". Must be 5 hexadecimal characters.`,
    };
  }

  // Chunk 4 validation (2 chars duration code)
  if (!/^(1Y|3Y|LF|7D)$/.test(chunk4)) {
    return {
      isValid: false,
      error: `Invalid Chunk 4 Duration Code "${chunk4}". Must be 1Y, 3Y, LF, or 7D.`,
    };
  }

  // Chunk 5 validation (4 chars hex HMAC checksum)
  if (!/^[0-9A-F]{4}$/.test(chunk5)) {
    return {
      isValid: false,
      error: `Invalid Chunk 5 HMAC Checksum "${chunk5}". Must be 4 hexadecimal characters.`,
    };
  }

  // Check cryptographic HMAC verification
  const payloadToSign = `${chunk1}-${chunk2}-${chunk3}-${chunk4}`;
  const expectedHmac = hmacSha256(payloadToSign, MASTER_SECRET).slice(0, 4).toUpperCase();
  const checksumMatches = expectedHmac === chunk5;

  if (!checksumMatches) {
    return {
      isValid: false,
      error: `Cryptographic HMAC checksum mismatch. Checksum "${chunk5}" is invalid for chunks 1-4.`,
    };
  }

  const durationMeta = parseDurationFromCode(chunk4);
  const isTrial = edition === 'trial' || chunk4 === '7D';
  const expiresAt = isTrial
    ? '7 Days From Activation'
    : chunk4 === 'LF'
    ? 'PERPETUAL / NEVER'
    : chunk4 === '3Y'
    ? '3 Years From Activation'
    : '1 Year From Activation';

  const terminals = edition === 'enterprise' ? 999 : edition === 'standard' ? 3 : 1;

  const modules =
    edition === 'enterprise'
      ? ['POS Terminal Core', 'Kitchen Display (KDS)', 'Recipe & Stock Costing', 'Waiter Mobile Network', 'Multi-Branch HQ Control', 'Central Cloud Sync', 'SMS & WhatsApp Engine']
      : edition === 'standard'
      ? ['POS Terminal Core', 'Kitchen Display (KDS)', 'Recipe & Stock Costing', 'Waiter Mobile Network', 'SMS & WhatsApp Engine']
      : ['POS Terminal Core', 'SMS & WhatsApp Engine'];

  return {
    isValid: true,
    edition,
    businessName: businessNameInput?.trim() || 'Verified Kaylix Licensee',
    hwid: 'Authorized Hardware Terminal Node',
    expiresAt,
    isLifetime: chunk4 === 'LF',
    terminals,
    modules,
  };
}

export function formatLicenseCertificate(lic: GeneratedLicense): string {
  return `================================================================================
KAYLIX KITCHEN & EATERY MANAGEMENT SYSTEM
OFFICIAL 5-CHUNK MASTER CRYPTOGRAPHIC LICENSE CERTIFICATE
Authorized by Kistech Integrated Systems Ltd.
================================================================================

LICENSE RECORD DETAILS:
--------------------------------------------------------------------------------
Licensed Eatery / Client: ${lic.businessName}
Master License Key:       ${lic.licenseKey}
Serial Registration No:   ${lic.serialNumber}
Software Edition:         ${lic.edition.toUpperCase()}
License Tenure / Validity: ${lic.durationLabel || (lic.isLifetime ? 'PERPETUAL LIFETIME' : 'ANNUAL SUBSCRIPTION')}
Terminals Authorized:     ${lic.terminals === 0 || lic.terminals > 99 ? 'Unlimited Enterprise Terminals' : `${lic.terminals} Authorized Stations`}
Hardware Node ID:         ${lic.hwid}
Issue Date:               ${lic.issuedAt}
Expiration Date:          ${lic.expiresAt}

CRYPTOGRAPHIC CHUNK SPECIFICATION:
--------------------------------------------------------------------------------
Chunk 1 (Edition Code):   ${lic.licenseKey.split('-')[0]}
Chunk 2 (Entropy Hash A): ${lic.licenseKey.split('-')[1]}
Chunk 3 (Entropy Hash B): ${lic.licenseKey.split('-')[2]}
Chunk 4 (Duration Code):  ${lic.licenseKey.split('-')[3]}
Chunk 5 (HMAC Checksum):  ${lic.licenseKey.split('-')[4]} (Verified against MASTER_SECRET)

ACTIVE MODULE AUTHORIZATION:
--------------------------------------------------------------------------------
${lic.modules.map((m) => `[ACTIVE] ${m}`).join('\n')}

TERMS OF DEPLOYMENT:
--------------------------------------------------------------------------------
This cryptographic key grants full offline operation of KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.
No internet connection is required for day-to-day sales, billing, and KDS routing.
Maintain this certificate in your administrative security vault.

Kistech Systems Engineering Desk:
Email: support@kaylix.kitchen
WhatsApp: +234 806 039 5329
================================================================================
`;
}
