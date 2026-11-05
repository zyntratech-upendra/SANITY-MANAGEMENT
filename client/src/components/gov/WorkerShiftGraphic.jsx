import React from 'react';

/**
 * Official unDraw Illustration
 * Source: https://undraw.co/illustrations (Clean Up / Sanitation Field Specialist)
 * Sanity Management Field Crew Ops
 */
export default function WorkerShiftGraphic({
  className = 'h-28 sm:h-32 w-auto',
}) {
  return (
    <div className={`relative select-none flex items-center justify-center ${className}`}>
      <img
        src="/illustrations/undraw_clean_up.svg"
        alt="Sanitation Worker Clean Up unDraw Illustration"
        className="h-full w-auto max-h-[140px] sm:max-h-[160px] object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
        loading="eager"
      />
    </div>
  );
}
