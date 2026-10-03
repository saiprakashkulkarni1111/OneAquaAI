import React, { createContext, useContext, useState, useEffect } from 'react';
import { RemoteConfigState } from '../types';

const DEFAULT_REMOTE_CONFIG: RemoteConfigState = {
  forceSafeMapFallback: false,
  forceSafeChartFallback: false,
  forceDeterministicAI: false,
  maintenanceNotice: '',
  emergencyAlertBanner: false,
  activeAlertMessage: '',
  oneHealthVigilanceMode: true
};

interface RemoteConfigContextType {
  config: RemoteConfigState;
  updateConfigKey: <K extends keyof RemoteConfigState>(key: K, value: RemoteConfigState[K]) => void;
  resetConfig: () => void;
  isSimulatedRemote: boolean;
}

const RemoteConfigContext = createContext<RemoteConfigContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'oneaqua_remote_config_v2';

export const RemoteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<RemoteConfigState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return { ...DEFAULT_REMOTE_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Could not parse local remote config:', e);
    }
    return DEFAULT_REMOTE_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      // Ignore storage errors
    }
  }, [config]);

  const updateConfigKey = <K extends keyof RemoteConfigState>(key: K, value: RemoteConfigState[K]) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_REMOTE_CONFIG);
  };

  return (
    <RemoteConfigContext.Provider value={{ config, updateConfigKey, resetConfig, isSimulatedRemote: true }}>
      {children}
    </RemoteConfigContext.Provider>
  );
};

export const useRemoteConfig = () => {
  const context = useContext(RemoteConfigContext);
  if (!context) {
    throw new Error('useRemoteConfig must be used within RemoteConfigProvider');
  }
  return context;
};
