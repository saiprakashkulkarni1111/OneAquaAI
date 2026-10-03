import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  UploadCloud, 
  Check, 
  AlertCircle, 
  HelpCircle,
  Eye,
  Wind,
  Layers,
  Bug,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { UrbanEcosystem, ObservationSubmission, AIOneHealthInsight } from '../types';
import { calculateConfidenceScore } from '../services/confidenceScore';
import { analyzeWaterObservationWithGemini } from '../services/aiService';
import { saveObservation } from '../services/dataService';
import { useRemoteConfig } from '../services/remoteConfig';

interface ObservationFormProps {
  ecosystems: UrbanEcosystem[];
  onSubmissionSuccess: (newObs: ObservationSubmission) => void;
}

const APPEARANCE_OPTIONS: ObservationSubmission['waterAppearance'][] = [
  'Crystal clear',
  'Natural green/tan',
  'Turbid/Muddy',
  'Heavy algae scum',
  'Oily sheen',
  'Foamy/Discolored'
];

const ODOUR_OPTIONS: ObservationSubmission['odour'][] = [
  'No detectable odour',
  'Pleasant/Fresh vegetation',
  'Musty/Stagnant',
  'Fishy/Decaying matter',
  'Chemical or sulfur-like'
];

const SURFACE_OPTIONS = [
  'Clear surface',
  'Floating leaf litter',
  'Algal mats/scum',
  'Duckweed/Water hyacinth',
  'Plastic & urban debris',
  'Oily rainbow film',
  'White froth/foam'
];

const BIODIVERSITY_OPTIONS = [
  'Dragonflies/Mayflies (sensitive species)',
  'Water striders & beetles',
  'Tadpoles/Frogs/Amphibians',
  'Waterfowl nesting/feeding',
  'Fish surfaced/gasping at air',
  'Dead fauna/fish spotted',
  'Mosquito larvae clusters in calm pool'
];

const DISTURBANCE_OPTIONS = [
  'Stormwater drain discharge',
  'Construction site silt wash',
  'Pet walking & unbagged waste',
  'Lawn fertilizer runoff zone',
  'Direct littering/Dumping',
  'Heavy vehicle road proximity',
  'Active recreational fishing'
];

export const ObservationForm: React.FC<ObservationFormProps> = ({
  ecosystems,
  onSubmissionSuccess
}) => {
  const { config } = useRemoteConfig();

  const [ecosystemId, setEcosystemId] = useState<string>(ecosystems[0]?.id || '');
  const [observerName, setObserverName] = useState<string>('Elena Rostova (Citizen Scientist)');
  const [waterAppearance, setWaterAppearance] = useState<ObservationSubmission['waterAppearance']>('Natural green/tan');
  const [odour, setOdour] = useState<ObservationSubmission['odour']>('No detectable odour');
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>(['Floating leaf litter']);
  const [selectedBiodiversity, setSelectedBiodiversity] = useState<string[]>(['Dragonflies/Mayflies (sensitive species)']);
  const [selectedDisturbances, setSelectedDisturbances] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  // GPS state
  const [lat, setLat] = useState<number | null>(ecosystems[0]?.location.lat || 37.7749);
  const [lng, setLng] = useState<number | null>(ecosystems[0]?.location.lng || -122.4194);
  const [accuracy, setAccuracy] = useState<number | null>(8);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Coordinates calibrated to target water basin.');

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  );

  // Submitting & AI analysis states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [aiPreview, setAiPreview] = useState<AIOneHealthInsight | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Recalculate Live Confidence Score
  const currentConfidence = calculateConfidenceScore({
    lat,
    lng,
    hasImage: !!imagePreview,
    notes,
    surfaceCount: selectedSurfaces.length,
    biodiversityCount: selectedBiodiversity.length,
    disturbanceCount: selectedDisturbances.length
  });

  // Handle GPS location fetch
  const handleGetCoordinates = () => {
    setIsLocating(true);
    setLocationStatus('Querying browser Geolocation API...');

    if (!('geolocation' in navigator)) {
      setLocationStatus('Geolocation not supported in browser; preserving default coordinates.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(6)));
        setLng(Number(pos.coords.longitude.toFixed(6)));
        setAccuracy(Math.round(pos.coords.accuracy));
        setLocationStatus(`GPS locked with ±${Math.round(pos.coords.accuracy)}m spatial confidence.`);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback to selected ecosystem coordinates
        const selected = ecosystems.find(e => e.id === ecosystemId);
        if (selected) {
          setLat(selected.location.lat);
          setLng(selected.location.lng);
          setAccuracy(15);
        }
        setLocationStatus('Using calibrated urban catchment baseline coordinates.');
        setIsLocating(false);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  // Toggle multi-select helpers
  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Handle File Upload
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Instant AI Preview Trigger
  const handlePreviewAI = async () => {
    setIsAiLoading(true);
    const mockObs: Partial<ObservationSubmission> = {
      waterAppearance,
      odour,
      surfaceConditions: selectedSurfaces,
      biodiversityIndicators: selectedBiodiversity,
      humanAndUrbanDisturbances: selectedDisturbances,
      notes,
      imageUrl: imagePreview || undefined
    };

    const insight = await analyzeWaterObservationWithGemini(mockObs, config.forceDeterministicAI);
    setAiPreview(insight);
    setIsAiLoading(false);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const targetEco = ecosystems.find(e => e.id === ecosystemId) || ecosystems[0];

    // Build observation payload
    const observationDraft: ObservationSubmission = {
      ecosystemId: targetEco.id,
      ecosystemName: targetEco.name,
      timestamp: Date.now(),
      observerName: observerName.trim() || 'Anonymous Citizen Scientist',
      lat: lat,
      lng: lng,
      locationAccuracyMeters: accuracy || 10,
      waterAppearance,
      odour,
      surfaceConditions: selectedSurfaces,
      biodiversityIndicators: selectedBiodiversity,
      humanAndUrbanDisturbances: selectedDisturbances,
      notes: notes.trim(),
      imageUrl: imagePreview || undefined,
      confidenceScore: currentConfidence
    };

    // Run AI One Health analysis
    let analysisResult = aiPreview;
    if (!analysisResult) {
      analysisResult = await analyzeWaterObservationWithGemini(
        observationDraft,
        config.forceDeterministicAI
      );
    }
    observationDraft.aiAnalysis = analysisResult;

    // Save to Firestore with persistent offline fallback
    const newId = await saveObservation(observationDraft);
    observationDraft.id = newId;

    setIsSubmitting(false);
    onSubmissionSuccess(observationDraft);
  };

  const getConfidenceBadgeColor = (score: number) => {
    if (score >= 80) return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-800 bg-amber-50 border-amber-200';
    return 'text-rose-800 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl shadow-xs overflow-hidden">
      {/* Header with Live Confidence Score Meter */}
      <div className="bg-[#FAF7F2] p-6 border-b border-[#E3DCCF] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
            Citizen Field Protocol v3.1
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-1">Submit Urban Freshwater Observation</h2>
          <p className="text-xs text-stone-500">
            Provide multi-parameter environmental proxies to feed the OneAquaAI epidemiological model.
          </p>
        </div>

        {/* Live Confidence Score Pill & Gauge */}
        <div className="bg-[#F4EFE6] p-3 rounded-xl border border-[#DED6C7] flex items-center gap-4 shadow-xs">
          <div>
            <div className="text-[10px] text-stone-600 uppercase font-mono tracking-wider font-semibold">
              Data Confidence Score
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black font-mono text-stone-900">{currentConfidence}%</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${getConfidenceBadgeColor(currentConfidence)}`}>
                {currentConfidence >= 80 ? 'High Evidence' : currentConfidence >= 60 ? 'Standard Evidence' : 'Needs Geotag/Photo'}
              </span>
            </div>
          </div>

          {/* Mini progress circle or bar */}
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-300"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={currentConfidence >= 80 ? 'text-emerald-700' : currentConfidence >= 60 ? 'text-amber-700' : 'text-rose-700'}
                strokeDasharray={`${currentConfidence}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-stone-900">
              {currentConfidence}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Row 1: Target Waterbody and Observer Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Target Urban Water Ecosystem
            </label>
            <select
              value={ecosystemId}
              onChange={(e) => {
                setEcosystemId(e.target.value);
                const eco = ecosystems.find(x => x.id === e.target.value);
                if (eco) {
                  setLat(eco.location.lat);
                  setLng(eco.location.lng);
                }
              }}
              className="w-full bg-[#F4EFE6] border border-[#DED6C7] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
            >
              {ecosystems.map((eco) => (
                <option key={eco.id} value={eco.id}>
                  {eco.name} ({eco.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Citizen Observer Identity (Optional / Pseudonym)
            </label>
            <input
              type="text"
              value={observerName}
              onChange={(e) => setObserverName(e.target.value)}
              placeholder="e.g. Elena Rostova (Citizen Scientist)"
              className="w-full bg-[#F4EFE6] border border-[#DED6C7] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-600 shadow-xs"
            />
          </div>
        </div>

        {/* Row 2: GPS Coordinates Geolocation Panel */}
        <div className="bg-[#F4EFE6] border border-[#DED6C7] rounded-xl p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-semibold text-stone-900">Spatial Geolocation (GPS Evidence)</span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                +25% Confidence
              </span>
            </div>

            <button
              type="button"
              onClick={handleGetCoordinates}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EFEAE0] text-teal-900 border border-[#D8D0C0] rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Acquiring GPS...' : 'Acquire Device Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-stone-500 block text-[11px] font-medium">Latitude:</span>
              <input
                type="number"
                step="0.0001"
                value={lat ?? ''}
                onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full bg-[#FAF7F2] border border-[#D8D0C0] rounded-lg px-2.5 py-1.5 text-stone-900 font-mono text-xs mt-1"
              />
            </div>
            <div>
              <span className="text-stone-500 block text-[11px] font-medium">Longitude:</span>
              <input
                type="number"
                step="0.0001"
                value={lng ?? ''}
                onChange={(e) => setLng(e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full bg-[#FAF7F2] border border-[#D8D0C0] rounded-lg px-2.5 py-1.5 text-stone-900 font-mono text-xs mt-1"
              />
            </div>
            <div>
              <span className="text-stone-500 block text-[11px] font-medium">Accuracy Radius:</span>
              <div className="w-full bg-[#FAF7F2] border border-[#D8D0C0] rounded-lg px-2.5 py-1.5 text-stone-700 font-mono text-xs mt-1">
                ±{accuracy} meters
              </div>
            </div>
          </div>
          <p className="text-[11px] text-stone-500 mt-2 italic">{locationStatus}</p>
        </div>

        {/* Row 3: Physical Water Appearance & Odour Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Appearance Radio-like Select */}
          <div>
            <label className="text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-teal-700" />
              Water Appearance & Clarity
            </label>
            <div className="grid grid-cols-2 gap-2">
              {APPEARANCE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setWaterAppearance(opt)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                    waterAppearance === opt
                      ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-600/30'
                      : 'bg-[#F4EFE6] border-[#DED6C7] text-stone-700 hover:text-stone-950 hover:border-[#cbbfab] hover:bg-[#EFEAE0]'
                  }`}
                >
                  <div>{opt}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Odour Index */}
          <div>
            <label className="text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-teal-700" />
              Perceived Odour (Anaerobic / Organic Signal)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ODOUR_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setOdour(opt)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                    odour === opt
                      ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-600/30'
                      : 'bg-[#F4EFE6] border-[#DED6C7] text-stone-700 hover:text-stone-950 hover:border-[#cbbfab] hover:bg-[#EFEAE0]'
                  }`}
                >
                  <div>{opt}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Multi-Select Parameter Pills */}
        <div className="space-y-4">
          {/* Surface Conditions */}
          <div>
            <label className="text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              Surface Conditions & Floating Matter
            </label>
            <div className="flex flex-wrap gap-2">
              {SURFACE_OPTIONS.map((item) => {
                const active = selectedSurfaces.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleItem(selectedSurfaces, setSelectedSurfaces, item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold'
                        : 'bg-[#F4EFE6] border-[#DED6C7] text-stone-700 hover:border-[#cbbfab] hover:bg-[#EFEAE0]'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Biodiversity Indicators */}
          <div>
            <label className="text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-teal-700" />
              Biological & Vector Indicators (Living Proxies)
            </label>
            <div className="flex flex-wrap gap-2">
              {BIODIVERSITY_OPTIONS.map((item) => {
                const active = selectedBiodiversity.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleItem(selectedBiodiversity, setSelectedBiodiversity, item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'bg-teal-100 border-teal-600 text-teal-950 font-bold'
                        : 'bg-[#F4EFE6] border-[#DED6C7] text-stone-700 hover:border-[#cbbfab] hover:bg-[#EFEAE0]'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urban Disturbances */}
          <div>
            <label className="text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Human & Urban Disturbances (Anthropogenic Pressures)
            </label>
            <div className="flex flex-wrap gap-2">
              {DISTURBANCE_OPTIONS.map((item) => {
                const active = selectedDisturbances.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleItem(selectedDisturbances, setSelectedDisturbances, item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'bg-amber-100 border-amber-600 text-amber-950 font-bold'
                        : 'bg-[#F4EFE6] border-[#DED6C7] text-stone-700 hover:border-[#cbbfab] hover:bg-[#EFEAE0]'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 5: Image Upload and Field Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Photographic Evidence */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-teal-700" />
                Photographic Evidence
              </label>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                +25% Confidence
              </span>
            </div>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-[#D8D0C0] h-44 bg-[#EFEAE0] group">
                <img
                  src={imagePreview}
                  alt="Water observation preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/70 text-rose-300 hover:bg-rose-700 hover:text-white transition cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-[#FAF7F2]/90 backdrop-blur-xs px-2 py-1 rounded text-[11px] text-stone-800 border border-[#D8D0C0]">
                  Image linked for One Health visual evaluation
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D5CDBC] hover:border-teal-600 rounded-xl h-44 cursor-pointer bg-[#F4EFE6] hover:bg-[#EFEAE0] transition p-4 text-center">
                <UploadCloud className="w-8 h-8 text-stone-400 mb-2" />
                <span className="text-xs font-semibold text-stone-700">
                  Click or drag photo of water, shore, or flora
                </span>
                <span className="text-[10px] text-stone-500 mt-1">
                  JPG, PNG, or WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Descriptive Citizen Field Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Descriptive Observational Narrative
              </label>
              <span className="text-[10px] font-mono text-stone-500">
                {notes.length} chars (adds up to +15% confidence)
              </span>
            </div>
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe shoreline condition, weather (e.g. recent rainfall), presence of waterfowl, water transparency or localized scum..."
              className="w-full bg-[#F4EFE6] border border-[#DED6C7] rounded-xl p-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-600 shadow-xs"
            />
          </div>
        </div>

        {/* AI Preview Section */}
        {aiPreview && (
          <div className="bg-[#F4EFE6] p-4 rounded-xl border border-teal-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                One Health AI Provisional Diagnosis Preview
              </span>
              <span className="text-[10px] text-stone-600 font-mono font-medium">
                {aiPreview.isDeterministicFallback ? 'Deterministic Rule' : 'Gemini AI'}
              </span>
            </div>
            <p className="text-xs text-stone-800 mb-2 leading-relaxed">
              <strong>Ecological:</strong> {aiPreview.ecologicalSignal}
            </p>
            <p className="text-xs text-stone-800 mb-2 leading-relaxed">
              <strong>Vector:</strong> {aiPreview.zoonoticVectorSignal}
            </p>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              <strong>Precaution:</strong> {aiPreview.publicHealthCaution}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E3DCCF]">
          <button
            type="button"
            onClick={handlePreviewAI}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFEAE0] hover:bg-[#E5DFD3] text-teal-900 text-xs font-semibold border border-[#D5CDBC] transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Synthesizing Signals...' : 'Preview One Health Signals'}</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSubmitting ? 'Syncing with Firestore...' : 'Commit Citizen Observation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
