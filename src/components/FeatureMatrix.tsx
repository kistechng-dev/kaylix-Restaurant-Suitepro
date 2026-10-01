import React, { useState } from 'react';
import { Check, X, Layers, Table, Smartphone } from 'lucide-react';
import { COMPARISON_FEATURES } from '../data/mockData';
import { EditionType } from '../types';

export const FeatureMatrix: React.FC = () => {
  const [mobilePackage, setMobilePackage] = useState<EditionType>('standard');
  const [showRawTableOnMobile, setShowRawTableOnMobile] = useState(false);

  return (
    <section id="comparison" className="py-12 sm:py-14 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            Full Package Breakdown
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Detailed Capabilities Matrix
          </h2>
          <p className="mt-1.5 text-slate-700 font-medium text-xs sm:text-sm">
            Compare all 4 packages side-by-side to find the ideal operational fit for your restaurant floor.
          </p>
        </div>

        {/* MOBILE VIEW (< md:): Interactive Package Checklist */}
        <div className="block md:hidden">
          {/* Segmented Package Filter */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-slate-300 mb-3 gap-1 overflow-x-auto no-scrollbar shadow-2xs">
            {(
              [
                { id: 'trial', label: 'Trial (7-Day)' },
                { id: 'basic', label: 'Basic' },
                { id: 'standard', label: 'Standard ⭐' },
                { id: 'enterprise', label: 'Enterprise 👑' },
              ] as { id: EditionType; label: string }[]
            ).map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setMobilePackage(pkg.id)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold whitespace-nowrap text-center transition-all ${
                  mobilePackage === pkg.id
                    ? 'bg-amber-500 text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pkg.label}
              </button>
            ))}
          </div>

          {/* Toggle raw table on mobile */}
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowRawTableOnMobile(!showRawTableOnMobile)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline flex items-center gap-1"
            >
              <Table className="w-3.5 h-3.5" />
              <span>{showRawTableOnMobile ? 'Switch to Mobile Cards View' : 'View Full Table Grid'}</span>
            </button>
          </div>

          {!showRawTableOnMobile ? (
            <div className="bg-white rounded-2xl border border-slate-300 shadow-2xs p-4 divide-y divide-slate-100">
              <div className="pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                    Package Features
                  </span>
                  <h4 className="text-base font-black text-slate-900 capitalize">
                    {mobilePackage === 'standard' ? 'Standard Package (Recommended)' : `${mobilePackage} Edition`}
                  </h4>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                  {COMPARISON_FEATURES.length} Specs
                </span>
              </div>

              <div className="pt-2 space-y-2.5">
                {COMPARISON_FEATURES.map((item, idx) => {
                  const val = item[mobilePackage];
                  const isCheck = val === true;
                  const isCross = val === false;
                  const isText = typeof val === 'string';

                  return (
                    <div key={idx} className="flex items-center justify-between py-1 text-xs">
                      <span className="font-semibold text-slate-800 pr-2">{item.name}</span>
                      <div className="shrink-0 text-right">
                        {isCheck && (
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            <span>Included</span>
                          </span>
                        )}
                        {isCross && (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full text-[11px]">
                            <X className="w-3 h-3 text-slate-400" />
                            <span>Not Included</span>
                          </span>
                        )}
                        {isText && (
                          <span className="inline-block font-mono font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                            {val}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* COMPARISON TABLE: Visible on desktop, or toggled on mobile */}
        <div
          className={`rounded-2xl border border-slate-300/80 bg-white overflow-hidden shadow-2xs ${
            showRawTableOnMobile ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-900">
                  <th className="py-3.5 px-4 font-black text-slate-900 w-1/3">Feature / Capability</th>
                  <th className="py-3.5 px-3 font-extrabold text-blue-900 text-center">Trial (7-Day)</th>
                  <th className="py-3.5 px-3 font-extrabold text-slate-900 text-center">Basic Package</th>
                  <th className="py-3.5 px-3 font-black text-amber-900 text-center bg-amber-100/70 border-l border-r border-amber-300">
                    Standard Pack
                  </th>
                  <th className="py-3.5 px-3 font-extrabold text-purple-900 text-center">Enterprises</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {COMPARISON_FEATURES.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{item.name}</td>

                    {/* Trial */}
                    <td className="py-2.5 px-3 text-center">
                      {typeof item.trial === 'boolean' ? (
                        item.trial ? (
                          <Check className="w-4 h-4 text-blue-700 mx-auto stroke-[2.8]" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-bold text-blue-900 text-xs">{item.trial}</span>
                      )}
                    </td>

                    {/* Basic */}
                    <td className="py-2.5 px-3 text-center">
                      {typeof item.basic === 'boolean' ? (
                        item.basic ? (
                          <Check className="w-4 h-4 text-emerald-700 mx-auto stroke-[2.8]" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-bold text-slate-900 text-xs">{item.basic}</span>
                      )}
                    </td>

                    {/* Standard */}
                    <td className="py-2.5 px-3 text-center bg-amber-50/70 border-l border-r border-amber-200 font-black text-amber-950">
                      {typeof item.standard === 'boolean' ? (
                        item.standard ? (
                          <Check className="w-4 h-4 text-amber-700 mx-auto stroke-[3]" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-black text-amber-900 text-xs">{item.standard}</span>
                      )}
                    </td>

                    {/* Enterprise */}
                    <td className="py-2.5 px-3 text-center">
                      {typeof item.enterprise === 'boolean' ? (
                        item.enterprise ? (
                          <Check className="w-4 h-4 text-purple-700 mx-auto stroke-[2.8]" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-bold text-purple-900 text-xs">{item.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
