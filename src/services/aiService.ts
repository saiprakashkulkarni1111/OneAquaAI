import { GoogleGenAI } from '@google/genai';
import { ObservationSubmission, AIOneHealthInsight } from '../types';
import { generateDeterministicOneHealthAnalysis } from './confidenceScore';

// Initialize Gemini client if environment API key is present
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with key:', err);
  }
}

export async function analyzeWaterObservationWithGemini(
  obs: Partial<ObservationSubmission>,
  forceDeterministic = false
): Promise<AIOneHealthInsight> {
  // If forced deterministic or no API key, gracefully use deterministic engine
  if (forceDeterministic || !aiClient) {
    console.info('Using One Health Deterministic Science Engine (Fallback/Standard)');
    return generateDeterministicOneHealthAnalysis(obs);
  }

  try {
    const prompt = `
You are the OneAquaAI scientific reasoning engine for the IEEE OneAquaHealth Hackathon 2026.
Analyze the following citizen-submitted urban freshwater observation through a scientific One Health lens (interconnecting environmental water quality, animal/aquatic biodiversity, and public urban health).

OBSERVATION PARAMETERS:
- Water Appearance: ${obs.waterAppearance || 'Unknown'}
- Odour: ${obs.odour || 'Unknown'}
- Surface Conditions: ${(obs.surfaceConditions || []).join(', ') || 'None noted'}
- Biodiversity Indicators: ${(obs.biodiversityIndicators || []).join(', ') || 'None noted'}
- Urban Pressures/Disturbances: ${(obs.humanAndUrbanDisturbances || []).join(', ') || 'None noted'}
- Citizen Notes: ${obs.notes || 'None'}
- Has Photographic Evidence: ${obs.imageUrl ? 'Yes' : 'No'}

CRITICAL SCIENTIFIC SAFETY RULES:
1. Always use probabilistic, observational terminology (e.g. "potential", "emerging signal", "suggestive indicator", "provisional proxy").
2. DO NOT fabricate chemical metrics (e.g. do not state "pH is 7.2" or "dissolved oxygen is 4.1 mg/L" from mere visual descriptions).
3. DO NOT diagnose human medical illness or suggest medical treatments. Focus on precautionary urban environmental health and vector management.

Return your analysis in strictly valid JSON format with this exact schema:
{
  "visualSignalSummary": "Concise summary of physical water condition signals",
  "ecologicalSignal": "Assessment of ecosystem integrity, macrophyte health, or hypoxic potential",
  "zoonoticVectorSignal": "Assessment of standing water vector (mosquito/midge) breeding potential or animal host interactions",
  "publicHealthCaution": "Evidence-first, non-medical citizen precautionary advice",
  "recommendedCitizenAction": ["action 1", "action 2", "action 3"],
  "confidenceAssessment": "Brief explanation of scientific confidence based on available observational proxies"
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(responseText);
    return {
      status: 'completed',
      visualSignalSummary: parsed.visualSignalSummary || 'Observational signals logged.',
      ecologicalSignal: parsed.ecologicalSignal || 'Ecosystem indicators evaluated.',
      zoonoticVectorSignal: parsed.zoonoticVectorSignal || 'Vector dynamics within seasonal expectations.',
      publicHealthCaution: parsed.publicHealthCaution || 'Exercise standard freshwater precautionary hygiene.',
      recommendedCitizenAction: Array.isArray(parsed.recommendedCitizenAction) 
        ? parsed.recommendedCitizenAction 
        : ['Continue regular monitoring', 'Share report with local watershed council'],
      confidenceAssessment: parsed.confidenceAssessment || 'Gemini 2.5 Flash One Health Analysis',
      timestamp: new Date().toISOString(),
      isDeterministicFallback: false
    };
  } catch (error) {
    console.warn('Gemini AI call failed or timed out. Gracefully engaging SafeAI deterministic fallback:', error);
    const fallback = generateDeterministicOneHealthAnalysis(obs);
    return {
      ...fallback,
      confidenceAssessment: 'Deterministic Fallback Engine (Activated seamlessly due to offline/API boundary)'
    };
  }
}
