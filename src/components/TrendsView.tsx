import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  BarChart2, 
  Layers, 
  AlertCircle, 
  Droplet,
  LineChart as LineChartIcon
} from 'lucide-react';
import { UrbanEcosystem, ObservationSubmission } from '../types';
import { SafeChart } from './SafeChart';
import { useRemoteConfig } from '../services/remoteConfig';

interface TrendsViewProps {
  ecosystems: UrbanEcosystem[];
  observations: ObservationSubmission[];
}

export const TrendsView: React.FC<TrendsViewProps> = ({
  ecosystems,
  observations
}) => {
  const { config } = useRemoteConfig();
  const [timeWindow, setTimeWindow] = useState<'7d' | '30d' | '90d'>('30d');

  // Simulated 6-month seasonal trend progression
  const seasonalMonths = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep 2026'];
  const seasonalHealthTrajectory = [78, 76, 71, 64, 69, 72];
  const seasonalScumEvents = [2, 3, 7, 12, 8, 4];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Longitudinal Surveillance
              </span>
              <span className="text-xs text-stone-500 font-mono">IEEE OneAquaHealth Dataset</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Hydrological &amp; Eutrophication Trends</h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
              Tracking seasonal shifts, surface temperature correlation, and multi-week algal accumulation patterns across urban water catchments.
            </p>
          </div>

          <div className="flex items-center bg-[#EFEAE0] p-1 rounded-xl border border-[#D8D0C0] text-xs">
            {(['7d', '30d', '90d'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  timeWindow === w ? 'bg-teal-700 text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {w.toUpperCase()} Horizon
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main SafeChart comparison */}
      <SafeChart
        ecosystems={ecosystems}
        forceFallback={config.forceSafeChartFallback}
        title="Comparative Catchment Ecological Integrity Score"
      />

      {/* Seasonal Trajectory Simulation */}
      <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3DCCF]">
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Metropolitan Water Health Index Trajectory
              </h3>
              <p className="text-xs text-stone-500">
                Aggregated 6-month seasonal pattern illustrating mid-summer thermal dip and fall recovery.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 font-bold">
            Current Index: 72/100
          </span>
        </div>

        {/* Visual Monthly Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3">
          {seasonalMonths.map((m, idx) => {
            const score = seasonalHealthTrajectory[idx];
            const scums = seasonalScumEvents[idx];

            return (
              <div key={m} className="bg-[#F4EFE6] p-3.5 rounded-xl border border-[#DED6C7] text-center flex flex-col justify-between shadow-xs">
                <span className="text-xs font-mono font-bold text-stone-600 block mb-2">{m}</span>
                <div>
                  <div className="text-xl font-black font-mono text-stone-900">{score}</div>
                  <div className="text-[10px] text-stone-500 font-medium">Mean Health</div>
                </div>
                <div className="mt-3 pt-2 border-t border-[#DFD7C7] text-[10px] text-amber-800 font-mono font-semibold">
                  {scums} scum alerts
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-[#F4EFE6] rounded-xl border border-[#DED6C7] text-xs text-stone-600">
          <strong className="text-stone-900">Seasonal Scientific Insight:</strong> Urban freshwater bodies exhibit pronounced thermal stress and reduced dissolved gas retention between July and August, correlating with peak cyanobacterial report density.
        </div>
      </div>
    </div>
  );
};
