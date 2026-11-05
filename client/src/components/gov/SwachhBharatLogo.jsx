import React from 'react';

/**
 * Official Swachh Bharat Abhiyan Logo (Gandhi Spectacles with Devanagari text & slogan)
 */
export default function SwachhBharatLogo({ className = 'h-11 w-auto', showSlogan = true }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 240 100"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Swachh Bharat Logo"
      >
        {/* Left spectacle temple line */}
        <path
          d="M10 38 Q25 32 40 40"
          stroke="#1e293b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Left Lens Frame */}
        <circle
          cx="75"
          cy="48"
          r="32"
          stroke="#1e293b"
          strokeWidth="4.5"
          fill="#ffffff"
        />
        {/* Left Lens Text: स्वच्छ in Indian Saffron */}
        <text
          x="75"
          y="56"
          textAnchor="middle"
          fontSize="23"
          fontWeight="900"
          fontFamily="'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif"
          fill="#ea580c"
          letterSpacing="0.5"
        >
          स्वच्छ
        </text>

        {/* Bridge connecting spectacles with Tricolor accents */}
        <path
          d="M107 46 Q120 36 133 46"
          stroke="#1e293b"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Right Lens Frame */}
        <circle
          cx="165"
          cy="48"
          r="32"
          stroke="#1e293b"
          strokeWidth="4.5"
          fill="#ffffff"
        />
        {/* Right Lens Text: भारत in Indian Emerald Green */}
        <text
          x="165"
          y="56"
          textAnchor="middle"
          fontSize="23"
          fontWeight="900"
          fontFamily="'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif"
          fill="#16a34a"
          letterSpacing="0.5"
        >
          भारत
        </text>

        {/* Right spectacle temple line */}
        <path
          d="M200 40 Q215 32 230 38"
          stroke="#1e293b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Slogan Banner: "एक कदम स्वच्छता की ओर" */}
        {showSlogan && (
          <text
            x="120"
            y="94"
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="800"
            fontFamily="'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif"
            fill="#0f766e"
            letterSpacing="0.6"
          >
            एक कदम स्वच्छता की ओर
          </text>
        )}
      </svg>
    </div>
  );
}

