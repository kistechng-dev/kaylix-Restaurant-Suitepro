import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Monitor,
  Printer,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Layers,
  FileArchive,
  RefreshCw,
  Check,
  Package,
} from 'lucide-react';
import { EditionType, OrderEditionType, DurationTier } from '../types';
import { getEffectiveEditions, getCustomPricing, normalizePhoneNumber } from '../utils/pricingStorage';
import { generateAllInOnePackage, triggerDownload } from '../utils/installerDownload';
import { VENDOR_CONTACT } from '../data/mockData';
import { GlobalLocationPicker, LocationSelection } from './GlobalLocationPicker';
import { generateMasterLicenseKey } from '../utils/licenseGenerator';

interface DownloadPageProps {
  onNavigateToOrder?: (editionId?: OrderEditionType) => void;
  onNavigateToBanks?: () => void;
  onOrderHardwareOnly?: (addonId?: string) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({
  onNavigateToOrder,
  onNavigateToBanks,
  onOrderHardwareOnly,
}) => {
  const [pricingConfig, setPricingConfig] = useState(getCustomPricing);
  const [editionsMap, setEditionsMap] = useState(getEffectiveEditions);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [showDownloadSourcesInfo, setShowDownloadSourcesInfo] = useState(false);

  // Selected Plan for Registration & Activation
  const [selectedPlan, setSelectedPlan] = useState<EditionType>('trial');

  // Country calling code & flag
  const [countryDialCode, setCountryDialCode] = useState<string>('+234');
  const [countryFlag, setCountryFlag] = useState<string>('🇳🇬');
  const [countryName, setCountryName] = useState<string>('Nigeria');

  // Registration Form State
  const [regForm, setRegForm] = useState({
    customerName: '',
    businessName: '',
    phone: '08060395329',
    email: '',
    cityState: 'Victoria Island, Eti-Osa LGA, Lagos, Nigeria',
    hardwareInUse: 'Windows PC / Laptop + 80mm Thermal Printer',
    notes: '',
  });

  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regSuccessData, setRegSuccessData] = useState<{
    customerName: string;
    businessName: string;
    phone: string;
    edition: EditionType;
    planName: string;
    licenseCode: string;
    googleDriveUrl: string;
    country: string;
    locationSummary: string;
  } | null>(null);

  const registrationSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePriceUpdate = () => {
      setPricingConfig(getCustomPricing());
      setEditionsMap(getEffectiveEditions());
    };
    window.addEventListener('kaylix_pricing_updated', handlePriceUpdate);
    return () => window.removeEventListener('kaylix_pricing_updated', handlePriceUpdate);
  }, []);

  // Single Master Google Drive link
  const allInOneDriveUrl =
    pricingConfig.driveLinks?.allInOne ||
    'https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Kitchen_AllInOne_POS_Suite_v342?usp=sharing';

  const handleDownloadDriveAndProceed = () => {
    window.open(allInOneDriveUrl, '_blank');
    if (onNavigateToOrder) {
      setTimeout(() => {
        onNavigateToOrder(selectedPlan);
      }, 400);
    }
  };

  const handleDownloadAllInOneZip = async () => {
    setIsDownloadingZip(true);
    try {
      const blob = await generateAllInOnePackage();
      const zipFilename = 'Kaylix_Kitchen_POS_Suite_AllInOne_v3.4.2_Setup.zip';
      triggerDownload(blob, zipFilename);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
      });
      if (onNavigateToOrder) {
        setTimeout(() => {
          onNavigateToOrder(selectedPlan);
        }, 1000);
      }
    } catch (err) {
      console.error('Download package generation failed', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.businessName || !regForm.customerName || !regForm.phone) {
      alert('Please fill in Restaurant Name, Contact Person, and WhatsApp Phone Number.');
      return;
    }

    setIsSubmittingReg(true);

    try {
      const digitsOnly = regForm.phone.replace(/\D/g, '');
      const cleanDialCode = countryDialCode.replace(/\D/g, '');
      let fullPhone = digitsOnly;
      if (cleanDialCode && !digitsOnly.startsWith(cleanDialCode)) {
        const trimmed = digitsOnly.replace(/^0+/, '');
        fullPhone = `${cleanDialCode}${trimmed}`;
      }

      const editionObj = editionsMap[selectedPlan] || editionsMap['trial'];
      const keyResult = generateMasterLicenseKey({
        businessName: regForm.businessName.trim(),
        clientPhone: fullPhone,
        edition: selectedPlan,
        hwid: 'CLIENT-REGISTERED-HARDWARE',
        validityDays: selectedPlan === 'trial' ? 7 : 365,
        terminalLimit: selectedPlan === 'enterprise' ? 0 : selectedPlan === 'standard' ? 3 : 1,
        modules: {
          posTerminal: true,
          kitchenDisplay: selectedPlan !== 'basic',
          recipeCosting: selectedPlan !== 'basic',
          waiterApp: selectedPlan === 'standard' || selectedPlan === 'enterprise',
          multiBranch: selectedPlan === 'enterprise',
          cloudSync: selectedPlan === 'enterprise',
          smsWhatsappAlerts: true,
        },
        resellerName: 'Kaylix Official Portal',
      });
      const generatedLicense = keyResult.licenseKey;

      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: regForm.customerName.trim(),
          businessName: regForm.businessName.trim(),
          phone: fullPhone,
          email: regForm.email?.trim() || `${regForm.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
          cityState: regForm.cityState.trim(),
          packageSubscribed: editionObj.name,
          edition: selectedPlan,
          durationTier: selectedPlan === 'trial' ? '7_days' : '1_year',
          tenureLabel: selectedPlan === 'trial' ? '7-Day Evaluation' : '1 Year License',
          amountPaid: 0,
          currency: 'NGN',
          licenseCode: generatedLicense,
          status: 'pending',
          notes: `Registered on Downloads Page for ${editionObj.name}. Country: ${countryName}. Location: ${regForm.cityState}. Hardware: ${regForm.hardwareInUse}. Notes: ${regForm.notes || 'None'}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });

        setRegSuccessData({
          customerName: regForm.customerName,
          businessName: regForm.businessName,
          phone: fullPhone,
          edition: selectedPlan,
          planName: editionObj.name,
          licenseCode: data.customer?.licenseCode || generatedLicense,
          googleDriveUrl: allInOneDriveUrl,
          country: countryName,
          locationSummary: regForm.cityState,
        });

        if (onNavigateToOrder) {
          setTimeout(() => {
            onNavigateToOrder(selectedPlan);
          }, 3000);
        }
      } else {
        alert(data.error || 'Failed to register. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not connect to server. Please check your network.');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const planOptions: { id: EditionType; title: string; subtitle: string; badge: string; color: string }[] = [
    {
      id: 'trial',
      title: '7-Day Free Trial Pass',
      subtitle: 'Full features for 7 days • 1 Cashier Terminal • Pre-loaded sample menu',
      badge: 'Free Evaluation',
      color: 'blue',
    },
    {
      id: 'basic',
      title: 'Basic Plan',
      subtitle: '1 Standalone Counter POS + 2 Wireless Handheld Terminals',
      badge: 'Counter + Handhelds',
      color: 'slate',
    },
    {
      id: 'standard',
      title: 'Standard Plan',
      subtitle: 'Multi-User Network + Interactive Table Floor Plan + Kitchen KDS Pass',
      badge: 'Recommended Dining',
      color: 'amber',
    },
    {
      id: 'enterprise',
      title: 'Enterprises Plan',
      subtitle: 'Unlimited Terminals + Central Commissary Production + Multi-Branch Cloud HQ',
      badge: 'Omnichannel Flagship',
      color: 'purple',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-3.5 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>Single Master Installer Download</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Download Kaylix POS All-in-One Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Only 1 universal software file powers all restaurant setups. Download the complete package once via Google Drive or direct browser bundle, then register below to pick whatever plan you want.
          </p>
        </div>

        {/* SECTION 1: THE 1 ALL-IN-ONE DOWNLOAD CARD */}
        <div className="bg-white border-2 border-amber-400/90 rounded-3xl p-5 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider shadow-xs">
            1 Universal Installer File
          </div>

          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20 shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Kaylix Kitchen POS Suite — All-in-One Setup
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Build: <strong className="text-slate-800 font-mono">v3.4.2 (Production Release)</strong> • Size: <strong className="text-slate-800 font-mono">78.4 MB</strong> • Target: <strong className="text-slate-800">Windows 11/10/8.1/7 & Android</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-xl border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>100% Offline-First POS</span>
              </div>
            </div>

            {/* Everything Included in this 1 File */}
            <div>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2.5">
                Included in This 1 Master Software Download:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full Cashier Counter POS (<span className="text-slate-500">&lt;3s checkout</span>)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kitchen Order Ticket (KOT) & Kitchen KDS Pass</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive Dining Table Floor Plan Management</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Recipe Costing & Automatic Ingredient Inventory</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ESC/POS 80mm & 58mm Thermal Receipt Spooler</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Layman 1-Click Offline Runner (START_HERE.html)</span>
                </div>
              </div>
            </div>

            {/* File Verification & Details */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-600">
              <div className="truncate">
                <strong className="text-slate-800">File:</strong> Kaylix_Kitchen_POS_Suite_AllInOne_v3.4.2_Setup.exe
              </div>
              <div className="shrink-0 text-[11px] text-slate-500">
                SHA-256: 09bd47c94a286e11893f441029da6c1e9561b34a
              </div>
            </div>

            {/* ACTION BUTTONS (The Only Download Buttons Needed) */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {/* 1. Download via Google Drive & Proceed */}
              <button
                type="button"
                onClick={handleDownloadDriveAndProceed}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95 group"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5-3.42-6z" fill="#FFFFFF" fillOpacity="0.95" />
                  <path d="M16.29 3.5h-8.58l6.55 11.5h8.59l-6.56-11.5z" fill="#FFFFFF" fillOpacity="0.8" />
                  <path d="M22.85 15H9.71l-3.43 6h13.14l3.43-6z" fill="#FFFFFF" />
                </svg>
                <span>Download via Google Drive & Proceed to Order Sender</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 2. Direct Browser Download (.ZIP) & Proceed */}
              <button
                type="button"
                disabled={isDownloadingZip}
                onClick={handleDownloadAllInOneZip}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-300 transition-all active:scale-95 disabled:opacity-50"
              >
                {isDownloadingZip ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                    <span>Compiling ZIP & Proceeding to Order Sender...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-700" />
                    <span>Direct Browser Download (.ZIP) & Proceed to Order Sender</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </>
                )}
              </button>
            </div>

            {/* Explanation: Where do these files download from? */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDownloadSourcesInfo(!showDownloadSourcesInfo)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <span>ℹ️ Where do "Direct Browser Download (.ZIP)" and Google Drive download from?</span>
                <span className="text-amber-700 underline font-semibold">
                  {showDownloadSourcesInfo ? 'Hide explanation' : 'Click to learn where files download from'}
                </span>
              </button>

              {showDownloadSourcesInfo && (
                <div className="mt-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold shrink-0 text-[11px]">
                      ☁️ Google Drive
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Downloads directly from our official <strong className="text-slate-900">Google Cloud Drive mirror</strong> storage. This gives you the pre-packaged setup executable with Google’s global high-speed CDN.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold shrink-0 text-[11px]">
                      ⚡ Direct Browser (.ZIP)
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Generated <strong className="text-slate-900">100% client-side directly inside your web browser</strong> using HTML5 in-memory packaging (JSZip). It creates your complete offline install bundle containing the HTML POS suite, Windows setup scripts, sample menu CSVs, and quickstart manuals immediately with zero server queues or third-party file locker limits.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: REGISTER RESTAURANT & PICK WHATEVER PLAN YOU WANT */}
        <div
          ref={registrationSectionRef}
          className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Restaurant Registration & Plan Activation Desk</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Register Your Restaurant & Pick Your Plan
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Register once to receive your pre-activation license key for the All-in-One software you downloaded above.
              </p>
            </div>
          </div>

          {/* Registration Confirmation Alert */}
          {regSuccessData && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-3 animate-fade-in shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-emerald-950">
                    Registration Confirmed for {regSuccessData.businessName}!
                  </h3>
                  <span className="text-xs text-emerald-800 block">
                    Contact: <strong>{regSuccessData.customerName}</strong> • Phone: <strong>+{regSuccessData.phone}</strong> • Plan: <strong>{regSuccessData.planName}</strong>
                  </span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5">
                    📍 Location: <strong>{regSuccessData.locationSummary}</strong> ({regSuccessData.country})
                  </span>
                </div>
              </div>

              {/* License Code Box */}
              <div className="p-3 bg-white border border-emerald-300 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-slate-500 block text-[11px]">Your Restaurant Pre-Activation Key:</span>
                <div className="font-mono font-black text-sm text-emerald-900 break-all select-all">
                  {regSuccessData.licenseCode}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Default POS Login: Username: <strong className="text-slate-800 font-mono">admin</strong> • Staff Code: <strong className="text-slate-800 font-mono">123456</strong>
                </div>
              </div>

              {/* Interactive Order Sender & WhatsApp setup buttons */}
              <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigateToOrder && onNavigateToOrder(selectedPlan)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Proceed to Interactive Order Sender</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello Kaylix Support, I registered my restaurant "${regSuccessData.businessName}" for the ${regSuccessData.planName}. License Key: ${regSuccessData.licenseCode}. Please assist with setup.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Chat with Setup Engineer on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmitRegistration} className="space-y-5">
            {/* Step 1: Pick Whatever Plan */}
            <div>
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2">
                1. Pick Whatever Plan Fits Your Restaurant:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {planOptions.map((opt) => {
                  const isChecked = selectedPlan === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedPlan(opt.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            opt.id === 'trial'
                              ? 'bg-blue-100 text-blue-900'
                              : opt.id === 'standard'
                              ? 'bg-amber-100 text-amber-900'
                              : opt.id === 'enterprise'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {opt.badge}
                        </span>

                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isChecked
                              ? 'border-amber-600 bg-amber-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-slate-900">{opt.title}</h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">{opt.subtitle}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Restaurant Contact Details */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                2. Enter Your Restaurant Information:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Restaurant / Eatery / Lounge Name *
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-amber-600 focus-within:bg-white">
                    <Building className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mama Cass Eatery & Lounge"
                      value={regForm.businessName}
                      onChange={(e) => setRegForm({ ...regForm, businessName: e.target.value })}
                      className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Owner / Manager Name *
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-amber-600 focus-within:bg-white">
                    <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chef Babatunde Adeyemi"
                      value={regForm.customerName}
                      onChange={(e) => setRegForm({ ...regForm, customerName: e.target.value })}
                      className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                    <span>WhatsApp Phone Number *</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                      <span>{countryFlag}</span>
                      <span>{countryName} ({countryDialCode})</span>
                    </span>
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-emerald-600 focus-within:bg-white">
                    <span className="text-xs font-mono font-bold text-slate-600 mr-2 flex items-center gap-1 shrink-0 bg-slate-200/80 px-2 py-0.5 rounded-md">
                      <span>{countryFlag}</span>
                      <span>{countryDialCode}</span>
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 806 039 5329 or 7911 123456"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full text-xs font-mono font-bold text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-amber-600 focus-within:bg-white">
                    <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="email"
                      placeholder="e.g. manager@restaurant.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full text-xs font-medium text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Worldwide Location Picker: Country, State, Local Govt, City */}
              <div>
                <GlobalLocationPicker
                  initialCountry={countryName}
                  initialState="Lagos"
                  initialLocalGovt="Eti-Osa"
                  initialCity="Victoria Island"
                  onCountryDialCodeChange={(dialCode) => {
                    setCountryDialCode(dialCode);
                  }}
                  onChange={(loc: LocationSelection) => {
                    setCountryName(loc.country);
                    setCountryFlag(loc.flag);
                    setCountryDialCode(loc.dialCode);
                    setRegForm((prev) => ({
                      ...prev,
                      cityState: loc.formattedString,
                    }));
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Hardware Equipment in Use (Optional)
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:border-amber-600 focus-within:bg-white">
                  <Monitor className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Windows Touch POS, Laptop, Sunmi POS, 80mm Printer"
                    value={regForm.hardwareInUse}
                    onChange={(e) => setRegForm({ ...regForm, hardwareInUse: e.target.value })}
                    className="w-full text-xs font-medium text-slate-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-medium">
                🔒 Registered in our official customer database for 1-on-1 setup support.
              </span>

              <button
                type="submit"
                disabled={isSubmittingReg}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmittingReg ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering & Proceeding to Order Sender...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Register & Proceed to Interactive Order Sender</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2.5: HARDWARE & ADD-ONS ONLY BANNER */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-500/30 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/30 text-amber-300 border border-amber-400/40 mb-1">
                Hardware & Add-ons
              </div>
              <h4 className="text-sm sm:text-base font-black text-white">Need Hardware Add-ons Only (Without Selecting a Plan Package)?</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                You can apply for thermal receipt printers, cash drawers, barcode scanners, and touch POS hardware without selecting a software plan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOrderHardwareOnly ? onOrderHardwareOnly() : onNavigateToOrder ? onNavigateToOrder('none') : null}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition-all active:scale-95"
          >
            <span>Order Hardware Add-ons Only</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SECTION 3: LAYMAN 3-STEP INSTRUCTIONS */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Layman 3-Step Setup Instructions
            </h3>
            <p className="text-xs text-slate-500">
              No technical expertise needed. 1 universal installation for counter POS, kitchen KDS, and waiter pads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900">Download the 1 File</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download the All-in-One file above from Google Drive or direct ZIP. Extract it to your PC Desktop.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900">Double-Click Launcher</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Double-click <strong>One_Click_Setup.bat</strong> (or open <strong>START_HERE.html</strong>). The POS creates its offline database.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900">Log In & Start Billing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign in with Username: <strong className="font-mono text-slate-900">admin</strong> and Code: <strong className="font-mono text-slate-900">123456</strong>. Start ringing orders 100% offline!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
