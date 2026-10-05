import React, { useState, useEffect } from 'react';
import {
  BadgeDollarSign,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Tag,
  Monitor,
  Printer,
  Smartphone,
  ScanBarcode,
  Coins,
  Plus,
  Trash2,
  Edit2,
  Clock,
  User,
  ShieldCheck,
  TrendingUp,
  Download,
  Filter,
  Check,
  X,
  Lock,
  RefreshCw,
  LogOut,
  Sliders,
  Tv,
  Radio,
  MessageSquare,
  Phone,
  Send,
  ExternalLink,
  ChevronRight,
  KeyRound,
  Users,
  Info,
} from 'lucide-react';
import {
  PricingConfig,
  getCustomPricing,
  savePricing,
  resetPricingToDefaults,
  calculateDollarFromNaira,
  getCurrentStaffSession,
  setStaffSession,
  StaffAccount,
  PricingAuditLogEntry,
  INITIAL_STAFF_ACCOUNTS,
  requestStaffWhatsAppOtp,
  verifyStaffWhatsAppOtp,
  normalizePhoneNumber,
} from '../utils/pricingStorage';
import { HardwareAddon, HardwareAvailability, HardwareCategory } from '../types';

export const AdminPricingManager: React.FC = () => {
  const [pricing, setPricing] = useState<PricingConfig>(getCustomPricing);
  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(getCurrentStaffSession);
  
  // WhatsApp OTP Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'credentials' | 'enter_code'>('credentials');
  const [authUsername, setAuthUsername] = useState('store_manager');
  const [authPhone, setAuthPhone] = useState('08060395329');
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [dispatchedPhone, setDispatchedPhone] = useState('');
  const [dispatchedWhatsappUrl, setDispatchedWhatsappUrl] = useState('');
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(null);

  // New Staff Registration Modal State (Admin registers users with Phone Number)
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [showStaffDirectory, setShowStaffDirectory] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    username: '',
    password: '',
    name: '',
    role: 'store_manager' as 'admin' | 'store_manager' | 'pricing_officer',
    phone: '08060395329',
  });

  // Hardware Management Modals
  const [isAddHardwareModalOpen, setIsAddHardwareModalOpen] = useState(false);
  const [editingHardwareId, setEditingHardwareId] = useState<string | null>(null);
  const [hardwareForm, setHardwareForm] = useState<Partial<HardwareAddon>>({
    name: '',
    category: 'printer',
    priceNGN: 45000,
    priceUSD: 28,
    description: '',
    specs: '',
    availability: 'in_stock',
    badge: 'New 2026 Model',
    isFeatured: false,
  });

  // UI state
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [auditFilter, setAuditFilter] = useState<string>('all');
  const [hardwareFilter, setHardwareFilter] = useState<string>('all');

  useEffect(() => {
    setPricing(getCustomPricing());
    const handlePriceUpdate = (e: any) => {
      if (e.detail) {
        setPricing(e.detail);
      }
    };
    window.addEventListener('kaylix_pricing_updated', handlePriceUpdate);
    return () => window.removeEventListener('kaylix_pricing_updated', handlePriceUpdate);
  }, []);

  // Handle Black Market FX Rate change
  const handleFxRateChange = (newRateStr: string) => {
    const rate = Math.max(100, parseInt(newRateStr, 10) || 1620);
    setPricing((prev) => {
      const updated = { ...prev, blackMarketRateNGN: rate };
      if (updated.autoSyncUSD) {
        (['basic', 'standard', 'enterprise'] as const).forEach((planKey) => {
          (['1_year', '3_years', 'lifetime'] as const).forEach((tierKey) => {
            const naira = updated.plans[planKey][tierKey].priceNGN;
            updated.plans[planKey][tierKey].priceUSD = calculateDollarFromNaira(naira, rate);
          });
        });
        updated.hardwareItems = updated.hardwareItems.map((item) => ({
          ...item,
          priceUSD: calculateDollarFromNaira(item.priceNGN, rate),
        }));
      }
      return updated;
    });
  };

  // Recalculate all USD prices on demand
  const handleRecalculateAllUsd = () => {
    const rate = pricing.blackMarketRateNGN || 1620;
    setPricing((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev)) as PricingConfig;
      (['basic', 'standard', 'enterprise'] as const).forEach((planKey) => {
        (['1_year', '3_years', 'lifetime'] as const).forEach((tierKey) => {
          const naira = cloned.plans[planKey][tierKey].priceNGN;
          cloned.plans[planKey][tierKey].priceUSD = calculateDollarFromNaira(naira, rate);
        });
      });
      cloned.hardwareItems = cloned.hardwareItems.map((item) => ({
        ...item,
        priceUSD: calculateDollarFromNaira(item.priceNGN, rate),
      }));
      return cloned;
    });
    setSaveSuccess(`Recalculated all USD rates using Black Market FX peg: ₦${rate}/$1`);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Handle Plan Price Change
  const handlePlanPriceChange = (
    plan: 'basic' | 'standard' | 'enterprise',
    tier: '1_year' | '3_years' | 'lifetime',
    currency: 'priceNGN' | 'priceUSD',
    value: string
  ) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setPricing((prev) => {
      const next = { ...prev };
      const currentTier = { ...next.plans[plan][tier] };
      if (currency === 'priceNGN') {
        currentTier.priceNGN = num;
        if (prev.autoSyncUSD) {
          currentTier.priceUSD = calculateDollarFromNaira(num, prev.blackMarketRateNGN);
        }
      } else {
        currentTier.priceUSD = num;
      }
      return {
        ...next,
        plans: {
          ...next.plans,
          [plan]: {
            ...next.plans[plan],
            [tier]: currentTier,
          },
        },
      };
    });
  };

  // Handle existing Hardware Price Change
  const handleHardwarePriceChange = (
    hardwareId: string,
    currency: 'priceNGN' | 'priceUSD',
    value: string
  ) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setPricing((prev) => ({
      ...prev,
      hardwareItems: prev.hardwareItems.map((item) => {
        if (item.id === hardwareId) {
          if (currency === 'priceNGN') {
            return {
              ...item,
              priceNGN: num,
              priceUSD: prev.autoSyncUSD
                ? calculateDollarFromNaira(num, prev.blackMarketRateNGN)
                : item.priceUSD,
            };
          }
          return { ...item, priceUSD: num };
        }
        return item;
      }),
    }));
  };

  // Handle Hardware Availability Toggle
  const handleHardwareAvailabilityChange = (
    hardwareId: string,
    availability: HardwareAvailability
  ) => {
    setPricing((prev) => ({
      ...prev,
      hardwareItems: prev.hardwareItems.map((item) =>
        item.id === hardwareId ? { ...item, availability } : item
      ),
    }));
  };

  // Handle Google Drive Link change
  const handleDriveLinkChange = (
    planKey: 'allInOne' | 'trial' | 'basic' | 'standard' | 'enterprise',
    newUrl: string
  ) => {
    setPricing((prev) => ({
      ...prev,
      driveLinks: {
        allInOne: prev.driveLinks?.allInOne || 'https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Kitchen_AllInOne_POS_Suite_v342?usp=sharing',
        trial: prev.driveLinks?.trial || 'https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Trial_POS_v342?usp=sharing',
        basic: prev.driveLinks?.basic || 'https://drive.google.com/drive/folders/1kAx_Kaylix_Basic_POS_1Counter_2Handheld?usp=sharing',
        standard: prev.driveLinks?.standard || 'https://drive.google.com/drive/folders/1mYz_Kaylix_Standard_POS_MultiUser_KDS?usp=sharing',
        enterprise: prev.driveLinks?.enterprise || 'https://drive.google.com/drive/folders/1eNp_Kaylix_Enterprise_POS_CloudHQ?usp=sharing',
        [planKey]: newUrl,
      },
    }));
  };

  // Save All Changes (Records timestamped audit entry)
  const handleSaveAll = async (actionSummary?: string) => {
    setIsSaving(true);
    try {
      const session = currentStaff || {
        username: 'admin',
        role: 'admin',
        name: 'Chief Systems Administrator',
      };
      const summary =
        actionSummary ||
        `Adjusted official pricing & POS device inventory (FX Peg: ₦${pricing.blackMarketRateNGN}/$).`;
      const saved = await savePricing(pricing, session, 'price_update', summary);
      setPricing(saved);
      setSaveSuccess('Pricing and hardware inventory saved and published live with timestamp.');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to save prices', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add / Edit Hardware Device
  const handleSaveHardwareDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hardwareForm.name || !hardwareForm.priceNGN) return;

    const rate = pricing.blackMarketRateNGN || 1620;
    const computedUSD = hardwareForm.priceUSD || calculateDollarFromNaira(hardwareForm.priceNGN, rate);

    const session = currentStaff || {
      username: 'store_manager',
      role: 'store_manager',
      name: 'Store Manager',
    };

    let updatedList: HardwareAddon[];
    let summary: string;

    if (editingHardwareId) {
      updatedList = pricing.hardwareItems.map((item) =>
        item.id === editingHardwareId
          ? {
              ...item,
              ...(hardwareForm as HardwareAddon),
              priceUSD: computedUSD,
            }
          : item
      );
      summary = `Updated hardware device: "${hardwareForm.name}" (Status: ${hardwareForm.availability}, ₦${hardwareForm.priceNGN?.toLocaleString()}).`;
    } else {
      const newDevice: HardwareAddon = {
        id: `hw-${Date.now().toString().slice(-6)}`,
        name: hardwareForm.name!,
        category: (hardwareForm.category as HardwareCategory) || 'terminal',
        priceNGN: hardwareForm.priceNGN!,
        priceUSD: computedUSD,
        description: hardwareForm.description || 'Next-generation POS hardware peripheral.',
        specs: hardwareForm.specs || 'Plug-and-play USB/LAN interface.',
        availability: hardwareForm.availability || 'in_stock',
        badge: hardwareForm.badge || 'New Tech',
        isFeatured: hardwareForm.isFeatured ?? true,
      };
      updatedList = [newDevice, ...pricing.hardwareItems];
      summary = `Added new device: "${newDevice.name}" into POS inventory at ₦${newDevice.priceNGN.toLocaleString()}.`;
    }

    const updatedConfig = { ...pricing, hardwareItems: updatedList };
    setPricing(updatedConfig);
    setIsAddHardwareModalOpen(false);
    setEditingHardwareId(null);
    await savePricing(updatedConfig, session, editingHardwareId ? 'hardware_updated' : 'hardware_added', summary);
    setSaveSuccess(summary);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // Delete Hardware Device
  const handleDeleteHardware = async (item: HardwareAddon) => {
    if (!window.confirm(`Are you sure you want to remove "${item.name}" from active hardware inventory?`)) return;
    const updatedList = pricing.hardwareItems.filter((h) => h.id !== item.id);
    const updatedConfig = { ...pricing, hardwareItems: updatedList };
    setPricing(updatedConfig);

    const session = currentStaff || {
      username: 'admin',
      role: 'admin',
      name: 'Chief Systems Administrator',
    };
    const summary = `Retired/Deleted device: "${item.name}" from POS add-ons.`;
    await savePricing(updatedConfig, session, 'hardware_deleted', summary);
    setSaveSuccess(summary);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // Reset to Defaults
  const handleReset = async () => {
    const session = currentStaff || {
      username: 'admin',
      role: 'admin',
      name: 'Chief Systems Administrator',
    };
    const reset = await resetPricingToDefaults(session);
    setPricing(reset);
    setConfirmReset(false);
    setSaveSuccess('Pricing matrix and devices reset to factory default specifications.');
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // STEP 1: Request 5-Digit WhatsApp Access Code
  const handleRequestWhatsAppCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authUsername.trim() || !authPhone.trim()) {
      setAuthError('Please enter both your Username and WhatsApp Phone number.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await requestStaffWhatsAppOtp(authUsername, authPhone);
      if (res.success) {
        setDispatchedPhone(res.phone);
        setDispatchedWhatsappUrl(res.whatsappUrl);
        setDispatchedCode(res.code || null);
        setAuthStep('enter_code');
        setAuthCode('');

        // Attempt to launch WhatsApp tab or link
        if (res.whatsappUrl && typeof window !== 'undefined') {
          // Open WhatsApp in a background tab if possible
          const waWindow = window.open(res.whatsappUrl, '_blank');
          if (!waWindow) {
            // Popup blocked - link is directly clickable on modal
          }
        }
      } else {
        setAuthError(res.error || 'Failed to dispatch WhatsApp code. Check username and phone number.');
      }
    } catch (err: any) {
      setAuthError('Network error. Could not connect to WhatsApp dispatch service.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // STEP 2: Verify 5-Digit Code from WhatsApp
  const handleVerifyWhatsAppCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authCode.trim()) {
      setAuthError('Please enter the 5-digit verification code sent to your WhatsApp.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await verifyStaffWhatsAppOtp(authUsername, dispatchedPhone || authPhone, authCode);
      if (res.success && res.user) {
        setCurrentStaff(res.user);
        setIsAuthModalOpen(false);
        setAuthStep('credentials');
        setAuthCode('');
        setSaveSuccess(`Welcome back, ${res.user.name}! 5-digit WhatsApp code verified.`);
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setAuthError(res.error || 'Invalid 5-digit code. Please verify the code sent to your WhatsApp.');
      }
    } catch (err) {
      setAuthError('Could not verify code. Please check your network connection.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Admin registers new user details WITH PHONE NUMBER
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.username || !newStaffForm.name || !newStaffForm.phone) {
      alert('Please fill in Name, Username, Role, and WhatsApp Phone Number.');
      return;
    }

    try {
      const res = await fetch('/api/pricing/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStaff: newStaffForm,
          adminSession: currentStaff || { username: 'admin', role: 'admin', name: 'Administrator' },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsNewStaffModalOpen(false);
        setNewStaffForm({
          username: '',
          password: '',
          name: '',
          role: 'store_manager',
          phone: '08060395329',
        });
        setPricing(data.pricing);
        setSaveSuccess(`Registered user ${data.staff.name} (@${data.staff.username}) with WhatsApp: +${data.staff.phone}.`);
        setTimeout(() => setSaveSuccess(null), 4500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'printer':
        return Printer;
      case 'scanner':
        return ScanBarcode;
      case 'drawer':
        return Coins;
      case 'tablet':
        return Smartphone;
      case 'terminal':
        return Monitor;
      case 'display':
        return Tv;
      case 'handheld':
        return Radio;
      default:
        return Monitor;
    }
  };

  const filteredHardware = pricing.hardwareItems.filter((item) => {
    if (hardwareFilter === 'all') return true;
    return item.category === hardwareFilter || item.availability === hardwareFilter;
  });

  const filteredAuditLog = (pricing.auditLog || []).filter((log) => {
    if (auditFilter === 'all') return true;
    return log.action === auditFilter;
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Top Banner: Multi-Role Commercial Pricing & Inventory Desk */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <BadgeDollarSign className="w-3.5 h-3.5 text-amber-700" />
              <span>Multi-Role Commercial Pricing & Inventory Desk</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Plans & POS Hardware Pricing Control
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed">
              Admin and Store Managers can adjust software pricing, manage POS hardware devices based on availability,
              and peg Dollar prices to the live Nigerian Black Market parallel exchange rate.
            </p>
          </div>

          {/* Active Staff Account & Session Control with Phone Info */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-slate-900 truncate">
                  {currentStaff ? currentStaff.name : 'Chief Systems Administrator'}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {currentStaff ? currentStaff.role.replace('_', ' ') : 'admin'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono block truncate">
                @{currentStaff ? currentStaff.username : 'admin'} • Tel: +{currentStaff?.phone ? normalizePhoneNumber(currentStaff.phone) : '2348060395329'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto pt-2 sm:pt-0 sm:ml-auto">
              <button
                type="button"
                onClick={() => {
                  setAuthStep('credentials');
                  setAuthError(null);
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 sm:flex-none px-2.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                title="Switch staff account via 5-digit WhatsApp verification"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Switch User</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNewStaffModalOpen(true)}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95"
                title="Admin registers user details with phone number"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Staff</span>
              </button>

              <button
                type="button"
                onClick={() => setShowStaffDirectory(!showStaffDirectory)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                title="View registered staff & phone numbers"
              >
                <Users className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Staff & Store Users Directory with WhatsApp Numbers */}
        {showStaffDirectory && (
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-amber-950">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-700" />
                <span>Registered Staff & Store Officers Directory (WhatsApp Verified)</span>
              </span>
              <button
                onClick={() => setShowStaffDirectory(false)}
                className="text-amber-800 hover:text-amber-950 font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {(pricing.staffAccounts || INITIAL_STAFF_ACCOUNTS).map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 truncate">{acc.name}</span>
                      <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                        {acc.role.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block">@{acc.username}</span>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-emerald-800 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      +{acc.phone ? normalizePhoneNumber(acc.phone) : '2348060395329'}
                    </span>
                    <a
                      href={`https://wa.me/${acc.phone ? normalizePhoneNumber(acc.phone) : '2348060395329'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-700 hover:underline font-bold flex items-center gap-0.5"
                    >
                      <MessageSquare className="w-2.5 h-2.5" />
                      <span>Chat</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Nigeria Black Market FX Peg Engine */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-300/80 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-950 border border-emerald-400">
                <TrendingUp className="w-3 h-3 text-emerald-800" />
                <span>Live Nigeria Black Market Parallel FX Peg</span>
              </span>
              <span className="text-[11px] font-bold text-slate-600">
                Auto-Converts Naira into Dollar Equivalent
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Whenever Naira prices change, Dollar values auto-update to reflect current Nigerian parallel market rates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-emerald-400 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-xs font-black text-slate-700 whitespace-nowrap">
                Black Market FX Rate:
              </span>
              <div className="flex items-center font-mono font-black text-emerald-900 text-sm">
                <span>₦</span>
                <input
                  type="number"
                  min={100}
                  value={pricing.blackMarketRateNGN}
                  onChange={(e) => handleFxRateChange(e.target.value)}
                  className="w-20 font-mono font-black text-slate-900 text-center bg-transparent focus:outline-none border-b border-emerald-500"
                />
                <span className="text-xs text-slate-500 ml-1">/ $1 USD</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRecalculateAllUsd}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync All USD Prices</span>
            </button>
          </div>
        </div>

        {/* Global Save and Reset Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 leading-tight">
            Last published: <strong className="text-slate-800">{pricing.updatedAt ? new Date(pricing.updatedAt).toLocaleString() : 'Recent'}</strong> by{' '}
            <strong className="text-slate-800">{pricing.updatedBy}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Publish All Prices</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {confirmReset && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Restore all software plan rates, Black Market FX, and hardware items to factory default values?</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs"
              >
                Yes, Restore Factory Defaults
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: SOFTWARE PLANS PRICING MATRIX */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>1. Software Plans Pricing Matrix</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Change Naira (₦) price and watch Dollar ($) auto-calculate at ₦{pricing.blackMarketRateNGN}/$1 black market rate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Basic Plan */}
          <div className="bg-slate-50 border border-slate-300/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Plan 01</span>
                <h5 className="text-sm font-black text-slate-900">Basic Plan</h5>
              </div>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                1 Counter + 2 Wireless
              </span>
            </div>

            {/* 1 Year */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>1 Year License:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.basic['1_year'].priceNGN.toLocaleString()} = ${pricing.plans.basic['1_year'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.basic['1_year'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('basic', '1_year', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.basic['1_year'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('basic', '1_year', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3 Years */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>3 Years License:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.basic['3_years'].priceNGN.toLocaleString()} = ${pricing.plans.basic['3_years'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.basic['3_years'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('basic', '3_years', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.basic['3_years'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('basic', '3_years', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Lifetime */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Perpetual Lifetime:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.basic['lifetime'].priceNGN.toLocaleString()} = ${pricing.plans.basic['lifetime'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.basic['lifetime'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('basic', 'lifetime', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.basic['lifetime'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('basic', 'lifetime', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Standard Plan */}
          <div className="bg-amber-50/50 border border-amber-300 rounded-2xl p-3.5 sm:p-4 space-y-3 relative shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800">Plan 02 • Recommended</span>
                <h5 className="text-sm font-black text-slate-900">Standard Plan</h5>
              </div>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                Multi-User + KDS
              </span>
            </div>

            {/* 1 Year */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>1 Year License:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.standard['1_year'].priceNGN.toLocaleString()} = ${pricing.plans.standard['1_year'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-amber-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.standard['1_year'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('standard', '1_year', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-amber-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.standard['1_year'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('standard', '1_year', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3 Years */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>3 Years License:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.standard['3_years'].priceNGN.toLocaleString()} = ${pricing.plans.standard['3_years'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-amber-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.standard['3_years'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('standard', '3_years', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-amber-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.standard['3_years'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('standard', '3_years', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Lifetime */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Perpetual Lifetime:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.standard['lifetime'].priceNGN.toLocaleString()} = ${pricing.plans.standard['lifetime'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-amber-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.standard['lifetime'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('standard', 'lifetime', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-amber-300 rounded-xl px-2 py-1.5 focus-within:border-amber-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.standard['lifetime'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('standard', 'lifetime', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enterprises Plan */}
          <div className="bg-purple-50/40 border border-purple-300 rounded-2xl p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-200">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-purple-800">Plan 03 • Flagship</span>
                <h5 className="text-sm font-black text-slate-900">Enterprises Plan</h5>
              </div>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full border border-purple-200">
                Omnichannel / Cloud
              </span>
            </div>

            {/* 1 Year */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>1 Year License:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.enterprise['1_year'].priceNGN.toLocaleString()} = ${pricing.plans.enterprise['1_year'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-purple-200 rounded-xl px-2 py-1.5 focus-within:border-purple-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.enterprise['1_year'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('enterprise', '1_year', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-purple-200 rounded-xl px-2 py-1.5 focus-within:border-purple-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.enterprise['1_year'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('enterprise', '1_year', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3 Years */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>3 Years License:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.enterprise['3_years'].priceNGN.toLocaleString()} = ${pricing.plans.enterprise['3_years'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-purple-200 rounded-xl px-2 py-1.5 focus-within:border-purple-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.enterprise['3_years'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('enterprise', '3_years', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-purple-200 rounded-xl px-2 py-1.5 focus-within:border-purple-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.enterprise['3_years'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('enterprise', '3_years', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Lifetime */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Perpetual Lifetime:</span>
                <span className="text-slate-400 font-normal">Auto: ₦{pricing.plans.enterprise['lifetime'].priceNGN.toLocaleString()} = ${pricing.plans.enterprise['lifetime'].priceUSD}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-white border border-purple-200 rounded-xl px-2 py-1.5 focus-within:border-purple-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.enterprise['lifetime'].priceNGN}
                    onChange={(e) =>
                      handlePlanPriceChange('enterprise', 'lifetime', 'priceNGN', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-white border border-purple-200 rounded-xl px-2 py-1.5 focus-within:border-purple-600">
                  <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min={0}
                    value={pricing.plans.enterprise['lifetime'].priceUSD}
                    onChange={(e) =>
                      handlePlanPriceChange('enterprise', 'lifetime', 'priceUSD', e.target.value)
                    }
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: GOOGLE DRIVE SOFTWARE DOWNLOAD LINKS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5-3.42-6z" fill="#0066DA"/>
                  <path d="M16.29 3.5h-8.58l6.55 11.5h8.59l-6.56-11.5z" fill="#00AC47"/>
                  <path d="M22.85 15H9.71l-3.43 6h13.14l3.43-6z" fill="#EA4335"/>
                </svg>
              </div>
              <span>Google Drive Software Download Links (Linked to Web Page)</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Each software plan's download button on the public website links directly to its Google Drive folder/installer for visitors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Master All-in-One Download Link */}
          <div className="col-span-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Master All-in-One Suite Google Drive Link (Linked to Download Page):</span>
              </span>
              <a
                href={pricing.driveLinks?.allInOne || 'https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Kitchen_AllInOne_POS_Suite_v342?usp=sharing'}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-amber-800 hover:underline font-bold flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="url"
              value={pricing.driveLinks?.allInOne || 'https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Kitchen_AllInOne_POS_Suite_v342?usp=sharing'}
              onChange={(e) => handleDriveLinkChange('allInOne', e.target.value)}
              className="w-full bg-white border border-amber-400 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600 shadow-2xs"
            />
          </div>

          {/* Trial Drive Link */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-950">Trial 7-Day Plan Google Drive Link:</span>
              <a
                href={pricing.driveLinks?.trial || 'https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Trial_POS_v342?usp=sharing'}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-700 hover:underline font-bold flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="url"
              value={pricing.driveLinks?.trial || 'https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Trial_POS_v342?usp=sharing'}
              onChange={(e) => handleDriveLinkChange('trial', e.target.value)}
              className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Basic Drive Link */}
          <div className="p-3.5 bg-slate-50 border border-slate-300/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">Basic Plan Google Drive Link:</span>
              <a
                href={pricing.driveLinks?.basic || 'https://drive.google.com/drive/folders/1kAx_Kaylix_Basic_POS_1Counter_2Handheld?usp=sharing'}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-amber-700 hover:underline font-bold flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="url"
              value={pricing.driveLinks?.basic || 'https://drive.google.com/drive/folders/1kAx_Kaylix_Basic_POS_1Counter_2Handheld?usp=sharing'}
              onChange={(e) => handleDriveLinkChange('basic', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Standard Drive Link */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-300 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950">Standard Plan Google Drive Link:</span>
              <a
                href={pricing.driveLinks?.standard || 'https://drive.google.com/drive/folders/1mYz_Kaylix_Standard_POS_MultiUser_KDS?usp=sharing'}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-amber-800 hover:underline font-bold flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="url"
              value={pricing.driveLinks?.standard || 'https://drive.google.com/drive/folders/1mYz_Kaylix_Standard_POS_MultiUser_KDS?usp=sharing'}
              onChange={(e) => handleDriveLinkChange('standard', e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Enterprise Drive Link */}
          <div className="p-3.5 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-950">Enterprises Flagship Google Drive Link:</span>
              <a
                href={pricing.driveLinks?.enterprise || 'https://drive.google.com/drive/folders/1eNp_Kaylix_Enterprise_POS_CloudHQ?usp=sharing'}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-purple-700 hover:underline font-bold flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="url"
              value={pricing.driveLinks?.enterprise || 'https://drive.google.com/drive/folders/1eNp_Kaylix_Enterprise_POS_CloudHQ?usp=sharing'}
              onChange={(e) => handleDriveLinkChange('enterprise', e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: POS HARDWARE ADD-ONS & INVENTORY AVAILABILITY */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Monitor className="w-4 h-4 text-emerald-600" />
              <span>2. POS Hardware Devices & Technology Availability</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Admin & Store Manager can add new available POS technology, edit specs, update stock status, and set retail prices.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={hardwareFilter}
              onChange={(e) => setHardwareFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none flex-1 sm:flex-none"
            >
              <option value="all">All Devices ({pricing.hardwareItems.length})</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="pre_order">Pre-Order</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="terminal">Terminals & PCs</option>
              <option value="printer">Thermal Printers</option>
              <option value="handheld">Wireless Handhelds</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setEditingHardwareId(null);
                setHardwareForm({
                  name: '',
                  category: 'terminal',
                  priceNGN: 150000,
                  priceUSD: calculateDollarFromNaira(150000, pricing.blackMarketRateNGN),
                  description: '',
                  specs: '',
                  availability: 'in_stock',
                  badge: 'New 2026 Model',
                  isFeatured: true,
                });
                setIsAddHardwareModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 flex-1 sm:flex-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add POS Device</span>
            </button>
          </div>
        </div>

        {/* Hardware Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredHardware.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const isOut = item.availability === 'out_of_stock';
            const isLow = item.availability === 'low_stock';
            const isPre = item.availability === 'pre_order';

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isOut
                    ? 'bg-slate-100/70 border-slate-300 opacity-75'
                    : 'bg-slate-50 border-slate-300/80 hover:bg-white hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          {item.category}
                        </span>
                        <h5 className="text-xs font-black text-slate-900 leading-snug truncate">{item.name}</h5>
                      </div>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed mb-2">
                    {item.description}
                  </p>

                  <div className="text-[10px] text-slate-500 font-mono bg-white p-2 rounded-lg border border-slate-200 mb-3 leading-snug">
                    <strong className="text-slate-700">Specs:</strong> {item.specs}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                  {/* Availability Dropdown */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-600">Stock Availability:</span>
                    <select
                      value={item.availability || 'in_stock'}
                      onChange={(e) =>
                        handleHardwareAvailabilityChange(item.id, e.target.value as HardwareAvailability)
                      }
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                        isOut
                          ? 'bg-red-50 text-red-800 border-red-300'
                          : isLow
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : isPre
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <option value="in_stock">In Stock (Available)</option>
                      <option value="low_stock">Low Stock (Limited)</option>
                      <option value="pre_order">Pre-Order (3-5 Days)</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  {/* Pricing Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Price NGN</span>
                      <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus-within:border-emerald-600">
                        <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                        <input
                          type="number"
                          min={0}
                          value={item.priceNGN}
                          onChange={(e) =>
                            handleHardwarePriceChange(item.id, 'priceNGN', e.target.value)
                          }
                          className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-0.5">
                        Price USD (Auto)
                      </span>
                      <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus-within:border-emerald-600">
                        <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                        <input
                          type="number"
                          min={0}
                          value={item.priceUSD}
                          onChange={(e) =>
                            handleHardwarePriceChange(item.id, 'priceUSD', e.target.value)
                          }
                          className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit Details / Delete */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHardwareId(item.id);
                        setHardwareForm(item);
                        setIsAddHardwareModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 hover:underline"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Specs & Badge</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteHardware(item)}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 hover:underline"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: IMMUTABLE PRICING & HARDWARE AUDIT LOG (WITH TIMESTAMPS) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>3. Timestamped Pricing & Hardware Modification Audit Log</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Traceable records of every pricing modification, hardware addition, and phone verification with staff username & timestamp.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none flex-1 sm:flex-none"
            >
              <option value="all">All Audit Actions</option>
              <option value="price_update">Price Updates</option>
              <option value="hardware_added">Hardware Added</option>
              <option value="hardware_updated">Hardware Updated</option>
              <option value="hardware_deleted">Hardware Deleted</option>
              <option value="staff_created">Staff Created</option>
              <option value="factory_reset">Factory Resets</option>
            </select>

            <a
              href="/api/pricing/audit/csv"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all flex-1 sm:flex-none justify-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 -mx-1 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs min-w-[620px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Timestamp (WAT)</th>
                <th className="py-2.5 px-3">Officer / User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Modification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAuditLog.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 font-medium">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredAuditLog.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-800 whitespace-nowrap">
                      {log.formattedDate || new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{log.staffName}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">@{log.username}</span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          log.action === 'hardware_added'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : log.action === 'hardware_deleted'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : log.action === 'staff_created'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {log.action.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {log.summary}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          2ND ATTACHED IMAGE: STAFF SIGN-IN VIA 5-DIGIT WHATSAPP VERIFICATION CODE
      ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-2xs">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    {authStep === 'credentials' ? 'Staff Account Sign-In' : 'WhatsApp 5-Digit Verification'}
                  </h4>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    {authStep === 'credentials'
                      ? 'Enter Username & WhatsApp Phone Number'
                      : `Enter 5-digit code sent to WhatsApp (+${dispatchedPhone})`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="leading-snug">{authError}</span>
              </div>
            )}

            {/* STEP 1: Enter Username & Phone Number */}
            {authStep === 'credentials' && (
              <form onSubmit={handleRequestWhatsAppCode} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Staff Username:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. admin or store_manager"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center justify-between">
                    <span>Registered WhatsApp Phone Number:</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">Nigeria (+234)</span>
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-emerald-600 focus-within:bg-white">
                    <span className="text-xs font-mono font-bold text-slate-400 mr-1.5 flex items-center gap-1">
                      <span>🇳🇬</span>
                      <span>+234</span>
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08060395329"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    System will send a secure 5-digit verification code to this WhatsApp number.
                  </span>
                </div>

                {/* Pre-Provisioned Quick-Select Profiles */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
                  <span className="font-bold text-slate-700 block">Pre-Provisioned Staff Profiles:</span>
                  <div className="grid grid-cols-1 gap-1.5 text-slate-600 font-mono text-[10px]">
                    <div
                      onClick={() => {
                        setAuthUsername('admin');
                        setAuthPhone('08060395329');
                      }}
                      className="p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-amber-500 flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <div>
                        <strong className="text-slate-900 block font-sans">Lead Administrator (@admin)</strong>
                        <span className="text-slate-500">WhatsApp: +234 806 039 5329</span>
                      </div>
                      <span className="text-amber-800 font-sans font-bold text-xs">Select</span>
                    </div>

                    <div
                      onClick={() => {
                        setAuthUsername('store_manager');
                        setAuthPhone('08060395329');
                      }}
                      className="p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-amber-500 flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <div>
                        <strong className="text-slate-900 block font-sans">Central Store Manager (@store_manager)</strong>
                        <span className="text-slate-500">WhatsApp: +234 806 039 5329</span>
                      </div>
                      <span className="text-amber-800 font-sans font-bold text-xs">Select</span>
                    </div>

                    <div
                      onClick={() => {
                        setAuthUsername('pricing_desk');
                        setAuthPhone('08060395329');
                      }}
                      className="p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-amber-500 flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <div>
                        <strong className="text-slate-900 block font-sans">Pricing Desk Officer (@pricing_desk)</strong>
                        <span className="text-slate-500">WhatsApp: +234 806 039 5329</span>
                      </div>
                      <span className="text-amber-800 font-sans font-bold text-xs">Select</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending WhatsApp Code...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send 5-Digit WhatsApp Code</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter 5-Digit WhatsApp Access Code */}
            {authStep === 'enter_code' && (
              <form onSubmit={handleVerifyWhatsAppCode} className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>5-Digit security code dispatched to WhatsApp!</span>
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    Sent to: <strong className="font-mono">+{dispatchedPhone}</strong> (@{authUsername})
                  </p>

                  {/* Direct WhatsApp Open Link Button */}
                  {dispatchedWhatsappUrl && (
                    <a
                      href={dispatchedWhatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open WhatsApp to View Code</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}

                  {/* Quick-fill button in preview environment */}
                  {dispatchedCode && (
                    <button
                      type="button"
                      onClick={() => setAuthCode(dispatchedCode)}
                      className="text-[10px] font-mono font-bold text-emerald-800 underline block mt-1 hover:text-emerald-950"
                    >
                      ⚡ Quick Autofill Code: {dispatchedCode}
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5 text-center">
                    Enter the 5-Digit Access Code:
                  </label>
                  <div className="flex justify-center">
                    <input
                      type="text"
                      maxLength={5}
                      autoFocus
                      required
                      placeholder="• • • • •"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                      className="w-48 text-center tracking-[0.5em] font-mono font-black text-2xl py-2.5 px-3 bg-slate-50 border-2 border-amber-500 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-400/30"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 text-center block mt-1.5">
                    Valid for 10 minutes • Code example: 5-digit number
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep('credentials');
                      setAuthError(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold underline"
                  >
                    ← Change Phone / User
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(false)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || authCode.length < 5}
                      className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Unlock Portal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          1ST ATTACHED IMAGE: ADMIN REGISTERS USERS DETAILS WITH THEIR PHONE NUMBER
      ========================================================================= */}
      {isNewStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shadow-2xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">Register Staff / Store User</h4>
                  <span className="text-[10px] text-slate-500">Record officer profile with confirmed phone number</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Full Officer / Store Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lekki Store Supervisor"
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Username:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. lekki_store"
                    value={newStaffForm.username}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, username: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Assigned Role:</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) =>
                      setNewStaffForm({
                        ...newStaffForm,
                        role: e.target.value as 'admin' | 'store_manager' | 'pricing_officer',
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  >
                    <option value="store_manager">Store Manager</option>
                    <option value="pricing_officer">Pricing Officer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* MANDATORY WHATSAPP PHONE NUMBER */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center justify-between">
                  <span>WhatsApp Phone Number (Required):</span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">Nigeria (+234)</span>
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:border-emerald-600 focus-within:bg-white">
                  <span className="text-xs font-mono font-bold text-slate-400 mr-1.5 flex items-center gap-1">
                    <span>🇳🇬</span>
                    <span>+234</span>
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08060395329"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none bg-transparent"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Staff member will receive 5-digit verification codes at this phone number to access the portal.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Initial Passcode / Secret:
                </label>
                <input
                  type="password"
                  placeholder="Default: Staff@2026"
                  value={newStaffForm.password}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewStaffModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Register User with Phone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT POS HARDWARE DEVICE & TECHNOLOGY
      ========================================================================= */}
      {isAddHardwareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    {editingHardwareId ? 'Edit POS Hardware Device' : 'Add New POS Technology / Device'}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Set device specifications, stock availability, and Naira retail price
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddHardwareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHardwareDevice} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Device Name / Model:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunmi V2 Pro 4G Wireless Handheld POS"
                  value={hardwareForm.name || ''}
                  onChange={(e) => setHardwareForm({ ...hardwareForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category:</label>
                  <select
                    value={hardwareForm.category || 'terminal'}
                    onChange={(e) =>
                      setHardwareForm({ ...hardwareForm, category: e.target.value as HardwareCategory })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="terminal">POS Terminal / PC</option>
                    <option value="printer">Thermal Receipt Printer</option>
                    <option value="scanner">Barcode / QR Scanner</option>
                    <option value="drawer">Steel Cash Drawer</option>
                    <option value="tablet">Waiter Order Tablet</option>
                    <option value="handheld">Wireless Handheld POS</option>
                    <option value="display">Kitchen KDS Display</option>
                    <option value="accessory">Network / Peripherals</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Availability Status:</label>
                  <select
                    value={hardwareForm.availability || 'in_stock'}
                    onChange={(e) =>
                      setHardwareForm({
                        ...hardwareForm,
                        availability: e.target.value as HardwareAvailability,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="in_stock">In Stock (Dispatch Ready)</option>
                    <option value="low_stock">Low Stock (Limited)</option>
                    <option value="pre_order">Pre-Order (3-5 Days)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Price NGN and Auto-Calculated USD */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Retail Price (₦ NGN):</label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:border-emerald-600">
                    <span className="text-xs font-bold text-slate-400 mr-1">₦</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={hardwareForm.priceNGN || 0}
                      onChange={(e) => {
                        const naira = parseInt(e.target.value, 10) || 0;
                        setHardwareForm({
                          ...hardwareForm,
                          priceNGN: naira,
                          priceUSD: calculateDollarFromNaira(naira, pricing.blackMarketRateNGN),
                        });
                      }}
                      className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Equivalent Dollar ($ USD):
                  </label>
                  <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      min={0}
                      value={hardwareForm.priceUSD || 0}
                      onChange={(e) =>
                        setHardwareForm({
                          ...hardwareForm,
                          priceUSD: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none bg-transparent"
                    />
                    <span className="text-[10px] text-emerald-800 font-bold ml-1">Auto</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Promotional / Technology Badge:</label>
                <input
                  type="text"
                  placeholder="e.g. New 2026 Tech, 4G Wireless, High Speed"
                  value={hardwareForm.badge || ''}
                  onChange={(e) => setHardwareForm({ ...hardwareForm, badge: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Technical Specs:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 5.5-inch IPS, Seiko 58mm printer, Android 13, 4G LTE SIM"
                  value={hardwareForm.specs || ''}
                  onChange={(e) => setHardwareForm({ ...hardwareForm, specs: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddHardwareModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs"
                >
                  {editingHardwareId ? 'Update Device' : 'Publish Device into Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
