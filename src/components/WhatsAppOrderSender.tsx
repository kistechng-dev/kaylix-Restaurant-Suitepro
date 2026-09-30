import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Copy,
  Check,
  RotateCcw,
  ShoppingBag,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { EditionType, DurationTier, OrderFormData } from '../types';
import { EDITIONS, HARDWARE_ADDONS, VENDOR_CONTACT } from '../data/mockData';

interface WhatsAppOrderSenderProps {
  initialEdition: EditionType;
  initialTier?: DurationTier;
  currency: 'NGN' | 'USD';
}

export const WhatsAppOrderSender: React.FC<WhatsAppOrderSenderProps> = ({
  initialEdition,
  initialTier = '1_year',
  currency,
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    businessName: '',
    phone: '',
    email: '',
    cityState: '',
    edition: initialEdition,
    durationTier: initialEdition === 'trial' ? '7_days' : initialTier,
    selectedAddons: [],
    deploymentType: 'remote',
    paymentMethod: 'bank_transfer',
    notes: '',
  });

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Sync if initial props change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      edition: initialEdition,
      durationTier: initialEdition === 'trial' ? '7_days' : initialTier || '1_year',
    }));
  }, [initialEdition, initialTier]);

  const toggleAddon = (addonId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedAddons.includes(addonId);
      if (exists) {
        return { ...prev, selectedAddons: prev.selectedAddons.filter((id) => id !== addonId) };
      } else {
        return { ...prev, selectedAddons: [...prev.selectedAddons, addonId] };
      }
    });
  };

  const fillSampleData = () => {
    setFormData({
      customerName: 'Engr. Tunde Adeleke',
      businessName: "Mama's Delight Kitchen & Lounge",
      phone: '+234 803 555 4912',
      email: 'mamasdelight.kitchen@gmail.com',
      cityState: 'Lekki Phase 1, Lagos',
      edition: 'standard',
      durationTier: '3_years',
      selectedAddons: ['thermal-printer-80mm', 'cash-drawer-rj11'],
      deploymentType: 'remote',
      paymentMethod: 'bank_transfer',
      notes: 'Need 1 Main Server Cashier + 1 Waiter Tablet + 1 Kitchen Display KDS configured.',
    });
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      businessName: '',
      phone: '',
      email: '',
      cityState: '',
      edition: 'standard',
      durationTier: '1_year',
      selectedAddons: [],
      deploymentType: 'remote',
      paymentMethod: 'bank_transfer',
      notes: '',
    });
  };

  const selectedEditionDetail = EDITIONS[formData.edition] || EDITIONS.standard;
  const currentPlan =
    selectedEditionDetail.plans[formData.durationTier] ||
    Object.values(selectedEditionDetail.plans)[0];

  // Calculate pricing
  const softwareCost =
    currency === 'NGN' ? currentPlan.priceNGN : currentPlan.priceUSD;

  const hardwareCost = formData.selectedAddons.reduce((acc, id) => {
    const addon = HARDWARE_ADDONS.find((a) => a.id === id);
    if (!addon) return acc;
    return acc + (currency === 'NGN' ? addon.priceNGN : addon.priceUSD);
  }, 0);

  const grandTotal = softwareCost + hardwareCost;

  // Format the WhatsApp Message string
  const generateWhatsAppMessage = (): string => {
    const currencySymbol = currency === 'NGN' ? '₦' : '$';
    const addonsListText =
      formData.selectedAddons.length > 0
        ? formData.selectedAddons
            .map((id) => {
              const item = HARDWARE_ADDONS.find((a) => a.id === id);
              if (!item) return '';
              const cost =
                currency === 'NGN'
                  ? `₦${item.priceNGN.toLocaleString()}`
                  : `$${item.priceUSD.toLocaleString()}`;
              return `  • ${item.name} (${cost})`;
            })
            .filter(Boolean)
            .join('\n')
        : '  • None (Software License Only)';

    const deploymentText =
      formData.deploymentType === 'remote'
        ? 'Remote Fast Setup via AnyDesk/TeamViewer (Recommended)'
        : formData.deploymentType === 'onsite'
        ? 'On-Site Engineer Deployment (Lagos/Abuja)'
        : 'Self-Guided Installation with Video Manual';

    const paymentText =
      formData.paymentMethod === 'bank_transfer'
        ? 'Direct Bank Transfer (Zenith Bank / Moniepoint)'
        : formData.paymentMethod === 'card'
        ? 'Online Card / POS Payment'
        : 'Cash on Delivery / Onsite Settlement';

    const tenureText =
      formData.edition === 'trial'
        ? '7-Day Free Evaluation'
        : `${currentPlan.label} (${currentPlan.periodText})`;

    return `*HELLO KAYLIX SOFTWARE SALES DESK!* 👋
I would like to place an order for the *Kaylix Kitchen & Eatery Management App*.

📋 *ORDER SUMMARY:*
----------------------------------------
*Eatery / Business Name:* ${formData.businessName || '[Pending Business Name]'}
*Contact Person:* ${formData.customerName || '[Pending Name]'}
*Phone Number:* ${formData.phone || '[Pending Phone]'}
*Email:* ${formData.email || '[Not Provided]'}
*Location / City:* ${formData.cityState || '[Not Provided]'}

📦 *PACKAGE & TENURE SELECTED:*
*${selectedEditionDetail.name.toUpperCase()}* (${selectedEditionDetail.badge})
*License Tenure:* ${tenureText}
*Stations Authorized:* ${selectedEditionDetail.terminals}
*Software Cost:* ${currencySymbol}${softwareCost.toLocaleString()}

🛠️ *HARDWARE ADD-ONS:*
${addonsListText}
*Hardware Total:* ${currencySymbol}${hardwareCost.toLocaleString()}

💰 *ESTIMATED TOTAL PAYABLE:*
*${currencySymbol}${grandTotal.toLocaleString()}*

⚙️ *PREFERENCES:*
*Deployment Mode:* ${deploymentText}
*Payment Method:* ${paymentText}
${formData.notes ? `*Special Notes:* ${formData.notes}\n` : ''}
----------------------------------------
*Generated via Official Kaylix Download Portal*
Please send payment confirmation and issue license key details. Thank you!`;
  };

  const handleSendToWhatsApp = async () => {
    setIsSubmitting(true);
    let orderRef = '';
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName.trim() || 'Valued Eatery Client',
          businessName: formData.businessName.trim() || 'Eatery / Lounge',
          phone: formData.phone.trim() || 'N/A',
          email: formData.email.trim() || 'N/A',
          cityState: formData.cityState.trim() || 'Nigeria',
          packageSubscribed: selectedEditionDetail.name,
          edition: formData.edition,
          durationTier: formData.durationTier,
          tenureLabel:
            formData.edition === 'trial'
              ? '7-Day Free Evaluation'
              : `${currentPlan.label} (${currentPlan.periodText})`,
          amountPaid: grandTotal,
          currency,
          selectedAddons: formData.selectedAddons,
          deploymentType: formData.deploymentType,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });
      const data = await response.json();
      if (data.success && data.customer) {
        orderRef = data.customer.id;
        setSubmittedRef(data.customer.id);
      }
    } catch (err) {
      console.warn('Logging order to backend database:', err);
    } finally {
      setIsSubmitting(false);
      const rawNumber = VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '');
      const baseMsg = generateWhatsAppMessage();
      const message = orderRef
        ? `${baseMsg}\n\n*DATABASE ORDER ID:* #${orderRef}`
        : baseMsg;
      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${rawNumber}?text=${encoded}`;
      window.open(url, '_blank');
    }
  };

  const handleCopyMessage = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="whatsapp-order" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
            Direct Sales & License Desk
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Interactive WhatsApp Order Sender
          </h2>
          <p className="mt-1.5 text-slate-700 font-medium text-xs sm:text-sm leading-relaxed">
            Customize your package, pick your 1-Year, 3-Years, or Lifetime duration, add optional hardware, and transmit directly to our official WhatsApp sales engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Form: Order Builder */}
          <div className="md:col-span-7 bg-slate-50 border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-extrabold text-slate-900">Configure Your Restaurant Order</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillSampleData}
                  className="text-xs text-amber-900 hover:text-amber-950 font-bold px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 transition-colors"
                >
                  ⚡ Sample Data
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-800 p-0.5 transition-colors"
                  title="Reset form"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendToWhatsApp();
              }}
              className="space-y-4"
            >
              {/* Business & Customer Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-700" />
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mama's Delight Kitchen & Bar"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    Contact Person / Owner *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Adeleke / Manager"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Phone, Email, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. eatery@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-700" />
                    City & State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Abuja"
                    value={formData.cityState}
                    onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              {/* Package Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  1. Select Software Package:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['trial', 'basic', 'standard', 'enterprise'] as EditionType[]).map((edId) => {
                    const item = EDITIONS[edId];
                    const isSelected = formData.edition === edId;

                    return (
                      <div
                        key={edId}
                        onClick={() => {
                          const newTier = edId === 'trial' ? '7_days' : formData.durationTier === '7_days' ? '1_year' : formData.durationTier;
                          setFormData({ ...formData, edition: edId, durationTier: newTier });
                        }}
                        className={`cursor-pointer rounded-xl p-2.5 border transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40 text-slate-900 shadow-2xs'
                            : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black truncate">{item.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-800 stroke-[3]" />}
                        </div>
                        <span className="text-[10px] text-amber-800 font-bold block mt-0.5 truncate">{item.badge}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duration Tenure Selector */}
              {formData.edition !== 'trial' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    2. Select Duration & Pricing:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1_year', '3_years', 'lifetime'] as DurationTier[]).map((tierKey) => {
                      const plan = selectedEditionDetail.plans[tierKey];
                      if (!plan) return null;
                      const isSelected = formData.durationTier === tierKey;
                      const priceLabel =
                        currency === 'NGN'
                          ? `₦${plan.priceNGN.toLocaleString()}`
                          : `$${plan.priceUSD.toLocaleString()}`;

                      return (
                        <div
                          key={tierKey}
                          onClick={() => setFormData({ ...formData, durationTier: tierKey })}
                          className={`cursor-pointer rounded-xl p-2 border text-center transition-all ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40 text-slate-900 shadow-2xs'
                              : 'bg-white border-slate-300 hover:border-slate-400 text-slate-800'
                          }`}
                        >
                          <span className="text-xs font-black block">{plan.label}</span>
                          <span className="text-sm font-black text-amber-800 font-mono block mt-0.5">
                            {priceLabel}
                          </span>
                          {plan.savingsBadge && (
                            <span className="text-[10px] font-black text-emerald-800 block">
                              {plan.savingsBadge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between font-bold">
                  <span>Trial License Duration: 7 Days Free Pass</span>
                  <span className="font-mono text-emerald-800">FREE</span>
                </div>
              )}

              {/* Hardware Add-ons Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  3. Optional POS Hardware Add-ons:
                </label>
                <div className="space-y-1.5">
                  {HARDWARE_ADDONS.map((addon) => {
                    const isChecked = formData.selectedAddons.includes(addon.id);
                    const priceStr =
                      currency === 'NGN'
                        ? `₦${addon.priceNGN.toLocaleString()}`
                        : `$${addon.priceUSD.toLocaleString()}`;

                    return (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-300'
                            : 'bg-white border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(addon.id)}
                          className="mt-0.5 rounded bg-white border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900">{addon.name}</span>
                            <span className="text-xs font-mono font-black text-amber-800 shrink-0">
                              +{priceStr}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">{addon.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Deployment Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Setup Preference
                  </label>
                  <select
                    value={formData.deploymentType}
                    onChange={(e) =>
                      setFormData({ ...formData, deploymentType: e.target.value as any })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                  >
                    <option value="remote">⚡ Remote AnyDesk Setup (Free & Fast)</option>
                    <option value="self">📦 Self-Installation (Using Manual)</option>
                    <option value="onsite">🚗 On-site Engineer Deployment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value as any })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                  >
                    <option value="bank_transfer">🏦 Direct Transfer (Zenith / Moniepoint)</option>
                    <option value="card">💳 Online Card / POS Settlement</option>
                    <option value="cash">💵 Cash on Hardware Delivery</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Custom Kitchen Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1 main kitchen + 1 bar counter setup needed."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Submit Button & Confirmation */}
              <div className="pt-1 space-y-2.5">
                {submittedRef && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span>Saved to Kaylix Admin Database (Ref: <strong className="font-mono">{submittedRef}</strong>).</span>
                      <span className="block text-[11px] font-normal text-emerald-800">Details recorded & WhatsApp conversation initiated.</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Recording to Database & Opening WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Submit Order & Open WhatsApp ({VENDOR_CONTACT.whatsappDisplay})</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live WhatsApp Chat Bubble Preview */}
          <div className="md:col-span-5 space-y-4">
            {/* Live Pricing Breakdown Card */}
            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-200 flex items-center justify-between">
                <span>Order Total Calculation</span>
                <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-black">
                  {currency}
                </span>
              </h4>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>
                    Package ({selectedEditionDetail.name}):
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formData.edition === 'trial'
                      ? 'FREE (7-Day)'
                      : currency === 'NGN'
                      ? `₦${softwareCost.toLocaleString()}`
                      : `$${softwareCost.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Hardware ({formData.selectedAddons.length} items):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {currency === 'NGN'
                      ? `₦${hardwareCost.toLocaleString()}`
                      : `$${hardwareCost.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Remote Setup:</span>
                  <span className="font-bold text-emerald-800">FREE INCLUDED</span>
                </div>

                <div className="pt-2.5 border-t border-slate-300 flex justify-between items-baseline text-sm">
                  <span className="font-black text-slate-900">Estimated Total:</span>
                  <span className="font-mono font-black text-xl text-amber-800">
                    {formData.edition === 'trial' && hardwareCost === 0
                      ? 'FREE'
                      : currency === 'NGN'
                      ? `₦${grandTotal.toLocaleString()}`
                      : `$${grandTotal.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Message Preview Bubble */}
            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-3.5 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-800 text-xs">Live WhatsApp Preview</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-xs text-slate-700 hover:text-slate-900 font-bold flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-300 shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-600" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Bubble Design */}
              <div className="bg-[#e5ddd5] p-3 rounded-xl border border-slate-300 font-sans text-xs leading-relaxed text-slate-900 shadow-inner">
                <div className="bg-[#dcf8c6] text-slate-900 p-3 rounded-xl rounded-tr-xs shadow-2xs whitespace-pre-wrap font-mono text-[10px] max-h-72 overflow-y-auto">
                  {generateWhatsAppMessage()}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-600 px-0.5">
                  <span>Destination: {VENDOR_CONTACT.whatsappDisplay}</span>
                  <span className="text-emerald-800 font-bold">Kaylix Sales Desk</span>
                </div>
              </div>

              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving to DB & Launching WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Save to Database & Launch WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
