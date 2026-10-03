export type HealthStatus = 'Optimal' | 'Caution' | 'Degraded' | 'Critical';

export interface UrbanEcosystem {
  id: string;
  name: string;
  type: 'Lake' | 'Canal' | 'River' | 'Urban Wetland' | 'Retention Basin';
  location: {
    lat: number;
    lng: number;
    district: string;
  };
  overallHealthScore: number; // 0 - 100
  status: HealthStatus;
  primaryStressors: string[];
  observedBiodiversity: string[];
  lastObserved: string;
  waterAppearance: string;
  odourIndex: 'None' | 'Mild earthy' | 'Stagnant' | 'Strong anaerobic/septic';
  oneHealthRiskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High Vigilance';
  communityReportsCount: number;
  description: string;
  imageUrl: string;
  trend: 'improving' | 'stable' | 'deteriorating';
}

export interface ObservationSubmission {
  id?: string;
  ecosystemId: string;
  ecosystemName: string;
  timestamp: number;
  observerName?: string;
  lat: number | null;
  lng: number | null;
  locationAccuracyMeters?: number;
  waterAppearance: 'Crystal clear' | 'Natural green/tan' | 'Turbid/Muddy' | 'Heavy algae scum' | 'Oily sheen' | 'Foamy/Discolored';
  odour: 'No detectable odour' | 'Pleasant/Fresh vegetation' | 'Musty/Stagnant' | 'Fishy/Decaying matter' | 'Chemical or sulfur-like';
  surfaceConditions: string[]; // e.g. ['Floating debris', 'Plastic litter', 'Algal mats', 'Duckweed', 'Clear']
  biodiversityIndicators: string[]; // e.g. ['Dragonflies/Mayflies (sensitive)', 'Fish surfaced/gasping', 'Waterfowl nesting', 'Tadpoles/Frogs', 'Dead fauna spotted']
  humanAndUrbanDisturbances: string[]; // e.g. ['Stormwater drain discharge', 'Pet waste proximity', 'Construction runoff', 'Fishing activity', 'Direct trash dumping']
  notes: string;
  imageUrl?: string;
  imageThumbnailUrl?: string;
  confidenceScore: number; // 0 - 100%
  aiAnalysis?: AIOneHealthInsight;
  isOfflineSync?: boolean;
}

export interface AIOneHealthInsight {
  status: 'completed' | 'fallback' | 'analyzing' | 'error';
  visualSignalSummary: string;
  ecologicalSignal: string;
  zoonoticVectorSignal: string; // e.g. Potential standing water vector breeding indicator
  publicHealthCaution: string; // Non-medical cautionary recommendation
  recommendedCitizenAction: string[];
  confidenceAssessment: string;
  timestamp: string;
  isDeterministicFallback?: boolean;
}

export interface RemoteConfigState {
  forceSafeMapFallback: boolean;
  forceSafeChartFallback: boolean;
  forceDeterministicAI: boolean;
  maintenanceNotice: string;
  emergencyAlertBanner: boolean;
  activeAlertMessage: string;
  oneHealthVigilanceMode: boolean;
}

export interface WaterAlert {
  id: string;
  ecosystemId: string;
  ecosystemName: string;
  severity: 'Advisory' | 'Warning' | 'Urgent Investigation';
  title: string;
  details: string;
  indicatorTriggers: string[];
  recommendedPrecautions: string[];
  issuedAt: string;
  verifiedByCitizens: number;
}
