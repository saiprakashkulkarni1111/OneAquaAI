import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Droplet, 
  MapPin, 
  PlusCircle, 
  Sparkles, 
  HeartPulse, 
  TrendingUp, 
  Bell, 
  History, 
  BookOpen, 
  Layers, 
  Sliders, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  Menu,
  X,
  Compass,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

import { UrbanEcosystem, ObservationSubmission, WaterAlert } from './types';
import { INITIAL_ECOSYSTEMS, INITIAL_OBSERVATIONS, INITIAL_ALERTS } from './data/seedData';
import { 
  initializeDatabaseSeed, 
  getEcosystems, 
  subscribeToObservations, 
  subscribeToAlerts 
} from './services/dataService';
import { RemoteConfigProvider, useRemoteConfig } from './services/remoteConfig';
import { UIScaleProvider, useUIScale } from './services/uiScale';
import { UIScaleControl } from './components/UIScaleControl';

// Views and Modals
import { DashboardView } from './components/DashboardView';
import { SafeMap } from './components/SafeMap';
import { ObservationForm } from './components/ObservationForm';
import { AIInsightsView } from './components/AIInsightsView';
import { EcosystemHealthView } from './components/EcosystemHealthView';
import { TrendsView } from './components/TrendsView';
import { AlertsView } from './components/AlertsView';
import { HistoryView } from './components/HistoryView';
import { AboutOneHealthView } from './components/AboutOneHealthView';
import { RemoteConfigModal } from './components/RemoteConfigModal';

function MainAppContent() {
  const { config } = useRemoteConfig();
  const { scale, isFullWidth } = useUIScale();

  // Navigation tab state (9 core sections)
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRemoteConfigOpen, setIsRemoteConfigOpen] = useState(false);

  // App Data States
  const [ecosystems, setEcosystems] = useState<UrbanEcosystem[]>(INITIAL_ECOSYSTEMS);
  const [observations, setObservations] = useState<ObservationSubmission[]>(INITIAL_OBSERVATIONS);
  const [alerts, setAlerts] = useState<WaterAlert[]>(INITIAL_ALERTS);
  const [selectedEcosystem, setSelectedEcosystem] = useState<UrbanEcosystem | null>(null);

  // Success toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Online / Offline Status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Bootstrap Firestore seed and snapshot listeners
    initializeDatabaseSeed();

    getEcosystems().then((data) => {
      if (data && data.length > 0) setEcosystems(data);
    });

    const unsubscribeObs = subscribeToObservations((data) => {
      setObservations(data);
    });

    const unsubscribeAlerts = subscribeToAlerts((data) => {
      setAlerts(data);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeObs();
      unsubscribeAlerts();
    };
  }, []);

  const handleSelectEcosystem = (eco: UrbanEcosystem) => {
    setSelectedEcosystem(eco);
    setActiveTab('map');
  };

  const handleSelectEcosystemByName = (name: string) => {
    const found = ecosystems.find(e => e.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setSelectedEcosystem(found);
      setActiveTab('map');
    }
  };

  const handleSubmissionSuccess = (newObs: ObservationSubmission) => {
    // Add locally to observations
    setObservations(prev => [newObs, ...prev]);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#10b981', '#38bdf8']
      });
    } catch (e) {
      // ignore
    }

    setToastMessage(`Observation logged for "${newObs.ecosystemName}" with ${newObs.confidenceScore}% evidence confidence!`);
    setTimeout(() => setToastMessage(null), 5000);

    // Switch to history tab or dashboard
    setActiveTab('history');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'map', label: 'Explore Map', icon: MapPin },
    { id: 'submit', label: 'Submit Observation', icon: PlusCircle, highlight: true },
    { id: 'ai', label: 'AI Insights', icon: Sparkles },
    { id: 'ecosystems', label: 'Ecosystem Health', icon: HeartPulse },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alerts.length },
    { id: 'history', label: 'Observation History', icon: History },
    { id: 'about', label: 'About One Health', icon: BookOpen }
  ];

  return (
    <div 
      className="min-h-screen bg-[#F6F3EC] text-stone-900 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-900 transition-all duration-200"
      style={{
        zoom: scale !== 100 ? `${scale / 100}` : undefined
      }}
    >
      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-b border-[#E3DCCF] shadow-xs">
        <div className={`w-full mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 transition-all duration-300 ${
          isFullWidth ? 'max-w-full' : 'max-w-7xl 2xl:max-w-[1600px]'
        }`}>
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-600 to-emerald-600 p-0.5 shadow-md shadow-teal-700/15 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#FAF7F2] rounded-[14px] flex items-center justify-center">
                <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-stone-900 group-hover:text-teal-700 transition">
                  OneAquaAI
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                  2026
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-stone-500 hidden sm:block">
                IEEE One Health Urban Water Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : item.highlight
                      ? 'text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 font-semibold'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-[#EFEAE0]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-teal-700' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-mono font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right Tools: UI Scaler, Offline Indicator & Remote Config Button */}
          <div className="flex items-center gap-2">
            {/* Direct UI Display Scaler */}
            <UIScaleControl />

            {/* Persistence & Connectivity Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title="Firestore Persistent Local Cache active for zero-crash offline resilience"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-700" /> : <WifiOff className="w-3.5 h-3.5 text-amber-700" />}
              <span>{isOnline ? 'Online Cache' : 'Offline Persistence'}</span>
            </div>

            {/* Remote Config Control */}
            <button
              onClick={() => setIsRemoteConfigOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFEAE0] text-stone-700 border border-[#D8D0C0] text-xs font-semibold transition cursor-pointer shadow-xs"
              title="Configure Remote Fallbacks"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden md:inline">Remote Config</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[#FAF7F2] text-stone-700 hover:text-stone-900 border border-[#D8D0C0] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FAF7F2] border-b border-[#E3DCCF] px-4 py-3 space-y-1 shadow-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer ${
                    isActive ? 'bg-teal-700 text-white' : 'text-stone-700 hover:bg-[#EFEAE0]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FAF7F2] border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-500 hover:text-stone-800 ml-2 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className={`flex-1 w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all duration-300 ${
        isFullWidth ? 'max-w-full' : 'max-w-7xl 2xl:max-w-[1600px]'
      }`}>
        {/* Navigation Tabs Bar for Tablets and small screens */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'bg-[#FAF7F2] border border-[#D8D0C0] text-stone-700 hover:bg-[#EFEAE0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Section Router */}
        {activeTab === 'dashboard' && (
          <DashboardView
            ecosystems={ecosystems}
            observations={observations}
            alerts={alerts}
            onSelectEcosystem={handleSelectEcosystem}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-[#FAF7F2] border border-[#E3DCCF] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">Urban Catchment Basin Map</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Interactive multi-layer cartography paired with accessible zero-crash fallback list view.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('submit')}
                className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Add Field Report at Current GPS
              </button>
            </div>
            <SafeMap
              ecosystems={ecosystems}
              selectedEcosystem={selectedEcosystem}
              onSelectEcosystem={setSelectedEcosystem}
              forceFallback={config.forceSafeMapFallback}
            />
          </div>
        )}

        {activeTab === 'submit' && (
          <ObservationForm
            ecosystems={ecosystems}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        )}

        {activeTab === 'ai' && (
          <AIInsightsView
            observations={observations}
            ecosystems={ecosystems}
          />
        )}

        {activeTab === 'ecosystems' && (
          <EcosystemHealthView
            ecosystems={ecosystems}
            onSelectEcosystem={handleSelectEcosystem}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsView
            ecosystems={ecosystems}
            observations={observations}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsView
            alerts={alerts}
            onSelectEcosystemByName={handleSelectEcosystemByName}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            observations={observations}
          />
        )}

        {activeTab === 'about' && (
          <AboutOneHealthView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#EFEAE0] border-t border-[#DFD7C7] py-6 text-xs text-stone-600">
        <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 ${
          isFullWidth ? 'max-w-full' : 'max-w-7xl 2xl:max-w-[1600px]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-semibold text-stone-800">OneAquaAI Platform</span>
            <span className="text-stone-500">• IEEE OneAquaHealth Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Evidence Confidence Engine</span>
            <span>•</span>
            <span>Firestore Offline Persistent Cache</span>
            <span>•</span>
            <span>SafeAI Non-Medical Matrix</span>
          </div>
        </div>
      </footer>

      {/* Remote Config Modal */}
      <RemoteConfigModal
        isOpen={isRemoteConfigOpen}
        onClose={() => setIsRemoteConfigOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <UIScaleProvider>
      <RemoteConfigProvider>
        <MainAppContent />
      </RemoteConfigProvider>
    </UIScaleProvider>
  );
}
