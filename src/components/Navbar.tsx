import React from 'react';
import { UtensilsCrossed, Download, MessageSquare, PhoneCall } from 'lucide-react';
import { VENDOR_CONTACT } from '../data/mockData';

interface NavbarProps {
  currency: 'NGN' | 'USD';
  setCurrency: (c: 'NGN' | 'USD') => void;
  onQuickDownloadTrial: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  setCurrency,
  onQuickDownloadTrial,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs font-semibold py-1.5 px-4 text-center">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="bg-white text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shadow-xs">
              Release v3.4.2
            </span>
            <span className="font-medium text-white/95">Kaylix Kitchen & POS Suite • Offline-First</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto gap-4 text-xs font-semibold">
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

      {/* Main Navbar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-17 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onScrollToSection('hero')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 text-white ring-2 ring-amber-400/30">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 font-sans">
                KAYLIX<span className="text-amber-600">.KITCHEN</span>
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                POS
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold leading-none mt-0.5">
              Kitchen & Eatery Management
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-700">
          <button
            onClick={() => onScrollToSection('editions')}
            className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Packages & Pricing
          </button>
          <button
            onClick={() => onScrollToSection('preview')}
            className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Software Tour
          </button>
          <button
            onClick={() => onScrollToSection('comparison')}
            className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Features Matrix
          </button>
          <button
            onClick={() => onScrollToSection('bank-details')}
            className="px-3 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Bank Details
          </button>
          <button
            onClick={() => onScrollToSection('whatsapp-order')}
            className="px-3 py-1.5 rounded-lg hover:text-emerald-800 hover:bg-emerald-50 transition-colors flex items-center gap-1.5 text-emerald-700 font-bold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp Order
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-100 border border-slate-300/80 rounded-lg p-0.5 text-xs font-bold">
            <button
              onClick={() => setCurrency('NGN')}
              className={`px-2 py-1 rounded-md transition-all ${
                currency === 'NGN'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ₦ NGN
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-md transition-all ${
                currency === 'USD'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Quick Trial Download CTA */}
          <button
            onClick={onQuickDownloadTrial}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.8]" />
            <span>7-Day Trial</span>
          </button>
        </div>
      </div>
    </header>
  );
};
