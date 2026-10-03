import React, { useState } from 'react';
import { 
  HeartPulse, 
  Droplets, 
  Bug, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { UrbanEcosystem } from '../types';

interface EcosystemHealthViewProps {
  ecosystems: UrbanEcosystem[];
  onSelectEcosystem: (eco: UrbanEcosystem) => void;
  onNavigateTab: (tab: string) => void;
}

export const EcosystemHealthView: React.FC<EcosystemHealthViewProps> = ({
  ecosystems,
  onSelectEcosystem,
  onNavigateTab
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = ecosystems.filter(eco => {
    if (filterType !== 'all' && eco.type !== filterType) return false;
    if (filterStatus !== 'all' && eco.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Optimal': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Caution': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Degraded': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-[#EFEAE0] text-stone-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Ecosystem Health Registry
              </span>
              <span className="text-xs text-stone-500 font-mono">5 Urban Basins Profiled</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Urban Aquatic Catchment Health</h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
              Evaluating biodiversity presence, urban stressors, and organic odour indicators to map hydrological vulnerability across metropolitan zones.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#FAF7F2] border border-[#D8D0C0] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-teal-600 cursor-pointer shadow-xs"
            >
              <option value="all">All Aquatic Types</option>
              <option value="Lake">Lakes</option>
              <option value="Canal">Canals</option>
              <option value="River">Rivers &amp; Creeks</option>
              <option value="Urban Wetland">Constructed Wetlands</option>
              <option value="Retention Basin">Retention Basins</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#FAF7F2] border border-[#D8D0C0] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-teal-600 cursor-pointer shadow-xs"
            >
              <option value="all">All Health Tiers</option>
              <option value="Optimal">Optimal (80+)</option>
              <option value="Caution">Caution (60-79)</option>
              <option value="Degraded">Degraded (40-59)</option>
              <option value="Critical">Critical (&lt;40)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Ecosystem Deep Dives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((eco) => (
          <div
            key={eco.id}
            className="bg-[#FAF7F2] border border-[#DFD7C7] hover:border-[#cbbfab] rounded-2xl overflow-hidden shadow-xs hover:shadow-md flex flex-col transition duration-300 group"
          >
            {/* Header Image */}
            <div className="relative h-44 overflow-hidden bg-[#EFEAE0]">
              <img
                src={eco.imageUrl}
                alt={eco.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-xs text-teal-900 border border-[#D8D0C0] font-semibold">
                  {eco.type}
                </span>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border backdrop-blur-xs ${getStatusBadge(eco.status)}`}>
                  {eco.status}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 bg-[#FAF7F2]/95 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#D8D0C0] text-xs font-mono font-bold text-stone-900 flex items-center gap-1.5 shadow-xs">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                <span>{eco.overallHealthScore}/100</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-teal-700 transition">
                  {eco.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  <span>{eco.location.district}</span>
                </p>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {eco.description}
                </p>
              </div>

              {/* Biological Indicators List */}
              <div className="bg-[#F4EFE6] p-3 rounded-xl border border-[#DED6C7] space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-stone-600 block mb-1 font-semibold">
                    Observed Bio-Indicators:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {eco.observedBiodiversity.map((bio, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] text-stone-800 border border-[#DED6C7]"
                      >
                        {bio}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DFD7C7]">
                  <span className="text-[10px] uppercase font-mono text-stone-600 block mb-1 font-semibold">
                    Dominant Stressors:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {eco.primaryStressors.map((stressor, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200"
                      >
                        {stressor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-2 border-t border-[#E3DCCF] flex items-center justify-between text-xs">
                <span className="text-stone-500 text-[11px]">
                  {eco.communityReportsCount} verified citizen records
                </span>
                <button
                  onClick={() => {
                    onSelectEcosystem(eco);
                    onNavigateTab('map');
                  }}
                  className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                >
                  <span>Locate on Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
