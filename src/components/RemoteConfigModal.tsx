import React, { useState } from 'react';
import { 
  Sliders, 
  Map, 
  BarChart3, 
  Sparkles, 
  BellRing, 
  RotateCcw, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  X,
  AlertTriangle
} from 'lucide-react';
import { useRemoteConfig } from '../services/remoteConfig';

interface RemoteConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RemoteConfigModal: React.FC<RemoteConfigModalProps> = ({ isOpen, onClose }) => {
  const { config, updateConfigKey, resetConfig } = useRemoteConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] border border-[#D8D0C0] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#EFEAE0] text-stone-500 hover:text-stone-900 border border-[#D8D0C0] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">Firebase Remote Config Simulator</h3>
            <p className="text-xs text-stone-500">
              Dynamically switch global fallback states &amp; operational modes in real-time.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3.5">
          {/* SafeMap Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4EFE6] border border-[#DED6C7]">
            <div className="flex items-center gap-3">
              <Map className="w-4 h-4 text-teal-700" />
              <div>
                <span className="text-xs font-semibold text-stone-900 block">Force &lt;SafeMap /&gt; HTML Fallback</span>
                <span className="text-[11px] text-stone-600">
                  Instantly toggles all map visualizers to accessible HTML list view.
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.forceSafeMapFallback}
                onChange={(e) => updateConfigKey('forceSafeMapFallback', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
            </label>
          </div>

          {/* SafeChart Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4EFE6] border border-[#DED6C7]">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-xs font-semibold text-stone-900 block">Force &lt;SafeChart /&gt; Table Fallback</span>
                <span className="text-[11px] text-stone-600">
                  Switches visual chart components to high-readability HTML tables.
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.forceSafeChartFallback}
                onChange={(e) => updateConfigKey('forceSafeChartFallback', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {/* SafeAI Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4EFE6] border border-[#DED6C7]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <div>
                <span className="text-xs font-semibold text-stone-900 block">Force Deterministic SafeAI Fallback</span>
                <span className="text-[11px] text-stone-600">
                  Bypasses external LLM API calls and uses local rule-based matrix.
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.forceDeterministicAI}
                onChange={(e) => updateConfigKey('forceDeterministicAI', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-700"></div>
            </label>
          </div>

          {/* Emergency Alert Banner Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4EFE6] border border-[#DED6C7]">
            <div className="flex items-center gap-3">
              <BellRing className="w-4 h-4 text-rose-700" />
              <div>
                <span className="text-xs font-semibold text-stone-900 block">Top Emergency Surveillance Banner</span>
                <span className="text-[11px] text-stone-600">
                  Broadcasts urgent citywide hydrological status bar across all screens.
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.emergencyAlertBanner}
                onChange={(e) => updateConfigKey('emergencyAlertBanner', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-700"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#E3DCCF] flex items-center justify-between">
          <button
            onClick={resetConfig}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
          >
            Apply &amp; Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
