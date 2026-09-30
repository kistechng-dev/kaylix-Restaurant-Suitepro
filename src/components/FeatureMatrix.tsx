import React from 'react';
import { Check, X, Layers } from 'lucide-react';
import { COMPARISON_FEATURES } from '../data/mockData';

export const FeatureMatrix: React.FC = () => {
  return (
    <section id="comparison" className="py-14 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
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

        {/* Comparison Table */}
        <div className="rounded-2xl border border-slate-300/80 bg-white overflow-hidden shadow-xs">
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
