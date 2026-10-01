import React, { useState } from 'react';
import {
  Download,
  MessageSquare,
  Check,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Laptop,
  HardDrive,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { EditionDetail, EditionType, DurationTier } from '../types';
import { EDITIONS } from '../data/mockData';

interface EditionsSectionProps {
  currency: 'NGN' | 'USD';
  onDownloadEdition: (edition: EditionDetail, tier: DurationTier) => void;
  onSelectForOrder: (editionId: EditionType, tier: DurationTier) => void;
}

export const EditionsSection: React.FC<EditionsSectionProps> = ({
  currency,
  onDownloadEdition,
  onSelectForOrder,
}) => {
  const editionsList = Object.values(EDITIONS);

  const [selectedTiers, setSelectedTiers] = useState<Record<string, DurationTier>>({
    trial: '7_days',
    basic: '1_year',
    standard: '1_year',
    enterprise: 'lifetime',
  });

  const [mobileSelectedEdition, setMobileSelectedEdition] = useState<EditionType>('standard');
  const [mobileShowAll, setMobileShowAll] = useState(false);

  const handleTierChange = (editionId: string, tier: DurationTier) => {
    setSelectedTiers((prev) => ({ ...prev, [editionId]: tier }));
  };

  const getActivePlan = (edition: EditionDetail) => {
    const tier = selectedTiers[edition.id] || edition.defaultTier;
    return edition.plans[tier] || Object.values(edition.plans)[0];
  };

  const formatPrice = (edition: EditionDetail) => {
    if (edition.id === 'trial') return 'FREE';
    const plan = getActivePlan(edition);
    if (currency === 'NGN') {
      return `₦${plan.priceNGN.toLocaleString()}`;
    }
    return `$${plan.priceUSD.toLocaleString()}`;
  };

  const renderEditionCard = (edition: EditionDetail, isMobileSingle = false) => {
    const isTrial = edition.id === 'trial';
    const isStandard = edition.id === 'standard';
    const isEnterprise = edition.id === 'enterprise';
    const currentTier = selectedTiers[edition.id] || edition.defaultTier;
    const activePlan = getActivePlan(edition);

    return (
      <div
        key={edition.id}
        className={`relative rounded-2xl flex flex-col justify-between transition-all duration-200 border ${
          isStandard
            ? 'bg-white border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
            : 'bg-white border-slate-300/80 hover:border-slate-400 hover:shadow-md'
        } p-4 sm:p-5`}
      >
        {/* Popular Pill */}
        {isStandard && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
            Most Popular Choice
          </div>
        )}
        {isEnterprise && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-700 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
            Flagship Fleet
          </div>
        )}

        <div>
          {/* Badge & Title */}
          <div className="flex items-center justify-between gap-1">
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                isTrial
                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                  : isStandard
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : isEnterprise
                  ? 'bg-purple-100 text-purple-950 border border-purple-300'
                  : 'bg-slate-100 text-slate-900 border border-slate-300'
              }`}
            >
              {edition.badge}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">{edition.name}</h3>
          <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">{edition.tagline}</p>

          {/* Duration Tenure Selector (for paid editions) */}
          {!isTrial ? (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-700 mb-1 font-bold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-700" />
                  Duration:
                </span>
                {activePlan.savingsBadge && (
                  <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                    {activePlan.savingsBadge}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-300 text-xs">
                {(['1_year', '3_years', 'lifetime'] as DurationTier[]).map((tierKey) => {
                  const plan = edition.plans[tierKey];
                  if (!plan) return null;
                  const isSelected = currentTier === tierKey;
                  return (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => handleTierChange(edition.id, tierKey)}
                      className={`py-1.5 rounded-lg text-center font-bold text-[11px] transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-2xs font-black'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
                      }`}
                    >
                      {plan.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-3 p-2 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-xs font-bold text-blue-900">
                7-Day Complete Free Trial Pass (Zero Commitment)
              </span>
            </div>
          )}

          {/* Pricing Box */}
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-300/80">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {formatPrice(edition)}
              </span>
              <span className="text-xs font-mono text-slate-700 font-bold">
                {isTrial ? '7-Day Pass' : activePlan.periodText}
              </span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-700 font-medium">
              <span>Terminals / Stations:</span>
              <span className="font-bold text-slate-900 truncate max-w-[150px]">{edition.terminals}</span>
            </div>
          </div>

          {/* Target Audience */}
          <div className="mt-2.5 text-[11px] text-slate-700 font-medium bg-slate-50 p-2 rounded-lg border border-slate-200">
            <strong className="text-slate-900">Recommended For:</strong> {edition.idealFor}
          </div>

          {/* Features List */}
          <div className="mt-3 space-y-1.5">
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
              Core Capabilities:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
              {edition.features.slice(0, isMobileSingle ? 8 : 5).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0 stroke-[2.5]" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations if any */}
          {edition.limitations && edition.limitations.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-200">
              <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                {edition.limitations.slice(0, 1).map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-700 mt-0.5 shrink-0" />
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
          {/* Order via WhatsApp */}
          <button
            onClick={() => onSelectForOrder(edition.id, currentTier)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>Order {edition.name} on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Download Button */}
          <button
            onClick={() => onDownloadEdition(edition, currentTier)}
            className={`w-full py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              isTrial
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                : isStandard
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download .ZIP ({isTrial ? '7-Day Pass' : activePlan.label})</span>
          </button>

          {/* File Metadata */}
          <div className="text-center pt-0.5 text-[10px] text-slate-500 font-mono font-medium">
            {edition.fileSize} • ESC/POS Autocut Ready
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="editions" className="py-12 sm:py-16 bg-white relative border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Transparent Pricing & Licenses
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Choose Your Hospitality Package
          </h2>
          <p className="mt-2 text-slate-700 font-medium text-xs sm:text-sm leading-relaxed">
            Select between 1 Year, 3 Years, or Lifetime perpetual licenses.
            All editions operate 100% offline with zero cloud outage vulnerability.
          </p>
        </div>

        {/* MOBILE VIEW: Segmented Switcher (< md:) */}
        <div className="block md:hidden">
          {/* Segmented Package Switcher Bar */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-300/80 mb-4 gap-1 overflow-x-auto no-scrollbar">
            {editionsList.map((ed) => {
              const isActive = mobileSelectedEdition === ed.id;
              return (
                <button
                  key={ed.id}
                  onClick={() => {
                    setMobileSelectedEdition(ed.id);
                    setMobileShowAll(false);
                  }}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold whitespace-nowrap text-center transition-all ${
                    isActive && !mobileShowAll
                      ? 'bg-white text-slate-950 shadow-xs font-black border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ed.id === 'trial' ? '⚡ Trial' : ed.id === 'basic' ? 'Basic' : ed.id === 'standard' ? '⭐ Standard' : 'Enterprise'}
                </button>
              );
            })}
          </div>

          {/* Toggle between single card and all cards */}
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setMobileShowAll(!mobileShowAll)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline flex items-center gap-1"
            >
              {mobileShowAll ? 'Show Single Swiper View' : 'Compare All 4 Packages Stacked'}
            </button>
          </div>

          {/* Card Display */}
          {mobileShowAll ? (
            <div className="space-y-4">
              {editionsList.map((edition) => renderEditionCard(edition, false))}
            </div>
          ) : (
            <div>
              {renderEditionCard(EDITIONS[mobileSelectedEdition], true)}
            </div>
          )}
        </div>

        {/* DESKTOP VIEW: 4 Cards Grid (>= md:) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {editionsList.map((edition) => renderEditionCard(edition, false))}
        </div>

        {/* Operating System Compatibility Bar */}
        <div className="mt-8 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Hardware & OS Compatibility</h4>
              <p className="text-[11px] sm:text-xs text-slate-700 font-medium">
                Windows 10/11 Server + Android Waiter Tablets + iOS Web Companion + ESC/POS Printers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-800 font-bold">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Virus-Total Clean</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <HardDrive className="w-3.5 h-3.5 text-amber-700" />
              <span>100% Offline SQLite</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
