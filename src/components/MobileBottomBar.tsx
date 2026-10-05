import React from 'react';
import { Package, Building2, MessageSquare, Download, Flame } from 'lucide-react';
import { PageType } from './Navbar';

interface MobileBottomBarProps {
  currentPage: PageType;
  onNavigateToPage: (page: PageType) => void;
  onOpenTrialModal: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentPage,
  onNavigateToPage,
  onOpenTrialModal,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {/* Tour Page */}
        <button
          onClick={() => onNavigateToPage('tour')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentPage === 'tour'
              ? 'text-amber-600 bg-amber-50/90 font-bold'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <Flame className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Tour</span>
        </button>

        {/* Choose Your Hospitality Package Page */}
        <button
          onClick={() => onNavigateToPage('plan')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentPage === 'plan'
              ? 'text-amber-600 bg-amber-50/90 font-bold'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <Package className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Plan</span>
        </button>

        {/* Download Center Button */}
        <button
          onClick={() => onNavigateToPage('download')}
          className="flex flex-col items-center justify-center -mt-3 group active:scale-95 transition-transform"
        >
          <div className={`w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg shadow-orange-500/30 ring-3 ring-white transition-all ${
            currentPage === 'download'
              ? 'bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 ring-amber-400 scale-105'
              : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600'
          }`}>
            <Download className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className={`text-[10px] font-black tracking-tight mt-0.5 ${
            currentPage === 'download' ? 'text-amber-900 underline' : 'text-amber-700'
          }`}>
            Download
          </span>
        </button>

        {/* Direct Bank Transfer & Payment Details Page */}
        <button
          onClick={() => onNavigateToPage('banks')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentPage === 'banks'
              ? 'text-emerald-700 bg-emerald-50/90 font-bold'
              : 'text-slate-600 hover:text-slate-900 active:scale-95'
          }`}
        >
          <Building2 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Banks</span>
        </button>

        {/* My Order Page */}
        <button
          onClick={() => onNavigateToPage('order')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentPage === 'order'
              ? 'text-emerald-700 bg-emerald-50/90 font-bold'
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
