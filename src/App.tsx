/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, PageType } from './components/Navbar';
import { Hero } from './components/Hero';
import { EditionsSection } from './components/EditionsSection';
import { FeatureMatrix } from './components/FeatureMatrix';
import { BankDetailsSection } from './components/BankDetailsSection';
import { WhatsAppOrderSender } from './components/WhatsAppOrderSender';
import { DownloadModal } from './components/DownloadModal';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';
import { MobileBottomBar } from './components/MobileBottomBar';
import { PhoneSimulatorWrapper } from './components/PhoneSimulatorWrapper';
import { EditionDetail, EditionType, DurationTier } from './types';
import { EDITIONS } from './data/mockData';
import { Package, Building2, MessageSquare, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [downloadModalEdition, setDownloadModalEdition] = useState<EditionDetail | null>(null);
  const [orderSelectedEdition, setOrderSelectedEdition] = useState<EditionType>('standard');
  const [orderSelectedTier, setOrderSelectedTier] = useState<DurationTier>('1_year');
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(false);

  // Multi-page navigation state: 'tour' | 'plan' | 'banks' | 'order'
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('plan') || hash.includes('package') || hash.includes('editions')) return 'plan';
      if (hash.includes('bank')) return 'banks';
      if (hash.includes('order')) return 'order';
    }
    return 'tour';
  });

  // Admin Portal mode state (hidden from public view)
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.pathname === '/admin';
    }
    return false;
  });

  // Hash synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminView(true);
        return;
      }
      setIsAdminView(false);

      if (hash.includes('plan') || hash.includes('package') || hash.includes('editions')) {
        setCurrentPage('plan');
      } else if (hash.includes('bank')) {
        setCurrentPage('banks');
      } else if (hash.includes('order')) {
        setCurrentPage('order');
      } else {
        setCurrentPage('tour');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    window.location.hash = page === 'tour' ? 'tour' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadEdition = (edition: EditionDetail, tier: DurationTier) => {
    setDownloadModalEdition(edition);
  };

  const handleQuickDownloadTrial = () => {
    setDownloadModalEdition(EDITIONS.trial);
  };

  const handleSelectForOrder = (editionId: EditionType, tier: DurationTier) => {
    setOrderSelectedEdition(editionId);
    setOrderSelectedTier(tier);
    navigateToPage('order');
  };

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin mode, render the private Backend Admin Portal
  if (isAdminView) {
    return <AdminPortal onBackToPublic={handleCloseAdmin} />;
  }

  // Render individual page content
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'plan':
        return (
          <div className="animate-fadeIn">
            {/* Page Header Banner */}
            <div className="bg-gradient-to-b from-amber-500/10 via-amber-50/60 to-transparent border-b border-amber-200/70 pt-8 pb-10 px-4 sm:px-6">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-2.5">
                  <button
                    onClick={() => navigateToPage('tour')}
                    className="hover:underline flex items-center gap-1 text-slate-600 hover:text-slate-900"
                  >
                    <span>Home / Tour</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-amber-900 font-extrabold">Choose Your Hospitality Package</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      Choose Your Hospitality Package
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
                      Select from our 4 tailored restaurant & hospitality POS packages with flexible duration tiers (1 Year, 3 Years, Lifetime) or test completely free with our 7-Day evaluation build.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigateToPage('order')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Go to My Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* The 4 Packages */}
            <EditionsSection
              currency={currency}
              onDownloadEdition={handleDownloadEdition}
              onSelectForOrder={handleSelectForOrder}
            />

            {/* Feature Comparison Matrix */}
            <FeatureMatrix />

            {/* Next Steps Banner */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Official Accounts</span>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">Need Bank Transfer Details?</h4>
                    <p className="text-xs text-slate-600 mt-1">View our verified Zenith Bank & Moniepoint settlement accounts.</p>
                  </div>
                  <button
                    onClick={() => navigateToPage('banks')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1 shrink-0 transition-all active:scale-95"
                  >
                    <span>View Banks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Ready to Finalize?</span>
                    <h4 className="text-sm font-black text-emerald-950 mt-0.5">Proceed to My Order</h4>
                    <p className="text-xs text-emerald-800 mt-1">Configure hardware add-ons and submit your activation details.</p>
                  </div>
                  <button
                    onClick={() => navigateToPage('order')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-xs transition-all active:scale-95"
                  >
                    <span>My Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'banks':
        return (
          <div className="animate-fadeIn">
            {/* Page Header Banner */}
            <div className="bg-gradient-to-b from-emerald-500/10 via-emerald-50/60 to-transparent border-b border-emerald-200/70 pt-8 pb-10 px-4 sm:px-6">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2.5">
                  <button
                    onClick={() => navigateToPage('tour')}
                    className="hover:underline flex items-center gap-1 text-slate-600 hover:text-slate-900"
                  >
                    <span>Home / Tour</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-emerald-900 font-extrabold">Direct Bank Transfer & Payment Details</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      Direct Bank Transfer & Payment Details
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
                      Official verified settlement accounts for immediate Kaylix POS software license key generation, receipting, and prompt hardware courier dispatch.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigateToPage('order')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Proceed to My Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <BankDetailsSection
              onProceedToOrder={() => navigateToPage('order')}
            />

            {/* Next Gateway Card */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    Step 2
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    Have you sent your transfer or need to configure hardware?
                  </h3>
                  <p className="text-xs text-slate-600 font-medium max-w-xl">
                    Head over to My Order to review your hospitality package, enter your restaurant details, and submit.
                  </p>
                </div>
                <button
                  onClick={() => navigateToPage('order')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shrink-0 transition-all active:scale-95"
                >
                  <span>Go to My Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'order':
        return (
          <div className="animate-fadeIn">
            {/* Page Header Banner */}
            <div className="bg-gradient-to-b from-slate-200/50 via-slate-100/50 to-transparent border-b border-slate-200 pt-8 pb-10 px-4 sm:px-6">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2.5">
                  <button
                    onClick={() => navigateToPage('tour')}
                    className="hover:underline flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Home / Tour</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <button
                    onClick={() => navigateToPage('plan')}
                    className="hover:underline hover:text-slate-900"
                  >
                    <span>Hospitality Packages</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-900 font-extrabold">My Order</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      My Order
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
                      Review your selected hospitality package, configure optional thermal printers & touchscreen hardware, enter restaurant delivery details, and submit.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigateToPage('plan')}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                    >
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>Change Package</span>
                    </button>
                    <button
                      onClick={() => navigateToPage('banks')}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                    >
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Bank Info</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Order Form */}
            <WhatsAppOrderSender
              initialEdition={orderSelectedEdition}
              initialTier={orderSelectedTier}
              currency={currency}
            />
          </div>
        );

      case 'tour':
      default:
        return (
          <div className="animate-fadeIn">
            {/* Hero & Interactive Software Tour */}
            <Hero
              onDownloadTrial={handleQuickDownloadTrial}
              onNavigateToPage={navigateToPage}
              currency={currency}
            />

            {/* Gateway Cards to Next Pages */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-2">
                  Explore Pages
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Everything You Need to Power Your Eatery
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Plan Card */}
                <div
                  onClick={() => navigateToPage('plan')}
                  className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                      <Package className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                      Choose Your Hospitality Package
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Compare Trial (7-Day), Basic, Standard, and Enterprise with full pricing tiers & comparison matrix.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-amber-700">
                    <span>View Packages</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Banks Card */}
                <div
                  onClick={() => navigateToPage('banks')}
                  className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Direct Bank Transfer & Payment Details
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Official verified settlement accounts for Zenith Bank & Moniepoint with fast receipt confirmation.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <span>View Accounts</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Order Card */}
                <div
                  onClick={() => navigateToPage('order')}
                  className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      My Order Page
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Configure your software licenses, add touchscreen terminals or printers, and submit your order.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <span>Go to Order</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const mainAppContent = (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-16 md:pb-0">
      {/* Navigation */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        onQuickDownloadTrial={handleQuickDownloadTrial}
        currentPage={currentPage}
        onNavigateToPage={navigateToPage}
        isPhoneMode={isPhoneMode}
        onTogglePhoneMode={() => setIsPhoneMode(!isPhoneMode)}
      />

      {/* Main Content Rendered by Current Page */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer with multi-page navigation and discrete Admin Portal link */}
      <Footer
        onNavigateToPage={navigateToPage}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Mobile Floating Thumb-Zone Navigation Bar */}
      <MobileBottomBar
        currentPage={currentPage}
        onNavigateToPage={navigateToPage}
        onOpenTrialModal={handleQuickDownloadTrial}
      />

      {/* Interactive Download Modal */}
      <DownloadModal
        edition={downloadModalEdition}
        onClose={() => setDownloadModalEdition(null)}
      />
    </div>
  );

  return (
    <PhoneSimulatorWrapper
      isPhoneMode={isPhoneMode}
      onTogglePhoneMode={() => setIsPhoneMode(false)}
    >
      {mainAppContent}
    </PhoneSimulatorWrapper>
  );
}
