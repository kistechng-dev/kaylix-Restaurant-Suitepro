/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EditionsSection } from './components/EditionsSection';
import { FeatureMatrix } from './components/FeatureMatrix';
import { BankDetailsSection } from './components/BankDetailsSection';
import { WhatsAppOrderSender } from './components/WhatsAppOrderSender';
import { DownloadModal } from './components/DownloadModal';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';
import { EditionDetail, EditionType, DurationTier } from './types';
import { EDITIONS } from './data/mockData';

export default function App() {
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [downloadModalEdition, setDownloadModalEdition] = useState<EditionDetail | null>(null);
  const [orderSelectedEdition, setOrderSelectedEdition] = useState<EditionType>('standard');
  const [orderSelectedTier, setOrderSelectedTier] = useState<DurationTier>('1_year');

  // Admin Portal mode state (hidden from public view)
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.pathname === '/admin';
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin' || window.location.pathname === '/admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
    scrollToSection('whatsapp-order');
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

  // Public Download Portal (inverted light mode)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        onQuickDownloadTrial={handleQuickDownloadTrial}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero & Interactive Software Tour */}
        <Hero
          onDownloadTrial={handleQuickDownloadTrial}
          onScrollToSection={scrollToSection}
          currency={currency}
        />

        {/* The 4 Packages (Trial 7-Day, Basic Package, Standard Package, Enterprises Package) */}
        <EditionsSection
          currency={currency}
          onDownloadEdition={handleDownloadEdition}
          onSelectForOrder={handleSelectForOrder}
        />

        {/* Feature Comparison Matrix */}
        <FeatureMatrix />

        {/* Bank Details & Payment Instructions (Zenith Bank Plc & Moniepoint) */}
        <BankDetailsSection
          onScrollToWhatsApp={() => scrollToSection('whatsapp-order')}
        />

        {/* WhatsApp Order Sender */}
        <WhatsAppOrderSender
          initialEdition={orderSelectedEdition}
          initialTier={orderSelectedTier}
          currency={currency}
        />
      </main>

      {/* Footer with discrete Admin Portal link */}
      <Footer
        onScrollToSection={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Download Modal */}
      <DownloadModal
        edition={downloadModalEdition}
        onClose={() => setDownloadModalEdition(null)}
      />
    </div>
  );
}
