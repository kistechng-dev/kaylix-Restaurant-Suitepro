import React from 'react';
import { Sparkles, Package, Building2, MessageSquare, Download, Flame } from 'lucide-react';

interface MobileBottomBarProps {
  activeSection: string;
  onScrollToSection: (sectionId: string) => void;
  onOpenTrialModal: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeSection,
  onScrollToSection,
  onOpenTrialModal,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {/* Home / Tour */}
        <button
          onClick={() => onScrollToSection('hero')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            activeSection === 'hero' || activeSection === 'preview'
              ? 'text-amber-600 bg-amber-50/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <Flame className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Tour</span>
        </button>

        {/* Packages */}
        <button
          onClick={() => onScrollToSection('editions')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            activeSection === 'editions'
              ? 'text-amber-600 bg-amber-50/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <Package className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Plans</span>
        </button>

        {/* Free Trial Center Button */}
        <button
          onClick={onOpenTrialModal}
          className="flex flex-col items-center justify-center -mt-3 group active:scale-95 transition-transform"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 ring-3 ring-white">
            <Download className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black text-amber-700 tracking-tight mt-0.5">7-Day Trial</span>
        </button>

        {/* Bank Payment Details */}
        <button
          onClick={() => onScrollToSection('bank-details')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            activeSection === 'bank-details'
              ? 'text-emerald-700 bg-emerald-50/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <Building2 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Banks</span>
        </button>

        {/* WhatsApp Order */}
        <button
          onClick={() => onScrollToSection('whatsapp-order')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            activeSection === 'whatsapp-order'
              ? 'text-emerald-700 bg-emerald-50/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Order</span>
        </button>
      </div>
    </div>
  );
};
