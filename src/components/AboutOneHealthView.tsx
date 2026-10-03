import React from 'react';
import { 
  HeartHandshake, 
  Droplet, 
  Bug, 
  Activity, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Globe, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AboutOneHealthView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-3xl p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              IEEE OneAquaHealth 2026 Framework
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
              Tripartite Paradigm
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            The One Health Philosophy in Urban Aquatic Ecosystems
          </h1>
          <p className="text-sm text-stone-600 mt-3 max-w-3xl leading-relaxed">
            One Health is an integrated, unifying approach that aims to sustainably balance and optimize the health of people, animals, and ecosystems. In urban environments, freshwater bodies are not merely decorative or hydrological drains—they are living bio-barometers connecting stormwater contamination, wildlife vectors, and municipal well-being.
          </p>
        </div>
      </div>

      {/* The 3 Pillars of One Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs relative">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center mb-4">
            <Droplet className="w-6 h-6 text-teal-700" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-2">1. Environmental Health</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Catchment integrity, stormwater dilution capacity, submerged macrophyte photosynthesis, and thermal buffer dynamics. Healthy water absorbs urban heat islands and filters non-point pollutants.
          </p>
          <div className="mt-4 pt-3 border-t border-[#E3DCCF] text-[11px] text-teal-800 font-mono font-semibold">
            Key Metric: Eutrophication Index
          </div>
        </div>

        <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs relative">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mb-4">
            <Bug className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-2">2. Animal &amp; Vector Ecology</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Natural predators like odonates (dragonflies) and amphibians control mosquito larvae. Degradation eliminates sensitive bio-indicators, creating unchecked breeding zones for disease vectors.
          </p>
          <div className="mt-4 pt-3 border-t border-[#E3DCCF] text-[11px] text-emerald-800 font-mono font-semibold">
            Key Metric: Biological Proxy Balance
          </div>
        </div>

        <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs relative">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-indigo-700" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-2">3. Human Community Well-Being</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Safe recreation, protection of pets from toxic cyanobacterial microcystins, and psychological benefits of urban blue spaces. Early warning prevents zoonotic spillover.
          </p>
          <div className="mt-4 pt-3 border-t border-[#E3DCCF] text-[11px] text-indigo-800 font-mono font-semibold">
            Key Metric: Community Exposure Risk
          </div>
        </div>
      </div>

      {/* Scientific Code of Ethics & AI Safety */}
      <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="text-lg font-bold text-stone-900">Scientific Safety &amp; Evidence-First Principles</h3>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          OneAquaAI operates under rigorous scientific validation rules established for the IEEE OneAquaHealth Hackathon 2026:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#F4EFE6] p-4 rounded-xl border border-[#DED6C7]">
            <div className="flex items-center gap-2 text-teal-900 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Evidence-First Observational Proxies</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              We rely strictly on multi-parameter citizen sensory indicators (optical turbidity, surface scums, macroinvertebrate presence) and refuse to fabricate pseudo-chemical figures (such as stating exact ppm or pH values from smartphone photos).
            </p>
          </div>

          <div className="bg-[#F4EFE6] p-4 rounded-xl border border-[#DED6C7]">
            <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Zero Medical Diagnostic Overreach</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              AI outputs offer environmental and ecological advisories, avoiding clinical diagnoses of human illness. All insights employ probabilistic, scientific terminology like "potential signal" or "emerging indicator."
            </p>
          </div>
        </div>
      </div>

      {/* Hackathon Attribution Banner */}
      <div className="bg-[#F4EFE6] p-6 rounded-2xl border border-[#DED6C7] flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div>
          <span className="font-bold text-stone-900 block">IEEE OneAquaHealth Hackathon 2026 Edition</span>
          <span className="text-stone-500">
            Engineered with React, TypeScript, Tailwind CSS, Firebase Firestore (Offline Persistent Cache), and Gemini AI Logic.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 font-semibold">
          <Award className="w-4 h-4 text-teal-700" />
          <span>Validated for Resilient Field Deployment</span>
        </div>
      </div>
    </div>
  );
};
