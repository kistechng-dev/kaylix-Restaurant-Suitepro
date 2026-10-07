import React, { useState } from 'react';
import {
  Download,
  MessageSquare,
  Zap,
  Printer,
  Layers,
  ChefHat,
  MonitorCheck,
  Clock,
  TrendingUp,
  Sparkles,
  CreditCard,
  Copy,
  Check,
  CheckCircle2,
  Package,
  ArrowRight,
} from 'lucide-react';
import { BANK_ACCOUNTS } from '../data/mockData';
import { PageType } from './Navbar';

interface HeroProps {
  onDownloadTrial: () => void;
  onNavigateToPage?: (page: PageType) => void;
  onScrollToSection?: (sectionId: string) => void;
  onOrderHardwareOnly?: (addonId?: string) => void;
  currency: 'NGN' | 'USD';
}

export const Hero: React.FC<HeroProps> = ({
  onDownloadTrial,
  onNavigateToPage,
  onScrollToSection,
  onOrderHardwareOnly,
  currency,
}) => {
  const handleNav = (target: PageType | string) => {
    if (onNavigateToPage) {
      if (target === 'whatsapp-order' || target === 'order') onNavigateToPage('order');
      else if (target === 'download' || target === 'downloads') onNavigateToPage('download');
      else if (target === 'bank-details' || target === 'banks') onNavigateToPage('banks');
      else if (target === 'editions' || target === 'plan') onNavigateToPage('plan');
      else onNavigateToPage('tour');
    } else if (onScrollToSection) {
      onScrollToSection(target);
    }
  };
  const [activeTab, setActiveTab] = useState<'pos' | 'kds' | 'recipe' | 'sales'>('pos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Smokey Party Jollof + Plantain', qty: 2, price: 2500 },
    { id: 2, name: 'Grilled Catfish Point & Kill', qty: 1, price: 6500 },
    { id: 3, name: 'Peppered Asun Goat Meat', qty: 1, price: 3500 },
    { id: 4, name: 'Chapman Classic Mocktail', qty: 2, price: 2000 },
  ]);

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

  const handleAddDish = (dish: { name: string; price: number }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === dish.name);
      if (existing) {
        return prev.map((item) =>
          item.name === dish.name ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: Date.now(), name: dish.name, qty: 1, price: dish.price }];
    });
    showToast(`+ Added ${dish.name} to POS Cart`);
  };

  const handlePrintKOT = () => {
    showToast('🖨️ Thermal Autocut Ticket #K-0842 printed and sent to Kitchen KDS!');
  };

  const subtotal = cartItems.reduce((acc, i) => acc + i.qty * i.price, 0);
  const tax = subtotal * 0.075;
  const grandTotal = subtotal + tax;

  return (
    <section id="hero" className="relative pt-6 sm:pt-8 pb-12 sm:pb-16 overflow-hidden bg-slate-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-tr from-amber-200/40 via-orange-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-100/25 blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 relative z-10">
        {/* Anti-Slop Unboxed Editorial Metadata Line */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600 mb-3 text-center">
          <span className="text-amber-800 font-bold font-mono">KAYLIX_MULTI_PURPOSE_POS_PRO_3.4.2</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-700">100% Offline-First Multi-Purpose POS</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-700">500+ Active Deployments</span>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.15]">
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

          {/* Action CTAs */}
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-2xl mx-auto">
            <button
              onClick={onDownloadTrial}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.8]" />
              <span>Download Free Trial & Proceed to Order Sender</span>
              <span className="text-[11px] bg-white/20 px-1.5 py-0.2 rounded font-mono font-medium">
                .zip
              </span>
            </button>

            <button
              onClick={() => handleNav('plan')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all active:scale-95"
            >
              <Package className="w-4 h-4" />
              <span>Choose Hospitality Plan</span>
            </button>

            <button
              onClick={() => (onOrderHardwareOnly ? onOrderHardwareOnly() : handleNav('order'))}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Buy Hardware Add-ons</span>
            </button>

            <button
              onClick={() => handleNav('order')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-400 font-bold text-sm flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>My Order</span>
            </button>
          </div>

          {/* Mobile Quick-Action Chips Scroller (Tactile Thumb Experience) */}
          <div className="mt-5 pt-3 border-t border-slate-200/80">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Touch Shortcuts
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 no-scrollbar justify-start sm:justify-center">
              <button
                onClick={onDownloadTrial}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>⚡ Download Trial & Proceed to Order Sender</span>
              </button>

              <button
                onClick={() => (onOrderHardwareOnly ? onOrderHardwareOnly() : handleNav('order'))}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>🖨️ Buy Hardware (No Plan Required)</span>
              </button>

              <button
                onClick={() => handleNav('plan')}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-all active:scale-95"
              >
                <Package className="w-3.5 h-3.5 text-amber-700" />
                <span>📦 Plan Packages</span>
              </button>

              <button
                onClick={() => handleNav('order')}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>💬 My Order</span>
              </button>

              <button
                onClick={() => handleNav('banks')}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition-all active:scale-95"
              >
                <CreditCard className="w-3.5 h-3.5 text-slate-600" />
                <span>🏦 Bank Accounts</span>
              </button>

              <button
                onClick={() => handleCopyAccount('1016978239', 'Zenith Bank')}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-all active:scale-95"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Zenith: <span className="font-mono font-black text-slate-900">1016978239</span></span>
              </button>

              <button
                onClick={() => handleCopyAccount('8089697390', 'Moniepoint')}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-all active:scale-95"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Moniepoint: <span className="font-mono font-black text-slate-900">8089697390</span></span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Software Tour Mockup */}
        <div id="preview" className="mt-6 sm:mt-8 rounded-2xl border border-slate-300/90 bg-white shadow-xl overflow-hidden">
          {/* Header of simulated application window */}
          <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 tracking-wide font-sans">
                Interactive Software Tour
              </span>
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.2 rounded text-[10px] font-black">
                ● LIVE
              </span>
            </div>

            {/* Navigation Tabs (Mobile Horizontally Scrollable) */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('pos')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'pos'
                    ? 'bg-amber-500 text-white font-black shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <MonitorCheck className="w-3.5 h-3.5" />
                <span>Cashier POS</span>
              </button>
              <button
                onClick={() => setActiveTab('kds')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'kds'
                    ? 'bg-amber-500 text-white font-black shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Kitchen KDS</span>
              </button>
              <button
                onClick={() => setActiveTab('recipe')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'recipe'
                    ? 'bg-amber-500 text-white font-black shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Recipe Costing</span>
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'sales'
                    ? 'bg-amber-500 text-white font-black shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Daily Sales</span>
              </button>
            </div>
          </div>

          {/* Interactive Tab Body */}
          <div className="p-3 sm:p-5 bg-slate-50 min-h-[380px]">
            {activeTab === 'pos' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
                {/* Left: Menu Grid */}
                <div className="md:col-span-7">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                      {['All Dishes', 'Rice & Specials', 'Soups & Swallows', 'Grills & Meat', 'Cocktails'].map((cat, idx) => (
                        <span
                          key={cat}
                          className={`px-2.5 py-1 rounded-lg cursor-pointer whitespace-nowrap font-bold text-xs ${
                            idx === 0
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-300 hover:text-slate-900'
                          }`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {[
                      { name: 'Smokey Party Jollof', price: 2500, stock: '48 portions', tag: 'Fast Moving' },
                      { name: 'Special Fried Rice', price: 3200, stock: '32 portions', tag: 'Chef Choice' },
                      { name: 'Grilled Catfish Point & Kill', price: 6500, stock: '14 fresh fish', tag: 'Live Grill' },
                      { name: 'Peppered Asun Goat Meat', price: 3500, stock: '26 portions', tag: 'Spicy' },
                      { name: 'Egusi Soup & Pounded Yam', price: 3500, stock: '20 portions', tag: 'Traditional' },
                      { name: 'Chapman Classic Cocktail', price: 2000, stock: 'Bar Ready', tag: 'Chilled' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleAddDish(item)}
                        className="bg-white border border-slate-300/80 rounded-xl p-2.5 sm:p-3 hover:border-amber-500 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between active:scale-95"
                      >
                        <div>
                          <span className="text-[9px] font-extrabold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                            {item.tag}
                          </span>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 leading-snug line-clamp-1">{item.name}</h4>
                          <span className="text-[10px] text-slate-600 font-medium">{item.stock}</span>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-black text-amber-800">₦{item.price.toLocaleString()}</span>
                          <span className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md hover:bg-amber-500 hover:text-white font-extrabold transition-colors">
                            + Add
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Active Order Ticket */}
                <div className="md:col-span-5 bg-white border border-slate-300/90 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-amber-800">TABLE #04 • DINE-IN</span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Order Ticket #K-0842</h4>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                        GUEST: 4 SEATS
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-900 text-[10px]">
                              {item.qty}
                            </span>
                            <span className="text-slate-800 font-semibold truncate max-w-[130px] sm:max-w-[160px]">{item.name}</span>
                          </div>
                          <span className="font-mono text-slate-900 font-bold text-[11px]">
                            ₦{(item.qty * item.price).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-900 font-bold">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>VAT (7.5%)</span>
                      <span className="font-mono text-slate-900 font-bold">₦{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                      <span>Total Payable</span>
                      <span className="font-mono text-amber-800 text-base font-black">₦{grandTotal.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-2">
                      <button
                        onClick={handlePrintKOT}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors active:scale-95"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        Print KOT
                      </button>
                      <button
                        onClick={() => showToast('Bill split between 4 guest seats!')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors active:scale-95"
                      >
                        Split Bill
                      </button>
                      <button
                        onClick={() => {
                          showToast('Settled ₦' + grandTotal.toLocaleString() + ' via Moniepoint POS!');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors active:scale-95"
                      >
                        Settle & Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kds' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 font-extrabold">KITCHEN DISPLAY SCREEN (KDS)</span>
                    <span className="text-amber-800 font-bold">3 Active Tickets</span>
                  </div>
                  <span className="text-emerald-800 font-mono font-bold text-[11px]">Auto-refreshing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Ticket 1 */}
                  <div className="bg-white border-2 border-amber-400 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="font-black text-amber-900 text-xs">TICKET #K-0840 • T4</span>
                      <span className="flex items-center gap-1 text-[10px] text-amber-900 font-mono bg-amber-100 px-1.5 py-0.5 rounded font-black">
                        <Clock className="w-3 h-3 text-amber-700" /> 04:12m
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-800">
                      <li className="font-bold flex items-center justify-between">
                        <span>2x Smokey Jollof Rice</span>
                        <span className="text-amber-800 text-[10px] font-black">Extra Plantain</span>
                      </li>
                      <li className="font-semibold text-slate-800">1x Grilled Catfish (Point & Kill)</li>
                      <li className="font-medium text-slate-600">1x Asun Peppered Goat</li>
                    </ul>
                    <button
                      onClick={() => showToast('🔔 Kitchen Buzzed Server: Table #4 order ready!')}
                      className="mt-2.5 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-2xs transition-colors active:scale-95"
                    >
                      Mark as Ready (Buzz Server)
                    </button>
                  </div>

                  {/* Ticket 2 */}
                  <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="font-bold text-slate-900 text-xs">TICKET #K-0841 • TAKEAWAY</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-700 font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                        <Clock className="w-3 h-3" /> 01:45m
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-800">
                      <li className="font-semibold text-slate-800">1x Special Fried Rice & Shrimps</li>
                      <li className="font-semibold text-slate-800">2x Crispy Chicken Wings (6pcs)</li>
                    </ul>
                    <button
                      onClick={() => showToast('🍳 Chef started preparation for Ticket #K-0841')}
                      className="mt-2.5 w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors active:scale-95"
                    >
                      Start Preparation
                    </button>
                  </div>

                  {/* Ticket 3 */}
                  <div className="bg-white border border-emerald-300 rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="font-bold text-emerald-900 text-xs">TICKET #K-0839 • VIP 2</span>
                      <span className="text-[9px] text-emerald-900 font-black bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                        READY
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-800">
                      <li className="font-semibold">1x Seafood Okro Soup & Fresh Fish</li>
                      <li className="font-semibold">2x Pounded Yam Portion</li>
                    </ul>
                    <button
                      onClick={() => showToast('✓ Order #K-0839 marked Completed & Dispatched!')}
                      className="mt-2.5 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition-colors active:scale-95"
                    >
                      Completed & Served ✓
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recipe' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <span className="text-slate-900 font-extrabold">RECIPE COSTING & INVENTORY DEDUCTION</span>
                  <span className="text-amber-800 font-bold">50-Plate Batch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-300/80 rounded-xl p-3 shadow-2xs">
                    <h5 className="font-extrabold text-slate-900 text-xs mb-1.5">Recipe: Smokey Party Jollof</h5>
                    <table className="w-full text-xs text-slate-800">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-left font-bold text-[11px]">
                          <th className="pb-1">Ingredient</th>
                          <th className="pb-1">Qty</th>
                          <th className="pb-1 text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800 font-medium text-[11px]">
                        <tr><td className="py-1">Long Grain Parboiled Rice</td><td>10.0 kg</td><td className="text-right font-mono font-bold text-slate-900">₦15,000</td></tr>
                        <tr><td className="py-1">Refined Vegetable Oil</td><td>3.0 Litres</td><td className="text-right font-mono font-bold text-slate-900">₦6,900</td></tr>
                        <tr><td className="py-1">Tomato Paste & Fresh Pepper</td><td>4.5 kg</td><td className="text-right font-mono font-bold text-slate-900">₦7,200</td></tr>
                        <tr><td className="py-1">Seasoning Cubes, Curry & Thyme</td><td>1 pack</td><td className="text-right font-mono font-bold text-slate-900">₦2,500</td></tr>
                        <tr><td className="py-1">Cooking Gas / Energy Allocation</td><td>1 batch</td><td className="text-right font-mono font-bold text-slate-900">₦3,000</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white border border-slate-300/80 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs mb-2">Cost Margin Breakdown</h5>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-700">
                          <span>Total Batch Cost:</span>
                          <span className="font-mono text-slate-900 font-bold">₦34,600</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Cost per Plate:</span>
                          <span className="font-mono text-amber-800 font-black">₦692</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Selling Price:</span>
                          <span className="font-mono text-emerald-800 font-black">₦2,500</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Gross Margin:</span>
                          <span className="font-mono text-emerald-700 font-black text-sm">72.3% Margin</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-900 font-medium">
                      ✓ Every time a plate is checked out, 0.2kg rice & 0.06L oil are depleted from central stock automatically.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <span className="text-slate-900 font-extrabold">FINANCIAL RECONCILIATION (Z-REPORT)</span>
                  <span className="text-emerald-800 font-black">Shift Closed • Balanced</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-white border border-slate-300/80 p-2.5 rounded-xl shadow-2xs">
                    <span className="text-slate-600 text-[11px] font-bold">Total Net Sales</span>
                    <h5 className="text-base font-black text-slate-900 font-mono mt-0.5">₦482,500</h5>
                    <span className="text-[10px] text-emerald-700 font-bold">+14% vs yesterday</span>
                  </div>
                  <div className="bg-white border border-slate-300/80 p-2.5 rounded-xl shadow-2xs">
                    <span className="text-slate-600 text-[11px] font-bold">Cash in Drawer</span>
                    <h5 className="text-base font-black text-amber-800 font-mono mt-0.5">₦184,000</h5>
                    <span className="text-[10px] text-slate-600 font-medium">Audited & Verified</span>
                  </div>
                  <div className="bg-white border border-slate-300/80 p-2.5 rounded-xl shadow-2xs">
                    <span className="text-slate-600 text-[11px] font-bold">POS / Transfer</span>
                    <h5 className="text-base font-black text-blue-800 font-mono mt-0.5">₦298,500</h5>
                    <span className="text-[10px] text-emerald-700 font-bold">Zenith & Moniepoint</span>
                  </div>
                  <div className="bg-white border border-slate-300/80 p-2.5 rounded-xl shadow-2xs">
                    <span className="text-slate-600 text-[11px] font-bold">Completed Orders</span>
                    <h5 className="text-base font-black text-purple-900 font-mono mt-0.5">118 Orders</h5>
                    <span className="text-[10px] text-slate-600 font-medium">Avg: ₦4,088</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Page Transition Card to Choose Package */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-400">
              Next Page
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Choose Your Plan Package
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-xl">
              Compare our 4 tailored POS plans with flexible duration options (1 Year, 3 Years, Lifetime) or download the 7-Day Free Evaluation build.
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
