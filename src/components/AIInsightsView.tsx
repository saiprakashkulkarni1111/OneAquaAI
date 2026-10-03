import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  ShieldCheck, 
  Droplet,
  Layers,
  Filter
} from 'lucide-react';
import { ObservationSubmission, UrbanEcosystem } from '../types';
import { SafeAI } from './SafeAI';
import { analyzeWaterObservationWithGemini } from '../services/aiService';
import { useRemoteConfig } from '../services/remoteConfig';

interface AIInsightsViewProps {
  observations: ObservationSubmission[];
  ecosystems: UrbanEcosystem[];
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  observations,
  ecosystems
}) => {
  const { config } = useRemoteConfig();
  const [selectedObsId, setSelectedObsId] = useState<string>(observations[0]?.id || '');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dynamicInsight, setDynamicInsight] = useState(observations[0]?.aiAnalysis || null);

  const currentObs = observations.find(o => o.id === selectedObsId) || observations[0];

  const handleRefresh = async () => {
    if (!currentObs) return;
    setIsRefreshing(true);
    const result = await analyzeWaterObservationWithGemini(currentObs, config.forceDeterministicAI);
    setDynamicInsight(result);
    setIsRefreshing(false);
  };

  const handleSelectObs = (obs: ObservationSubmission) => {
    setSelectedObsId(obs.id || '');
    setDynamicInsight(obs.aiAnalysis || null);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Scientific Inference Engine
              </span>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                SafeAI Fallback Guaranteed
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">One Health Environmental AI Intelligence</h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Synthesizing multi-modal citizen field indicators (water clarity, perceived odour, floating vegetation, aquatic macroinvertebrates, and urban run-off stressors) into non-medical One Health risk vectors.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#EFEAE0] p-2 rounded-xl border border-[#D8D0C0] text-xs">
            <Cpu className="w-4 h-4 text-teal-700" />
            <span className="text-stone-600">Active Pipeline:</span>
            <span className="font-mono font-semibold text-teal-800">
              {config.forceDeterministicAI ? 'Offline Deterministic Matrix' : 'Gemini 2.5 Flash'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Observation Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-stone-800">Select Field Report to Inspect</h3>
            <span className="text-xs text-stone-500 font-mono">{observations.length} reports</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {observations.map((obs) => {
              const isSelected = obs.id === (currentObs?.id || selectedObsId);
              return (
                <div
                  key={obs.id}
                  onClick={() => handleSelectObs(obs)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#FAF7F2] border-teal-600 shadow-md ring-2 ring-teal-600/30'
                      : 'bg-[#FAF7F2] border-[#DFD7C7] hover:border-[#cbbfab] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{obs.ecosystemName}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{obs.observerName}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFEAE0] text-teal-900 border border-[#D8D0C0] font-semibold">
                      {obs.confidenceScore}% Conf
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-stone-600 line-clamp-2">
                    "{obs.notes || 'No extended notes'}"
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-stone-500 font-mono border-t border-[#E3DCCF] pt-2">
                    <span>{obs.waterAppearance}</span>
                    <span>{new Date(obs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active AI Insight Display */}
        <div className="lg:col-span-8 space-y-4">
          {currentObs && (
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DFD7C7] flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Current Subject:</span>
                <span className="font-bold text-stone-900">{currentObs.ecosystemName}</span>
                <span className="text-stone-500 font-mono">[{currentObs.lat?.toFixed(3)}, {currentObs.lng?.toFixed(3)}]</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Appearance:</span>
                <span className="text-stone-800 font-medium">{currentObs.waterAppearance}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500">Odour:</span>
                <span className="text-stone-800 font-medium">{currentObs.odour}</span>
              </div>
            </div>
          )}

          {dynamicInsight ? (
            <SafeAI
              insight={dynamicInsight}
              isLoading={isRefreshing}
              onRefresh={handleRefresh}
            />
          ) : (
            <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-12 text-center shadow-xs">
              <Sparkles className="w-8 h-8 text-teal-700 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-stone-900">No Analysis Cached Yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Trigger the SafeAI engine to synthesize this observation’s ecological and public health signals.
              </p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition cursor-pointer shadow-xs"
              >
                Synthesize Analysis Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
