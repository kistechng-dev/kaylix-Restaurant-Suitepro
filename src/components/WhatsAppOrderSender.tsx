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
  Paperclip,
  Upload,
  CreditCard,
  Receipt,
  ShieldCheck,
  Landmark,
  Trash2,
  Eye,
  XCircle,
  Download,
  Zap,
  Sparkles,
} from 'lucide-react';
import { EditionType, OrderEditionType, DurationTier, OrderFormData, EditionDetail, HardwareAddon } from '../types';
import { VENDOR_CONTACT, BANK_ACCOUNTS } from '../data/mockData';
import { getEffectiveEditions, getEffectiveHardware } from '../utils/pricingStorage';
import { GlobalLocationPicker, LocationSelection } from './GlobalLocationPicker';
import { generateTrialEvaluationPackage, triggerDownload } from '../utils/installerDownload';

interface WhatsAppOrderSenderProps {
  initialEdition: OrderEditionType;
  initialTier?: DurationTier;
  initialAddons?: string[];
  currency: 'NGN' | 'USD';
}

export const WhatsAppOrderSender: React.FC<WhatsAppOrderSenderProps> = ({
  initialEdition,
  initialTier = '1_year',
  initialAddons,
  currency,
}) => {
  const [editionsMap, setEditionsMap] = useState<Record<string, EditionDetail>>(getEffectiveEditions);
  const [hardwareList, setHardwareList] = useState<HardwareAddon[]>(getEffectiveHardware);

  useEffect(() => {
    const handlePriceUpdate = () => {
      setEditionsMap(getEffectiveEditions());
      setHardwareList(getEffectiveHardware());
    };
    window.addEventListener('kaylix_pricing_updated', handlePriceUpdate);
    return () => window.removeEventListener('kaylix_pricing_updated', handlePriceUpdate);
  }, []);
  const [orderCountryName, setOrderCountryName] = useState('Nigeria');
  const [orderCountryDialCode, setOrderCountryDialCode] = useState('+234');
  const [orderCountryFlag, setOrderCountryFlag] = useState('🇳🇬');

  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    businessName: '',
    phone: '',
    email: '',
    cityState: 'Lekki Phase 1, Eti-Osa LGA, Lagos, Nigeria',
    edition: initialEdition,
    durationTier: initialEdition === 'trial' ? '7_days' : initialTier,
    selectedAddons: initialAddons && initialAddons.length > 0
      ? initialAddons
      : initialEdition === 'none'
      ? ['thermal-printer-80mm']
      : [],
    deploymentType: 'remote',
    paymentMethod: 'bank_transfer',
    notes: '',
  });

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Attached Payment Details & Proof State
  const [payerName, setPayerName] = useState('');
  const [senderBank, setSenderBank] = useState('');
  const [receivingBank, setReceivingBank] = useState('Zenith Bank Plc (1016978239)');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [customAmountTransferred, setCustomAmountTransferred] = useState<string>('');
  const [receiptFile, setReceiptFile] = useState<{
    fileName: string;
    fileSize: string;
    fileType: string;
    dataUrl: string;
  } | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [completedOrderRecord, setCompletedOrderRecord] = useState<any>(null);
  const [previewingReceiptImage, setPreviewingReceiptImage] = useState<string | null>(null);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setReceiptError('File size is larger than 15MB. Please choose a smaller receipt file.');
      return;
    }

    setReceiptError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setReceiptFile({
        fileName: file.name,
        fileSize: sizeStr,
        fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCopyBankAccount = (accNum: string, bankId: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedBankId(bankId);
    setTimeout(() => setCopiedBankId(null), 2500);
  };

  // Sync if initial props change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      edition: initialEdition,
      durationTier: initialEdition === 'trial' ? '7_days' : initialTier || '1_year',
      selectedAddons: initialAddons && initialAddons.length > 0
        ? initialAddons
        : initialEdition === 'none' && prev.selectedAddons.length === 0
        ? ['thermal-printer-80mm']
        : prev.selectedAddons,
    }));
  }, [initialEdition, initialTier, initialAddons]);

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
      phone: '234 806 0395 329',
      email: 'mamasdelight.kitchen@gmail.com',
      cityState: 'Lekki Phase 1, Lagos',
      edition: 'standard',
      durationTier: '3_years',
      selectedAddons: ['thermal-printer-80mm', 'cash-drawer-rj11'],
      deploymentType: 'remote',
      paymentMethod: 'bank_transfer',
      notes: 'Need 1 Main Server Cashier + 1 Waiter Tablet + 1 Kitchen Display KDS configured.',
    });
    setPayerName('Engr. Tunde Adeleke');
    setSenderBank('Guaranty Trust Bank (GTBank)');
    setReceivingBank('Zenith Bank Plc (1016978239)');
    setTransactionRef('NIP-GTB-8492019482');
    setPaymentDate(new Date().toISOString().split('T')[0]);
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
    setPayerName('');
    setSenderBank('');
    setTransactionRef('');
    setCustomAmountTransferred('');
    setReceiptFile(null);
    setReceiptError(null);
  };

  const isHardwareOnly = formData.edition === 'none';

  const selectedEditionDetail = !isHardwareOnly
    ? editionsMap[formData.edition] || editionsMap.standard
    : null;

  const currentPlan = selectedEditionDetail
    ? selectedEditionDetail.plans[formData.durationTier] || Object.values(selectedEditionDetail.plans)[0]
    : null;

  // Calculate pricing
  const softwareCost = isHardwareOnly || !currentPlan
    ? 0
    : currency === 'NGN' ? currentPlan.priceNGN : currentPlan.priceUSD;

  const hardwareCost = formData.selectedAddons.reduce((acc, id) => {
    const addon = hardwareList.find((a) => a.id === id);
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
              const item = hardwareList.find((a) => a.id === id);
              if (!item) return '';
              const cost =
                currency === 'NGN'
                  ? `₦${item.priceNGN.toLocaleString()}`
                  : `$${item.priceUSD.toLocaleString()}`;
              return `  • ${item.name} (${cost})`;
            })
            .filter(Boolean)
            .join('\n')
        : isHardwareOnly
        ? '  • [No hardware selected yet]'
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

    const tenureText = isHardwareOnly
      ? 'No Software License Required (Hardware Purchase Only)'
      : formData.edition === 'trial'
      ? '7-Day Free Evaluation'
      : currentPlan ? `${currentPlan.label} (${currentPlan.periodText})` : '1 Year License';

    const packageSection = isHardwareOnly
      ? `📦 *ORDER TYPE: STANDALONE HARDWARE & ADD-ONS ONLY*
*Software Plan Package:* None (Hardware Only Purchase)
*Software Plan Cost:* ${currencySymbol}0`
      : `📦 *PACKAGE & TENURE SELECTED:*
*${selectedEditionDetail ? selectedEditionDetail.name.toUpperCase() : 'STANDARD PACKAGE'}* (${selectedEditionDetail?.badge || 'Dining'})
*License Tenure:* ${tenureText}
*Stations Authorized:* ${selectedEditionDetail?.terminals || '1 Station'}
*Software Cost:* ${currencySymbol}${softwareCost.toLocaleString()}`;

    const paymentProofSection = (payerName || transactionRef || receiptFile || senderBank)
      ? `\n💳 *ATTACHED PAYMENT DETAILS & PROOF:*
• *Paid To:* ${receivingBank}
• *Payer / Account Name:* ${payerName.trim() || formData.customerName || '[Not Specified]'}
• *Transferred From Bank:* ${senderBank.trim() || '[Not Specified]'}
• *Transaction Ref / Session ID:* ${transactionRef.trim() || '[Not Specified]'}
• *Payment Date:* ${paymentDate}
• *Amount Transferred:* ${currencySymbol}${Number(customAmountTransferred || grandTotal).toLocaleString()}
${receiptFile ? `• *Payment Receipt Attached:* ✅ ${receiptFile.fileName} (${receiptFile.fileSize})` : '• *Payment Receipt:* Attached with order submission'}`
      : '';

    return `*HELLO KAYLIX SOFTWARE & HARDWARE SALES DESK!* 👋
I would like to place an order from the *Kaylix Official Portal*.

📋 *ORDER SUMMARY:*
----------------------------------------
*Eatery / Business Name:* ${formData.businessName || '[Pending Business Name]'}
*Contact Person:* ${formData.customerName || '[Pending Name]'}
*Phone Number:* ${formData.phone || '[Pending Phone]'}
*Email:* ${formData.email || '[Not Provided]'}
*Location / City:* ${formData.cityState || '[Not Provided]'}

${packageSection}

🛠️ *HARDWARE EQUIPMENT & ADD-ONS:*
${addonsListText}
*Hardware Total:* ${currencySymbol}${hardwareCost.toLocaleString()}

💰 *ESTIMATED TOTAL PAYABLE:*
*${currencySymbol}${grandTotal.toLocaleString()}*

⚙️ *PREFERENCES:*
*Deployment Mode:* ${deploymentText}
*Payment Method:* ${paymentText}
${paymentProofSection}
${formData.notes ? `\n*Special Notes:* ${formData.notes}\n` : ''}
----------------------------------------
*Generated via Official Kaylix Ordering Desk*
Please confirm order availability and shipping / activation instructions. Thank you!`;
  };

  const handleSubmitOrder = async (e?: React.FormEvent, launchWhatsAppDirectly = false) => {
    if (e) e.preventDefault();

    if (isHardwareOnly && formData.selectedAddons.length === 0) {
      alert('Please select at least one hardware add-on or equipment item to proceed with your hardware order.');
      return;
    }

    setIsSubmitting(true);
    let orderRef = '';
    const finalAmount = customAmountTransferred ? Number(customAmountTransferred) : grandTotal;

    try {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      const cleanDialCode = orderCountryDialCode.replace(/\D/g, '');
      let fullPhone = digitsOnly;
      if (cleanDialCode && !digitsOnly.startsWith(cleanDialCode)) {
        const trimmed = digitsOnly.replace(/^0+/, '');
        fullPhone = `${cleanDialCode}${trimmed}`;
      }

      const hasPaymentInfo = Boolean(payerName || transactionRef || receiptFile || senderBank);
      const paymentDetails = hasPaymentInfo
        ? {
            payerName: payerName.trim() || formData.customerName.trim() || undefined,
            senderBank: senderBank.trim() || undefined,
            receivingBank,
            transactionRef: transactionRef.trim() || undefined,
            paymentDate,
            amountTransferred: finalAmount,
            receiptFileName: receiptFile?.fileName,
            receiptFileType: receiptFile?.fileType,
            receiptFileSize: receiptFile?.fileSize,
            receiptFileData: receiptFile?.dataUrl,
          }
        : undefined;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName.trim() || 'Valued Eatery Client',
          businessName: formData.businessName.trim() || 'Eatery / Lounge',
          phone: fullPhone || formData.phone.trim() || 'N/A',
          email: formData.email.trim() || 'N/A',
          cityState: formData.cityState.trim() || `${orderCountryName}`,
          packageSubscribed: isHardwareOnly
            ? 'Hardware & Add-ons Only'
            : (selectedEditionDetail?.name || 'Standard Package'),
          edition: formData.edition,
          durationTier: formData.durationTier,
          tenureLabel: isHardwareOnly
            ? 'Hardware Only (No Software Plan)'
            : formData.edition === 'trial'
            ? '7-Day Free Evaluation'
            : currentPlan ? `${currentPlan.label} (${currentPlan.periodText})` : '1 Year License',
          amountPaid: finalAmount,
          currency,
          selectedAddons: formData.selectedAddons,
          deploymentType: formData.deploymentType,
          paymentMethod: formData.paymentMethod,
          notes: isHardwareOnly
            ? `[Hardware-Only Order] ${formData.notes || ''}`
            : formData.notes,
          paymentDetails,
        }),
      });

      const data = await response.json();
      if (data.success && data.customer) {
        orderRef = data.customer.id;
        setSubmittedRef(data.customer.id);
        setCompletedOrderRecord(data.customer);
        setShowOrderSuccessModal(true);

        // Auto-download 7-Day Free Evaluation Bundle with operational services if Trial plan
        if (formData.edition === 'trial') {
          try {
            const trialBlob = await generateTrialEvaluationPackage({
              customerName: formData.customerName,
              businessName: formData.businessName,
              phone: fullPhone || formData.phone,
              licenseCode: data.customer.licenseCode,
            });
            triggerDownload(trialBlob, 'Kaylix_Restaurant_POS_7Day_Trial_Evaluation_InstallerBundle.zip');
          } catch (dlErr) {
            console.warn('Trial auto-download notification:', dlErr);
          }
        }
      }
    } catch (err) {
      console.warn('Logging order to backend database:', err);
    } finally {
      setIsSubmitting(false);
      if (launchWhatsAppDirectly) {
        handleLaunchWhatsApp(orderRef);
      }
    }
  };

  const handleLaunchWhatsApp = (forcedRef?: string) => {
    const rawNumber = VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '');
    const baseMsg = generateWhatsAppMessage();
    const refToUse = forcedRef || submittedRef;
    const message = refToUse
      ? `${baseMsg}\n\n*DATABASE ORDER ID:* #${refToUse}`
      : baseMsg;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${rawNumber}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleSendToWhatsApp = () => {
    handleSubmitOrder(undefined, true);
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
            Interactive Order Sender
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
                handleSubmitOrder(e);
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

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>WhatsApp Number *</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                      <span>{orderCountryFlag}</span>
                      <span>{orderCountryName} ({orderCountryDialCode})</span>
                    </span>
                  </label>
                  <div className="flex items-center bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-500/20">
                    <span className="text-xs font-mono font-bold text-slate-600 mr-2 flex items-center gap-1 shrink-0 bg-slate-100 px-2 py-0.5 rounded-md">
                      <span>{orderCountryFlag}</span>
                      <span>{orderCountryDialCode}</span>
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 803 123 4567 or 7911 123456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>
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
              </div>

              {/* Worldwide Location Picker: Country, State, Local Govt, City */}
              <div>
                <GlobalLocationPicker
                  initialCountry={orderCountryName}
                  initialState="Lagos"
                  initialLocalGovt="Eti-Osa"
                  initialCity="Victoria Island"
                  onCountryDialCodeChange={(dialCode) => {
                    setOrderCountryDialCode(dialCode);
                  }}
                  onChange={(loc: LocationSelection) => {
                    setOrderCountryName(loc.country);
                    setOrderCountryFlag(loc.flag);
                    setOrderCountryDialCode(loc.dialCode);
                    setFormData((prev) => ({
                      ...prev,
                      cityState: loc.formattedString,
                    }));
                  }}
                />
              </div>

              {/* Plan Package Selector or Hardware-Only Selection */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-1 border-b border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    1. Select Order Type & Package:
                  </label>
                  <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg self-start sm:self-auto text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        if (isHardwareOnly) {
                          setFormData({ ...formData, edition: 'standard', durationTier: '1_year' });
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        !isHardwareOnly
                          ? 'bg-white text-slate-900 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      💻 Software (+ Hardware)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          edition: 'none',
                          selectedAddons: formData.selectedAddons.length > 0 ? formData.selectedAddons : [hardwareList[0]?.id || 'thermal-printer-80mm'],
                        });
                      }}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        isHardwareOnly
                          ? 'bg-amber-600 text-white shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🖨️ Hardware Only (No Plan)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['trial', 'basic', 'standard', 'enterprise'] as EditionType[]).map((edId) => {
                    const item = editionsMap[edId];
                    const isSelected = formData.edition === edId;

                    return (
                      <div
                        key={edId}
                        onClick={() => {
                          if (isSelected) {
                            // Deselect plan to allow hardware add-on only without plan package
                            setFormData({
                              ...formData,
                              edition: 'none',
                              selectedAddons: formData.selectedAddons.length > 0 ? formData.selectedAddons : [hardwareList[0]?.id || 'thermal-printer-80mm'],
                            });
                          } else {
                            const newTier =
                              edId === 'trial'
                                ? '7_days'
                                : edId === 'enterprise'
                                ? 'lifetime'
                                : formData.durationTier === '7_days'
                                ? '1_year'
                                : formData.durationTier;
                            setFormData({ ...formData, edition: edId, durationTier: newTier });
                          }
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

                  {/* 5th Option: Hardware / Add-on Only Card */}
                  <div
                    onClick={() => {
                      setFormData({
                        ...formData,
                        edition: 'none',
                        selectedAddons: formData.selectedAddons.length > 0 ? formData.selectedAddons : [hardwareList[0]?.id || 'thermal-printer-80mm'],
                      });
                    }}
                    className={`cursor-pointer rounded-xl p-2.5 border transition-all col-span-2 sm:col-span-1 ${
                      isHardwareOnly
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-600 ring-2 ring-amber-500/40 text-slate-900 shadow-2xs'
                        : 'bg-slate-50 border-dashed border-amber-300 hover:border-amber-400 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-950 truncate flex items-center gap-1">
                        <span>🛠️ Hardware Only</span>
                      </span>
                      {isHardwareOnly && <Check className="w-3.5 h-3.5 text-amber-800 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-amber-800 font-bold block mt-0.5 truncate">
                      No Plan Required
                    </span>
                  </div>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1">
                  <span>💡 Tip: Click any selected plan again to deselect, or pick <strong>🛠️ Hardware Only</strong> to order equipment without a plan package.</span>
                  {isHardwareOnly && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Hardware Add-ons Only Active
                    </span>
                  )}
                </div>
              </div>

              {/* Duration Tenure Selector or Hardware Only Notice */}
              {isHardwareOnly ? (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="font-black text-slate-900 flex items-center gap-1.5">
                      <span>✓ Standalone Hardware & Add-on Order</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.2 rounded-full font-bold">₦0 / $0 Software Fee</span>
                    </span>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">
                      No recurring software package required. Pick any combination of thermal printers, cash drawers, barcode scanners, and wireless handheld devices below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, edition: 'standard', durationTier: '1_year' })}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-400 text-amber-900 font-bold text-[11px] hover:bg-amber-100 transition-colors shrink-0 shadow-2xs"
                  >
                    + Add Software Plan
                  </button>
                </div>
              ) : formData.edition !== 'trial' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    2. Select Duration & Pricing:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1_year', '3_years', 'lifetime'] as DurationTier[]).map((tierKey) => {
                      const plan = selectedEditionDetail?.plans[tierKey];
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
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-blue-950 space-y-2.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-blue-900 font-extrabold">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Trial License Duration: 7 Days Free Pass
                    </span>
                    <span className="font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-black">
                      100% FREE PASS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    Includes 7 days unrestricted evaluation operation/services: Counter Fast POS, Kitchen KDS, 80mm/58mm thermal receipt printing, waiter tablets, and local offline database.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSubmitOrder(undefined, false)}
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-75"
                  >
                    <Download className="w-4 h-4 text-amber-300 stroke-[2.8]" />
                    <span>Download Installer & Register 7-Day Free Services to Backend</span>
                  </button>
                </div>
              )}

              {/* Hardware Add-ons Checkboxes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {isHardwareOnly ? '2. Select Your POS Hardware & Equipment Add-ons *' : '3. Optional POS Hardware Add-ons:'}
                  </label>
                  {isHardwareOnly && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                      Select 1 or more items
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {hardwareList.map((addon) => {
                    const isChecked = formData.selectedAddons.includes(addon.id);
                    const isOutOfStock = addon.availability === 'out_of_stock';
                    const priceStr =
                      currency === 'NGN'
                        ? `₦${addon.priceNGN.toLocaleString()}`
                        : `$${addon.priceUSD.toLocaleString()}`;

                    return (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${
                          isOutOfStock
                            ? 'bg-slate-100/80 border-slate-200 opacity-60 cursor-not-allowed'
                            : isChecked
                            ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-300 cursor-pointer shadow-2xs'
                            : 'bg-white border-slate-300 hover:border-slate-400 cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={isOutOfStock}
                          checked={isChecked}
                          onChange={() => !isOutOfStock && toggleAddon(addon.id)}
                          className="mt-0.5 rounded bg-white border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 disabled:opacity-40"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-slate-900">{addon.name}</span>
                              {addon.badge && (
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                                  {addon.badge}
                                </span>
                              )}
                              {addon.availability === 'pre_order' && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                  Pre-Order
                                </span>
                              )}
                              {addon.availability === 'low_stock' && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  Low Stock
                                </span>
                              )}
                              {isOutOfStock && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-mono font-black text-amber-800 shrink-0">
                              +{priceStr}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium leading-tight mt-1">
                            {addon.description}
                          </p>
                          {addon.specs && (
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                              {addon.specs}
                            </span>
                          )}
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

              {/* ============================================================== */}
              {/* ATTACH PAYMENT DETAILS & PROOF OF PAYMENT SECTION */}
              {/* ============================================================== */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-2 border-emerald-300/80 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Attach Payment Details & Proof</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          Official Settlement
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        Pay into Zenith Bank or Moniepoint, attach your payment details & proof, and click submit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verified Accounts 1-Click Copy Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BANK_ACCOUNTS.map((bank) => {
                    const isSelectedBank = receivingBank.includes(bank.accountNumber);
                    const isCopied = copiedBankId === bank.id;
                    return (
                      <div
                        key={bank.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isSelectedBank
                            ? 'bg-white border-emerald-500 ring-2 ring-emerald-300 shadow-2xs'
                            : 'bg-white/80 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-black text-slate-900 flex items-center gap-1">
                            <Landmark className="w-3.5 h-3.5 text-emerald-700" />
                            {bank.bankName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setReceivingBank(`${bank.bankName} (${bank.accountNumber})`);
                              handleCopyBankAccount(bank.accountNumber, bank.id);
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-2.5 h-2.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-2.5 h-2.5" />
                                <span>Copy No.</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="font-mono text-sm font-black text-slate-900 tracking-wider">
                          {bank.accountNumber}
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium truncate mt-0.5">
                          Account: <strong className="text-slate-800">{bank.accountName}</strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => setReceivingBank(`${bank.bankName} (${bank.accountNumber})`)}
                          className={`mt-2 w-full text-[10px] font-bold py-1 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                            isSelectedBank
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isSelectedBank ? <Check className="w-3 h-3" /> : null}
                          <span>{isSelectedBank ? 'Selected Target Account' : 'Pay to this Account'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Form Fields: Payer Name & Sender Bank */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Payer / Depositor Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engr. Tunde Adeleke"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Bank Transferred From:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GTBank, Access, Zenith, Kuda, OPay"
                      value={senderBank}
                      onChange={(e) => setSenderBank(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                {/* Form Fields: Transaction Reference & Date & Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Transaction Ref / Session ID:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NIP-9984129482"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Date of Payment:
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Amount Paid ({currency}):
                    </label>
                    <input
                      type="number"
                      placeholder={grandTotal.toString()}
                      value={customAmountTransferred}
                      onChange={(e) => setCustomAmountTransferred(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* File Attachment: Proof of Payment Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                      Attach Payment Receipt or Transfer Screenshot:
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      JPG, PNG, PDF up to 15MB
                    </span>
                  </label>

                  {receiptFile ? (
                    <div className="p-3 bg-white rounded-xl border border-emerald-400 ring-2 ring-emerald-200/60 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {receiptFile.dataUrl.startsWith('data:image') ? (
                          <img
                            src={receiptFile.dataUrl}
                            alt="Receipt Preview"
                            onClick={() => setPreviewingReceiptImage(receiptFile.dataUrl)}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-90 shadow-2xs"
                            title="Click to view full preview"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                            <Receipt className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-xs font-black text-slate-900 block truncate">
                            {receiptFile.fileName}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-500 font-medium">
                              {receiptFile.fileSize}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                              ✓ Attached & Ready
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {receiptFile.dataUrl.startsWith('data:image') && (
                          <button
                            type="button"
                            onClick={() => setPreviewingReceiptImage(receiptFile.dataUrl)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Preview image"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setReceiptFile(null)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                          title="Remove attached file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white/90 hover:bg-emerald-50/50 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center group">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleReceiptUpload}
                        className="hidden"
                      />
                      <div className="w-9 h-9 rounded-full bg-emerald-100 group-hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                        Click or drag & drop payment receipt / transfer screenshot
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Debit alert screenshot, bank transaction slip, or PDF statement
                      </span>
                    </label>
                  )}

                  {receiptError && (
                    <p className="text-[11px] text-rose-600 font-bold mt-1">
                      {receiptError}
                    </p>
                  )}
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
                      <span className="block text-[11px] font-normal text-emerald-800">
                        Payment details attached & registered. Click below to chat or view receipt.
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Order & Payment Details...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Order & Payment Details</span>
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
                    Plan Package {selectedEditionDetail ? `(${selectedEditionDetail.name})` : ''}:
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {isHardwareOnly
                      ? 'None (Hardware Only)'
                      : formData.edition === 'trial'
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

      {/* ==========================================
          MODAL: ORDER & PAYMENT SUBMISSION SUCCESS
      ========================================== */}
      {showOrderSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {formData.edition === 'trial'
                  ? '7-Day Free Evaluation Activated & Downloaded!'
                  : 'Order & Payment Proof Submitted!'}
              </h3>
              <p className="text-xs text-slate-600">
                {formData.edition === 'trial' ? (
                  <>
                    Your 7-day trial registration has been saved to the central database under Reference{' '}
                    <strong className="font-mono text-emerald-800 text-sm">
                      #{submittedRef || completedOrderRecord?.id || 'KYLX-TRAL-SUCCESS'}
                    </strong>
                    . The official Windows installer bundle has been compiled and downloaded with full 7-day operational services.
                  </>
                ) : (
                  <>
                    Your order reference is{' '}
                    <strong className="font-mono text-emerald-800 text-sm">
                      #{submittedRef || completedOrderRecord?.id || 'KYLX-REC-SUCCESS'}
                    </strong>
                    . All details and attached payment proof have been saved to the Kaylix Central Database.
                  </>
                )}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">Business / Eatery:</span>
                <span className="font-bold text-slate-900">{formData.businessName || 'Valued Eatery'}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">Plan Package:</span>
                <span className="font-bold text-slate-900">
                  {isHardwareOnly ? 'Hardware Only' : (selectedEditionDetail?.name || 'Standard Plan')} ({formData.durationTier.replace('_', ' ')})
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">Total Amount:</span>
                <span className="font-mono font-black text-emerald-800 text-sm">
                  {currency === 'NGN' ? '₦' : '$'}{Number(customAmountTransferred || grandTotal).toLocaleString()}
                </span>
              </div>
              {receivingBank && (
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Paid To:</span>
                  <span className="font-bold text-slate-900">{receivingBank}</span>
                </div>
              )}
              {transactionRef && (
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Transaction Ref:</span>
                  <span className="font-mono font-bold text-slate-900">{transactionRef}</span>
                </div>
              )}
              {receiptFile && (
                <div className="flex justify-between text-slate-700 items-center pt-1 border-t border-slate-200">
                  <span className="font-medium">Payment Proof:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    <Paperclip className="w-3 h-3" />
                    {receiptFile.fileName} ({receiptFile.fileSize})
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  handleLaunchWhatsApp();
                  setShowOrderSuccessModal(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch WhatsApp with Order & Payment Proof</span>
              </button>

              <button
                type="button"
                onClick={() => setShowOrderSuccessModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Done / Close Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewingReceiptImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800">Attached Receipt Preview</span>
              <button
                type="button"
                onClick={() => setPreviewingReceiptImage(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-50 rounded-xl p-2">
              <img
                src={previewingReceiptImage}
                alt="Receipt"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
