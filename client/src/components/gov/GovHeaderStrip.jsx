import React, { useState } from 'react';
import EmblemOfIndia from './EmblemOfIndia';
import SwachhBharatLogo from './SwachhBharatLogo';
import { useLocationCoords } from '../../context/LocationContext';
import { FaLocationCrosshairs, FaUniversalAccess } from 'react-icons/fa6';

/**
 * Standard Government of India (MoHUA / Swachh Bharat) Top Utility & Emblem Strip
 */
export default function GovHeaderStrip() {
  const { coords, hasLiveGps, requestLocation } = useLocationCoords();
  const [lang, setLang] = useState('EN'); // 'EN' | 'HI'

  const handleFontSize = (delta) => {
    const root = document.documentElement;
    const current = parseFloat(window.getComputedStyle(root).fontSize) || 16;
    const next = Math.min(20, Math.max(14, current + delta));
    root.style.fontSize = `${next}px`;
  };

  const resetFontSize = () => {
    document.documentElement.style.fontSize = '';
  };

  return (
    <div className="w-full bg-slate-900 text-white select-none relative z-50">
      {/* 3px India Flag Tricolor Top Ribbon */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" title="Saffron (Strength and Courage)" />
        <div className="flex-1 bg-[#FFFFFF]" title="White (Peace and Truth)" />
        <div className="flex-1 bg-[#138808]" title="Green (Fertility and Growth)" />
      </div>

      {/* Main Government Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: State Emblem + Official Ministry Designation */}
        <div className="flex items-center gap-3">
          <EmblemOfIndia className="h-10 w-auto shrink-0" variant="gold" />
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-100 tracking-tight text-[11px] sm:text-xs">
                भारत सरकार
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-extrabold text-amber-300 tracking-tight text-[11px] sm:text-xs">
                Government of India
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium">
              आवासन और शहरी कार्य मंत्रालय • Ministry of Housing and Urban Affairs
            </div>
          </div>
        </div>

        {/* Center: Swachh Bharat Mission Urban 2.0 National Mission Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-950/80 to-slate-900 px-3.5 py-1 rounded-full border border-emerald-500/30 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-black text-emerald-200 tracking-wide">
            स्वच्छ भारत मिशन (शहरी 2.0) • National Smart Sanitation Platform
          </span>
        </div>

        {/* Right: Swachh Bharat Emblem + Accessibility Controls + GPS */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Swachh Bharat Gandhi Specs Logo */}
          <div className="hidden md:flex items-center bg-white/10 hover:bg-white/15 px-3 py-1 rounded-xl border border-white/15 transition-colors">
            <SwachhBharatLogo className="h-7 w-auto" showSlogan={false} />
            <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider ml-1">
              Mission Urban 2.0
            </span>
          </div>

          {/* GPS Coordinate Indicator */}
          <button
            type="button"
            onClick={requestLocation}
            className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Real-time browser GPS tracking"
          >
            <FaLocationCrosshairs className={`w-3 h-3 ${hasLiveGps ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">GPS:</span>
            <span>{coords.lat.toFixed(2)}°, {coords.lng.toFixed(2)}°</span>
          </button>

          {/* Accessibility Font Size Controls */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px] font-bold">
            <button
              onClick={() => handleFontSize(-1)}
              className="px-2 py-0.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={resetFontSize}
              className="px-2 py-0.5 text-amber-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontSize(1)}
              className="px-2 py-0.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Bilingual Language Switch */}
          <button
            type="button"
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="px-2.5 py-1 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-emerald-200 hover:text-white text-[11px] font-black uppercase tracking-wide border border-emerald-600/40 transition-colors cursor-pointer"
          >
            {lang === 'EN' ? 'हिन्दी' : 'English'}
          </button>
        </div>
      </div>
    </div>
  );
}

