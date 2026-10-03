import React, { useState } from 'react';
import { UrbanEcosystem } from '../types';
import { 
  MapPin, 
  Layers, 
  Maximize2, 
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Droplet, 
  ArrowUpRight,
  List,
  Map as MapIcon,
  ShieldAlert
} from 'lucide-react';

interface SafeMapProps {
  ecosystems: UrbanEcosystem[];
  selectedEcosystem: UrbanEcosystem | null;
  onSelectEcosystem: (eco: UrbanEcosystem) => void;
  forceFallback?: boolean;
}

export const SafeMap: React.FC<SafeMapProps> = ({
  ecosystems,
  selectedEcosystem,
  onSelectEcosystem,
  forceFallback = false
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>(forceFallback ? 'list' : 'map');
  const [activeLayer, setActiveLayer] = useState<'health' | 'risk' | 'stressors'>('health');
  const [simulatedLoadError, setSimulatedLoadError] = useState(false);
  const [mapScale, setMapScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // If forceFallback changed from remote config
  const effectiveViewMode = forceFallback || simulatedLoadError ? 'list' : viewMode;

  const handleZoomIn = () => setMapScale(prev => Math.min(1.8, Number((prev + 0.15).toFixed(2))));
  const handleZoomOut = () => setMapScale(prev => Math.max(0.75, Number((prev - 0.15).toFixed(2))));
  const handleResetZoom = () => setMapScale(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal': return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20';
      case 'Caution': return 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20';
      case 'Degraded': return 'bg-orange-500 text-white border-orange-600 shadow-orange-500/20';
      case 'Critical': return 'bg-rose-500 text-white border-rose-600 shadow-rose-500/20';
      default: return 'bg-cyan-500 text-white border-cyan-600';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Moderate': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Elevated': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'High Vigilance': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-[#EFEAE0] text-stone-700 border-[#D8D0C0]';
    }
  };

  return (
    <div className={`bg-[#fffdfa] border border-[#ded5c5] shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 h-screen w-screen rounded-none' 
        : 'min-h-[440px] h-[55vh] sm:h-[60vh] max-h-[740px] rounded-2xl'
    }`}>
      {/* Top Map Toolbar */}
      <div className="bg-[#faf6ee]/95 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[#ded5c5] flex flex-wrap items-center justify-between gap-3 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-teal-700" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2">
              Urban Hydrology Spatial Explorer
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Scalable Grid
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-stone-500">
              5 Connected Catchment Basins • Real-time Citizen Feeds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Spatial Zoom Stepper (when in map mode) */}
          {effectiveViewMode === 'map' && (
            <div className="flex items-center bg-[#fffdfa] p-1 rounded-lg border border-[#ded5c5] text-xs">
              <button
                onClick={handleZoomOut}
                disabled={mapScale <= 0.75}
                className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 rounded hover:bg-[#ede5d6] transition cursor-pointer"
                title="Zoom Out Map View"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-teal-800 hover:underline cursor-pointer"
                title="Reset Zoom"
              >
                {Math.round(mapScale * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={mapScale >= 1.8}
                className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 rounded hover:bg-[#ede5d6] transition cursor-pointer"
                title="Zoom In Map View"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
              isFullscreen 
                ? 'bg-teal-50 text-teal-800 border-teal-300' 
                : 'bg-[#fffdfa] text-stone-600 border-[#ded5c5] hover:bg-[#ede5d6]'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Layer switcher */}
          <div className="hidden md:flex items-center bg-[#ede5d6] p-1 rounded-lg border border-[#ded5c5] text-xs">
            <button
              onClick={() => setActiveLayer('health')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                activeLayer === 'health' ? 'bg-[#fffdfa] text-teal-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Health Score
            </button>
            <button
              onClick={() => setActiveLayer('risk')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                activeLayer === 'risk' ? 'bg-[#fffdfa] text-amber-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              One Health Risk
            </button>
            <button
              onClick={() => setActiveLayer('stressors')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                activeLayer === 'stressors' ? 'bg-[#fffdfa] text-cyan-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Urban Stressors
            </button>
          </div>

          {/* Toggle between Interactive Canvas Map & Elegant HTML List Fallback */}
          <div className="flex items-center bg-[#ede5d6] p-1 rounded-lg border border-[#ded5c5] text-xs">
            <button
              onClick={() => {
                setSimulatedLoadError(false);
                setViewMode('map');
              }}
              disabled={forceFallback}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded font-medium transition cursor-pointer ${
                effectiveViewMode === 'map'
                  ? 'bg-[#fffdfa] text-teal-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              } ${forceFallback ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={forceFallback ? 'Disabled by Remote Config Fallback' : 'Interactive Map View'}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map View</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded font-medium transition cursor-pointer ${
                effectiveViewMode === 'list'
                  ? 'bg-[#fffdfa] text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Safe Accessible Fallback List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Safe List View</span>
              {(forceFallback || simulatedLoadError) && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Map or Fallback Body */}
      <div className="relative flex-1 bg-[#ede6d8] overflow-hidden">
        {effectiveViewMode === 'map' ? (
          <div className="relative w-full h-full select-none overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f6f0e4] via-[#ede5d5] to-[#e4dbc8]">
            {/* Scalable Canvas Layer */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-auto"
              style={{
                transform: `scale(${mapScale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.25s ease-out'
              }}
            >
              {/* SVG Cartographic Vector Canvas with Urban Waterways & Topography */}
              <svg
                className="w-full h-full absolute inset-0 opacity-80"
                viewBox="0 0 1000 600"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ddd3bf" strokeWidth="0.8" />
                  </pattern>
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Urban Contour Outlines */}
                <path
                  d="M 50,300 Q 200,150 450,220 T 800,140 Q 950,200 980,350"
                  fill="none"
                  stroke="#c5baa5"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 100,500 Q 350,420 550,510 T 920,440"
                  fill="none"
                  stroke="#c5baa5"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Primary Urban River & Canal Corridors */}
                <path
                  d="M 120,40 C 260,110 320,220 480,260 C 640,300 720,420 890,560"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                />
                {/* Secondary drainage canal */}
                <path
                  d="M 480,260 C 440,360 300,410 180,470"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="8 3"
                />
                {/* Wetland Lagoon outline */}
                <ellipse
                  cx="260"
                  cy="200"
                  rx="110"
                  ry="70"
                  fill="#0ea5e9"
                  fillOpacity="0.2"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                {/* Detention Basin outline */}
                <rect
                  x="680"
                  y="180"
                  width="140"
                  height="90"
                  rx="20"
                  fill="#0d9488"
                  fillOpacity="0.2"
                  stroke="#0f766e"
                  strokeWidth="2"
                />
              </svg>

              {/* Simulated Ecosystem Markers with Coordinates */}
              {ecosystems.map((eco, index) => {
                const isSelected = selectedEcosystem?.id === eco.id;
                // Map simulated positions based on index
                const positions = [
                  { top: '32%', left: '26%' }, // Greenfield Lake
                  { top: '44%', left: '48%' }, // North Canal
                  { top: '18%', left: '16%' }, // Silver Creek
                  { top: '35%', left: '74%' }, // Harbor Gateway
                  { top: '72%', left: '38%' }  // South Delta
                ];
                const pos = positions[index % positions.length];

                return (
                  <div
                    key={eco.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20"
                    onClick={() => onSelectEcosystem(eco)}
                  >
                    {/* Ping Animation */}
                    {eco.status === 'Critical' || eco.status === 'Degraded' ? (
                      <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping"></span>
                    ) : null}

                    {/* Marker Node */}
                    <div
                      className={`relative flex items-center justify-center p-2 rounded-2xl border-2 transition-transform duration-300 shadow-md ${
                        isSelected
                          ? 'ring-4 ring-teal-500 scale-125 ' + getStatusColor(eco.status)
                          : 'hover:scale-110 ' + getStatusColor(eco.status)
                      }`}
                    >
                      <Droplet className="w-5 h-5 text-white" />
                      <span className="absolute -bottom-1 -right-1 font-mono text-[9px] font-bold bg-[#fffdfa] px-1 py-0.2 rounded border border-[#ded5c5] text-stone-900 shadow-xs">
                        {eco.overallHealthScore}
                      </span>
                    </div>

                    {/* Hover Floating Pill */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-[#fffdfa]/95 backdrop-blur-md p-2.5 rounded-xl border border-[#ded5c5] text-left shadow-lg z-30">
                      <p className="text-xs font-semibold text-stone-900 truncate">{eco.name}</p>
                      <div className="flex items-center justify-between text-[11px] mt-1 text-stone-600">
                        <span>Status: <b className="text-stone-900">{eco.status}</b></span>
                        <span>Score: <b className="text-teal-800">{eco.overallHealthScore}%</b></span>
                      </div>
                      <div className="mt-1 text-[10px] text-stone-500 font-mono">
                        {eco.location.district}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Map Legend & Inspector */}
            <div className="absolute bottom-4 left-4 bg-[#fffdfa]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#ded5c5] text-xs shadow-md max-w-xs z-20 hidden md:block">
              <div className="font-semibold text-stone-900 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-800">
                  <Layers className="w-3.5 h-3.5 text-teal-700" />
                  Eco-Health Index Map Legend
                </span>
                <span className="text-[10px] text-stone-400 font-mono">SafeMap v2.6</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
                  <span className="text-stone-700">Optimal (80-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs"></span>
                  <span className="text-stone-700">Caution (60-79)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-xs"></span>
                  <span className="text-stone-700">Degraded (40-59)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs"></span>
                  <span className="text-stone-700">Critical (&lt;40)</span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#ece4d6] flex items-center justify-between text-[10px] text-stone-500">
                <span>Click any marker to inspect</span>
                <button
                  onClick={() => setSimulatedLoadError(true)}
                  className="text-teal-700 hover:underline cursor-pointer font-medium"
                >
                  Test Fallback View
                </button>
              </div>
            </div>

            {/* Selected Ecosystem Quick Peek */}
            {selectedEcosystem && (
              <div className="absolute top-4 right-4 bg-[#fffdfa]/95 backdrop-blur-md p-4 rounded-xl border border-teal-600/30 text-xs shadow-lg max-w-sm z-20 animate-in fade-in slide-in-from-right-2 duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {selectedEcosystem.type}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 mt-1.5">{selectedEcosystem.name}</h4>
                    <p className="text-stone-500 text-[11px] mt-0.5">{selectedEcosystem.location.district}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(selectedEcosystem.status)}`}>
                    {selectedEcosystem.overallHealthScore}/100
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-[#faf6ee] p-2.5 rounded-lg border border-[#ece4d6]">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Appearance</span>
                    <span className="text-stone-800 font-medium">{selectedEcosystem.waterAppearance}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Odour Index</span>
                    <span className="text-stone-800 font-medium">{selectedEcosystem.odourIndex}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">One Health Risk</span>
                    <span className={`inline-block px-1.5 py-0.5 mt-0.5 rounded text-[10px] font-medium border ${getRiskBadge(selectedEcosystem.oneHealthRiskLevel)}`}>
                      {selectedEcosystem.oneHealthRiskLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Field Reports</span>
                    <span className="text-emerald-700 font-medium">{selectedEcosystem.communityReportsCount} verified</span>
                  </div>
                </div>

                <p className="text-stone-600 text-[11px] mt-2 line-clamp-2 leading-relaxed">
                  {selectedEcosystem.description}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* SAFE MAP FALLBACK: Clean, High-Contrast Accessible HTML List View */
          <div className="w-full h-full overflow-y-auto p-6 bg-[#f7f4ee]">
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  SafeMap HTML Fallback Activated
                </h4>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  Rendering structured tabular view to ensure zero-crash resilience against tile outages, canvas failures, or restricted bandwidth.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ecosystems.map((eco) => {
                const isSelected = selectedEcosystem?.id === eco.id;
                return (
                  <div
                    key={eco.id}
                    onClick={() => onSelectEcosystem(eco)}
                    className={`cursor-pointer p-4 rounded-xl border transition duration-200 ${
                      isSelected
                        ? 'bg-[#fffdfa] border-teal-600 ring-2 ring-teal-600/30 shadow-md'
                        : 'bg-[#fffdfa] border-[#ded5c5] hover:border-[#cbbfab] hover:bg-[#faf6ee]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                          {eco.type}
                        </span>
                        <h4 className="text-base font-semibold text-stone-900 mt-1">{eco.name}</h4>
                        <p className="text-xs text-stone-500">{eco.location.district} • GPS [{eco.location.lat.toFixed(4)}, {eco.location.lng.toFixed(4)}]</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(eco.status)}`}>
                        {eco.overallHealthScore}/100
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-[#faf6ee] p-2.5 rounded-lg border border-[#ece4d6]">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Water Visuals:</span>
                        <span className="text-stone-800 font-medium">{eco.waterAppearance}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">Odour:</span>
                        <span className="text-stone-800 font-medium">{eco.odourIndex}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">One Health Risk:</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] border ${getRiskBadge(eco.oneHealthRiskLevel)}`}>
                          {eco.oneHealthRiskLevel}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">Status:</span>
                        <span className="text-stone-800 font-medium">{eco.status} ({eco.trend})</span>
                      </div>
                    </div>

                    <div className="mt-2.5 text-xs text-stone-600">
                      <span className="text-stone-900 font-medium">Stressor Indicators:</span> {eco.primaryStressors.join(' • ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
