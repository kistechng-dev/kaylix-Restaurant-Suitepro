import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, Wifi, Battery, Sparkles, X, Check } from 'lucide-react';

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
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet'>('phone');
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

  const isPhone = deviceType === 'phone';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-6 px-3 flex flex-col items-center justify-start text-white relative">
      {/* Floating Control Bar for Preview & Device Selection */}
      <div className="w-full max-w-xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-2.5 bg-slate-800/95 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-xl text-xs z-50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-slate-200">Device Simulator</span>
        </div>

        {/* Device Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setDeviceType('phone')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all text-xs ${
              isPhone
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone (430px)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceType('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all text-xs ${
              !isPhone
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>POS Tablet (768px)</span>
          </button>
        </div>

        <button
          onClick={onTogglePhoneMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all active:scale-95 shadow-xs"
        >
          <Monitor className="w-3.5 h-3.5 text-amber-400" />
          <span>Exit to Full Web</span>
        </button>
      </div>

      {/* Realistic Chassis with Presentable Proportions */}
      <div
        className={`relative w-full transition-all duration-300 ease-out shadow-[0_25px_70px_rgba(0,0,0,0.75)] ring-1 ring-white/10 overflow-hidden flex flex-col ${
          isPhone
            ? 'max-w-[430px] rounded-[50px] border-[10px] border-slate-900 bg-slate-950 h-[880px]'
            : 'max-w-[768px] rounded-[36px] border-[12px] border-slate-900 bg-slate-950 h-[860px]'
        }`}
      >
        {/* Dynamic Island & Mobile Status Bar */}
        <div className="bg-white text-slate-900 px-5 pt-3 pb-2 flex items-center justify-between text-xs font-bold shrink-0 border-b border-slate-200/80 z-30 select-none">
          {/* Time */}
          <span className="font-black tracking-tight text-[13px]">{currentTime}</span>

          {/* Dynamic Island Cutout (Phone only) */}
          {isPhone ? (
            <div className="w-24 h-6 rounded-full bg-black flex items-center justify-between px-2 text-white/80 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
              <span>Counter POS Terminal #01</span>
            </div>
          )}

          {/* Icons: 5G, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-800">
            <span className="text-[10px] font-black">{isPhone ? '5G' : 'LAN'}</span>
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <div className="w-5 h-2.5 border border-slate-800 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-900 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Scrollable Viewport Content with phone-simulator-viewport CSS isolation */}
        <div className="phone-simulator-viewport flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 text-slate-900 relative scroll-smooth overscroll-contain">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="bg-white/95 backdrop-blur-md pt-1.5 pb-2.5 flex justify-center shrink-0 border-t border-slate-100 z-30">
          <div className={`${isPhone ? 'w-32' : 'w-48'} h-1 bg-slate-400 rounded-full`} />
        </div>
      </div>

      {/* Helpful Hint */}
      <p className="mt-3 text-center text-xs text-slate-400 font-medium">
        {isPhone
          ? 'Phone viewport: Spacious, thumb-ergonomic layout with touch navigation.'
          : 'Tablet viewport: High-speed counter touchscreen layout for busy venues.'}
      </p>
    </div>
  );
};
