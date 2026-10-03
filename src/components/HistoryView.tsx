import React, { useState } from 'react';
import { 
  History, 
  MapPin, 
  Calendar, 
  Eye, 
  Sparkles, 
  Search, 
  Filter, 
  ShieldCheck, 
  Camera, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { ObservationSubmission } from '../types';
import { SafeAI } from './SafeAI';

interface HistoryViewProps {
  observations: ObservationSubmission[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ observations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObs, setSelectedObs] = useState<ObservationSubmission | null>(null);

  const filtered = observations.filter(obs => {
    const text = (obs.ecosystemName + ' ' + obs.notes + ' ' + (obs.observerName || '')).toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Auditable Ledger
              </span>
              <span className="text-xs text-stone-500 font-mono">Synced with Local Offline Cache &amp; Firestore</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Observation History</h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
              Permanent citizen monitoring trail documenting sensory proxies, geotag confidence, and AI environmental risk evaluations.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports, observer, notes..."
              className="w-full bg-[#F4EFE6] border border-[#DED6C7] rounded-xl pl-9 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-600 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Observation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((obs) => (
          <div
            key={obs.id}
            className="bg-[#FAF7F2] border border-[#DFD7C7] hover:border-[#cbbfab] rounded-2xl overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between transition"
          >
            {/* Image Preview if available */}
            {obs.imageUrl ? (
              <div className="h-40 overflow-hidden relative bg-[#EFEAE0]">
                <img
                  src={obs.imageUrl}
                  alt={obs.ecosystemName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#D8D0C0] text-[10px] font-mono text-teal-900 font-bold shadow-xs">
                  {obs.confidenceScore}% Evidence
                </div>
              </div>
            ) : (
              <div className="h-20 bg-[#F4EFE6] p-4 border-b border-[#E3DCCF] flex items-center justify-between">
                <span className="text-xs text-stone-500 italic">No photo attached</span>
                <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D8D0C0] text-[10px] font-mono text-teal-900 font-bold">
                  {obs.confidenceScore}% Evidence
                </span>
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>{new Date(obs.timestamp).toLocaleDateString()}</span>
                  <span className="font-mono text-[11px] text-stone-500">
                    {new Date(obs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 line-clamp-1">{obs.ecosystemName}</h3>
                <p className="text-xs text-stone-500 mt-0.5">By {obs.observerName || 'Citizen Contributor'}</p>

                <p className="text-xs text-stone-600 mt-2 line-clamp-3 italic">
                  "{obs.notes || 'Routine field check; parameters logged according to One Health matrix.'}"
                </p>
              </div>

              {/* Parameters mini tag cluster */}
              <div className="bg-[#F4EFE6] p-2.5 rounded-xl border border-[#DED6C7] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="text-stone-500">Appearance:</span>
                  <span className="font-semibold text-stone-900">{obs.waterAppearance}</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span className="text-stone-500">Odour:</span>
                  <span className="font-semibold text-stone-900">{obs.odour}</span>
                </div>
                {obs.lat && (
                  <div className="flex items-center justify-between text-stone-700 font-mono text-[10px]">
                    <span className="text-stone-500">Coordinates:</span>
                    <span className="font-medium text-stone-800">{obs.lat.toFixed(4)}, {obs.lng?.toFixed(4)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#E3DCCF] flex items-center justify-between">
                <span className="text-[10px] text-stone-500 font-medium">
                  {obs.aiAnalysis ? 'AI Synthesized' : 'Raw Record'}
                </span>
                {obs.aiAnalysis && (
                  <button
                    onClick={() => setSelectedObs(obs)}
                    className="flex items-center gap-1 text-teal-700 hover:text-teal-900 text-xs font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View AI Brief</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Full AI Inspection */}
      {selectedObs && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedObs(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#EFEAE0] text-stone-500 hover:text-stone-900 border border-[#D5CDBC] cursor-pointer"
            >
              ✕
            </button>
            <div className="mb-4">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                Archived Observation
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-1">{selectedObs.ecosystemName}</h3>
              <p className="text-xs text-stone-500">
                Submitted on {new Date(selectedObs.timestamp).toLocaleString()} • Observer: {selectedObs.observerName}
              </p>
            </div>

            {selectedObs.aiAnalysis && (
              <SafeAI insight={selectedObs.aiAnalysis} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
