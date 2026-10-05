import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { EditionDetail } from '../types';
import { generateInstallerPackage, triggerDownload } from '../utils/installerDownload';
import { VENDOR_CONTACT } from '../data/mockData';

interface DownloadModalProps {
  edition: EditionDetail | null;
  onClose: () => void;
  onProceedToOrder?: (editionId: any) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ edition, onClose, onProceedToOrder }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!edition) return;

    setDownloadProgress(20);
    const t1 = setTimeout(() => setDownloadProgress(60), 300);
    const t2 = setTimeout(async () => {
      setDownloadProgress(100);
      setIsReady(true);
      try {
        const blob = await generateInstallerPackage(edition);
        const zipFilename = `${edition.installerFileName.replace('.exe', '')}_InstallerBundle.zip`;
        triggerDownload(blob, zipFilename);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Download package generation failed', err);
      }
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [edition]);

  if (!edition) return null;

  const handleRedownload = async () => {
    const blob = await generateInstallerPackage(edition);
    const zipFilename = `${edition.installerFileName.replace('.exe', '')}_InstallerBundle.zip`;
    triggerDownload(blob, zipFilename);
    if (onProceedToOrder) {
      setTimeout(() => {
        onProceedToOrder(edition.id);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Downloading Installer Bundle</h3>
              <p className="text-xs text-slate-500">{edition.name} • {edition.version}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-700">
                {isReady ? 'Packaging Complete! File Downloaded.' : 'Compiling Installer Package...'}
              </span>
              <span className="font-mono text-amber-700 font-bold">{downloadProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>

          {/* Official Google Drive Mirror Box */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-blue-200 flex items-center justify-center shadow-2xs shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5-3.42-6z" fill="#0066DA"/>
                  <path d="M16.29 3.5h-8.58l6.55 11.5h8.59l-6.56-11.5z" fill="#00AC47"/>
                  <path d="M22.85 15H9.71l-3.43 6h13.14l3.43-6z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <span className="text-xs font-black text-blue-950 block">Official Google Drive Mirror</span>
                <span className="text-[10px] text-blue-700 font-medium">Direct cloud download for {edition.name}</span>
              </div>
            </div>

            <a
              href={edition.googleDriveUrl || `https://drive.google.com/drive/folders/1sLwLpP_Kaylix_Trial_POS_v342?usp=sharing`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all shrink-0 active:scale-95"
            >
              <span>Download on Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Package Details Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>File Payload:</span>
              <span className="font-mono text-slate-900 font-medium truncate max-w-[240px]">
                {edition.installerFileName.replace('.exe', '')}_InstallerBundle.zip
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Size:</span>
              <span className="font-mono text-slate-800 font-semibold">{edition.fileSize}</span>
            </div>
          </div>

          {/* Package Contents Checklist */}
          <div className="space-y-1.5 text-xs text-slate-700">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
              {edition.id === 'enterprise' ? 'Enterprise Flagship Bundle Includes:' : 'Bundle Includes:'}
            </span>
            {edition.id === 'enterprise' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] bg-purple-50/60 p-3 rounded-xl border border-purple-200">
                <div className="flex items-center gap-1.5 text-purple-900 font-bold col-span-full">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-purple-700" />
                  <span>START_HERE_KAYLIX_ENTERPRISE.html (1-Click Layman Runner)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>Daily WhatsApp/Email Sales Digest</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>Central Cloud Multi-Branch Hub</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>Inter-Branch Stock Requisitions</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>Central Commissary Production</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>VIP Loyalty & SMS Marketing</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>Accounting CSV & API Sync</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-medium col-span-full">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>Technical Support & Remote Deployment Desk</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Kaylix Setup Launcher (.bat)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>QuickStart Manual (.txt)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Sample Menu Template (.csv)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Thermal ESC/POS Config</span>
                </div>
              </div>
            )}
          </div>

          {/* Default Credentials Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
            <div>
              <span className="font-bold block">First Time Login Credentials:</span>
              <span>Username: <strong className="text-slate-900 font-mono font-bold">admin</strong> • Default Staff Code: <strong className="text-slate-900 font-mono font-bold">123456</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleRedownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download & Proceed to Order Sender</span>
            </button>
            {onProceedToOrder && (
              <button
                type="button"
                onClick={() => {
                  onProceedToOrder(edition.id);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Go to Interactive Order Sender</span>
              </button>
            )}
            <a
              href={`https://wa.me/${VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello Kaylix Support, I just downloaded the ${edition.name}. Please assist with setup.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Help</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
