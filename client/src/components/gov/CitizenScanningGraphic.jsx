import React from 'react';

/**
 * Official unDraw Illustration
 * Source: https://undraw.co/illustrations (Customer Survey / QR Feedback)
 * Sanity Management Citizen Sanitation & Grievances
 */
export default function CitizenScanningGraphic({
  className = 'h-28 sm:h-32 w-auto',
}) {
  return (
    <div className={`relative select-none flex items-center justify-center ${className}`}>
      <img
        src="/illustrations/undraw_qr_code_scan.svg"
        alt="Citizen QR Code Feedback unDraw Illustration"
        className="h-full w-auto max-h-[140px] sm:max-h-[160px] object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
        loading="eager"
      />
    </div>
  );
}
