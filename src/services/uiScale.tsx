import React, { createContext, useContext, useState, useEffect } from 'react';

export type UIScaleOption = 80 | 90 | 100 | 110 | 125 | 140;

interface UIScaleContextType {
  scale: number; // percentage, e.g. 100
  setScale: (scale: number) => void;
  increaseScale: () => void;
  decreaseScale: () => void;
  resetScale: () => void;
  isFullWidth: boolean;
  setIsFullWidth: (full: boolean) => void;
  toggleFullWidth: () => void;
}

const UI_SCALE_KEY = 'oneaqua_ui_scale_preference';
const UI_WIDTH_KEY = 'oneaqua_ui_fullwidth_preference';

const UIScaleContext = createContext<UIScaleContextType | undefined>(undefined);

export const UIScaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scale, setScaleState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(UI_SCALE_KEY);
      if (saved) {
        const val = Number(saved);
        if (!isNaN(val) && val >= 75 && val <= 150) return val;
      }
    } catch (e) {
      // ignore
    }
    return 100;
  });

  const [isFullWidth, setIsFullWidthState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(UI_WIDTH_KEY);
      if (saved !== null) return saved === 'true';
    } catch (e) {
      // ignore
    }
    return false;
  });

  const setScale = (val: number) => {
    const clamped = Math.min(150, Math.max(75, val));
    setScaleState(clamped);
    try {
      localStorage.setItem(UI_SCALE_KEY, String(clamped));
    } catch (e) {
      // ignore
    }
  };

  const increaseScale = () => {
    setScaleState((prev) => {
      const next = Math.min(150, prev + 10);
      try {
        localStorage.setItem(UI_SCALE_KEY, String(next));
      } catch (e) {}
      return next;
    });
  };

  const decreaseScale = () => {
    setScaleState((prev) => {
      const next = Math.max(75, prev - 10);
      try {
        localStorage.setItem(UI_SCALE_KEY, String(next));
      } catch (e) {}
      return next;
    });
  };

  const resetScale = () => {
    setScale(100);
  };

  const setIsFullWidth = (full: boolean) => {
    setIsFullWidthState(full);
    try {
      localStorage.setItem(UI_WIDTH_KEY, String(full));
    } catch (e) {}
  };

  const toggleFullWidth = () => {
    setIsFullWidthState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(UI_WIDTH_KEY, String(next));
      } catch (e) {}
      return next;
    });
  };

  return (
    <UIScaleContext.Provider
      value={{
        scale,
        setScale,
        increaseScale,
        decreaseScale,
        resetScale,
        isFullWidth,
        setIsFullWidth,
        toggleFullWidth
      }}
    >
      {children}
    </UIScaleContext.Provider>
  );
};

export const useUIScale = () => {
  const context = useContext(UIScaleContext);
  if (!context) {
    throw new Error('useUIScale must be used within a UIScaleProvider');
  }
  return context;
};
