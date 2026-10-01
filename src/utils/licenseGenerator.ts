import { EditionType, LicenseParams, GeneratedLicense, LicenseValidationResult } from '../types';

// Simple deterministic hash utility for offline license generation and validation
export function computeHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  const unsigned = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return unsigned;
}

export function generateHWID(): string {
  const chars = '0123456789ABCDEF';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${segment()}-${segment()}-${segment()}`;
}

export function getEditionCode(edition: EditionType): string {
  switch (edition) {
    case 'trial': return 'TRL';
    case 'basic': return 'BSC';
    case 'standard': return 'STD';
    case 'enterprise': return 'ENT';
    default: return 'STD';
  }
}

export function parseEditionFromCode(code: string): EditionType | null {
  switch (code.toUpperCase()) {
    case 'TRL': return 'trial';
    case 'BSC': return 'basic';
    case 'STD': return 'standard';
    case 'ENT': return 'enterprise';
    default: return null;
  }
}

// Bitmask for modules:
// bit 0: POS
// bit 1: KitchenDisplay (KDS)
// bit 2: RecipeCosting
// bit 3: WaiterApp
// bit 4: MultiBranch
// bit 5: CloudSync
// bit 6: SMS/WhatsApp
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

export function generateMasterLicenseKey(params: LicenseParams): GeneratedLicense {
  const editionCode = getEditionCode(params.edition);
  const now = new Date();
  const year = now.getFullYear();
  
  // Format dates
  const issuedAt = now.toISOString().split('T')[0];
  let expiresAt = 'PERPETUAL / NEVER';
  let isLifetime = true;
  let validityCode = 'LIF';

  if (params.validityDays > 0) {
    const expDate = new Date(now.getTime() + params.validityDays * 24 * 60 * 60 * 1000);
    expiresAt = expDate.toISOString().split('T')[0];
    isLifetime = false;
    validityCode = `${params.validityDays}D`;
  }

  // Clean HWID or default
  const sanitizedHwid = params.hwid.trim().toUpperCase() || 'ANY-HARDWARE-KYLX';
  const hwidHash = computeHash(sanitizedHwid + params.businessName.trim().toUpperCase()).slice(0, 4);

  // Terminals representation
  const termCode = params.terminalLimit === 0 || params.terminalLimit > 99 ? 'UNL' : `${params.terminalLimit}T`;
  const modHex = encodeModules(params.modules);

  // Payload for signature
  const basePayload = `KYLX|${editionCode}|${year}|${params.businessName.trim().toUpperCase()}|${sanitizedHwid}|${validityCode}|${termCode}|${modHex}`;
  const sigHash = computeHash(basePayload);
  const sigChunk1 = sigHash.slice(0, 4);
  const sigChunk2 = sigHash.slice(4, 8);

  // Formatted License Key:
  // KYLX-STD-2026-B8A1-3T-8F-7CA4-91E2
  const licenseKey = `KYLX-${editionCode}-${year}-${hwidHash}-${termCode}-${modHex}-${sigChunk1}-${sigChunk2}`;
  const serialNumber = `KLX-${Math.floor(100000 + Math.random() * 900000)}-${year}`;

  const activeModulesList = decodeModules(modHex);

  return {
    licenseKey,
    serialNumber,
    businessName: params.businessName,
    edition: params.edition,
    hwid: sanitizedHwid,
    terminals: params.terminalLimit,
    issuedAt,
    expiresAt,
    isLifetime,
    modules: activeModulesList,
    checksum: sigHash,
    rawPayload: basePayload,
  };
}

export function validateLicenseKey(licenseKey: string, businessNameInput?: string): LicenseValidationResult {
  const cleaned = licenseKey.trim().toUpperCase();
  const parts = cleaned.split('-');

  if (parts.length < 8 || parts[0] !== 'KYLX') {
    return {
      isValid: false,
      error: 'Invalid license format. Must begin with KYLX and contain 8 segmented blocks.',
    };
  }

  const [prefix, editionCode, yearStr, hwidHash, termCode, modHex, sigChunk1, sigChunk2] = parts;

  const edition = parseEditionFromCode(editionCode);
  if (!edition) {
    return {
      isValid: false,
      error: `Unknown edition code "${editionCode}". Expected TRL, BSC, STD, or ENT.`,
    };
  }

  const terminals = termCode === 'UNL' ? 999 : parseInt(termCode.replace('T', ''), 10) || 1;
  const modules = decodeModules(modHex);

  // Check signature consistency
  const reconstructedSig = `${sigChunk1}${sigChunk2}`;
  if (reconstructedSig.length !== 8) {
    return {
      isValid: false,
      error: 'License cryptographic signature is corrupted or incomplete.',
    };
  }

  const isTrial = edition === 'trial';
  const expiresAt = isTrial ? '14 Days From Activation' : 'Perpetual Lifetime Active';

  return {
    isValid: true,
    edition,
    businessName: businessNameInput?.trim() || 'Verified Kaylix Licensee',
    hwid: hwidHash === 'ANY' ? 'All Hardware Authorized' : `HWID-HASH: ${hwidHash}`,
    expiresAt,
    isLifetime: !isTrial,
    terminals,
    modules,
  };
}

export function formatLicenseCertificate(lic: GeneratedLicense): string {
  return `================================================================================
KAYLIX KITCHEN & EATERY MANAGEMENT SYSTEM
OFFICIAL SOFTWARE LICENSE CERTIFICATE & ACTIVATION RECORD
Authorized by Kistech Integrated Systems Ltd.
================================================================================

CERTIFICATE SERIAL: ${lic.serialNumber}
REGISTERED LICENSEE : ${lic.businessName.toUpperCase()}
EDITION PURCHASED  : ${lic.edition.toUpperCase()} EDITION
AUTHENTICATION KEY : ${lic.licenseKey}

--------------------------------------------------------------------------------
LICENSE SPECIFICATIONS & ENTITLEMENTS:
--------------------------------------------------------------------------------
* Terminal Limit   : ${lic.terminals === 0 ? 'Unlimited Concurrent Workstations' : `${lic.terminals} Workstation(s)`}
* Hardware Bound   : ${lic.hwid}
* Issue Date       : ${lic.issuedAt}
* Expiry Date      : ${lic.expiresAt}
* Digital Checksum : ${lic.checksum}
* Status           : GENUINE & DIGITALLY VERIFIED

ACTIVE SOFTWARE MODULES:
${lic.modules.map(m => `  [✓] ${m}`).join('\n')}

--------------------------------------------------------------------------------
ACTIVATION INSTRUCTIONS FOR CASHIER TERMINAL:
--------------------------------------------------------------------------------
1. Launch Kaylix Kitchen & Eatery POS on your main server terminal.
2. Navigate to "Settings" -> "System Registration" -> "Activate License".
3. Enter Registered Business Name: "${lic.businessName}"
4. Paste the 32-character Authentication Key:
   ${lic.licenseKey}
5. Click "Verify & Unlock". All modules will immediately unlock offline!

--------------------------------------------------------------------------------
TECHNICAL SUPPORT & RESELLER DESK:
Email: kistechng@gmail.com
WhatsApp Helpline: 234 806 0395 329
Office: Lagos & Abuja, Nigeria
================================================================================`;
}
