import React from 'react';
import { UtensilsCrossed, PhoneCall, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { VENDOR_CONTACT } from '../data/mockData';
import { PageType } from './Navbar';

interface FooterProps {
  onNavigateToPage?: (page: PageType) => void;
  onScrollToSection?: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToPage, onScrollToSection }) => {
  const handleNav = (target: PageType | string) => {
    if (onNavigateToPage) {
      if (target === 'whatsapp-order' || target === 'order') onNavigateToPage('order');
      else if (target === 'download' || target === 'downloads') onNavigateToPage('download');
      else if (target === 'bank-details' || target === 'banks') onNavigateToPage('banks');
      else if (target === 'editions' || target === 'comparison' || target === 'plan') onNavigateToPage('plan');
      else onNavigateToPage('tour');
    } else if (onScrollToSection) {
      onScrollToSection(target);
    }
  };

  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-12 pb-10 text-slate-700 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNav('tour')}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black shadow-xs">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-slate-900 tracking-tight font-mono">
                KAYLIX<span className="text-amber-600">_POS_PRO_3.4.2</span>
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-xs font-medium">
              KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2 — The premier Point of Sale, inventory, and billing system engineered for retail, eateries, and modern businesses.
            </p>
            <div className="flex items-center gap-1.5 text-slate-800 font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Stable Build: {VENDOR_CONTACT.installerVersion}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-wider">Pages</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => handleNav('tour')}
                  className="hover:text-amber-700 transition-colors"
                >
                  POS Software Tour
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('plan')}
                  className="hover:text-amber-700 transition-colors text-left"
                >
                  Choose Your Hospitality Package
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('download')}
                  className="hover:text-amber-700 transition-colors text-left font-bold text-amber-800"
                >
                  Download Software & Register
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('banks')}
                  className="hover:text-amber-700 transition-colors text-left"
                >
                  Direct Bank Transfer & Payment Details
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('order')}
                  className="hover:text-emerald-700 transition-colors font-bold text-emerald-800"
                >
                  My Order Page
                </button>
              </li>
            </ul>
          </div>

          {/* Software Plans */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-wider">Plan Packages</h4>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li>
                <strong className="text-slate-900">Trial Plan:</strong> 7-Day Free Full Pass
              </li>
              <li>
                <strong className="text-slate-900">Basic Plan:</strong> 1 Standalone POS + 2 Wireless Terminals
              </li>
              <li>
                <strong className="text-amber-800">Standard Plan:</strong> Multi-User + KDS Pass
              </li>
              <li>
                <strong className="text-purple-900">Enterprises Plan:</strong> Omnichannel Flagship
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-wider">Support Desk</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <a href={`mailto:${VENDOR_CONTACT.email}`} className="hover:text-slate-900 text-slate-800">
                  {VENDOR_CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <a
                  href={`https://wa.me/${VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-800 font-bold text-emerald-800"
                >
                  {VENDOR_CONTACT.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{VENDOR_CONTACT.location}</span>
              </li>
              <li className="text-[11px] text-slate-500 pt-0.5">
                {VENDOR_CONTACT.supportHours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <div>
            © {new Date().getFullYear()} Kaylix Technology & Kistech Integrated Systems Ltd.
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-bold text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              100% Genuine Software
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
