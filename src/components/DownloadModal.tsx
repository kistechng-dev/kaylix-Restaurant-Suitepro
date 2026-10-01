import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  CheckCircle2,
  FileArchive,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import { EditionDetail } from '../types';
import { generateInstallerPackage, triggerDownload } from '../utils/installerDownload';
import { VENDOR_CONTACT } from '../data/mockData';

interface DownloadModalProps {
  edition: EditionDetail | null;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ edition, onClose }) => {
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
              Bundle Includes:
            </span>
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
          </div>

          {/* Default Credentials Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
            <div>
              <span className="font-bold block">First Time Login Credentials:</span>
              <span>Username: <strong className="text-slate-900 font-mono font-bold">admin</strong> • Default PIN: <strong className="text-slate-900 font-mono font-bold">1234</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleRedownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Click to Re-download File</span>
            </button>
            <a
              href={`https://wa.me/${VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello Kaylix Support, I just downloaded the ${edition.name}. Please assist with setup.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Get Setup Help on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
