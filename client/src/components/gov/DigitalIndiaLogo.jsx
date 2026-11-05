import React from 'react';

/**
 * Digital India Official Emblem representation
 */
export default function DigitalIndiaLogo({ className = 'h-9 w-auto' }) {
  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <svg
        viewBox="0 0 160 50"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Digital India Logo"
      >
        {/* Tricolor digital swirl */}
        <path
          d="M12 25 C12 16, 20 10, 28 10 C36 10, 42 16, 42 25 C42 34, 34 40, 26 40 C18 40, 16 34, 20 30 C24 26, 30 28, 30 32"
          stroke="#ff9933"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M18 25 C18 19, 23 15, 28 15 C33 15, 36 19, 36 25 C36 30, 31 34, 27 34"
          stroke="#138808"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="28" cy="25" r="2.5" fill="#000080" />

        {/* Text "Digital India" */}
        <text
          x="52"
          y="23"
          fontSize="14"
          fontWeight="900"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fill="#1e293b"
          letterSpacing="0.2"
        >
          Digital India
        </text>
        <text
          x="52"
          y="36"
          fontSize="8.5"
          fontWeight="700"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fill="#64748b"
          letterSpacing="0.8"
        >
          POWER TO EMPOWER
        </text>
      </svg>
    </div>
  );
}

