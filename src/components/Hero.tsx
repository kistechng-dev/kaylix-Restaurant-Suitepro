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
} from 'lucide-react';

interface HeroProps {
  onDownloadTrial: () => void;
  onScrollToSection: (sectionId: string) => void;
  currency: 'NGN' | 'USD';
}

export const Hero: React.FC<HeroProps> = ({
  onDownloadTrial,
  onScrollToSection,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'pos' | 'kds' | 'recipe' | 'sales'>('pos');
  const [cartItems] = useState([
    { id: 1, name: 'Smokey Party Jollof + Plantain', qty: 2, price: 2500 },
    { id: 2, name: 'Grilled Catfish Point & Kill', qty: 1, price: 6500 },
    { id: 3, name: 'Peppered Asun Goat Meat', qty: 1, price: 3500 },
    { id: 4, name: 'Chapman Classic Mocktail', qty: 2, price: 2000 },
  ]);

  const subtotal = cartItems.reduce((acc, i) => acc + i.qty * i.price, 0);
  const tax = subtotal * 0.075;
  const grandTotal = subtotal + tax;

  return (
    <section id="hero" className="relative pt-8 pb-16 overflow-hidden bg-slate-50">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-tr from-amber-200/40 via-orange-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-100/25 blur-3xl pointer-events-none rounded-full" />

      {/* Reduced Container Width */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Official Kaylix Suite v3.4.2 Released
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-300 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            Zero Latency • 100% Offline First
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-300 shadow-2xs">
            <Printer className="w-3.5 h-3.5 text-amber-600" />
            ESC/POS 80mm & 58mm Autocut
          </span>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-3xl mx-auto mb-9">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            The High-Speed Operating System for Modern{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
              Kitchens, Eateries & Lounges
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Eliminate order mistakes, stop kitchen inventory leaks, and speed up table turnarounds.
            Available in 4 tailored packages: <strong className="text-amber-800 font-bold">Trial (7-Day)</strong>,{' '}
            <strong className="text-slate-900 font-bold">Basic Package</strong> (Single POS + 1 Wireless),{' '}
            <strong className="text-amber-800 font-bold">Standard Package</strong> (Multi-User + KDS Pass), and{' '}
            <strong className="text-slate-900 font-bold">Enterprises Package</strong> (Omnichannel Flagship).
          </p>

          {/* Action CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onDownloadTrial}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4 stroke-[2.8]" />
              <span>Download 7-Day Free Trial</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.2 rounded font-mono font-medium">
                .zip
              </span>
            </button>

            <button
              onClick={() => onScrollToSection('whatsapp-order')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-400 font-bold text-sm flex items-center gap-2 shadow-xs transition-all hover:border-emerald-500"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Order via WhatsApp</span>
            </button>

            <button
              onClick={() => onScrollToSection('bank-details')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm flex items-center gap-2 shadow-xs transition-all"
            >
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Bank Payment Details</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Software Tour Mockup */}
        <div id="preview" className="mt-10 rounded-2xl border border-slate-300/90 bg-white shadow-xl overflow-hidden">
          {/* Header of simulated application window */}
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 tracking-wide font-sans">
                Interactive Software Preview
              </span>
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.2 rounded text-[10px] font-black">
                ● LIVE DEMO
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
              <button
                onClick={() => setActiveTab('pos')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'pos'
                    ? 'bg-amber-500 text-white font-black shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <MonitorCheck className="w-3.5 h-3.5" />
                <span>Cashier POS</span>
              </button>
              <button
                onClick={() => setActiveTab('kds')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'kds'
                    ? 'bg-amber-500 text-white font-black shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Kitchen KDS</span>
              </button>
              <button
                onClick={() => setActiveTab('recipe')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'recipe'
                    ? 'bg-amber-500 text-white font-black shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Recipe Costing</span>
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'sales'
                    ? 'bg-amber-500 text-white font-black shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Daily Sales</span>
              </button>
            </div>
          </div>

          {/* Interactive Tab Body */}
          <div className="p-4 sm:p-5 bg-slate-50 min-h-[390px]">
            {activeTab === 'pos' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left: Menu Grid */}
                <div className="md:col-span-7">
                  <div className="flex items-center justify-between mb-3">
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

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { name: 'Smokey Party Jollof', price: '₦2,500', stock: '48 portions', tag: 'Fast Moving' },
                      { name: 'Special Fried Rice', price: '₦3,200', stock: '32 portions', tag: 'Chef Choice' },
                      { name: 'Grilled Catfish Point & Kill', price: '₦6,500', stock: '14 fresh fish', tag: 'Live Grill' },
                      { name: 'Peppered Asun Goat Meat', price: '₦3,500', stock: '26 portions', tag: 'Spicy' },
                      { name: 'Egusi Soup & Pounded Yam', price: '₦3,500', stock: '20 portions', tag: 'Traditional' },
                      { name: 'Chapman Classic Cocktail', price: '₦2,000', stock: 'Bar Ready', tag: 'Chilled' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-300/80 rounded-xl p-3 hover:border-amber-500 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                            {item.tag}
                          </span>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 leading-snug">{item.name}</h4>
                          <span className="text-[11px] text-slate-600 font-medium">{item.stock}</span>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-black text-amber-800">{item.price}</span>
                          <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md hover:bg-amber-500 hover:text-white font-extrabold transition-colors">
                            + Add
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Active Order Ticket */}
                <div className="md:col-span-5 bg-white border border-slate-300/90 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-800">TABLE #04 • DINE-IN</span>
                        <h4 className="text-sm font-extrabold text-slate-900">Order Ticket #K-0842</h4>
                      </div>
                      <span className="text-[11px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                        GUEST: 4 SEATS
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-2 max-h-44 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-900 text-[11px]">
                              {item.qty}
                            </span>
                            <span className="text-slate-800 font-semibold">{item.name}</span>
                          </div>
                          <span className="font-mono text-slate-900 font-bold">
                            ₦{(item.qty * item.price).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1 text-xs">
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

                    <div className="grid grid-cols-3 gap-1.5 pt-2">
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors">
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        Print KOT
                      </button>
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors">
                        Split Bill
                      </button>
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors">
                        Pay & Settle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kds' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 font-extrabold">KITCHEN DISPLAY SCREEN (KDS)</span>
                    <span className="text-amber-800 font-bold">4 Active Tickets in Queue</span>
                  </div>
                  <span className="text-emerald-800 font-mono font-bold">Auto-Refreshing every 3s</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Ticket 1 */}
                  <div className="bg-white border-2 border-amber-400 rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-black text-amber-900 text-xs">TICKET #K-0840 • T4</span>
                      <span className="flex items-center gap-1 text-[11px] text-amber-900 font-mono bg-amber-100 px-2 py-0.5 rounded font-black">
                        <Clock className="w-3 h-3 text-amber-700" /> 04:12 mins
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-xs text-slate-800">
                      <li className="font-bold flex items-center justify-between">
                        <span>2x Smokey Jollof Rice</span>
                        <span className="text-amber-800 text-[10px] font-black">Extra Plantain</span>
                      </li>
                      <li className="font-semibold text-slate-800">1x Grilled Catfish (Full Fish - Spicy)</li>
                      <li className="font-medium text-slate-600">1x Asun Peppered Goat</li>
                    </ul>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-2xs transition-colors">
                      Mark as Ready (Buzz Server)
                    </button>
                  </div>

                  {/* Ticket 2 */}
                  <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-bold text-slate-900 text-xs">TICKET #K-0841 • TAKEAWAY</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded font-bold">
                        <Clock className="w-3 h-3" /> 01:45 mins
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-xs text-slate-800">
                      <li className="font-semibold text-slate-800">1x Special Fried Rice & Shrimps</li>
                      <li className="font-semibold text-slate-800">2x Crispy Chicken Wings (6pcs)</li>
                    </ul>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors">
                      Start Preparation
                    </button>
                  </div>

                  {/* Ticket 3 */}
                  <div className="bg-white border border-emerald-300 rounded-xl p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-bold text-emerald-900 text-xs">TICKET #K-0839 • VIP 2</span>
                      <span className="text-[10px] text-emerald-900 font-black bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        READY FOR DISPATCH
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-xs text-slate-800">
                      <li className="font-semibold">1x Seafood Okro Soup & Fresh Fish</li>
                      <li className="font-semibold">2x Pounded Yam Portion</li>
                    </ul>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition-colors">
                      Completed & Served ✓
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recipe' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <span className="text-slate-900 font-extrabold">RECIPE COSTING & AUTOMATED INVENTORY DEDUCTION</span>
                  <span className="text-amber-800 font-bold">Yield: 50 Portions Batch</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-white border border-slate-300/80 rounded-xl p-3.5 shadow-2xs">
                    <h5 className="font-extrabold text-slate-900 text-xs mb-2">Recipe: Smokey Party Jollof (50 Plates)</h5>
                    <table className="w-full text-xs text-slate-800">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-left font-bold">
                          <th className="pb-1">Raw Ingredient</th>
                          <th className="pb-1">Quantity</th>
                          <th className="pb-1 text-right">Unit Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                        <tr><td className="py-1">Long Grain Parboiled Rice</td><td>10.0 kg</td><td className="text-right font-mono font-bold text-slate-900">₦15,000</td></tr>
                        <tr><td className="py-1">Refined Vegetable Oil</td><td>3.0 Litres</td><td className="text-right font-mono font-bold text-slate-900">₦6,900</td></tr>
                        <tr><td className="py-1">Tomato Paste & Fresh Pepper Puree</td><td>4.5 kg</td><td className="text-right font-mono font-bold text-slate-900">₦7,200</td></tr>
                        <tr><td className="py-1">Seasoning Cubes, Curry & Thyme</td><td>1 pack</td><td className="text-right font-mono font-bold text-slate-900">₦2,500</td></tr>
                        <tr><td className="py-1">Cooking Gas / Energy Allocation</td><td>1 batch</td><td className="text-right font-mono font-bold text-slate-900">₦3,000</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white border border-slate-300/80 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs mb-2">Cost Margin Breakdown</h5>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-700">
                          <span>Total Batch Production Cost:</span>
                          <span className="font-mono text-slate-900 font-bold">₦34,600</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Cost per Individual Plate:</span>
                          <span className="font-mono text-amber-800 font-black">₦692</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Selling Price per Plate:</span>
                          <span className="font-mono text-emerald-800 font-black">₦2,500</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Gross Margin Percentage:</span>
                          <span className="font-mono text-emerald-700 font-black text-sm">72.3% Margin</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-900 font-medium">
                      ✓ Every time a plate is checked out on the POS, 0.2kg rice & 0.06L oil are automatically depleted from central inventory in real time.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <span className="text-slate-900 font-extrabold">END-OF-DAY FINANCIAL RECONCILIATION (Z-REPORT)</span>
                  <span className="text-emerald-800 font-black">Shift Closed • Balanced</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white border border-slate-300/80 p-3 rounded-xl shadow-2xs">
                    <span className="text-slate-600 text-xs font-bold">Total Net Sales</span>
                    <h5 className="text-base sm:text-lg font-black text-slate-900 font-mono mt-0.5">₦482,500</h5>
                    <span className="text-[10px] text-emerald-700 font-bold">+14% vs yesterday</span>
                  </div>
                  <div className="bg-white border border-slate-300/80 p-3 rounded-xl shadow-2xs">
                    <span className="text-slate-600 text-xs font-bold">Cash in Drawer</span>
                    <h5 className="text-base sm:text-lg font-black text-amber-800 font-mono mt-0.5">₦184,000</h5>
                    <span className="text-[10px] text-slate-600 font-medium">Audited & Verified</span>
                  </div>
                  <div className="bg-white border border-slate-300/80 p-3 rounded-xl shadow-2xs">
                    <span className="text-slate-600 text-xs font-bold">POS / Transfer</span>
                    <h5 className="text-base sm:text-lg font-black text-blue-800 font-mono mt-0.5">₦298,500</h5>
                    <span className="text-[10px] text-emerald-700 font-bold">Zenith & Moniepoint</span>
                  </div>
                  <div className="bg-white border border-slate-300/80 p-3 rounded-xl shadow-2xs">
                    <span className="text-slate-600 text-xs font-bold">Completed Orders</span>
                    <h5 className="text-base sm:text-lg font-black text-purple-900 font-mono mt-0.5">118 Orders</h5>
                    <span className="text-[10px] text-slate-600 font-medium">Avg ticket: ₦4,088</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
