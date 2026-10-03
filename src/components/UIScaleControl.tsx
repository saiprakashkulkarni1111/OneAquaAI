import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Monitor, 
  Sliders, 
  Check
} from 'lucide-react';
import { useUIScale } from '../services/uiScale';

export const UIScaleControl: React.FC = () => {
  const { 
    scale, 
    increaseScale, 
    decreaseScale, 
    resetScale, 
    setScale, 
    isFullWidth, 
    toggleFullWidth 
  } = useUIScale();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const presets = [
    { label: 'Compact / Dense', value: 85 },
    { label: 'Standard / 100%', value: 100 },
    { label: 'Comfortable', value: 110 },
    { label: 'Presentation / 4K', value: 125 }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with Current Scale */}
      <div className="flex items-center bg-[#FAF7F2] border border-[#D8D0C0] rounded-xl p-1 shadow-xs">
        <button
          onClick={decreaseScale}
          disabled={scale <= 75}
          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-[#EFEAE0] disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
          title="Zoom UI Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-1 text-xs font-mono font-bold text-teal-800 hover:text-teal-950 hover:bg-[#EFEAE0] rounded-lg flex items-center gap-1 transition cursor-pointer"
          title="UI Display Scale Options"
        >
          <span>{scale}%</span>
        </button>

        <button
          onClick={increaseScale}
          disabled={scale >= 140}
          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-[#EFEAE0] disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
          title="Zoom UI In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-[#DFD7C7] mx-1" />

        <button
          onClick={toggleFullWidth}
          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
            isFullWidth 
              ? 'bg-teal-50 text-teal-800 border border-teal-300' 
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFEAE0]'
          }`}
          title={isFullWidth ? 'Switch to Standard Container' : 'Switch to Ultra-Wide Fluid Canvas'}
        >
          {isFullWidth ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#FAF7F2] border border-[#D8D0C0] rounded-2xl shadow-xl p-3 z-50 text-xs text-stone-800">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E3DCCF] text-stone-600 font-medium">
            <span className="flex items-center gap-1.5 text-stone-900 font-semibold">
              <Monitor className="w-3.5 h-3.5 text-teal-700" />
              Viewport UI Scale
            </span>
            <button
              onClick={resetScale}
              className="text-[10px] text-teal-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset 100%
            </button>
          </div>

          <div className="space-y-1">
            {presets.map((preset) => {
              const active = scale === preset.value;
              return (
                <button
                  key={preset.value}
                  onClick={() => {
                    setScale(preset.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                    active
                      ? 'bg-teal-100 text-teal-950 font-bold'
                      : 'text-stone-700 hover:bg-[#EFEAE0] hover:text-stone-950'
                  }`}
                >
                  <span>{preset.label}</span>
                  {active && <Check className="w-3.5 h-3.5 text-teal-700" />}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#E3DCCF] flex items-center justify-between text-[11px] text-stone-600">
            <span>Wide Screen Layout</span>
            <button
              onClick={toggleFullWidth}
              className="font-mono text-teal-700 hover:underline cursor-pointer font-semibold"
            >
              {isFullWidth ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
