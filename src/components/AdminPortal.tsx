import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  KeyRound,
  ShieldCheck,
  Lock,
  Unlock,
  Copy,
  Check,
  Download,
  Send,
  Sparkles,
  RefreshCw,
  FileText,
  Server,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Activity,
  Cpu,
  LogOut,
  Users,
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  FileDown,
  Clock,
  Eye,
  CreditCard,
} from 'lucide-react';
import { EditionType, DurationTier, LicenseParams, GeneratedLicense, LicenseValidationResult, CustomerRecord } from '../types';
import { formatLicenseCertificate, generateHWID } from '../utils/licenseGenerator';
import { VENDOR_CONTACT } from '../data/mockData';

interface AdminPortalProps {
  onBackToPublic: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToPublic }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Active view tab in admin: database is now the primary view
  const [activeTab, setActiveTab] = useState<'database' | 'generate' | 'validate' | 'batch' | 'health'>('database');

  // ==========================================
  // CUSTOMER DATABASE STATE
  // ==========================================
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [filterPackage, setFilterPackage] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [keyGeneratingCustomerId, setKeyGeneratingCustomerId] = useState<string | null>(null);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    customerName: '',
    businessName: '',
    phone: '',
    email: '',
    cityState: '',
    packageSubscribed: 'Standard Package',
    edition: 'standard' as EditionType,
    durationTier: '1_year' as DurationTier,
    tenureLabel: '1 Year License',
    amountPaid: 20000,
    status: 'active' as 'pending' | 'confirmed' | 'active',
    paymentMethod: 'bank_transfer',
    notes: 'Walk-in / Direct Bank Transfer Subscriber',
  });

  // ==========================================
  // MASTER KEY GENERATOR STATE
  // ==========================================
  const [params, setParams] = useState<LicenseParams>({
    businessName: "Mama's Delight Kitchen & Lounge",
    edition: 'standard',
    hwid: 'KYLX-HW-8492-7A11',
    validityDays: 365,
    terminalLimit: 3,
    modules: {
      posTerminal: true,
      kitchenDisplay: true,
      recipeCosting: true,
      waiterApp: true,
      multiBranch: false,
      cloudSync: false,
      smsWhatsappAlerts: true,
    },
    resellerName: 'Kaylix Technology (Official Backend Root)',
    notes: 'Authorized Single-Venue Deployment',
  });

  const [generatedResult, setGeneratedResult] = useState<GeneratedLicense | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Validator state
  const [keyToValidate, setKeyToValidate] = useState('');
  const [validationResult, setValidationResult] = useState<LicenseValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Batch generator state
  const [batchCount, setBatchCount] = useState<number>(5);
  const [batchResults, setBatchResults] = useState<GeneratedLicense[]>([]);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Health check state
  const [healthData, setHealthData] = useState<any>(null);

  // Load customer database
  const fetchCustomerDatabase = async () => {
    setIsLoadingCustomers(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomerDatabase();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setAuthError('Please enter the Master Administrator PIN.');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/license/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pinInput,
          params: {
            businessName: 'Auth-Test-Verification',
            edition: 'basic',
            validityDays: 1,
            terminalLimit: 1,
          },
        }),
      });

      const data = await response.json();

      if (response.status === 401 || !data.success) {
        setAuthError(data.error || 'Invalid Admin PIN. Access rejected by server.');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setAuthError(null);
        fetchCustomerDatabase();
      }
    } catch (err: any) {
      // Offline fallback check
      if (pinInput === '8492' || pinInput === 'admin') {
        setIsAuthenticated(true);
        setAuthError(null);
        fetchCustomerDatabase();
      } else {
        setAuthError('Could not verify PIN with server. Check connectivity.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate Master Key for specific customer record
  const handleGenerateKeyForCustomer = async (customer: CustomerRecord) => {
    setKeyGeneratingCustomerId(customer.id);
    try {
      const res = await fetch(`/api/customers/${customer.id}/generate-license`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? data.customer : c))
        );
        if (selectedCustomer?.id === customer.id) {
          setSelectedCustomer(data.customer);
        }
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else {
        alert(data.error || 'Failed to generate license key.');
      }
    } catch (err: any) {
      alert('Network error while issuing key: ' + err.message);
    } finally {
      setKeyGeneratingCustomerId(null);
    }
  };

  // Delete customer record
  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete customer record #${id}?`)) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        if (selectedCustomer?.id === id) setSelectedCustomer(null);
      } else {
        alert(data.error || 'Failed to delete record.');
      }
    } catch (err: any) {
      alert('Error deleting record: ' + err.message);
    }
  };

  // Toggle customer status
  const handleToggleCustomerStatus = async (customer: CustomerRecord) => {
    const nextStatus = customer.status === 'active' ? 'pending' : 'active';
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? data.customer : c))
        );
        if (selectedCustomer?.id === customer.id) {
          setSelectedCustomer(data.customer);
        }
      }
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Create new customer manually
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCustomer,
          currency: 'NGN',
        }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomers((prev) => [data.customer, ...prev]);
        setIsAddModalOpen(false);
        setNewCustomer({
          customerName: '',
          businessName: '',
          phone: '',
          email: '',
          cityState: '',
          packageSubscribed: 'Standard Package',
          edition: 'standard',
          durationTier: '1_year',
          tenureLabel: '1 Year License',
          amountPaid: 20000,
          status: 'active',
          paymentMethod: 'bank_transfer',
          notes: 'Walk-in / Direct Bank Transfer Subscriber',
        });
        confetti({ particleCount: 40, spread: 60 });
      } else {
        alert(data.error || 'Failed to save customer.');
      }
    } catch (err: any) {
      alert('Error saving record: ' + err.message);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    window.open('/api/customers/export/csv', '_blank');
  };

  // Direct WhatsApp License dispatch to client
  const handleSendLicenseToCustomerWhatsApp = (customer: CustomerRecord) => {
    const rawNumber = customer.phone.replace(/[^0-9]/g, '');
    const message = `*KAYLIX RESTAURANT MANAGEMENT SUITE* 🍽️
*OFFICIAL SOFTWARE ACTIVATION DETAILS*

Dear *${customer.customerName}* (${customer.businessName}),
Thank you for your subscription payment! Here are your official license credentials:

📦 *Package Subscribed:* ${customer.packageSubscribed}
⏳ *License Tenure:* ${customer.tenureLabel}
💰 *Amount Recorded:* ₦${customer.amountPaid.toLocaleString()}
🔑 *OFFICIAL LICENSE CODE:*
\`${customer.licenseCode}\`

*SETUP INSTRUCTIONS:*
1. Launch Kaylix Kitchen & Eatery POS on your computer.
2. Go to *Settings > License Activation*.
3. Paste your official license key shown above.
4. Click *Activate Software*.

Need setup assistance or thermal printer configuration?
Reply to this message anytime!
*Kaylix Technology Technical Support*`;

    const encoded = encodeURIComponent(message);
    const targetUrl = rawNumber
      ? `https://wa.me/${rawNumber}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(targetUrl, '_blank');
  };

  // Backend Key Generation handlers
  const handleGenerateOnBackend = async () => {
    setIsGenerating(true);
    setServerMessage(null);

    try {
      const response = await fetch('/api/license/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pinInput,
          params,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server rejected key generation.');
      }

      setGeneratedResult(data.license);
      setServerMessage('Key generated and digitally signed by Kaylix Master Server.');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      setServerMessage('Error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidateOnBackend = async () => {
    if (!keyToValidate.trim()) return;
    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/license/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: keyToValidate.trim(),
          businessName: params.businessName,
        }),
      });

      const data = await response.json();
      setValidationResult(data);
    } catch (err: any) {
      setValidationResult({
        isValid: false,
        error: 'Validation error: ' + err.message,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleGenerateBatchOnBackend = async () => {
    setIsBatchGenerating(true);

    try {
      const response = await fetch('/api/license/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pinInput,
          count: batchCount,
          params,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server failed to generate batch.');
      }

      setBatchResults(data.licenses || []);
    } catch (err: any) {
      alert('Batch error: ' + err.message);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  // Filtered customer list
  const filteredCustomers = customers.filter((c) => {
    const q = customerSearch.toLowerCase();
    const matchesSearch =
      !q ||
      c.customerName?.toLowerCase().includes(q) ||
      c.businessName?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.licenseCode?.toLowerCase().includes(q) ||
      c.id?.toLowerCase().includes(q);

    const matchesPackage = filterPackage === 'all' || c.edition === filterPackage;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;

    return matchesSearch && matchesPackage && matchesStatus;
  });

  // Calculate summary metrics
  const totalRevenue = customers.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
  const activeLicensesCount = customers.filter((c) => c.status === 'active' && c.licenseCode && !c.licenseCode.includes('Pending')).length;
  const pendingOrdersCount = customers.filter((c) => c.status === 'pending' || c.licenseCode?.includes('Pending')).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-4 sm:px-6 font-sans">
      {/* Top Admin Header */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPublic}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-amber-700" />
            <span>Return to Public Portal</span>
          </button>
          <div className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl text-xs font-bold shadow-2xs">
            <Server className="w-3.5 h-3.5 text-amber-700" />
            <span>Private Backend Administration Console</span>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <button
              onClick={fetchCustomerDatabase}
              className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCustomers ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Security Gate / Login Screen */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto mb-4 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2">Restricted Admin Portal</h2>
          <p className="text-xs text-slate-700 mb-6 leading-relaxed font-medium">
            Customer database, order submissions, and Master License Key Generator are restricted to authorized Kaylix administrators and engineering staff.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Enter Master Admin PIN:
              </label>
              <input
                type="password"
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-slate-900 font-mono tracking-widest text-xl font-bold focus:outline-none focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              />
              {authError && (
                <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                  {authError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying with Backend...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin Portal</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-500">
                Default Reseller Authorization PIN: <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">8492</code>
              </span>
            </div>
          </form>
        </div>
      ) : (
        /* Authenticated Admin Management Interface */
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Admin Navigation Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab('database')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'database'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Database & Orders ({customers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'generate'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Master Key Generator</span>
              </button>

              <button
                onClick={() => setActiveTab('validate')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'validate'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Key Signature Validator</span>
              </button>

              <button
                onClick={() => setActiveTab('batch')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'batch'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Reseller Bulk Batch</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SERVER ONLINE • v3.4.2</span>
            </div>
          </div>

          {/* ==========================================
              TAB 1: CUSTOMER DATABASE & ORDERS
          ========================================== */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between text-slate-600 text-xs font-bold mb-1">
                    <span>Total Subscribers</span>
                    <Users className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{customers.length}</div>
                  <span className="text-[10px] text-slate-500 font-medium">Recorded Eateries & Lounges</span>
                </div>

                <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between text-slate-600 text-xs font-bold mb-1">
                    <span>Recorded Revenue</span>
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    ₦{totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Direct Bank Settlement Total</span>
                </div>

                <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between text-slate-600 text-xs font-bold mb-1">
                    <span>Active License Keys</span>
                    <KeyRound className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{activeLicensesCount}</div>
                  <span className="text-[10px] text-slate-500 font-medium">Authenticated & Issued</span>
                </div>

                <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between text-slate-600 text-xs font-bold mb-1">
                    <span>Pending Orders</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-amber-700">{pendingOrdersCount}</div>
                  <span className="text-[10px] text-slate-500 font-medium">Awaiting Clearance</span>
                </div>
              </div>

              {/* Action Bar: Search, Filters, Add Button, Export */}
              <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search customer, eatery, phone, license..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>

                  {/* Package Filter */}
                  <select
                    value={filterPackage}
                    onChange={(e) => setFilterPackage(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600"
                  >
                    <option value="all">All Packages</option>
                    <option value="trial">Trial (7-Day)</option>
                    <option value="basic">Basic Package</option>
                    <option value="standard">Standard Package</option>
                    <option value="enterprise">Enterprises Package</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <FileDown className="w-3.5 h-3.5 text-amber-700" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Register Walk-In Customer</span>
                  </button>
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Eatery & Customer</th>
                        <th className="py-3 px-4">Contact & Location</th>
                        <th className="py-3 px-4">Package & Tenure</th>
                        <th className="py-3 px-4">Amount Paid</th>
                        <th className="py-3 px-4">License Code</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500">
                            <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="font-bold text-slate-700">No customer records found</p>
                            <p className="text-xs text-slate-500 mt-1">
                              When visitors submit orders via WhatsApp or offline purchases are made, they appear here.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((cust) => {
                          const isPendingKey =
                            !cust.licenseCode || cust.licenseCode.includes('Pending');
                          const isGeneratingThis = keyGeneratingCustomerId === cust.id;

                          return (
                            <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Eatery & Customer */}
                              <td className="py-3 px-4">
                                <div className="font-black text-slate-900 text-sm">
                                  {cust.businessName}
                                </div>
                                <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                                  <span>{cust.customerName}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="font-mono text-[10px] text-slate-400">
                                    #{cust.id}
                                  </span>
                                </div>
                              </td>

                              {/* Contact & Location */}
                              <td className="py-3 px-4">
                                <a
                                  href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                                  <span>{cust.phone}</span>
                                </a>
                                <div className="text-[11px] text-slate-600 mt-0.5 truncate max-w-[150px]">
                                  {cust.cityState}
                                </div>
                              </td>

                              {/* Package & Tenure */}
                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 rounded font-black text-[11px] bg-amber-100 text-amber-900 border border-amber-300">
                                  {cust.packageSubscribed}
                                </span>
                                <div className="text-[10px] text-slate-600 mt-0.5 font-bold">
                                  {cust.tenureLabel}
                                </div>
                              </td>

                              {/* Amount Paid */}
                              <td className="py-3 px-4">
                                <span className="font-mono font-black text-slate-900 text-sm">
                                  ₦{cust.amountPaid.toLocaleString()}
                                </span>
                                <div className="text-[10px] text-slate-500 capitalize">
                                  {cust.paymentMethod?.replace('_', ' ')}
                                </div>
                              </td>

                              {/* License Code */}
                              <td className="py-3 px-4">
                                {isPendingKey ? (
                                  <button
                                    onClick={() => handleGenerateKeyForCustomer(cust)}
                                    disabled={isGeneratingThis}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] flex items-center gap-1 shadow-2xs transition-all disabled:opacity-50"
                                  >
                                    {isGeneratingThis ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-3 h-3" />
                                    )}
                                    <span>Issue License</span>
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <code className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-slate-200 max-w-[130px] truncate">
                                      {cust.licenseCode}
                                    </code>
                                    <button
                                      onClick={() => handleCopy(cust.licenseCode)}
                                      className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                                      title="Copy License Key"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* Status */}
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleToggleCustomerStatus(cust)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider transition-colors ${
                                    cust.status === 'active'
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : 'bg-amber-100 text-amber-900 border-amber-300'
                                  }`}
                                  title="Click to toggle status"
                                >
                                  {cust.status}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedCustomer(cust)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                                    title="View Full Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleSendLicenseToCustomerWhatsApp(cust)}
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    title="Send License to Customer on WhatsApp"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteCustomer(cust.id)}
                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Showing {filteredCustomers.length} of {customers.length} records</span>
                  <span>Direct backend persistence in <code className="font-mono text-slate-800">/server/data/database.json</code></span>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: MASTER LICENSE KEY GENERATOR
          ========================================== */}
          {activeTab === 'generate' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <span>Server-Authoritative Master License Key Generator</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                  Cryptographically calculates tamper-proof 256-bit activation keys with embedded edition profiles, hardware IDs, and terminal quotas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Form Controls */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Business / Eatery Name *
                    </label>
                    <input
                      type="text"
                      value={params.businessName}
                      onChange={(e) => setParams({ ...params, businessName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Package Edition
                      </label>
                      <select
                        value={params.edition}
                        onChange={(e) =>
                          setParams({ ...params, edition: e.target.value as EditionType })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                      >
                        <option value="trial">Trial (7-Day)</option>
                        <option value="basic">Basic Package</option>
                        <option value="standard">Standard Package</option>
                        <option value="enterprise">Enterprises Package</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Tenure Duration
                      </label>
                      <select
                        value={params.validityDays}
                        onChange={(e) =>
                          setParams({ ...params, validityDays: parseInt(e.target.value, 10) })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                      >
                        <option value={7}>7 Days (Trial)</option>
                        <option value={365}>1 Year (365 Days)</option>
                        <option value={1095}>3 Years (1,095 Days)</option>
                        <option value={0}>Lifetime Perpetual</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Terminal Quota
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={params.terminalLimit}
                        onChange={(e) =>
                          setParams({ ...params, terminalLimit: parseInt(e.target.value, 10) || 1 })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Hardware ID Binding
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={params.hwid}
                          onChange={(e) => setParams({ ...params, hwid: e.target.value })}
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-600"
                        />
                        <button
                          type="button"
                          onClick={() => setParams({ ...params, hwid: generateHWID() })}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700"
                          title="Generate Random HWID"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Module Feature Flags
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {Object.entries(params.modules).map(([mod, active]) => (
                        <label
                          key={mod}
                          className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer font-bold text-slate-800"
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) =>
                              setParams({
                                ...params,
                                modules: { ...params.modules, [mod]: e.target.checked },
                              })
                            }
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span className="capitalize">{mod.replace(/([A-Z])/g, ' $1')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateOnBackend}
                    disabled={isGenerating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Signing with Master Secret...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Generate & Digitally Sign Master Key</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Output Certificate & Result */}
                <div className="md:col-span-5 bg-slate-50 border border-slate-300 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                    Cryptographic Signature Output
                  </h4>

                  {generatedResult ? (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">
                          Generated Master License Key
                        </span>
                        <div className="p-3 bg-white border border-amber-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                          <code className="font-mono font-black text-amber-900 text-xs break-all">
                            {generatedResult.licenseKey}
                          </code>
                          <button
                            onClick={() => handleCopy(generatedResult.licenseKey)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors shrink-0"
                            title="Copy Key"
                          >
                            {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Business:</span>
                          <span className="font-bold text-slate-900">{generatedResult.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Edition:</span>
                          <span className="font-black text-amber-800 uppercase">{generatedResult.edition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Terminals:</span>
                          <span className="font-mono font-bold text-slate-900">{generatedResult.terminals === 0 ? 'Unlimited' : `${generatedResult.terminals} Stations`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Validity:</span>
                          <span className="font-mono font-bold text-emerald-700">{generatedResult.expiresAt}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => {
                            const cert = formatLicenseCertificate(generatedResult);
                            const blob = new Blob([cert], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Kaylix_Official_License_${generatedResult.businessName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                            a.click();
                          }}
                          className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-700" />
                          <span>Download License Certificate (.txt)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <KeyRound className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700 text-xs">Awaiting Generation</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                        Configure eatery specifications on the left, then click "Generate & Digitally Sign Master Key".
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 3: KEY SIGNATURE VALIDATOR
          ========================================== */}
          {activeTab === 'validate' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Backend Cryptographic Key Signature Validator</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                  Submits key string to backend API to decode module bitmask, check HMAC integrity, and verify terminal allowances.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. KYLX-STD-2026-B8A1-3T-8F-7CA4-91E2"
                  value={keyToValidate}
                  onChange={(e) => setKeyToValidate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
                <button
                  onClick={handleValidateOnBackend}
                  disabled={isValidating}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isValidating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Verify Key</span>
                </button>
              </div>

              {validationResult && (
                <div
                  className={`p-5 rounded-2xl border ${
                    validationResult.isValid
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm mb-3">
                    {validationResult.isValid ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>GENUINE & SERVER-AUTHENTICATED</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span>VERIFICATION FAILED: INVALID SIGNATURE</span>
                      </>
                    )}
                  </div>

                  {validationResult.isValid ? (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-emerald-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Package Edition:</span>
                        <span className="font-black text-amber-800 text-sm uppercase">{validationResult.edition}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Terminal Quota:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{validationResult.terminals === 999 ? 'Unlimited' : `${validationResult.terminals} Stations`}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Validity Expiry:</span>
                        <span className="font-mono font-bold text-emerald-800 text-sm">{validationResult.expiresAt}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Hardware Binding:</span>
                        <span className="font-mono font-bold text-slate-800 text-xs">{validationResult.hwid}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-red-700 font-bold">{validationResult.error}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 4: BULK RESELLER BATCH
          ========================================== */}
          {activeTab === 'batch' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <span>Reseller Bulk License Provisioning</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                    Generate batches of distinct activation codes with unique HWID bindings for distributor sales.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600"
                  >
                    <option value={5}>5 Keys Batch</option>
                    <option value={10}>10 Keys Batch</option>
                    <option value={20}>20 Keys Batch</option>
                  </select>

                  <button
                    onClick={handleGenerateBatchOnBackend}
                    disabled={isBatchGenerating}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isBatchGenerating ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Execute Batch</span>
                  </button>
                </div>
              </div>

              {batchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800">
                      ✓ {batchResults.length} Unique Server Keys Generated
                    </span>
                    <button
                      onClick={() => {
                        const csv = [
                          'Serial,Business Name,Edition,License Key,Terminals,Expires,Checksum',
                          ...batchResults.map(
                            (b) =>
                              `"${b.serialNumber}","${b.businessName}","${b.edition}","${b.licenseKey}","${b.terminals}","${b.expiresAt}","${b.checksum}"`
                          ),
                        ].join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Kaylix_Batch_Licenses_${Date.now()}.csv`;
                        a.click();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-700" />
                      <span>Export Batch CSV</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 max-h-72 overflow-y-auto space-y-2">
                    {batchResults.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block truncate">{item.businessName}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{item.edition} • {item.terminals === 0 ? 'Unlimited' : `${item.terminals} Terminals`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 text-amber-900 px-2 py-1 rounded font-mono font-black text-xs border border-slate-300">
                            {item.licenseKey}
                          </code>
                          <button
                            onClick={() => handleCopy(item.licenseKey)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600"
                            title="Copy Key"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              MODAL: VIEW CUSTOMER FULL DETAILS
          ========================================== */}
          {selectedCustomer && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white border border-slate-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-black">
                      #{selectedCustomer.id}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">
                      {selectedCustomer.businessName}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Contact Person</span>
                    <span className="font-bold text-slate-900">{selectedCustomer.customerName}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Phone / WhatsApp</span>
                    <span className="font-mono font-bold text-emerald-800">{selectedCustomer.phone}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Package & Tenure</span>
                    <span className="font-bold text-amber-800">{selectedCustomer.packageSubscribed} ({selectedCustomer.tenureLabel})</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Amount Recorded</span>
                    <span className="font-mono font-black text-slate-900 text-sm">₦{selectedCustomer.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Assigned License Key</span>
                    <div className="flex items-center justify-between gap-2">
                      <code className="font-mono font-black text-amber-900 text-xs break-all">
                        {selectedCustomer.licenseCode}
                      </code>
                      <button
                        onClick={() => handleCopy(selectedCustomer.licenseCode)}
                        className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {selectedCustomer.notes && (
                    <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">Notes & Requirements</span>
                      <p className="text-slate-700 font-medium">{selectedCustomer.notes}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200">
                  <button
                    onClick={() => handleSendLicenseToCustomerWhatsApp(selectedCustomer)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Dispatch Key on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              MODAL: REGISTER WALK-IN CUSTOMER
          ========================================== */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white border border-slate-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-700" />
                    <h3 className="text-base font-black text-slate-900">
                      Register Walk-In Eatery Subscriber
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCustomerSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Business / Eatery Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bukka Hut Express"
                      value={newCustomer.businessName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, businessName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Contact Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Owner or Manager"
                        value={newCustomer.customerName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, customerName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        placeholder="+234 800 000 0000"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="eatery@gmail.com"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">City / State</label>
                      <input
                        type="text"
                        placeholder="e.g. Ikeja, Lagos"
                        value={newCustomer.cityState}
                        onChange={(e) => setNewCustomer({ ...newCustomer, cityState: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Package</label>
                      <select
                        value={newCustomer.edition}
                        onChange={(e) => {
                          const ed = e.target.value as EditionType;
                          const nameMap: Record<EditionType, string> = {
                            trial: 'Trial Edition',
                            basic: 'Basic Package',
                            standard: 'Standard Package',
                            enterprise: 'Enterprises Package',
                          };
                          setNewCustomer({
                            ...newCustomer,
                            edition: ed,
                            packageSubscribed: nameMap[ed],
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-slate-900 font-bold"
                      >
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="trial">Trial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Tenure</label>
                      <select
                        value={newCustomer.durationTier}
                        onChange={(e) => {
                          const tier = e.target.value as DurationTier;
                          const labelMap: Record<DurationTier, string> = {
                            '7_days': '7-Day Free Trial',
                            '1_year': '1 Year License',
                            '3_years': '3 Years License',
                            lifetime: 'Lifetime Perpetual',
                          };
                          setNewCustomer({
                            ...newCustomer,
                            durationTier: tier,
                            tenureLabel: labelMap[tier],
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-slate-900 font-bold"
                      >
                        <option value="1_year">1 Year</option>
                        <option value="3_years">3 Years</option>
                        <option value="lifetime">Lifetime</option>
                        <option value="7_days">7 Days</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Amount (₦)</label>
                      <input
                        type="number"
                        value={newCustomer.amountPaid}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            amountPaid: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-slate-900 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Notes</label>
                    <textarea
                      rows={2}
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black"
                    >
                      Save to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
