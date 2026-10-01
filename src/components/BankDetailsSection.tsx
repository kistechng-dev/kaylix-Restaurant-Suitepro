import React, { useState } from 'react';
import {
  Building2,
  Copy,
  Check,
  Send,
  FileCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { BANK_ACCOUNTS, VENDOR_CONTACT } from '../data/mockData';

interface BankDetailsSectionProps {
  onScrollToWhatsApp?: () => void;
  onProceedToOrder?: () => void;
}

export const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({
  onScrollToWhatsApp,
  onProceedToOrder,
}) => {
  const handleProceed = onProceedToOrder || onScrollToWhatsApp;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customNarrationRef] = useState(
    () => `KYLX-${Math.floor(10000 + Math.random() * 90000)}`
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <section id="bank-details" className="py-16 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            Official Settlement Accounts
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Direct Bank Transfer & Payment Details
          </h2>
          <p className="mt-2 text-slate-700 font-medium text-sm leading-relaxed">
            Pay securely through our certified Zenith Bank Plc or Moniepoint settlement accounts.
            Instant license key issuance upon transfer receipt confirmation.
          </p>
        </div>

        {/* Suggested Payment Narration / Reference Badge */}
        <div className="max-w-xl mx-auto mb-8 p-3.5 rounded-xl bg-white border border-slate-300 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-600 font-bold block">Auto-Generated Transfer Reference:</span>
              <span className="text-base font-mono font-black text-amber-900 tracking-wider">
                {customNarrationRef}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleCopy(customNarrationRef, 'narration-ref')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors border border-slate-300"
          >
            {copiedId === 'narration-ref' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-800">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Ref</span>
              </>
            )}
          </button>
        </div>

        {/* Bank Account Cards Grid - Exactly Zenith & Moniepoint */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {BANK_ACCOUNTS.map((bank) => {
            const isCopied = copiedId === bank.id;
            const isZenith = bank.id === 'zenith';

            const handleSendProof = () => {
              const text = encodeURIComponent(
                `*PAYMENT CONFIRMATION - KAYLIX POS SUITE*\n\n` +
                `*Settlement Bank:* ${bank.bankName}\n` +
                `*Account Number:* ${bank.accountNumber}\n` +
                `*Beneficiary:* ${bank.accountName}\n` +
                `*Payment Reference:* ${customNarrationRef}\n\n` +
                `Please find my attached bank payment receipt. Kindly issue my software license code. Thank you!`
              );
              const rawNumber = VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '');
              window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
            };

            return (
              <div
                key={bank.id}
                className={`rounded-2xl bg-white border ${
                  isZenith ? 'border-red-300 ring-2 ring-red-100/80' : 'border-blue-300 ring-2 ring-blue-100/80'
                } p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all shadow-xs`}
              >
                <div>
                  {/* Top indicator & Currency */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isZenith
                          ? 'bg-red-100 text-red-900 border border-red-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}
                    >
                      {isZenith ? 'Zenith Corporate' : 'Moniepoint Settlement'}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{bank.currency} Settlement</span>
                  </div>

                  {/* Bank Name */}
                  <h3 className="text-xl font-black text-slate-900 mt-2.5 leading-snug">{bank.bankName}</h3>

                  {/* Account Number Box (High-Contrast Tactile Mobile Box) */}
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                    <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold block">
                      Account Number (Tap to Copy)
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-wider">
                        {bank.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(bank.accountNumber, bank.id)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                        title="Copy Account Number"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Beneficiary Details */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-600 block text-[10px] uppercase font-bold">Account Name / Beneficiary</span>
                      <span className="text-sm font-extrabold text-slate-900">{bank.accountName}</span>
                    </div>

                    {bank.sortCode && (
                      <div className="flex justify-between border-t border-slate-100 pt-1.5 text-xs">
                        <span className="text-slate-600 font-medium">Sort Code:</span>
                        <span className="font-mono text-slate-900 font-bold">{bank.sortCode}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-1.5 text-[11px] text-slate-700 font-medium">
                      Branch: {bank.bankBranch}
                    </div>
                  </div>
                </div>

                {/* Mobile Direct Action: Confirm on WhatsApp */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <button
                    onClick={handleSendProof}
                    className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Send Payment Proof to WhatsApp</span>
                  </button>

                  <div className="p-2 rounded-lg bg-slate-50 font-mono text-[11px] text-slate-900 border border-slate-300 flex items-center justify-between">
                    <span className="truncate font-bold">USSD: {bank.ussdCode}</span>
                    <button
                      onClick={() => handleCopy(bank.ussdCode, `${bank.id}-ussd`)}
                      className="text-amber-800 hover:text-amber-900 font-extrabold text-xs ml-1.5 shrink-0"
                    >
                      {copiedId === `${bank.id}-ussd` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4-Step Payment & Activation Guide */}
        <div className="mt-10 max-w-3xl mx-auto p-6 rounded-2xl bg-white border border-slate-300 shadow-xs">
          <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-700" />
            <span>How to Settle Payment & Activate Your License (4 Quick Steps)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs shadow-2xs">
                1
              </div>
              <h4 className="font-extrabold text-slate-900">Select Package</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                Choose Basic (₦10k), Standard (₦20k), or Enterprises (₦40k) for 1-Year, 3-Years, or Lifetime.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs shadow-2xs">
                2
              </div>
              <h4 className="font-extrabold text-slate-900">Make Transfer</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                Transfer to our Zenith Bank (1016978239) or Moniepoint (8089697390) account via mobile app or USSD.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs shadow-2xs">
                3
              </div>
              <h4 className="font-extrabold text-slate-900">Send Proof</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                Click WhatsApp button below to transmit your transfer receipt and eatery name.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-2xs">
                4
              </div>
              <h4 className="font-extrabold text-slate-900">Instant Key</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                Receive certified Master License Key within 15 minutes, with optional remote AnyDesk setup.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-700 font-medium">
              Need invoice or help? Contact <span className="text-amber-800 font-bold">{VENDOR_CONTACT.email}</span>
            </div>
            <button
              onClick={handleProceed}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Proceed to My Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
