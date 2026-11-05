import React from 'react';

/**
 * State Emblem of India (Ashok Stambh) official representation
 */
export default function EmblemOfIndia({ className = 'h-12 w-auto', variant = 'gold' }) {
  const fillColor = variant === 'mono' ? '#1e293b' : variant === 'white' ? '#ffffff' : '#b45309';

  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="State Emblem of India"
    >
      {/* Central Lion Head */}
      <path
        d="M60 14 C52 14, 46 20, 46 28 C46 32, 48 36, 51 38 C48 41, 46 45, 46 50 C46 58, 52 64, 60 64 C68 64, 74 58, 74 50 C74 45, 72 41, 69 38 C72 36, 74 32, 74 28 C74 20, 68 14, 60 14 Z"
        fill={fillColor}
      />
      {/* Left Lion Head Profile */}
      <path
        d="M36 28 C30 28, 25 33, 25 40 C25 44, 27 48, 30 50 C27 53, 26 57, 26 62 C26 69, 31 74, 38 74 C41 74, 44 73, 46 71 C45 66, 45 61, 46 56 C42 54, 40 50, 40 45 C40 41, 42 38, 45 36 C43 31, 40 28, 36 28 Z"
        fill={fillColor}
        opacity="0.95"
      />
      {/* Right Lion Head Profile */}
      <path
        d="M84 28 C90 28, 95 33, 95 40 C95 44, 93 48, 90 50 C93 53, 94 57, 94 62 C94 69, 89 74, 82 74 C79 74, 76 73, 74 71 C75 66, 75 61, 74 56 C78 54, 80 50, 80 45 C80 41, 78 38, 75 36 C77 31, 80 28, 84 28 Z"
        fill={fillColor}
        opacity="0.95"
      />
      {/* Mane details & whiskers */}
      <circle cx="56" cy="32" r="2" fill="#ffffff" opacity="0.8" />
      <circle cx="64" cy="32" r="2" fill="#ffffff" opacity="0.8" />
      <path d="M57 38 L60 41 L63 38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M54 44 C57 46, 63 46, 66 44" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

      {/* Pillar Base / Abacus */}
      <path
        d="M20 78 L100 78 C102 78, 104 80, 104 82 L100 92 L20 92 L16 82 C16 80, 18 78, 20 78 Z"
        fill={fillColor}
      />

      {/* Ashoka Chakra in Center */}
      <circle cx="60" cy="85" r="5.5" stroke="#ffffff" strokeWidth="1.2" fill="none" />
      <circle cx="60" cy="85" r="1.5" fill="#ffffff" />
      {/* Chakra Spokes */}
      <line x1="60" y1="80" x2="60" y2="90" stroke="#ffffff" strokeWidth="0.8" />
      <line x1="55" y1="85" x2="65" y2="85" stroke="#ffffff" strokeWidth="0.8" />
      <line x1="56.5" y1="81.5" x2="63.5" y2="88.5" stroke="#ffffff" strokeWidth="0.8" />
      <line x1="56.5" y1="88.5" x2="63.5" y2="81.5" stroke="#ffffff" strokeWidth="0.8" />

      {/* Bull on Left */}
      <path d="M30 84 C28 82, 32 82, 34 85 C35 87, 33 89, 31 88 Z" fill="#ffffff" opacity="0.9" />
      {/* Horse on Right */}
      <path d="M88 84 C90 82, 86 82, 84 85 C83 87, 85 89, 87 88 Z" fill="#ffffff" opacity="0.9" />

      {/* Bell-shaped Inverted Lotus Base */}
      <path
        d="M24 94 C32 108, 88 108, 96 94 L92 98 C84 114, 36 114, 28 98 Z"
        fill={fillColor}
      />
      <path
        d="M34 112 L86 112 C88 112, 90 114, 90 116 L88 120 L32 120 L30 116 C30 114, 32 112, 34 112 Z"
        fill={fillColor}
      />

      {/* Satyameva Jayate (सत्यमेव जयते) in Devanagari */}
      <text
        x="60"
        y="142"
        textAnchor="middle"
        fontSize="13"
        fontFamily="'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif"
        fontWeight="800"
        fill={fillColor}
        letterSpacing="1.5"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}

