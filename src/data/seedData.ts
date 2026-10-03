import { UrbanEcosystem, ObservationSubmission, WaterAlert } from '../types';

export const INITIAL_ECOSYSTEMS: UrbanEcosystem[] = [
  {
    id: 'eco-greenfield-lake',
    name: 'Greenfield Lake & Wetland Reserve',
    type: 'Lake',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      district: 'Western Parklands District'
    },
    overallHealthScore: 84,
    status: 'Optimal',
    primaryStressors: ['Weekend recreational litter', 'Mild avian droppings'],
    observedBiodiversity: ['Herons', 'Mallards', 'Banded dragonfly nymphs', 'Submerged Elodea'],
    lastObserved: '12 minutes ago',
    waterAppearance: 'Natural green/tan',
    odourIndex: 'Mild earthy',
    oneHealthRiskLevel: 'Low',
    communityReportsCount: 42,
    description: 'A key urban biodiversity sanctuary regulating local thermal comfort and urban bird flyways.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    trend: 'stable'
  },
  {
    id: 'eco-north-canal',
    name: 'North Urban Canal & Bypass',
    type: 'Canal',
    location: {
      lat: 37.7833,
      lng: -122.4167,
      district: 'Old Industrial & Innovation Corridor'
    },
    overallHealthScore: 58,
    status: 'Caution',
    primaryStressors: ['Stormwater overflow discharges', 'Culvert siltation', 'Microplastic accumulation'],
    observedBiodiversity: ['Carp', 'Water striders', 'Cattails along concrete banks'],
    lastObserved: '35 minutes ago',
    waterAppearance: 'Turbid/Muddy',
    odourIndex: 'Stagnant',
    oneHealthRiskLevel: 'Moderate',
    communityReportsCount: 67,
    description: 'Engineered drainage waterway transitioning toward re-naturalized urban bio-corridor.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    trend: 'improving'
  },
  {
    id: 'eco-silver-creek',
    name: 'Silver Creek Riparian Basin',
    type: 'River',
    location: {
      lat: 37.7690,
      lng: -122.4467,
      district: 'Foothill Urban Edge'
    },
    overallHealthScore: 91,
    status: 'Optimal',
    primaryStressors: ['Occasional off-leash dog trail erosion'],
    observedBiodiversity: ['Native trout fry', 'Mayfly larvae (clean indicator)', 'Riparian willows', 'Kingfishers'],
    lastObserved: '2 hours ago',
    waterAppearance: 'Crystal clear',
    odourIndex: 'None',
    oneHealthRiskLevel: 'Low',
    communityReportsCount: 31,
    description: 'High-elevation headwater stream acting as the primary biological reference site for the metropolitan area.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    trend: 'improving'
  },
  {
    id: 'eco-harbor-retention',
    name: 'Harbor Gateway Retention Basin',
    type: 'Retention Basin',
    location: {
      lat: 37.7558,
      lng: -122.3872,
      district: 'Port Logistics District'
    },
    overallHealthScore: 42,
    status: 'Degraded',
    primaryStressors: ['Asphalt runoff hydrocarbons', 'Stagnant thermal heating', 'Dense duckweed matting'],
    observedBiodiversity: ['Mosquito larvae clusters', 'Leeches', 'Hardy pond snails'],
    lastObserved: '4 hours ago',
    waterAppearance: 'Foamy/Discolored',
    odourIndex: 'Strong anaerobic/septic',
    oneHealthRiskLevel: 'Elevated',
    communityReportsCount: 54,
    description: 'Artificial stormwater detention basin capturing high-velocity road runoff before estuary discharge.',
    imageUrl: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80',
    trend: 'deteriorating'
  },
  {
    id: 'eco-south-delta-wetland',
    name: 'South Delta Constructed Wetland',
    type: 'Urban Wetland',
    location: {
      lat: 37.7312,
      lng: -122.3980,
      district: 'South Coastal Resiliency Zone'
    },
    overallHealthScore: 76,
    status: 'Caution',
    primaryStressors: ['Seasonal blue-green scum pockets', 'Nutrient loading from upland turf lawns'],
    observedBiodiversity: ['Black-necked stilts', 'Floating reeds', 'Dragonflies', 'Amphibians'],
    lastObserved: '5 hours ago',
    waterAppearance: 'Heavy algae scum',
    odourIndex: 'Mild earthy',
    oneHealthRiskLevel: 'Moderate',
    communityReportsCount: 89,
    description: 'Living bio-sponge built to purify treated municipal water while offering critical wetland bird refugia.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    trend: 'stable'
  }
];

export const INITIAL_OBSERVATIONS: ObservationSubmission[] = [
  {
    id: 'obs-001',
    ecosystemId: 'eco-harbor-retention',
    ecosystemName: 'Harbor Gateway Retention Basin',
    timestamp: Date.now() - 1000 * 60 * 35, // 35 mins ago
    observerName: 'Elena Rostova (Citizen Scientist)',
    lat: 37.7558,
    lng: -122.3872,
    locationAccuracyMeters: 6,
    waterAppearance: 'Foamy/Discolored',
    odour: 'Musty/Stagnant',
    surfaceConditions: ['Plastic litter', 'Algal mats', 'Floating debris'],
    biodiversityIndicators: ['Dead fauna spotted', 'Fish surfaced/gasping'],
    humanAndUrbanDisturbances: ['Stormwater drain discharge', 'Direct trash dumping'],
    notes: 'Observed thick greenish scum forming near the western overflow culvert. Strong stagnant odor noticed within 15 meters.',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 92,
    aiAnalysis: {
      status: 'completed',
      visualSignalSummary: 'Emerging surface scum with foamy aggregation and shoreline organic accumulation.',
      ecologicalSignal: 'Potential hypoxic indicators detected based on gasping aquatic fauna and heavy surface film.',
      zoonoticVectorSignal: 'Stagnant margins exhibit ideal micro-conditions for Culex mosquito larval development.',
      publicHealthCaution: 'Recommend avoiding contact with standing surface foam and advising pet owners to steer dogs away from shoreline.',
      recommendedCitizenAction: [
        'Log follow-up observation in 24 hours to monitor bloom dispersion',
        'Notify Municipal Urban Drainage Taskforce regarding culvert blockage',
        'Avoid physical water contact or pet water consumption'
      ],
      confidenceAssessment: 'High (Multi-parameter visual confirmation with verified GPS coordinates)',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'obs-002',
    ecosystemId: 'eco-greenfield-lake',
    ecosystemName: 'Greenfield Lake & Wetland Reserve',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    observerName: 'Marcus Chen',
    lat: 37.7751,
    lng: -122.4201,
    locationAccuracyMeters: 4,
    waterAppearance: 'Natural green/tan',
    odour: 'Pleasant/Fresh vegetation',
    surfaceConditions: ['Duckweed', 'Clear'],
    biodiversityIndicators: ['Dragonflies/Mayflies (sensitive)', 'Tadpoles/Frogs', 'Waterfowl nesting'],
    humanAndUrbanDisturbances: ['Pet waste proximity'],
    notes: 'Healthy dragonfly activity across the eastern reed bed. Water clarity is high, bottom pebbles visible up to 1.2m depth.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 95,
    aiAnalysis: {
      status: 'completed',
      visualSignalSummary: 'High light penetration and flourishing macroinvertebrate indicators along shoreline vegetation.',
      ecologicalSignal: 'Favorable dissolved oxygen proxy indicated by abundant sensitive Odonata (dragonfly) species.',
      zoonoticVectorSignal: 'Natural predation by dragonflies and juvenile amphibians actively suppresses mosquito emergence.',
      publicHealthCaution: 'Low immediate biological hazard. Water ecosystem is functioning in a resilient balanced state.',
      recommendedCitizenAction: [
        'Maintain vegetative buffer zone along walking path',
        'Collect discarded fishing line or plastics if safely accessible'
      ],
      confidenceAssessment: 'Very High (Includes photo, verified coordinates, and multiple sensitive bio-indicators)',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'obs-003',
    ecosystemId: 'eco-north-canal',
    ecosystemName: 'North Urban Canal & Bypass',
    timestamp: Date.now() - 1000 * 60 * 300, // 5 hours ago
    observerName: 'Amina Al-Sayed',
    lat: 37.7830,
    lng: -122.4172,
    locationAccuracyMeters: 9,
    waterAppearance: 'Turbid/Muddy',
    odour: 'No detectable odour',
    surfaceConditions: ['Floating debris'],
    biodiversityIndicators: ['Waterfowl nesting'],
    humanAndUrbanDisturbances: ['Construction runoff', 'Stormwater drain discharge'],
    notes: 'Construction work upstream on 4th street appears to be contributing suspended brown silt into the bypass.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 84,
    aiAnalysis: {
      status: 'completed',
      visualSignalSummary: 'High particulate turbidity from inorganic sediment wash-off.',
      ecologicalSignal: 'Potential reduction in light penetration which could temporarily impede benthic plant photosynthesis.',
      zoonoticVectorSignal: 'Flow velocity remains sufficient to prevent vector standing-water stagnation.',
      publicHealthCaution: 'Suspended silt is non-toxic to casual touch but indicates high urban runoff vulnerability.',
      recommendedCitizenAction: [
        'Check silt barrier integrity near 4th street culvert',
        'Record secondary turbidity snapshot following rain event'
      ],
      confidenceAssessment: 'Moderate-High (Visual sediment plume confirmed with spatial context)',
      timestamp: new Date().toISOString()
    }
  }
];

export const INITIAL_ALERTS: WaterAlert[] = [
  {
    id: 'alert-01',
    ecosystemId: 'eco-harbor-retention',
    ecosystemName: 'Harbor Gateway Retention Basin',
    severity: 'Urgent Investigation',
    title: 'Potential Cyanobacterial Aggregation Signal',
    details: 'Cluster of 5 citizen reports within 24 hours citing green surface scum, dead minnows, and anaerobic odor at southwest culvert.',
    indicatorTriggers: ['Surface algal film', 'Fish surfaced/hypoxic signals', 'Anaerobic odor'],
    recommendedPrecautions: [
      'Prohibit canine contact and recreational water access',
      'Deploy municipal mobile lab for chlorophyll-a and microcystin assay',
      'Inspect upstream stormwater discharge inlet'
    ],
    issuedAt: 'Today at 08:30 AM',
    verifiedByCitizens: 8
  },
  {
    id: 'alert-02',
    ecosystemId: 'eco-north-canal',
    ecosystemName: 'North Urban Canal & Bypass',
    severity: 'Advisory',
    title: 'Elevated Turbidity & Sediment Plume Following Inflow',
    details: 'Turbid runoff surge noticed after early morning industrial corridor maintenance.',
    indicatorTriggers: ['Sediment turbidity', 'Construction proximity'],
    recommendedPrecautions: [
      'Inspect sedimentation traps along canal inlet 3B',
      'Citizen monitors requested to log downstream clarity readings'
    ],
    issuedAt: 'Yesterday at 04:15 PM',
    verifiedByCitizens: 14
  },
  {
    id: 'alert-03',
    ecosystemId: 'eco-south-delta-wetland',
    ecosystemName: 'South Delta Constructed Wetland',
    severity: 'Warning',
    title: 'Elevated Vector Activity Near Warm Shallow Pools',
    details: 'High count of standing-water mosquito larvae documented in non-circulating retention pockets.',
    indicatorTriggers: ['Mosquito larvae abundance', 'Restricted water circulation'],
    recommendedPrecautions: [
      'Introduce biological surface larvicide (Bti) in targeted stagnant channels',
      'Clear floating debris choking the internal weir gates'
    ],
    issuedAt: '2 days ago',
    verifiedByCitizens: 19
  }
];
