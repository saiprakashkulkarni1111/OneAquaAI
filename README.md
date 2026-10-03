💧 OneAquaAI: Urban Freshwater & One Health Intelligence
![Image](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)

![Image](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)

![Image](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)

![Image](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)

![Image](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)

![Image](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=google&logoColor=white)

![Image](https://img.shields.io/badge/Paradigm-One_Health-2E7D32)

![Image](https://img.shields.io/badge/Design-Offline--First_%26_Zero--Crash-0284C7)

Citizen-Powered Water Intelligence for Resilient Urban Health

Transforming qualitative community field observations into predictive hydrological and epidemiological bio-risk intelligence.
🌐 Live Demonstrations
Shared App URL: https://ais-pre-fg5sn3scz3dta5qu6l3mgy-151942632815.asia-southeast1.run.app
Demo Video (3–5 min): [Add your YouTube / Loom demo video link here]
Project Submission: IEEE OneAquaHealth Hackathon 2026
🌊 The Problem & One Health Context
Urban waterbodies—canals, retention basins, drainage channels, and peri-urban wetlands—form the vital circulatory system of modern metropolises. Rapid urbanization and climate shocks have overwhelmed these ecosystems with untreated stormwater runoff, municipal organic waste, and prolonged stagnation.
Under the One Health paradigm, ecological breakdown in urban water directly precipitates human health crises:
Eutrophication & Anoxia: Nutrient overloading triggers toxic cyanobacterial blooms, causing mass aquatic die-offs and foul septic odors.
Vector Proliferation: Stagnant, warm surface waters create fertile breeding grounds for disease vectors such as Aedes aegypti (dengue, chikungunya) and Culex quinquefasciatus (lymphatic filariasis, West Nile virus).
Surveillance Blindspots: Municipal authorities rely on sparse, monthly grab-sampling stations that routinely miss hyper-local bloom spikes and micro-catchment stagnant pools.
OneAquaAI bridges this critical gap by empowering community volunteers, park rangers, and public health field teams with an offline-first, multimodal AI surveillance platform that detects hazards early.
✨ Key Features
1. 🗺️ Interactive Catchment Map & SafeMap Resilience
Real-time geospatial mapping of urban drainage basins, lakes, and canal reaches.
Visual risk heatmaps indicating eutrophication and vector breeding danger zones.
Zero-Crash SafeMap Layer: Built with a resilient fallback mechanism and an instant Accessible HTML Tabular View for low-bandwidth devices or network disruptions.
2. 📝 Multimodal Citizen Field Reporting
Geotagged observation submissions capturing water appearance, odor profiles, estimated turbidity, and macroinvertebrate bio-indicators.
Automatic device GPS precision extraction with continuous signal confidence gauging.
Photo attachment for machine-vision validation.
3. 🧠 Multimodal AI & Quantitative Bio-Risk Diagnostics
Powered by Google Gemini 2.5 Flash for multimodal visual diagnostics (algal scum identification, film analysis, flow rate estimation).
Mathematical implementation of Carlson's Trophic State Index (
) and Vector Transmission Potential (
).
Generates actionable, plain-language municipal advisories (e.g., larvicide deployment windows, aeration pump triggers).
4. 📶 Offline-First Local Queue & Firestore Sync
Field workers in remote channels or dense wetlands operate uninterrupted with local IndexedDB storage.
Auto-syncs queued field observations with Firebase Firestore immediately upon re-establishing internet connectivity.
5. 🎨 Ergonomic Light Beige Design System
High-contrast, nature-inspired light beige aesthetic (#F6F3EC canvas with warm ivory and stone surfaces).
Optimized for field readability under bright outdoor sunlight without visual glare.
Dynamic UI scale control accommodating accessibility needs.
📐 Mathematical & Epidemiological Formulations
1. Carlson's Trophic State Index (
)
Using Secchi depth equivalence (
, in meters) and estimated Chlorophyll-
 (
):
Range	Classification	Ecological Status
Oligotrophic	Clear water, high dissolved oxygen, low biological risk
Mesotrophic	Moderate biological productivity, balanced ecosystem
Eutrophic	High nutrient loading, frequent algal scums
Hypereutrophic	Severe cyanobacterial blooms, fish die-offs, anoxia
2. Vector Transmission Potential Index (
)
Vector risk 
 is computed as a logistic response to water surface temperature (
 in 
), stagnation coefficient (
), organic debris accumulation (
), and stream velocity (
 in 
):
3. Citizen Observation Confidence Weighting (
)
Crowdsourced observations are weighted dynamically to prevent spam or noisy sensor outliers from skewing municipal alerts:
Where:
: Device GPS radius error (meters)
: Submitter historical report validation ratio
: Spatial-temporal neighbor report consensus factor
🏗️ Architecture
code
Code
┌─────────────────────────────────────────┐
                    │      Citizen & Field Observer App       │
                    │   (React 19 + TypeScript + Tailwind)    │
                    └───────────────────┬─────────────────────┘
                                        │
                         [Online / Offline Detection]
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
     [Online Connectivity]                        [Offline Mode / No Signal]
                 │                                             │
                 ▼                                             ▼
     ┌───────────────────────┐                     ┌───────────────────────┐
     │   Firebase Firestore  │◄──── Sync Queue ────┤   IndexedDB Storage   │
     │  Real-Time Database   │                     │  Local Field Reports  │
     └───────────┬───────────┘                     └───────────────────────┘
                 │
                 ▼
     ┌────────────────────────────────────────────────────────┐
     │        AI Analytics & One Health Modeling Engine        │
     │  - Google Gemini 2.5 Flash Multimodal Vision Pipeline  │
     │  - Carlson's Trophic State Index (TSI)                 │
     │  - Vector Transmission Potential (VTP) Scoring         │
     └───────────────────────────┬────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
    ┌─────────────────────────┐     ┌─────────────────────────┐
    │  Geospatial Risk Maps   │     │  Municipal Actionable   │
    │ (SafeMap & Heatmaps)    │     │   Outbreak Advisories   │
    └─────────────────────────┘     └─────────────────────────┘
🛠️ Tech Stack
Client & Presentation: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion.
Geospatial & Visualization: Leaflet, Canvas heatmaps, Recharts, Custom SafeMap/SafeChart fallback wrappers.
Backend & Persistence: Node.js, Express, Firebase Firestore, IndexedDB (offline sync).
Artificial Intelligence: Google Gemini 2.5 Flash API via @google/genai TypeScript SDK.
🚀 Getting Started
Prerequisites
Node.js (v18.0.0 or higher)
npm or bun
1. Clone & Install
code
Bash
git clone https://github.com/your-username/oneaqua-ai.git
cd oneaqua-ai
npm install
2. Environment Configuration
Create a .env file in the root directory using .env.example:
code
Bash
cp .env.example .env
Ensure your Gemini API key and Firebase credentials are set:
code
Env
GEMINI_API_KEY="your-gemini-api-key"
3. Run Development Server
code
Bash
npm run dev
Open http://localhost:3000 in your browser.
4. Build for Production
code
Bash
npm run build
npm run preview
📂 Project Directory Structure
code
Text
├── index.html                   # HTML entry point with synced SEO & metadata
├── metadata.json                # Project identification & server capabilities
├── firestore.rules              # Firebase security & data access rules
├── package.json                 # Project dependencies & build scripts
├── src/
│   ├── App.tsx                  # Root application, navigation & global theme
│   ├── main.tsx                 # React DOM mount point
│   ├── components/
│   │   ├── DashboardView.tsx    # Unified monitoring overview
│   │   ├── SafeMap.tsx          # Resilient geospatial catchment map
│   │   ├── SafeChart.tsx        # Zero-crash time-series analytics
│   │   ├── SafeAI.tsx           # Multimodal AI analysis wrapper
│   │   ├── ObservationForm.tsx  # Citizen field reporting with GPS gauge
│   │   ├── EcosystemTrends.tsx  # Longitudinal water quality metrics
│   │   ├── UIScaleControl.tsx   # Field accessibility contrast/font scaler
│   │   └── RemoteConfigModal.tsx# Database & telemetry sync inspector
│   ├── services/
│   │   ├── gemini.ts            # Multimodal AI inspection engine
│   │   ├── firebase.ts          # Firestore client initialization & listeners
│   │   └── offlineStorage.ts    # IndexedDB offline report queue
│   └── types/
│       └── waterQuality.ts      # Hydrological & epidemiological schemas
🏆 Hackathon Evaluation Highlights
Criteria	Implementation Highlights
One Health Relevance	Directly models the feedback loop between aquatic degradation (
) and vector emergence (
).
Technical Excellence	Zero-crash fallback architecture (SafeMap, SafeChart, SafeAI) + offline-first IndexedDB synchronization.
Scientific Grounding	Embedded Carlson Trophic State equations, logistic vector risk modeling, and GPS confidence weighting.
Field Usability	Light beige ergonomic palette (#F6F3EC) designed for direct sunlight visibility with accessibility scaling.
📄 License & Acknowledgments
This project is developed for the IEEE OneAquaHealth Hackathon 2026.
Distributed under the MIT License.
