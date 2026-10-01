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
