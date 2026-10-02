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
} from '../utils/pricingStorage';
import { HardwareAddon, HardwareAvailability, HardwareCategory } from '../types';

export const AdminPricingManager: React.FC = () => {
  const [pricing, setPricing] = useState<PricingConfig>(getCustomPricing);
  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(getCurrentStaffSession);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // New Staff Modal State
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    username: '',
    password: '',
    name: '',
    role: 'store_manager' as 'admin' | 'store_manager' | 'pricing_officer',
    phone: '234 806 0395 329',
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
      // Auto recalculate all plan prices and hardware if autoSyncUSD is enabled
      const updated = { ...prev, blackMarketRateNGN: rate };
      if (updated.autoSyncUSD) {
        // Recalculate plans
        (['basic', 'standard', 'enterprise'] as const).forEach((planKey) => {
          (['1_year', '3_years', 'lifetime'] as const).forEach((tierKey) => {
            const naira = updated.plans[planKey][tierKey].priceNGN;
            updated.plans[planKey][tierKey].priceUSD = calculateDollarFromNaira(naira, rate);
          });
        });
        // Recalculate hardware
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

  // Handle Plan Price Change (Auto converts USD from NGN via FX rate)
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

  // Staff Login
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/pricing/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authUsername, password: authPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentStaff(data.user);
        setStaffSession(data.user);
        setIsAuthModalOpen(false);
        setAuthUsername('');
        setAuthPassword('');
        setSaveSuccess(`Authenticated as ${data.user.name} (${data.user.role})`);
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setAuthError('Connection failed. Please try again.');
    }
  };

  // Admin creates new staff account
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.username || !newStaffForm.password || !newStaffForm.name) return;
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
          phone: '234 806 0395 329',
        });
        setPricing(data.pricing);
        setSaveSuccess(`New staff account for ${data.staff.name} (@${data.staff.username}) created successfully.`);
        setTimeout(() => setSaveSuccess(null), 4000);
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
    <div className="space-y-6">
      {/* Top Banner: Commercial Desk, Staff Session, and FX Peg */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
              <BadgeDollarSign className="w-3.5 h-3.5 text-amber-700" />
              <span>Multi-Role Commercial Pricing & Inventory Desk</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Plans & POS Hardware Pricing Control
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-2xl leading-relaxed">
              Admin and Store Managers can adjust software pricing, manage POS hardware devices based on availability,
              and peg Dollar prices to the live Nigerian Black Market parallel exchange rate.
            </p>
          </div>

          {/* Active Staff Account & Session Control */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900">
                  {currentStaff ? currentStaff.name : 'Chief Administrator'}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {currentStaff ? currentStaff.role.replace('_', ' ') : 'admin'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono block">
                @{currentStaff ? currentStaff.username : 'admin'} • Verified Staff Session
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:ml-auto">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition-all"
                title="Switch staff account"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Switch User</span>
              </button>

              {currentStaff?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => setIsNewStaffModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 transition-all"
                  title="Add new staff account"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Staff</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Nigeria Black Market FX Peg Engine */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-300/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
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

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-emerald-400 rounded-xl px-3 py-1.5 shadow-2xs">
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
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync All USD Prices</span>
            </button>
          </div>
        </div>

        {/* Global Save and Reset Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            Last published: <strong className="text-slate-800">{pricing.updatedAt ? new Date(pricing.updatedAt).toLocaleString() : 'Recent'}</strong> by{' '}
            <strong className="text-slate-800">{pricing.updatedBy}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
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
                className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg"
              >
                Yes, Restore Factory Defaults
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: SOFTWARE PLANS PRICING MATRIX */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Basic Plan */}
          <div className="bg-slate-50 border border-slate-300/80 rounded-2xl p-4 space-y-3.5">
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
          <div className="bg-amber-50/50 border border-amber-300 rounded-2xl p-4 space-y-3.5 relative shadow-xs">
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
          <div className="bg-purple-50/40 border border-purple-300 rounded-2xl p-4 space-y-3.5">
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

      {/* SECTION 2: POS HARDWARE ADD-ONS & INVENTORY AVAILABILITY */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
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

          <div className="flex items-center gap-2">
            {/* Filter */}
            <select
              value={hardwareFilter}
              onChange={(e) => setHardwareFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
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
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New POS Device</span>
            </button>
          </div>
        </div>

        {/* Hardware Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHardware.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const isOut = item.availability === 'out_of_stock';
            const isLow = item.availability === 'low_stock';
            const isPre = item.availability === 'pre_order';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
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
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          {item.category}
                        </span>
                        <h5 className="text-xs font-black text-slate-900 leading-snug">{item.name}</h5>
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

                <div className="space-y-3 pt-2 border-t border-slate-200">
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
                      <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1 focus-within:border-emerald-600">
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
                      <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1 focus-within:border-emerald-600">
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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>3. Timestamped Pricing & Hardware Modification Audit Log</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Complete traceable record of every pricing modification, hardware addition, and FX change with staff username & timestamp.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
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
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
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

      {/* ========================================================
          MODAL: SWITCH / AUTHENTICATE STAFF USERNAME & PASSWORD
      ======================================================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Staff Account Sign-In</h4>
                  <span className="text-[10px] text-slate-500">Authenticate session to record audit trail</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleStaffLogin} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Username:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin or store_manager"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password:</label>
                <input
                  type="password"
                  required
                  placeholder="Enter account password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Preconfigured Credentials Quick Fill Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-700 block">Pre-Provisioned Staff Accounts:</span>
                <div className="grid grid-cols-1 gap-1 text-slate-600 font-mono text-[10px]">
                  <div
                    onClick={() => {
                      setAuthUsername('admin');
                      setAuthPassword('Admin@Kaylix2026');
                    }}
                    className="p-1.5 rounded bg-white border border-slate-200 cursor-pointer hover:border-amber-500 flex justify-between"
                  >
                    <span><strong>admin</strong> / Admin@Kaylix2026</span>
                    <span className="text-amber-800 font-sans font-bold">Fill Lead Admin</span>
                  </div>
                  <div
                    onClick={() => {
                      setAuthUsername('store_manager');
                      setAuthPassword('Store@Kaylix2026');
                    }}
                    className="p-1.5 rounded bg-white border border-slate-200 cursor-pointer hover:border-amber-500 flex justify-between"
                  >
                    <span><strong>store_manager</strong> / Store@Kaylix2026</span>
                    <span className="text-amber-800 font-sans font-bold">Fill Store Manager</span>
                  </div>
                  <div
                    onClick={() => {
                      setAuthUsername('pricing_desk');
                      setAuthPassword('Desk@Kaylix2026');
                    }}
                    className="p-1.5 rounded bg-white border border-slate-200 cursor-pointer hover:border-amber-500 flex justify-between"
                  >
                    <span><strong>pricing_desk</strong> / Desk@Kaylix2026</span>
                    <span className="text-amber-800 font-sans font-bold">Fill Pricing Desk</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-xs"
                >
                  Authenticate Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADMIN CREATES NEW STAFF / STORE ACCOUNT
      ======================================================== */}
      {isNewStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Create Staff / Store User</h4>
                  <span className="text-[10px] text-slate-500">Provide distinct credentials with role</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Staff / Store Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lekki Store Supervisor"
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Username:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. lekki_store"
                    value={newStaffForm.username}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, username: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role:</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) =>
                      setNewStaffForm({
                        ...newStaffForm,
                        role: e.target.value as 'admin' | 'store_manager' | 'pricing_officer',
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="store_manager">Store Manager</option>
                    <option value="pricing_officer">Pricing Officer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password:</label>
                <input
                  type="password"
                  required
                  placeholder="Create strong password"
                  value={newStaffForm.password}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-xs"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT POS HARDWARE DEVICE & TECHNOLOGY
      ======================================================== */}
      {isAddHardwareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
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
                className="text-slate-400 hover:text-slate-600"
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
