import React, { useState, useEffect } from 'react';
import { useLocationCoords } from '../context/LocationContext';
import EmblemOfIndia from './gov/EmblemOfIndia';
import SwachhBharatLogo from './gov/SwachhBharatLogo';
import {
  FaRestroom,
  FaLocationDot,
  FaArrowRight,
  FaSpinner,
  FaCheck,
} from 'react-icons/fa6';

export default function SplashScreen({ onComplete }) {
  const { coords, hasLiveGps, isLocating, requestLocation } = useLocationCoords();
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Municipal Sanitation Cloud...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Step 1: Connect to Cloud API
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Connecting to Sanity Management Cloud & IoT Engine...');
    }, 500);

    // Step 2: Request Location & Sync GIS
    const t2 = setTimeout(() => {
      setProgress(75);
      setStatusText('Syncing Municipal GIS Boundaries & Coordinates...');
      requestLocation();
    }, 1100);

    // Step 3: Verified
    const t3 = setTimeout(() => {
      setProgress(95);
      setStatusText('Civic Restroom Directory Verified & Ready.');
    }, 1700);

    // Step 4: Auto transition
    const t4 = setTimeout(() => {
      setProgress(100);
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 350);
    }, 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 text-white overflow-y-auto overflow-x-hidden transition-opacity duration-300 select-none min-h-screen ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3px Tricolor Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-[#FFFFFF]" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Top Emblem Bar */}
      <div className="w-full max-w-lg flex items-center justify-between text-xs text-slate-300 pt-2 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <EmblemOfIndia className="h-7 sm:h-8 w-auto shrink-0" variant="white" />
          <div className="leading-tight text-left">
            <span className="font-bold text-[10px] sm:text-[11px] text-amber-300 block">
              GOVERNMENT OF INDIA
            </span>
            <span className="font-semibold text-[9px] sm:text-[10px] text-slate-300">
              Ministry of Housing & Urban Affairs
            </span>
          </div>
        </div>
        <button
          onClick={handleFinish}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold shrink-0"
        >
          Skip &rarr;
        </button>
      </div>

      {/* Center Hero Animation */}
      <div className="text-center max-w-lg w-full space-y-4 sm:space-y-6 flex flex-col items-center my-auto py-4">
        {/* Animated Icon with Pulsing Rings & Sparkle */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-emerald-500/20 animate-ping duration-1000"></div>
          <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-emerald-500/30 animate-pulse"></div>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-emerald-400/40 animate-float">
            <img
              src="/logo.png"
              alt="Sanity Management Logo"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
          {/* Live sparkle GIF badge */}
          <div className="absolute -top-1 -right-1 bg-white p-1 rounded-xl shadow-lg border border-emerald-300">
            <img
              src="/illustrations/sanitation_cleaning.gif"
              alt="Clean badge"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover"
            />
          </div>
        </div>

        <div>
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-inner inline-block">
            Swachh Bharat Mission (Urban 2.0)
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mt-2 sm:mt-3.5 tracking-tight">
            SANITY MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 sm:mt-2 max-w-md mx-auto leading-relaxed font-medium px-2">
            Official Smart Public Restroom Monitoring, IoT Odor & Water Telemetry, Citizen QR Grievances & Rapid Municipal Dispatch
          </p>
        </div>

        {/* GPS Location Status Pill */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 text-left">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                hasLiveGps ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
              }`}
            >
              <FaLocationDot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-xs text-slate-300 font-extrabold uppercase tracking-wider">
                {hasLiveGps ? 'GPS Location Locked' : isLocating ? 'Acquiring GPS...' : 'Location Services'}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-white">
                {coords.lat.toFixed(3)}° N, {coords.lng.toFixed(3)}° E
              </span>
            </div>
          </div>

          {!hasLiveGps && (
            <button
              onClick={requestLocation}
              className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm shrink-0"
            >
              Grant GPS
            </button>
          )}
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full space-y-2">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 h-full transition-all duration-300 ease-out rounded-full shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-mono flex items-center justify-center gap-2 font-medium px-2 text-center">
            {progress < 100 ? (
              <FaSpinner className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />
            ) : (
              <FaCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{statusText}</span>
          </p>
        </div>
      </div>

      {/* Bottom Launch Button */}
      <div className="w-full max-w-lg pt-2 pb-2 sm:pb-0 shrink-0">
        <button
          onClick={handleFinish}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-900/60 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Enter Smart Sanitation Platform</span>
          <FaArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
