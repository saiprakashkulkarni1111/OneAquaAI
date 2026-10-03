import React from 'react';
import { 
  Activity, 
  MapPin, 
  Droplet, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle, 
  Eye, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import { UrbanEcosystem, ObservationSubmission, WaterAlert } from '../types';
import { SafeMap } from './SafeMap';
import { SafeChart } from './SafeChart';
import { SafeAI } from './SafeAI';
import { useRemoteConfig } from '../services/remoteConfig';

interface DashboardViewProps {
  ecosystems: UrbanEcosystem[];
  observations: ObservationSubmission[];
  alerts: WaterAlert[];
  onSelectEcosystem: (eco: UrbanEcosystem) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  ecosystems,
  observations,
  alerts,
  onSelectEcosystem,
  onNavigateTab
}) => {
  const { config } = useRemoteConfig();

  // Metrics summary
  const averageHealthScore = Math.round(
    ecosystems.reduce((acc, curr) => acc + curr.overallHealthScore, 0) / (ecosystems.length || 1)
  );

  const urgentAlertsCount = alerts.filter(a => a.severity === 'Urgent Investigation' || a.severity === 'Warning').length;
  const recentObservation = observations[0];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-[#FAF7F2] p-6 md:p-8 border border-[#DFD7C7] shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                IEEE OneAquaHealth 2026
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-teal-800 bg-teal-50 border border-teal-200">
                Real-Time Firestore Cache
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              Urban Freshwater &amp; One Health Intelligence
            </h1>
            <p className="text-stone-600 text-xs md:text-sm mt-2 leading-relaxed">
              Bridging community environmental surveillance with epidemiological and ecological reasoning. Monitor urban waterbody micro-habitats, detect early eutrophication, and safeguard community resilience without medical diagnostic claims.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => onNavigateTab('submit')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
              >
                <Droplet className="w-4 h-4" />
                <span>Submit Citizen Report</span>
              </button>
              <button
                onClick={() => onNavigateTab('map')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFEAE0] hover:bg-[#E5DFD3] text-stone-800 font-semibold text-xs border border-[#D5CDBC] transition cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Open Catchment Map</span>
              </button>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-[#F4EFE6] border border-[#DED6C7] p-3 sm:p-4 rounded-2xl flex-1 shadow-xs">
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-600 uppercase block truncate font-medium">Metropolitan Health</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-800 font-mono mt-1 block">
                {averageHealthScore}<span className="text-xs text-stone-500 font-normal">/100</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-stone-500 mt-1 block truncate">Weighted 5 Catchments</span>
            </div>

            <div className="bg-[#F4EFE6] border border-[#DED6C7] p-3 sm:p-4 rounded-2xl flex-1 shadow-xs">
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-600 uppercase block truncate font-medium">Active Alerts</span>
              <span className="text-xl sm:text-2xl font-black text-amber-800 font-mono mt-1 block">
                {urgentAlertsCount}
              </span>
              <span className="text-[9px] sm:text-[10px] text-stone-500 mt-1 block truncate">Surveillance Flags</span>
            </div>

            <div className="bg-[#F4EFE6] border border-[#DED6C7] p-3 sm:p-4 rounded-2xl flex-1 shadow-xs">
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-600 uppercase block truncate font-medium">Citizen Records</span>
              <span className="text-xl sm:text-2xl font-black text-teal-800 font-mono mt-1 block">
                {observations.length}
              </span>
              <span className="text-[9px] sm:text-[10px] text-stone-500 mt-1 block truncate">Real-time Stream</span>
            </div>

            <div className="bg-[#F4EFE6] border border-[#DED6C7] p-3 sm:p-4 rounded-2xl flex-1 shadow-xs">
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-600 uppercase block truncate font-medium">Data Confidence</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-800 font-mono mt-1 block">
                91.4%
              </span>
              <span className="text-[9px] sm:text-[10px] text-stone-500 mt-1 block truncate">Multi-proxy Geotagged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Catchment Spatial Map & Comparative Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SafeMap
            ecosystems={ecosystems}
            selectedEcosystem={null}
            onSelectEcosystem={onSelectEcosystem}
            forceFallback={config.forceSafeMapFallback}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Recent Alerts Card */}
          <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E3DCCF]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-stone-900">Active Catchment Advisories</h3>
              </div>
              <button
                onClick={() => onNavigateTab('alerts')}
                className="text-[11px] text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onNavigateTab('alerts')}
                  className="cursor-pointer p-3 rounded-xl bg-[#F4EFE6] border border-[#DED6C7] hover:border-[#cbbfab] hover:bg-[#EFEAE0] transition"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-stone-900 truncate">{alert.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      alert.severity === 'Urgent Investigation'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                    {alert.details}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 mt-2 font-mono">
                    <span className="font-semibold text-stone-700">{alert.ecosystemName}</span>
                    <span>{alert.issuedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Chart */}
          <SafeChart
            ecosystems={ecosystems}
            forceFallback={config.forceSafeChartFallback}
            title="Catchment Health Breakdown"
          />
        </div>
      </div>

      {/* Latest One Health AI Analysis Feature Spot */}
      {recentObservation?.aiAnalysis && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-700" />
              <h2 className="text-lg font-bold text-stone-900">Latest One Health AI Field Synthesis</h2>
            </div>
            <span className="text-xs text-stone-500">
              Evaluated from field report on <strong className="text-stone-800">{recentObservation.ecosystemName}</strong>
            </span>
          </div>

          <SafeAI insight={recentObservation.aiAnalysis} />
        </div>
      )}
    </div>
  );
};
