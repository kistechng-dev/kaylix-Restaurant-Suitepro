import React, { useState } from 'react';
import {
  Download,
  MessageSquare,
  Zap,
  Printer,
  Layers,
  ChefHat,
  MonitorCheck,
  TrendingUp,
  Sparkles,
  CreditCard,
  Copy,
  Check,
  CheckCircle2,
  Package,
  ArrowRight,
  HardDrive,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { BANK_ACCOUNTS, VENDOR_CONTACT } from '../data/mockData';
import { PageType } from './Navbar';

interface HeroProps {
  onDownloadTrial: () => void;
  onNavigateToPage?: (page: PageType) => void;
  onScrollToSection?: (sectionId: string) => void;
  onOrderHardwareOnly?: (addonId?: string) => void;
  currency: 'NGN' | 'USD';
  isPhoneMode?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onDownloadTrial,
  onNavigateToPage,
  onOrderHardwareOnly,
  currency,
  isPhoneMode = false,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<'msi' | 'zip' | null>(null);

  const handleNav = (target: PageType) => {
    if (onNavigateToPage) {
      onNavigateToPage(target);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCopyAccount = (accNo: string, bankName: string) => {
    navigator.clipboard.writeText(accNo);
    setCopiedBank(bankName);
    showToast(`✓ Copied ${bankName} account (${accNo}) to clipboard!`);
    setTimeout(() => {
      setCopiedBank(null);
    }, 2500);
  };

  const handleCopyFileLink = (type: 'msi' | 'zip', filename: string) => {
    const fullUrl = `${window.location.origin}/downloads/${filename}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(type);
    showToast(`✓ Copied direct download link for ${filename}!`);
    setTimeout(() => {
      setCopiedLink(null);
    }, 2500);
  };

  return (
    <section id="hero" className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden bg-slate-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subtle Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-tr from-amber-200/30 via-orange-100/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-100/20 blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Editorial Metadata Line */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600 mb-3 text-center">
          <span className="text-amber-800 font-bold font-mono">KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-700">100% Offline-First Multi-Purpose POS</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-700">500+ Active Deployments</span>
        </div>

        {/* Main Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.15]">
            The High-Speed Operating System for Modern{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
              Kitchens, Eateries & Lounges
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Eliminate billing mistakes, prevent kitchen inventory pilferage, and accelerate customer service turnaround.
            Available in 4 tailored packages: <strong className="text-amber-800 font-bold">Trial (7-Day)</strong>,{' '}
            <strong className="text-slate-900 font-bold">Basic</strong>,{' '}
            <strong className="text-amber-800 font-bold">Standard</strong>, and{' '}
            <strong className="text-slate-900 font-bold">Enterprise</strong>.
          </p>
        </div>

        {/* Primary Direct Live Downloads Card (MSI & ZIP Hub) */}
        <div className="bg-white border-2 border-amber-400/90 rounded-3xl p-5 sm:p-7 shadow-md mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-black px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider shadow-xs">
            Official Release v3.4.2
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                <Download className="w-3 h-3 text-amber-700" />
                <span>Direct Live Downloads</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-mono">
                KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2 Distribution
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                1-click download of the production build for Windows & portable environments.
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-xl border border-emerald-200 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Offline SQLite</span>
            </div>
          </div>

          {/* 2 Live Download Pillars: MSI & ZIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
            {/* 1. Windows Native Setup (.MSI) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                      MSI
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900">
                        Windows Native Setup
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        1.93 MB • 1-Click Installation
                      </span>
                    </div>
                  </div>
                  <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.msi — Native Windows installer for Windows 11, 10, 8.1, and Server.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-2">
                <a
                  href="/downloads/KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.msi"
                  download="KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.msi"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MSI (1.93 MB)</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyFileLink('msi', 'KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.msi')}
                  title="Copy direct download link"
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {copiedLink === 'msi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* 2. Universal Portable Archive (.ZIP) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0">
                      ZIP
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900">
                        Universal Portable Archive
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        1.59 MB • Zero Installation
                      </span>
                    </div>
                  </div>
                  <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                    Portable
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.zip — Standalone portable bundle. Run directly from USB or any folder.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-2">
                <a
                  href="/downloads/KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.zip"
                  download="KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.zip"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ZIP (1.59 MB)</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyFileLink('zip', 'KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2.zip')}
                  title="Copy direct download link"
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {copiedLink === 'zip' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Trial CTA Row */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium text-center sm:text-left">
              Need to test first? Download our 7-day complete evaluation pass with sample restaurant data.
            </span>
            <button
              type="button"
              onClick={onDownloadTrial}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>7-Day Free Trial Pass</span>
            </button>
          </div>
        </div>

        {/* Spacious, Mobile-Friendly Navigation Buttons (2x2 on Mobile, 4-Row on Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
          <button
            onClick={() => handleNav('plan')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700">
                Plan Packages
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                4 plans from Trial to Enterprise.
              </p>
            </div>
          </button>

          <button
            onClick={() => (onOrderHardwareOnly ? onOrderHardwareOnly() : handleNav('order'))}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
              <Printer className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700">
                Buy Hardware
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                Thermal printers & cash drawers.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleNav('banks')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700">
                Bank Details
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                Zenith Bank & Moniepoint accounts.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleNav('order')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-300 hover:border-emerald-500 hover:shadow-md text-left transition-all group flex flex-col justify-between bg-emerald-50/30"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700">
                My Order Page
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                Submit details & WhatsApp setup.
              </p>
            </div>
          </button>
        </div>

        {/* Clean Feature Highlights Grid (Spacious & Anti-Squeeze) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs mb-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 inline-block mb-1.5">
              Core Architecture
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Built for Real Restaurant Operations
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Zero lag, zero internet dependence, and instant printing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Sub-3-Second Checkout</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Touchscreen-optimized cashier billing with rapid item search, split bills, and table transfers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
                <HardDrive className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">100% Offline-First SQLite</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operates completely without internet. Protects against network drops and cloud outages.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                <ChefHat className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Kitchen KDS & Autocut KOT</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sends orders directly to kitchen displays and ESC/POS 80mm/58mm thermal printers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Recipe Inventory Costing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deducts raw food ingredients (rice, oil, meat) automatically every time a plate is rung up.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">End-of-Day X & Z Audits</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tracks shift cash balances, POS card payments, transfers, and voids with anti-theft security.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Hardware Compatibility</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects to any Windows PC, barcode scanner, thermal printer, or Android waiter tablet.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Bank Settlement Account Quick Chips */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mb-8">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Verified Settlement Accounts:</span>
              <span className="text-slate-600">Direct bank transfer with instant software license activation.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCopyAccount('1016978239', 'Zenith Bank')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold transition-all active:scale-95"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Zenith: <strong className="font-mono text-slate-900">1016978239</strong></span>
            </button>

            <button
              onClick={() => handleCopyAccount('8089697390', 'Moniepoint')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold transition-all active:scale-95"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Moniepoint: <strong className="font-mono text-slate-900">8089697390</strong></span>
            </button>
          </div>
        </div>

        {/* Next Gateway Transition Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-400">
              Next Step
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Choose Your Plan Package
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-xl">
              Compare our 4 tailored POS plans with flexible duration tiers (1 Year, 3 Years, Lifetime) or download the 7-Day Free Evaluation build.
            </p>
          </div>
          <button
            onClick={() => handleNav('plan')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 shrink-0 transition-all active:scale-95"
          >
            <span>Choose Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
