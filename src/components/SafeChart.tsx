import React, { useState } from 'react';
import { BarChart3, Table as TableIcon, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import { UrbanEcosystem } from '../types';

interface SafeChartProps {
  ecosystems: UrbanEcosystem[];
  title?: string;
  forceFallback?: boolean;
}

export const SafeChart: React.FC<SafeChartProps> = ({
  ecosystems,
  title = 'Urban Catchment Health Index Comparison',
  forceFallback = false
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'table'>(forceFallback ? 'table' : 'visual');
  const [metric, setMetric] = useState<'health' | 'reports'>('health');

  const effectiveView = forceFallback ? 'table' : viewMode;

  const sortedEcosystems = [...ecosystems].sort((a, b) => {
    if (metric === 'health') return b.overallHealthScore - a.overallHealthScore;
    return b.communityReportsCount - a.communityReportsCount;
  });

  const getBarColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400';
    if (score >= 60) return 'from-amber-500 to-yellow-400';
    if (score >= 40) return 'from-orange-500 to-amber-500';
    return 'from-rose-600 to-red-400';
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-5 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E3DCCF]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
            <BarChart3 className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900">{title}</h3>
            <p className="text-xs text-stone-500">
              {metric === 'health' ? 'Comparative Health Score (0-100)' : 'Citizen Field Reports Density'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-[#EFEAE0] p-1 rounded-lg border border-[#D8D0C0] text-xs">
            <button
              onClick={() => setMetric('health')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                metric === 'health' ? 'bg-teal-700 text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Health Score
            </button>
            <button
              onClick={() => setMetric('reports')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                metric === 'reports' ? 'bg-teal-700 text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Observations
            </button>
          </div>

          {/* Fallback Switcher */}
          <div className="flex items-center bg-[#EFEAE0] p-1 rounded-lg border border-[#D8D0C0] text-xs">
            <button
              onClick={() => setViewMode('visual')}
              disabled={forceFallback}
              className={`p-1.5 rounded transition cursor-pointer ${
                effectiveView === 'visual' ? 'bg-[#FAF7F2] text-teal-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              } ${forceFallback ? 'opacity-40 cursor-not-allowed' : ''}`}
              title={forceFallback ? 'Disabled by Remote Config Fallback' : 'Render Visual Graphic'}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition cursor-pointer ${
                effectiveView === 'table' ? 'bg-[#FAF7F2] text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Safe Table Fallback"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Content */}
      {effectiveView === 'visual' ? (
        <div className="space-y-4 pt-2">
          {sortedEcosystems.map((eco) => {
            const val = metric === 'health' ? eco.overallHealthScore : eco.communityReportsCount;
            const maxVal = metric === 'health' ? 100 : 100;
            const percentage = Math.min(100, Math.round((val / maxVal) * 100));

            return (
              <div key={eco.id} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">{eco.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFEAE0] text-stone-600 border border-[#D8D0C0] font-mono">
                      {eco.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-stone-500 text-[11px]">
                      {metric === 'health' ? 'Health Index:' : 'Reports:'}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">
                      {val}{metric === 'health' ? '/100' : ''}
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="h-3.5 bg-[#EFEAE0] rounded-full overflow-hidden p-0.5 border border-[#DFD7C7]">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full bg-gradient-to-r ${getBarColor(eco.overallHealthScore)} transition-all duration-700 shadow-xs`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                  <span>Risk Level: <strong className="text-stone-700 font-semibold">{eco.oneHealthRiskLevel}</strong></span>
                  <span>Trend: <strong className="text-stone-700 font-semibold capitalize">{eco.trend}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* SAFE CHART FALLBACK: High-Readability Accessible Table */
        <div className="pt-1">
          <div className="mb-3 bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-teal-900">
            <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              <strong>SafeChart Accessible Fallback Table:</strong> Zero-dependency tabular presentation for universal screen-reader accessibility and bandwidth conservation.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#F4EFE6] text-stone-600 uppercase font-mono text-[10px] border-b border-[#DFD7C7]">
                <tr>
                  <th className="py-2.5 px-3">Ecosystem</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Health Score</th>
                  <th className="py-2.5 px-3">One Health Risk</th>
                  <th className="py-2.5 px-3">Citizen Reports</th>
                  <th className="py-2.5 px-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D5] font-sans">
                {sortedEcosystems.map((eco, idx) => (
                  <tr key={eco.id} className="hover:bg-[#F4EFE6]/80 transition">
                    <td className="py-2.5 px-3 font-semibold text-stone-900 flex items-center gap-1.5">
                      <span className="text-stone-400 font-mono text-[11px]">#{idx + 1}</span>
                      {eco.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">{eco.type}</td>
                    <td className="py-2.5 px-3 font-bold font-mono">
                      <span className={eco.overallHealthScore >= 80 ? 'text-emerald-700' : eco.overallHealthScore >= 60 ? 'text-amber-700' : 'text-rose-700'}>
                        {eco.overallHealthScore} / 100
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EFEAE0] border border-[#DFD7C7] text-stone-800">
                        {eco.oneHealthRiskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-stone-700">{eco.communityReportsCount}</td>
                    <td className="py-2.5 px-3 capitalize text-stone-700">{eco.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
