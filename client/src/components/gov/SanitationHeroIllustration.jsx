import React from 'react';

/**
 * Official Smart Restroom & Sanitation Hero Showcase
 * Directly represents public restroom complex hygiene, IoT telemetry & worker ops
 */
export default function SanitationHeroIllustration({
  className = 'w-full max-w-lg h-auto',
}) {
  return (
    <div className={`relative select-none flex flex-col items-center justify-center ${className}`}>
      {/* Decorative soft glowing backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/60 via-teal-50/40 to-emerald-100/50 rounded-3xl -z-10 blur-xl" />

      {/* Relevant Smart Sanitation & Public Restroom SVG Illustration */}
      <img
        src="/illustrations/undraw_smart_sanitation.svg"
        alt="Sanity Management Smart Restroom & Public Sanitation Complex"
        className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain drop-shadow-xl transition-transform duration-300 hover:scale-[1.02]"
        loading="eager"
      />

      {/* Official Civic Badge with Live Animated Verification */}
      <div className="mt-4 flex items-center gap-2.5 bg-white/95 border border-emerald-300 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-slate-800 backdrop-blur-xs">
        <img
          src="/illustrations/sanitation_cleaning.gif"
          alt="Hygiene Verified"
          className="w-6 h-6 rounded-lg object-cover"
        />
        <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wide">
          Smart Restroom Hygiene
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-[11px] font-bold text-slate-600">
          IoT Odor Telemetry & QR Feedback
        </span>
      </div>
    </div>
  );
}
