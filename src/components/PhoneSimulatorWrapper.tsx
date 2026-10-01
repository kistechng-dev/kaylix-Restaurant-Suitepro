import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Volume2, Sparkles, X } from 'lucide-react';

interface PhoneSimulatorWrapperProps {
  children: React.ReactNode;
  isPhoneMode: boolean;
  onTogglePhoneMode: () => void;
}

export const PhoneSimulatorWrapper: React.FC<PhoneSimulatorWrapperProps> = ({
  children,
  isPhoneMode,
  onTogglePhoneMode,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-6 px-3 flex flex-col items-center justify-start text-white relative">
      {/* Floating Control Bar for Preview */}
      <div className="w-full max-w-md mx-auto mb-4 flex items-center justify-between bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-xl text-xs z-50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-200">Phone Page Mode (Mobile Vibe)</span>
        </div>

        <button
          onClick={onTogglePhoneMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition-all active:scale-95 shadow-xs"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit to Full Web</span>
        </button>
      </div>

      {/* Realistic Smartphone Chassis (iPhone 16 Pro styling) */}
      <div className="relative w-full max-w-[400px] rounded-[52px] border-[11px] border-slate-800 bg-slate-950 shadow-[0_25px_70px_rgba(0,0,0,0.7)] ring-1 ring-white/10 overflow-hidden flex flex-col h-[860px]">
        {/* Dynamic Island & Mobile Status Bar */}
        <div className="bg-white text-slate-900 px-6 pt-3 pb-1 flex items-center justify-between text-xs font-bold shrink-0 border-b border-slate-100 z-30 select-none">
          {/* Time */}
          <span className="font-black tracking-tight text-[13px]">{currentTime}</span>

          {/* Dynamic Island Cutout */}
          <div className="w-24 h-6 rounded-full bg-black flex items-center justify-between px-2 text-white/80 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>

          {/* Icons: 5G, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-800">
            <span className="text-[10px] font-black">5G</span>
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <div className="w-5 h-2.5 border border-slate-800 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-900 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Scrollable Viewport Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 text-slate-900 relative scroll-smooth overscroll-contain">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="bg-white/95 backdrop-blur-md pt-1 pb-2 flex justify-center shrink-0 border-t border-slate-100 z-30">
          <div className="w-32 h-1 bg-slate-400 rounded-full" />
        </div>
      </div>

      {/* Helpful Hint */}
      <p className="mt-3 text-center text-xs text-slate-400 font-medium">
        Simulating phone viewport with thumb-zone ergonomics & touch navigation.
      </p>
    </div>
  );
};
