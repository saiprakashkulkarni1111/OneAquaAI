import React from 'react';
import { AIOneHealthInsight } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Bug, 
  HeartPulse, 
  CheckCircle, 
  Cpu, 
  RefreshCw 
} from 'lucide-react';

interface SafeAIProps {
  insight: AIOneHealthInsight;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const SafeAI: React.FC<SafeAIProps> = ({ insight, onRefresh, isLoading = false }) => {
  const isFallback = insight.isDeterministicFallback || insight.status === 'fallback';

  return (
    <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs relative overflow-hidden">
      {/* Background ambient glow */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
        isFallback ? 'bg-amber-300' : 'bg-teal-300'
      }`} />

      {/* Engine Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E3DCCF]">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isFallback 
              ? 'bg-amber-50 text-amber-800 border-amber-200' 
              : 'bg-gradient-to-br from-teal-600 to-cyan-700 text-white border-teal-500 shadow-xs'
          }`}>
            {isFallback ? <Cpu className="w-5 h-5 text-amber-700" /> : <Sparkles className="w-5 h-5 text-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-900">One Health Intelligence Matrix</h3>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                isFallback 
                  ? 'bg-amber-50 text-amber-900 border-amber-300' 
                  : 'bg-teal-50 text-teal-900 border-teal-300'
              }`}>
                {isFallback ? 'SafeAI Deterministic Fallback' : 'Gemini 2.5 Flash One Health'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              IEEE OneAquaHealth Ecological & Vector Assessment Guidelines
            </p>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#EFEAE0] hover:bg-[#E5DFD3] text-stone-700 border border-[#D5CDBC] transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Analyze</span>
          </button>
        )}
      </div>

      {/* Safety Notice regarding Probabilistic Language */}
      <div className="mb-5 bg-[#F4EFE6] border border-[#DED6C7] rounded-xl p-3 text-xs text-stone-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-900">Scientific Safety Protocol:</strong> Analysis provides <em>emerging signals</em> and <em>provisional proxies</em> based on observed morphological and ecological parameters. It does not fabricate laboratory chemical concentrations (e.g. pH) or diagnose medical conditions.
        </p>
      </div>

      {/* Grid of Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Physical & Ecological Signal */}
        <div className="bg-[#F4EFE6] border border-[#DED6C7] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-2">
            <HeartPulse className="w-4 h-4 text-teal-700" />
            <span>Ecological & Macrophyte Proxy</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {insight.ecologicalSignal}
          </p>
          <div className="mt-3 pt-2.5 border-t border-[#DFD7C7] text-[11px] text-stone-600">
            <span className="text-stone-500 font-medium">Visual Signal: </span>{insight.visualSignalSummary}
          </div>
        </div>

        {/* Zoonotic Vector Signal */}
        <div className="bg-[#F4EFE6] border border-[#DED6C7] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
            <Bug className="w-4 h-4 text-amber-700" />
            <span>Standing Vector Breeding Signal</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {insight.zoonoticVectorSignal}
          </p>
          <div className="mt-3 pt-2.5 border-t border-[#DFD7C7] text-[11px] text-stone-600">
            <span className="text-stone-500 font-medium">Vector Risk: </span>Evaluated against surface stagnation and biological predation proxies.
          </div>
        </div>

        {/* Public Health Non-Medical Caution */}
        <div className="bg-[#F4EFE6] border border-[#DED6C7] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2">
            <AlertTriangle className="w-4 h-4 text-emerald-700" />
            <span>Public Health Precaution</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {insight.publicHealthCaution}
          </p>
          <div className="mt-3 pt-2.5 border-t border-[#DFD7C7] text-[11px] text-stone-600">
            <span className="text-stone-500 font-medium">Target Group: </span>Citizens, dog walkers, and urban park users.
          </div>
        </div>
      </div>

      {/* Recommended Citizen Actions */}
      <div className="mt-5 bg-[#F4EFE6] p-4 rounded-xl border border-[#DED6C7]">
        <h4 className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          Recommended Community Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {insight.recommendedCitizenAction.map((action, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-[#FAF7F2] p-2 rounded-lg border border-[#DED6C7]">
              <span className="text-teal-800 font-mono text-[10px] mt-0.5 font-bold">#{idx + 1}</span>
              <span className="text-stone-800">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence assessment footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-3 border-t border-[#DFD7C7]">
        <span>Confidence Proxy: <strong className="text-stone-800">{insight.confidenceAssessment}</strong></span>
        <span>Evaluated: {new Date(insight.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
