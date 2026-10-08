import React from 'react';
import { UtensilsCrossed, Download, MessageSquare, PhoneCall, Smartphone, Monitor, Package, Building2, Home } from 'lucide-react';
import { VENDOR_CONTACT } from '../data/mockData';

export type PageType = 'tour' | 'plan' | 'download' | 'banks' | 'order';

interface NavbarProps {
  currency: 'NGN' | 'USD';
  setCurrency: (c: 'NGN' | 'USD') => void;
  onQuickDownloadTrial: () => void;
  currentPage: PageType;
  onNavigateToPage: (page: PageType) => void;
  isPhoneMode?: boolean;
  onTogglePhoneMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  setCurrency,
  onQuickDownloadTrial,
  currentPage,
  onNavigateToPage,
  isPhoneMode = false,
  onTogglePhoneMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Top Notification Bar (Desktop only, hidden in phone mode) */}
      {!isPhoneMode && (
        <div className="hidden sm:block bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs font-semibold py-1.5 px-4 text-center">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-white text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                Release v3.4.2
              </span>
              <span className="font-medium text-white/95">KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2 • 100% Offline-First</span>
            </div>
            <div className="flex items-center justify-end gap-4 text-xs font-semibold">
              <a
                href={`https://wa.me/${VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 text-white font-bold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                WhatsApp: {VENDOR_CONTACT.whatsappDisplay}
              </a>
              <span className="hidden md:inline text-white/60">•</span>
              <span className="hidden md:inline text-white/90">Desk: {VENDOR_CONTACT.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0"
          onClick={() => onNavigateToPage('tour')}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 text-white ring-2 ring-amber-400/30">
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 font-mono">
                KAYLIX<span className="text-amber-600">_POS_PRO</span>
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                3.4.2
              </span>
            </div>
            {!isPhoneMode && (
              <p className="hidden sm:block text-[10px] text-slate-600 font-semibold leading-none mt-0.5">
                KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2
              </p>
            )}
          </div>
        </div>

        {/* Multi-Page Navigation Links (Desktop only, hidden in phone mode) */}
        {!isPhoneMode && (
          <nav className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => onNavigateToPage('tour')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'tour'
                  ? 'bg-amber-100 text-amber-950 font-bold shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-amber-600" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigateToPage('plan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'plan'
                  ? 'bg-amber-100 text-amber-950 font-bold shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Plan Packages</span>
            </button>

            <button
              onClick={() => onNavigateToPage('download')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'download'
                  ? 'bg-amber-100 text-amber-950 font-bold shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Download</span>
            </button>

            <button
              onClick={() => onNavigateToPage('banks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'banks'
                  ? 'bg-amber-100 text-amber-950 font-bold shadow-2xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Bank Details</span>
            </button>

            <button
              onClick={() => onNavigateToPage('order')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                currentPage === 'order'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 font-bold'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>My Order</span>
            </button>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop Phone Mode Toggle */}
          {onTogglePhoneMode && (
            <button
              onClick={onTogglePhoneMode}
              title={isPhoneMode ? 'Exit Phone Mode' : 'Preview Phone Version'}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900"
            >
              {isPhoneMode ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-amber-600" />
                  <span>Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Phone Mode</span>
                </>
              )}
            </button>
          )}

          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-100 border border-slate-300/80 rounded-lg p-0.5 text-[11px] sm:text-xs font-bold">
            <button
              onClick={() => setCurrency('NGN')}
              className={`px-1.5 sm:px-2 py-1 rounded-md transition-all ${
                currency === 'NGN'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ₦ NGN
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-1.5 sm:px-2 py-1 rounded-md transition-all ${
                currency === 'USD'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Quick Trial Download CTA */}
          <button
            onClick={onQuickDownloadTrial}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/20 transition-all active:scale-95 shrink-0"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.8]" />
            <span className="hidden xs:inline">7-Day</span>
            <span>Trial</span>
          </button>
        </div>
      </div>
    </header>
  );
};
