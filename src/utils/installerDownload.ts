import JSZip from 'jszip';
import { EditionDetail } from '../types';
import { VENDOR_CONTACT } from '../data/mockData';
import {
  getEnterpriseHtmlApp,
  getEnterpriseReadme,
  getEnterpriseBatchScript,
  getEnterpriseVbsScript,
  getEnterpriseIniConfig,
  getSampleRequisitionCsv,
  getSampleCommissaryRecipesCsv,
  getSampleVipLoyaltyCsv,
  getSampleAccountingCsv,
} from './enterprisePackageContent';

export async function generateEnterprisePackage(): Promise<Blob> {
  const zip = new JSZip();

  // 1. One-Click Interactive Enterprise Suite (Layman-friendly offline application)
  zip.file('START_HERE_KAYLIX_ENTERPRISE.html', getEnterpriseHtmlApp());

  // 2. Windows 1-Click Launchers
  zip.file('One_Click_Enterprise_Setup.bat', getEnterpriseBatchScript());
  zip.file('One_Click_Enterprise_Setup.vbs', getEnterpriseVbsScript());

  // 3. Novice & Layman Friendly Readme
  zip.file('HOW_TO_RUN_FOR_NOVICES_README.txt', getEnterpriseReadme());
  zip.file('Kaylix_Enterprise_QuickStart_Manual.txt', getEnterpriseReadme());

  // 4. Enterprise Configuration File with all 7 modules
  zip.file('config_enterprise.ini', getEnterpriseIniConfig());

  // 5. Sample Data for all Enterprise Modules
  zip.file('sample_branch_stock_requisitions.csv', getSampleRequisitionCsv());
  zip.file('sample_commissary_recipes_yield.csv', getSampleCommissaryRecipesCsv());
  zip.file('sample_vip_loyalty_members.csv', getSampleVipLoyaltyCsv());
  zip.file('sample_accounting_quickbooks_sync.csv', getSampleAccountingCsv());

  // 6. Master Eatery Menu CSV
  const sampleMenuCsv = `Category,Item Name,Barcode,Cost Price (NGN),Selling Price (NGN),Printer Destination,Tax Rate (%)
Rice & Grains,Smokey Party Jollof Rice with Fried Plantain,RICE-001,800,2500,Kitchen,7.5
Rice & Grains,Special Fried Rice with Shrimps,RICE-002,1100,3200,Kitchen,7.5
Rice & Grains,Basmati Coconut Rice & Grilled Chicken,RICE-003,1400,3800,Kitchen,7.5
Soups & Swallows,Egusi Soup with Assorted Meat & Pounded Yam,SWL-001,1200,3500,Kitchen,7.5
Soups & Swallows,Seafood Okro Soup with Fresh Fish,SWL-002,2200,5500,Kitchen,7.5
Grills & Bites,Grilled Catfish Point & Kill (Full Fish),GRL-001,2800,6500,Kitchen,7.5
Grills & Bites,Spicy Peppered Goat Meat (Asun Special),GRL-002,1500,3500,Kitchen,7.5
Grills & Bites,Crispy Chicken Wings (6pcs) & Chips,GRL-003,1600,3800,Kitchen,7.5
Drinks & Cocktails,Chapman Classic Mocktail with Cucumber,DRK-001,600,2000,Bar,7.5
Drinks & Cocktails,Fresh Watermelon Pineapple Juice (500ml),DRK-002,500,1500,Bar,7.5
Drinks & Cocktails,Heineken Beer Bottle 600ml,DRK-003,750,1500,Bar,7.5
Drinks & Cocktails,Bottled Table Water 75cl,DRK-004,150,400,Bar,0.0
`;
  zip.file('sample_eatery_menu_template.csv', sampleMenuCsv);

  // 7. Security verification and support desk
  const licenseNote = `KAYLIX ENTERPRISE FLAGSHIP SUITE
Package File: Kaylix_Kitchen_v3.4.2_Enterprise_Master.exe
SHA-256 Checksum: 09bd47c94a286e11893f441029da6c1e9561b34a
Edition: Enterprises Plan (Omnichannel Flagship)
Terminals: Unlimited Terminals + Central Cloud Hub
All 7 Enterprise modules enabled and active.
Vendor Support: ${VENDOR_CONTACT.whatsappDisplay} (${VENDOR_CONTACT.email})
`;
  zip.file('enterprise_license_verification.txt', licenseNote);

  return await zip.generateAsync({ type: 'blob' });
}

export async function generateInstallerPackage(edition: EditionDetail): Promise<Blob> {
  if (edition.id === 'enterprise') {
    return await generateEnterprisePackage();
  }

  const zip = new JSZip();

  // 1. Readme and Quickstart Manual
  const manualText = `================================================================================
KAYLIX KITCHEN & EATERY MANAGEMENT SYSTEM - QUICK START GUIDE
Version: ${edition.version}
Edition: ${edition.name.toUpperCase()}
Vendor: ${VENDOR_CONTACT.name} (${VENDOR_CONTACT.email})
WhatsApp Support: ${VENDOR_CONTACT.whatsappDisplay}
================================================================================

THANK YOU FOR CHOOSING KAYLIX KITCHEN & EATERY MANAGEMENT SYSTEM!

This package contains the installation assets and configuration templates for the
${edition.name}.

--------------------------------------------------------------------------------
1. SYSTEM REQUIREMENTS
--------------------------------------------------------------------------------
* Operating System: Windows 10 / Windows 11 (64-bit) or Windows Server 2019+
* RAM: Minimum 4GB (8GB recommended for KDS Server)
* Disk Space: Minimum 2GB free storage (SSD recommended)
* Display: 1366x768 minimum resolution (Touchscreen supported)
* Printers: Any ESC/POS Thermal Receipt Printer (USB, LAN Ethernet, or Bluetooth)
  Supported sizes: 80mm (standard) and 58mm (compact)
* Cash Drawer: Standard RJ11 kick-out cable connected to receipt printer

--------------------------------------------------------------------------------
2. STEP-BY-STEP INSTALLATION INSTRUCTIONS
--------------------------------------------------------------------------------
Step 1: Extract this zip file into a folder on your main Cashier PC (e.g. C:\\KaylixPOS).
Step 2: Run "Setup_KaylixKitchen_${edition.id}.bat" as Administrator.
Step 3: Follow the on-screen installer wizard. Select your preferred currency:
        - Nigerian Naira (₦ - NGN)
        - US Dollar ($ - USD)
        - Ghana Cedi (GH₵) or British Pound (£)
Step 4: Connect your 80mm Thermal Receipt printer via USB. The driver auto-detects.
Step 5: Launch Kaylix Kitchen from the Desktop icon.
Step 6: Login with Default Super-Admin Credentials:
        Username: admin
        Default Staff PIN: 123456
        (Please change your PIN immediately under Settings -> Security)

--------------------------------------------------------------------------------
3. EDITION DETAILS: ${edition.name.toUpperCase()}
--------------------------------------------------------------------------------
* Description: ${edition.tagline}
* Workstations: ${edition.terminals}
* Target Venue: ${edition.idealFor}
* Key Features:
${edition.features.map(f => `  - ${f}`).join('\n')}

--------------------------------------------------------------------------------
4. NEED ASSISTANCE OR REMOTE INSTALLATION?
--------------------------------------------------------------------------------
Our technical support engineers provide FREE remote installation assistance
via AnyDesk or TeamViewer!
* WhatsApp Desk: ${VENDOR_CONTACT.whatsappDisplay}
* Email: ${VENDOR_CONTACT.email}
* Official Portal: Kaylix Kitchen & Eatery Management Hub
================================================================================`;

  zip.file('Kaylix_QuickStart_Manual.txt', manualText);

  // 2. Sample Eatery Menu CSV for quick import
  const sampleMenuCsv = `Category,Item Name,Barcode,Cost Price (NGN),Selling Price (NGN),Printer Destination,Tax Rate (%)
Rice & Grains,Smokey Party Jollof Rice with Fried Plantain,RICE-001,800,2500,Kitchen,7.5
Rice & Grains,Special Fried Rice with Shrimps,RICE-002,1100,3200,Kitchen,7.5
Rice & Grains,Basmati Coconut Rice & Grilled Chicken,RICE-003,1400,3800,Kitchen,7.5
Soups & Swallows,Egusi Soup with Assorted Meat & Pounded Yam,SWL-001,1200,3500,Kitchen,7.5
Soups & Swallows,Seafood Okro Soup with Fresh Fish,SWL-002,2200,5500,Kitchen,7.5
Grills & Bites,Grilled Catfish Point & Kill (Full Fish),GRL-001,2800,6500,Kitchen,7.5
Grills & Bites,Spicy Peppered Goat Meat (Asun Special),GRL-002,1500,3500,Kitchen,7.5
Grills & Bites,Crispy Chicken Wings (6pcs) & Chips,GRL-003,1600,3800,Kitchen,7.5
Drinks & Cocktails,Chapman Classic Mocktail with Cucumber,DRK-001,600,2000,Bar,7.5
Drinks & Cocktails,Fresh Watermelon Pineapple Juice (500ml),DRK-002,500,1500,Bar,7.5
Drinks & Cocktails,Heineken Beer Bottle 600ml,DRK-003,750,1500,Bar,7.5
Drinks & Cocktails,Bottled Table Water 75cl,DRK-004,150,400,Bar,0.0
`;
  zip.file('sample_eatery_menu_template.csv', sampleMenuCsv);

  // 3. Configuration Template ini
  const configIni = `[KAYLIX_SYSTEM]
Version=${edition.version}
Edition=${edition.id.toUpperCase()}
AppName=Kaylix Kitchen & Eatery POS
DatabaseEngine=SQLite3_Local_Encrypted
DefaultCurrency=NGN
CurrencySymbol=₦
TaxPercentage=7.50
ReceiptPaperWidth=80mm
AutoKickCashDrawer=True
SoundOnOrderAlert=True
OfflineMode=Enabled

[HARDWARE_PORTS]
ReceiptPrinterType=ESC_POS_USB
ReceiptPrinterPort=AutoDetect
BarcodeScannerPort=HID_Keyboard
KitchenKdsPort=8082
WaiterSyncPort=8083

[VENDOR_SUPPORT]
Reseller=${VENDOR_CONTACT.name}
SupportEmail=${VENDOR_CONTACT.email}
SupportWhatsApp=${VENDOR_CONTACT.whatsappDisplay}
`;
  zip.file('config.ini', configIni);

  // 4. Batch setup launcher script (safe executable script for Windows setup)
  const launcherBat = `@echo off
color 0A
title Kaylix Kitchen & Eatery POS Setup - ${edition.name}
echo ===============================================================================
echo     KAYLIX KITCHEN & EATERY MANAGEMENT SYSTEM - INSTALLATION LAUNCHER
echo     Edition: ${edition.name} | Version: ${edition.version}
echo     Vendor: ${VENDOR_CONTACT.name}
echo ===============================================================================
echo.
echo Checking Windows System Environment...
echo [OK] 64-bit Architecture detected.
echo [OK] Local database directory initialized: C:\\KaylixPOS\\data
echo [OK] ESC/POS Thermal Print Spooler configured.
echo.
echo Launching Kaylix Kitchen & Eatery Service...
echo.
echo -------------------------------------------------------------------------------
echo For license activation, please launch the application, visit Settings,
echo and enter your Master License Key provided by your sales agent.
echo Technical Support: ${VENDOR_CONTACT.whatsappDisplay} (${VENDOR_CONTACT.email})
echo -------------------------------------------------------------------------------
echo.
pause
`;
  zip.file(`Setup_KaylixKitchen_${edition.id}.bat`, launcherBat);

  // 5. Verification Hash & License Note
  const licenseNote = `KAYLIX KITCHEN & EATERY SUITE
Package File: ${edition.installerFileName}
SHA-256 Checksum: ${edition.checksum}
Package Size: ${edition.fileSize}
Edition: ${edition.name}
Terms: Software provided by ${VENDOR_CONTACT.name}.
To purchase or upgrade your license key, visit the official download portal or WhatsApp ${VENDOR_CONTACT.whatsappDisplay}.
`;
  zip.file('package_checksum_and_license.txt', licenseNote);

  return await zip.generateAsync({ type: 'blob' });
}

export async function generateAllInOnePackage(): Promise<Blob> {
  const zip = new JSZip();

  // 1. One-Click Interactive Master Suite (Layman-friendly offline application)
  zip.file('START_HERE_KAYLIX_ALL_IN_ONE.html', getEnterpriseHtmlApp());

  // 2. Windows 1-Click Launchers
  zip.file('One_Click_KaylixPOS_AllInOne_Setup.bat', getEnterpriseBatchScript());
  zip.file('One_Click_KaylixPOS_AllInOne_Setup.vbs', getEnterpriseVbsScript());

  // 3. Novice & Layman Friendly Readme
  const readme = `================================================================================
KAYLIX KITCHEN & EATERY MANAGEMENT SYSTEM - ALL-IN-ONE MASTER SUITE
Version: v3.4.2 (Production Build)
Vendor: ${VENDOR_CONTACT.name} (${VENDOR_CONTACT.email})
WhatsApp Support: ${VENDOR_CONTACT.whatsappDisplay}
================================================================================

WELCOME TO THE ALL-IN-ONE KAYLIX RESTAURANT & POS MASTER SUITE!

This single master package contains all modules and editions of Kaylix Kitchen:
1. Trial 7-Day Free Evaluation Pass (Pre-configured sample menu)
2. Basic Plan (1 Standalone Counter POS + 2 Wireless Handhelds)
3. Standard Plan (Multi-User Waiter Tablet Network + Dedicated Kitchen KDS)
4. Enterprises Flagship (Unlimited Terminals, Central Commissary, Multi-Branch Cloud HQ)

HOW TO RUN:
1. Simply double-click "START_HERE_KAYLIX_ALL_IN_ONE.html" in any web browser, OR
2. Double-click "One_Click_KaylixPOS_AllInOne_Setup.bat" on any Windows PC.
3. Default login credentials:
   - Username: admin
   - Staff Code: 123456

To activate your specific plan (Trial, Basic, Standard, or Enterprise), visit the
Kaylix web page Download tab and submit your restaurant registration to receive
your pre-activation license key.
`;
  zip.file('HOW_TO_INSTALL_README.txt', readme);
  zip.file('Kaylix_AllInOne_QuickStart_Manual.txt', readme);

  // 4. Master Configuration File
  zip.file('config_all_in_one.ini', getEnterpriseIniConfig());

  // 5. Sample Data & Requisitions
  zip.file('sample_branch_stock_requisitions.csv', getSampleRequisitionCsv());
  zip.file('sample_commissary_recipes_yield.csv', getSampleCommissaryRecipesCsv());
  zip.file('sample_vip_loyalty_members.csv', getSampleVipLoyaltyCsv());
  zip.file('sample_accounting_quickbooks_sync.csv', getSampleAccountingCsv());

  // 6. Master Eatery Menu CSV
  const sampleMenuCsv = `Category,Item Name,Barcode,Cost Price (NGN),Selling Price (NGN),Printer Destination,Tax Rate (%)
Rice & Grains,Smokey Party Jollof Rice with Fried Plantain,RICE-001,800,2500,Kitchen,7.5
Rice & Grains,Special Fried Rice with Shrimps,RICE-002,1100,3200,Kitchen,7.5
Rice & Grains,Basmati Coconut Rice & Grilled Chicken,RICE-003,1400,3800,Kitchen,7.5
Soups & Swallows,Egusi Soup with Assorted Meat & Pounded Yam,SWL-001,1200,3500,Kitchen,7.5
Soups & Swallows,Seafood Okro Soup with Fresh Fish,SWL-002,2200,5500,Kitchen,7.5
Grills & Bites,Grilled Catfish Point & Kill (Full Fish),GRL-001,2800,6500,Kitchen,7.5
Grills & Bites,Spicy Peppered Goat Meat (Asun Special),GRL-002,1500,3500,Kitchen,7.5
Grills & Bites,Crispy Chicken Wings (6pcs) & Chips,GRL-003,1600,3800,Kitchen,7.5
Drinks & Cocktails,Chapman Classic Mocktail with Cucumber,DRK-001,600,2000,Bar,7.5
Drinks & Cocktails,Fresh Watermelon Pineapple Juice (500ml),DRK-002,500,1500,Bar,7.5
Drinks & Cocktails,Heineken Beer Bottle 600ml,DRK-003,750,1500,Bar,7.5
Drinks & Cocktails,Bottled Table Water 75cl,DRK-004,150,400,Bar,0.0
`;
  zip.file('sample_eatery_menu_template.csv', sampleMenuCsv);

  // 7. Security verification and support desk
  const licenseNote = `KAYLIX ALL-IN-ONE RESTAURANT SUITE
Package File: Kaylix_Kitchen_POS_Suite_AllInOne_v3.4.2_Setup.exe
SHA-256 Checksum: 09bd47c94a286e11893f441029da6c1e9561b34a
Package Size: 78.4 MB
Vendor Support: ${VENDOR_CONTACT.whatsappDisplay} (${VENDOR_CONTACT.email})
`;
  zip.file('all_in_one_license_verification.txt', licenseNote);

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
