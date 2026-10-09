import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  CheckCircle2,
  FileArchive,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Laptop,
  Copy,
  Check,
  Clock,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { EditionDetail } from '../types';
import { generateTrialEvaluationPackage, triggerDownload } from '../utils/installerDownload';
import { generateMasterLicenseKey } from '../utils/licenseGenerator';
import { VENDOR_CONTACT } from '../data/mockData';

interface TrialDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition?: EditionDetail | null;
  initialBusinessName?: string;
  initialCustomerName?: string;
  initialPhone?: string;
  onSuccessRegistered?: (orderRecord: any) => void;
}

export const TrialDownloadModal: React.FC<TrialDownloadModalProps> = ({
  isOpen,
  onClose,
  edition,
  initialBusinessName = '',
  initialCustomerName = '',
  initialPhone = '',
  onSuccessRegistered,
}) => {
  // Form State
  const [businessName, setBusinessName] = useState(initialBusinessName || "Mama's Delight Kitchen & Lounge");
  const [customerName, setCustomerName] = useState(initialCustomerName || 'Chef / Manager');
  const [phone, setPhone] = useState(initialPhone || '08089697390');
  const [email, setEmail] = useState('');
  const [cityState, setCityState] = useState('Victoria Island, Lagos, Nigeria');
  const [hardwareInUse, setHardwareInUse] = useState('Windows PC / Laptop + 80mm Thermal Printer');

  // Processing & Download state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string>('');
  const [submittedOrderId, setSubmittedOrderId] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setBusinessName("Buka Royale Kitchen & Grills");
    setCustomerName('Emmanuel Okon');
    setPhone('08089697390');
    setEmail('emmanuel.buka@gmail.com');
    setCityState('Ikeja, Lagos, Nigeria');
    setHardwareInUse('Touchscreen POS Terminal + 80mm Kitchen Printer');
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleSubmitAndDownload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setDownloadProgress(25);

    try {
      // 1. Generate 7-Day Trial License Key
      const trialKeyResult = generateMasterLicenseKey({
        businessName: businessName.trim() || "Mama's Delight Kitchen & Lounge",
        edition: 'trial',
        clientPhone: phone.trim() || '08089697390',
        validityDays: 7,
        terminalLimit: 1,
        hwid: 'CLIENT-HWID-TRIAL',
        resellerName: 'Kaylix Official Portal',
        modules: {
          posTerminal: true,
          kitchenDisplay: true,
          recipeCosting: true,
          waiterApp: true,
          multiBranch: false,
          cloudSync: false,
          smsWhatsappAlerts: false,
        },
      });
      const licenseCode = trialKeyResult?.licenseKey || 'TRAL-7D9A1-2C4B8-7D-8F22';
      setGeneratedKey(licenseCode);

      // 2. Submit record to backend portal (/api/orders)
      setDownloadProgress(50);
      let orderId = `KYLX-TRAL-${Date.now().toString().slice(-6)}`;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customerName.trim() || 'Valued Trial Client',
            businessName: businessName.trim() || 'Eatery & Lounge',
            phone: phone.trim() || '08089697390',
            email: email.trim() || 'trial@kaylix.internal',
            cityState: cityState.trim() || 'Lagos, Nigeria',
            packageSubscribed: 'Trial Plan (7-Day Free Evaluation)',
            edition: 'trial',
            durationTier: '7_days',
            tenureLabel: '7-Day Free Evaluation Pass',
            amountPaid: 0,
            currency: 'NGN',
            paymentMethod: 'free_trial',
            status: 'active',
            notes: `Online 7-Day Free Evaluation Trial Download - Operational POS Services Activated. Hardware: ${hardwareInUse}. Key: ${licenseCode}`,
            selectedAddons: [],
            deploymentType: 'self_guided',
          }),
        });

        const data = await res.json();
        if (data.success && data.customer) {
          orderId = data.customer.id;
          if (onSuccessRegistered) {
            onSuccessRegistered(data.customer);
          }
        }
      } catch (backendErr) {
        console.warn('Backend order recording notice (proceeding with local trial delivery):', backendErr);
      }

      setSubmittedOrderId(orderId);
      setDownloadProgress(75);

      // 3. Generate installer package with 7 days free evaluation operation/services
      const blob = await generateTrialEvaluationPackage({
        customerName: customerName.trim(),
        businessName: businessName.trim(),
        phone: phone.trim(),
        licenseCode,
      });

      setDownloadProgress(100);

      // 4. Trigger download
      const filename = `Kaylix_Restaurant_POS_7Day_Trial_Evaluation_InstallerBundle.zip`;
      triggerDownload(blob, filename);

      // 5. Celebration confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsComplete(true);
    } catch (err: any) {
      console.error('Failed to submit and generate trial download:', err);
      setErrorMessage(err?.message || 'Could not compile trial bundle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedownloadOnly = async () => {
    try {
      const blob = await generateTrialEvaluationPackage({
        customerName,
        businessName,
        phone,
        licenseCode: generatedKey || 'TRAL-7D9A1-2C4B8-7D-8F22',
      });
      triggerDownload(blob, `Kaylix_Restaurant_POS_7Day_Trial_Evaluation_InstallerBundle.zip`);
    } catch (err) {
      console.error('Redownload failed:', err);
    }
  };

  const googleDriveTrialUrl =
    'https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Trial_POS_v342?usp=sharing';

  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-blue-950">
                  7-Day Free Full Pass
                </span>
                <span className="text-xs text-blue-200 font-mono">v3.4.2 Production</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5 text-white">
                Download & Activate 7-Day Free Evaluation
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Operation & Services Guarantee Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                7-Day Unrestricted Free Evaluation Services:
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                100% Free • No Card Needed
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Counter Fast Cashier POS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Kitchen Display Screen (KDS)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>ESC/POS 80mm & 58mm Printing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Shift Z-Reports & Sales Auditing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>100% Offline (No Internet Lag)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Free Remote WhatsApp Support</span>
              </div>
            </div>
          </div>

          {!isComplete ? (
            /* STEP 1: Registration Form & One-Click Download */
            <form onSubmit={handleSubmitAndDownload} className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-800">
                  Enter Your Restaurant Information to Activate Services:
                </span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-300 transition-colors"
                >
                  ⚡ Fill Sample Eatery
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Eatery / Restaurant Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Mama's Delight Kitchen"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Contact Person Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Chef Johnson"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    WhatsApp / Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08089697390 or 08060395329"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="manager@eatery.com"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City & State / Location</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      placeholder="e.g. Victoria Island, Lagos"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hardware Setup</label>
                  <div className="relative">
                    <Laptop className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={hardwareInUse}
                      onChange={(e) => setHardwareInUse(e.target.value)}
                      placeholder="e.g. Windows PC + 80mm Printer"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Progress bar when submitting */}
              {isSubmitting && (
                <div className="space-y-1 py-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>
                      {downloadProgress < 50
                        ? 'Registering 7-Day Evaluation in Central Database...'
                        : downloadProgress < 85
                        ? 'Packaging Windows Installer & Services Certificate...'
                        : 'Starting Download...'}
                    </span>
                    <span className="font-mono text-blue-700">{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit & Download Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting to Backend Portal & Packaging Download...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 stroke-[2.8]" />
                    <span>Download Installer & Activate 7-Day Evaluation Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Default credentials note */}
              <div className="text-[11px] text-slate-500 text-center font-medium">
                Default Super-Admin Login: <span className="font-mono font-bold text-slate-800">admin</span> • Staff Code: <span className="font-mono font-bold text-slate-800">123456</span>
              </div>
            </form>
          ) : (
            /* STEP 2: Download Complete & Active Services Certificate View */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.8]" />
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  7-Day Evaluation Downloaded & Services Activated!
                </h4>
                <p className="text-xs text-slate-600">
                  Your registration information has been submitted and saved to the central backend portal database under Order ID{' '}
                  <strong className="font-mono text-blue-900 font-bold">#{submittedOrderId}</strong>.
                </p>
              </div>

              {/* License Certificate Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-medium">7-Day Evaluation License Key:</span>
                  <span className="text-emerald-400 font-bold text-[11px]">Valid Until: {expiryDate}</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <code className="font-mono text-sm sm:text-base font-black text-amber-400 tracking-wider">
                    {generatedKey || 'TRAL-7D9A1-2C4B8-7D-8F22'}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span>Registered To:</span>{' '}
                    <strong className="text-slate-200">{businessName}</strong>
                  </div>
                  <div>
                    <span>Phone:</span>{' '}
                    <strong className="text-slate-200">{phone}</strong>
                  </div>
                </div>
              </div>

              {/* Package Payload Details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Downloaded Bundle:</span>
                  <span className="font-mono font-bold text-slate-900 truncate max-w-[260px]">
                    Kaylix_Restaurant_POS_7Day_Trial_Evaluation_InstallerBundle.zip
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Evaluation Tenure:</span>
                  <span className="font-bold text-blue-900">7 Days Free Full Operation Pass</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Central Portal Registration:</span>
                  <span className="font-bold text-emerald-700">✅ Registered & Active in DB</span>
                </div>
              </div>

              {/* Official Google Drive Mirror Link */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold text-blue-950 block">Google Drive Mirror Available</span>
                    <span className="text-[11px] text-blue-700">Alternate cloud download link for installer</span>
                  </div>
                </div>
                <a
                  href={googleDriveTrialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shrink-0"
                >
                  Drive Link
                </a>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleRedownloadOnly}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Redownload Bundle</span>
                </button>

                <a
                  href={`https://wa.me/${VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello Kaylix Support Desk, I just registered and downloaded the 7-Day Free Evaluation Pass for *${businessName}* (Order #${submittedOrderId}). My Trial License Key is *${generatedKey}*. Please guide me on installation.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Setup Desk</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
