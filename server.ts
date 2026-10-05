import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  verifyAdminPin,
  generateServerMasterKey,
  validateServerMasterKey,
  generateAdminOtp,
  verifyAdminOtpOrPin,
  ADMIN_RECOVERY_PHONE_DISPLAY,
} from './server/licenseService.ts';
import {
  getAllCustomers,
  createCustomerRecord,
  updateCustomerRecord,
  deleteCustomerRecord,
  generateLicenseForExistingCustomer,
  exportDatabaseCsv,
} from './server/customerDatabase.ts';
import {
  getPricingConfig,
  updatePricingConfig,
  resetPricingConfig,
  verifyStaffCredentials,
  createStaffAccount,
  exportAuditLogCsv,
  generateWhatsAppOtp,
  verifyWhatsAppOtp,
} from './server/pricingDatabase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Kaylix Master Licensing Backend',
    version: 'v3.4.2',
    timestamp: new Date().toISOString(),
  });
});

// POST /api/admin/request-otp - Generate 6-digit random code sent to 234 806 0395 329
app.post('/api/admin/request-otp', (req, res) => {
  try {
    const otpData = generateAdminOtp();
    res.json({
      success: true,
      message: `Security unlock code generated for registered phone ${otpData.phone}`,
      phone: otpData.phone,
      whatsappUrl: otpData.whatsappUrl,
      smsUrl: otpData.smsUrl,
      code: otpData.code,
      expiresInSeconds: 600,
    });
  } catch (error: any) {
    console.error('Request OTP error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate security code' });
  }
});

// POST /api/admin/verify-pin - Verify Master PIN or random OTP
app.post('/api/admin/verify-pin', (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN or Security Code is required' });
    }

    if (verifyAdminOtpOrPin(pin)) {
      res.json({ success: true, message: 'Admin verified successfully' });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid Authorization PIN or Expired Security Code. Try again or request a new code.',
      });
    }
  } catch (error: any) {
    console.error('Verify PIN error:', error);
    res.status(500).json({ success: false, error: 'Internal verification error' });
  }
});

// POST /api/license/generate - Backend Master Key Generator with PIN/OTP verification
app.post('/api/license/generate', (req, res) => {
  try {
    const { pin, params } = req.body;

    if (!verifyAdminOtpOrPin(pin)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid Reseller Master PIN or Security Code. Access rejected by server.',
      });
    }

    if (!params || !params.businessName || !params.edition) {
      return res.status(400).json({
        success: false,
        error: 'Missing required license parameters (businessName and edition).',
      });
    }

    const license = generateServerMasterKey(params);
    res.json({
      success: true,
      license,
      generatedBy: 'Kaylix Master License Engine (Server-Side)',
    });
  } catch (error: any) {
    console.error('License generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate license on server: ' + (error?.message || 'Internal error'),
    });
  }
});

// POST /api/license/validate - Server cryptographic signature verification
app.post('/api/license/validate', (req, res) => {
  try {
    const { licenseKey, businessName } = req.body;
    if (!licenseKey) {
      return res.status(400).json({
        isValid: false,
        error: 'License key string is required.',
      });
    }

    const result = validateServerMasterKey(licenseKey, businessName);
    res.json(result);
  } catch (error: any) {
    console.error('License validation error:', error);
    res.status(500).json({
      isValid: false,
      error: 'Server validation error: ' + (error?.message || 'Internal error'),
    });
  }
});

// POST /api/license/batch - Bulk Master Keys Generation for Resellers
app.post('/api/license/batch', (req, res) => {
  try {
    const { pin, count = 5, params } = req.body;

    if (!verifyAdminOtpOrPin(pin)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid Reseller Master PIN or Security Code.',
      });
    }

    const batchCount = Math.min(Math.max(1, count), 50);
    const licenses = [];

    for (let i = 1; i <= batchCount; i++) {
      const chars = '0123456789ABCDEF';
      const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const hwid = `${segment()}-${segment()}-${segment()}`;

      const bParams = {
        ...params,
        businessName: params?.businessName
          ? `${params.businessName} (Node #${i})`
          : `Reseller Batch Client #${i} (${(params?.edition || 'standard').toUpperCase()})`,
        hwid,
      };

      licenses.push(generateServerMasterKey(bParams));
    }

    res.json({
      success: true,
      count: licenses.length,
      licenses,
    });
  } catch (error: any) {
    console.error('Batch generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate batch on server: ' + (error?.message || 'Internal error'),
    });
  }
});

// ==========================================
// CUSTOMER & SUBSCRIPTIONS DATABASE API
// ==========================================

// GET /api/customers - Retrieve all customer records
app.get('/api/customers', (req, res) => {
  try {
    const customers = getAllCustomers();
    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error: any) {
    console.error('Fetch customers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer database: ' + (error?.message || 'Internal error'),
    });
  }
});

// POST /api/orders & POST /api/customers - Record new order/inquiry from WhatsApp submit or Admin
app.post(['/api/orders', '/api/customers'], (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData) {
      return res.status(400).json({ success: false, error: 'No order data provided' });
    }

    const savedRecord = createCustomerRecord(orderData);
    res.json({
      success: true,
      message: 'Order and customer details recorded in database successfully.',
      customer: savedRecord,
    });
  } catch (error: any) {
    console.error('Save customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record customer in database: ' + (error?.message || 'Internal error'),
    });
  }
});

// PATCH /api/customers/:id - Update customer record status, license, amount, notes
app.patch('/api/customers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = updateCustomerRecord(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Customer record not found' });
    }
    res.json({
      success: true,
      customer: updated,
    });
  } catch (error: any) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update record: ' + (error?.message || 'Internal error'),
    });
  }
});

// DELETE /api/customers/:id - Delete customer record
app.delete('/api/customers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteCustomerRecord(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Customer record not found' });
    }
    res.json({
      success: true,
      message: 'Record deleted from database.',
    });
  } catch (error: any) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete record: ' + (error?.message || 'Internal error'),
    });
  }
});

// POST /api/customers/:id/generate-license - Issue authenticated Master License Key to customer
app.post('/api/customers/:id/generate-license', (req, res) => {
  try {
    const { id } = req.params;
    const result = generateLicenseForExistingCustomer(id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({
      success: true,
      message: 'License key generated and bound to customer.',
      customer: result.customer,
      licenseKey: result.licenseKey,
    });
  } catch (error: any) {
    console.error('Generate license for customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate license: ' + (error?.message || 'Internal error'),
    });
  }
});

// GET /api/customers/export/csv - Export CSV of all customers
app.get('/api/customers/export/csv', (req, res) => {
  try {
    const csv = exportDatabaseCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Kaylix_Customer_Database.csv"');
    res.send(csv);
  } catch (error: any) {
    console.error('Export CSV error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export CSV: ' + (error?.message || 'Internal error'),
    });
  }
});

// GET /api/pricing - Get current official plans and hardware pricing
app.get('/api/pricing', (req, res) => {
  try {
    const pricing = getPricingConfig();
    res.json({ success: true, pricing });
  } catch (error: any) {
    console.error('Get pricing error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pricing configuration' });
  }
});

// POST /api/pricing/auth - Staff & Store Manager Login with username & password
app.post('/api/pricing/auth', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }
    const staff = verifyStaffCredentials(username, password);
    if (!staff) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
    res.json({
      success: true,
      message: `Welcome, ${staff.name}`,
      user: {
        id: staff.id,
        username: staff.username,
        name: staff.name,
        role: staff.role,
        phone: staff.phone,
      },
    });
  } catch (error: any) {
    console.error('Staff auth error:', error);
    res.status(500).json({ success: false, error: 'Staff authentication failed' });
  }
});

// POST /api/pricing/auth/request-otp - Send generated 5-digit code to staff WhatsApp
app.post('/api/pricing/auth/request-otp', (req, res) => {
  try {
    const { username, phone } = req.body;
    if (!username && !phone) {
      return res.status(400).json({ success: false, error: 'Username and phone number are required' });
    }
    const result = generateWhatsAppOtp(username, phone);
    res.json({
      success: true,
      message: `5-Digit code generated and dispatched to WhatsApp (+${result.phone})`,
      phone: result.phone,
      whatsappUrl: result.whatsappUrl,
      code: result.code, // Returned for dev/preview and direct WhatsApp opening
      staff: result.staff ? {
        username: result.staff.username,
        name: result.staff.name,
        role: result.staff.role,
        phone: result.staff.phone,
      } : undefined,
    });
  } catch (error: any) {
    console.error('Request OTP error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate 5-digit WhatsApp code' });
  }
});

// POST /api/pricing/auth/verify-otp - Verify 5-digit code and grant access to portal
app.post('/api/pricing/auth/verify-otp', (req, res) => {
  try {
    const { username, phone, code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: '5-Digit code is required' });
    }
    const result = verifyWhatsAppOtp(username, phone, code);
    if (!result.success || !result.staff) {
      return res.status(401).json({ success: false, error: result.error || 'Invalid 5-digit verification code' });
    }
    res.json({
      success: true,
      message: `Welcome, ${result.staff.name}! Access granted.`,
      user: {
        id: result.staff.id,
        username: result.staff.username,
        name: result.staff.name,
        role: result.staff.role,
        phone: result.staff.phone,
      },
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// POST /api/pricing/staff - Admin creates a new staff/store account
app.post('/api/pricing/staff', (req, res) => {
  try {
    const { newStaff, adminSession } = req.body;
    if (!newStaff || !newStaff.username || !newStaff.password || !newStaff.name) {
      return res.status(400).json({ success: false, error: 'Complete staff details required' });
    }
    const created = createStaffAccount(newStaff, adminSession);
    const updatedPricing = getPricingConfig();
    res.json({
      success: true,
      message: `Staff account ${created.name} (@${created.username}) created.`,
      staff: created,
      pricing: updatedPricing,
    });
  } catch (error: any) {
    console.error('Create staff error:', error);
    res.status(500).json({ success: false, error: 'Failed to create staff account' });
  }
});

// POST /api/pricing - Update plans and hardware pricing by admin or store manager
app.post('/api/pricing', (req, res) => {
  try {
    const { pricing, userSession, actionType, actionSummary } = req.body;
    if (!pricing) {
      return res.status(400).json({ success: false, error: 'No pricing payload provided' });
    }
    const updated = updatePricingConfig(pricing, userSession, actionType, actionSummary);
    res.json({
      success: true,
      message: 'Plans and hardware pricing updated successfully.',
      pricing: updated,
    });
  } catch (error: any) {
    console.error('Update pricing error:', error);
    res.status(500).json({ success: false, error: 'Failed to update pricing configuration' });
  }
});

// POST /api/pricing/reset - Reset pricing to factory default values
app.post('/api/pricing/reset', (req, res) => {
  try {
    const { adminSession } = req.body;
    const reset = resetPricingConfig(adminSession);
    res.json({
      success: true,
      message: 'Pricing restored to factory default matrix.',
      pricing: reset,
    });
  } catch (error: any) {
    console.error('Reset pricing error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset pricing' });
  }
});

// GET /api/pricing/audit/csv - Download pricing audit history CSV
app.get('/api/pricing/audit/csv', (req, res) => {
  try {
    const csv = exportAuditLogCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Kaylix_Pricing_Audit_Log.csv"');
    res.send(csv);
  } catch (error: any) {
    console.error('Export audit log error:', error);
    res.status(500).json({ success: false, error: 'Failed to export pricing audit log' });
  }
});

// GET /api/download/enterprise-package - One-Click Novice Enterprise Package (.zip)
app.get(['/api/download/enterprise-package', '/download/enterprise-package.zip'], async (req, res) => {
  try {
    const JSZip = (await import('jszip')).default;
    const {
      getEnterpriseHtmlApp,
      getEnterpriseReadme,
      getEnterpriseBatchScript,
      getEnterpriseVbsScript,
      getEnterpriseIniConfig,
      getSampleRequisitionCsv,
      getSampleCommissaryRecipesCsv,
      getSampleVipLoyaltyCsv,
      getSampleAccountingCsv,
    } = await import('./src/utils/enterprisePackageContent.ts');

    const zip = new JSZip();
    zip.file('START_HERE_KAYLIX_ENTERPRISE.html', getEnterpriseHtmlApp());
    zip.file('One_Click_Enterprise_Setup.bat', getEnterpriseBatchScript());
    zip.file('One_Click_Enterprise_Setup.vbs', getEnterpriseVbsScript());
    zip.file('HOW_TO_RUN_FOR_NOVICES_README.txt', getEnterpriseReadme());
    zip.file('Kaylix_Enterprise_QuickStart_Manual.txt', getEnterpriseReadme());
    zip.file('config_enterprise.ini', getEnterpriseIniConfig());
    zip.file('sample_branch_stock_requisitions.csv', getSampleRequisitionCsv());
    zip.file('sample_commissary_recipes_yield.csv', getSampleCommissaryRecipesCsv());
    zip.file('sample_vip_loyalty_members.csv', getSampleVipLoyaltyCsv());
    zip.file('sample_accounting_quickbooks_sync.csv', getSampleAccountingCsv());
    zip.file('sample_eatery_menu_template.csv', `Category,Item Name,Barcode,Cost Price (NGN),Selling Price (NGN),Printer Destination,Tax Rate (%)
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
`);
    zip.file('enterprise_license_verification.txt', `KAYLIX ENTERPRISE FLAGSHIP SUITE
Package File: Kaylix_Kitchen_v3.4.2_Enterprise_Master.exe
SHA-256 Checksum: 09bd47c94a286e11893f441029da6c1e9561b34a
Edition: Enterprises Plan (Omnichannel Flagship)
Terminals: Unlimited Terminals + Central Cloud Hub
All 7 Enterprise modules enabled and active.
`);

    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="Kaylix_Kitchen_v3.4.2_Enterprise_Master_Bundle.zip"');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error: any) {
    console.error('Download Enterprise Package error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate package: ' + error.message });
  }
});

// Full-Stack Server Integration with Vite
async function startServer() {
  const distDir = path.resolve(__dirname, 'dist');
  const indexHtml = path.resolve(distDir, 'index.html');

  // Check if compiled production build exists
  if (process.env.NODE_ENV === 'production' && fs.existsSync(indexHtml)) {
    console.log('[Server] Serving production static build from dist/');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      res.sendFile(indexHtml, (err) => {
        if (err) next(err);
      });
    });
  } else {
    // In development OR if production was started without running build (e.g. Render default build command)
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[Server Notice] NODE_ENV=production but dist/index.html was not found. Mounting Vite middleware fallback so site remains fully accessible.'
      );
    }
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kaylix Kitchen Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
