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
      className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col items-center justify-between p-6 sm:p-8 text-white transition-opacity duration-300 ${
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
      <div className="w-full max-w-lg flex items-center justify-between text-xs text-slate-300 pt-2">
        <div className="flex items-center gap-3">
          <EmblemOfIndia className="h-8 w-auto shrink-0" variant="white" />
          <div className="leading-tight text-left">
            <span className="font-bold text-[11px] text-amber-300 block">
              GOVERNMENT OF INDIA
            </span>
            <span className="font-semibold text-[10px] text-slate-300">
              Ministry of Housing & Urban Affairs
            </span>
          </div>
        </div>
        <button
          onClick={handleFinish}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
        >
          Skip &rarr;
        </button>
      </div>

      {/* Center Hero Animation */}
      <div className="text-center max-w-lg w-full space-y-6 flex flex-col items-center my-auto">
        {/* Animated Icon with Pulsing Rings & Sparkle */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full bg-emerald-500/20 animate-ping duration-1000"></div>
          <div className="absolute w-36 h-36 rounded-full bg-emerald-500/30 animate-pulse"></div>
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-emerald-400/40 animate-float">
            <img
              src="/logo.png"
              alt="Sanity Management Logo"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
          {/* Subtle live sparkle GIF badge */}
          <div className="absolute -top-1 -right-1 bg-white p-1 rounded-xl shadow-lg border border-emerald-300">
            <img
              src="/illustrations/sanitation_cleaning.gif"
              alt="Clean badge"
              className="w-7 h-7 rounded-lg object-cover"
            />
          </div>
        </div>

        <div>
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-4 py-1.5 rounded-full shadow-inner inline-block">
            Swachh Bharat Mission (Urban 2.0)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-3.5 tracking-tight">
            SANITY MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-md mx-auto leading-relaxed font-medium">
            Official Smart Public Restroom Monitoring, IoT Odor & Water Telemetry, Citizen QR Grievances & Rapid Municipal Dispatch
          </p>
        </div>

        {/* GPS Location Status Pill */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/20 w-full flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                hasLiveGps ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
              }`}
            >
              <FaLocationDot className="w-5 h-5" />
            </div>
            <div className="text-left">
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
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              Grant GPS
            </button>
          )}
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full space-y-2.5">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 h-full transition-all duration-300 ease-out rounded-full shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-mono flex items-center justify-center gap-2 font-medium">
            {progress < 100 ? (
              <FaSpinner className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <FaCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{statusText}</span>
          </p>
        </div>
      </div>

      {/* Bottom Launch Button */}
      <div className="w-full max-w-lg pt-4">
        <button
          onClick={handleFinish}
          className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-900/60 flex items-center justify-center gap-2.5 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Enter Smart Sanitation Platform</span>
          <FaArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
