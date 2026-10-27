import React from 'react';

interface FcpsLogoProps {
  customUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FcpsLogo: React.FC<FcpsLogoProps> = ({ customUrl, className = 'h-12 w-auto', style }) => {
  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt="Fairfax County Public Schools Logo"
        className={`${className} object-contain`}
        style={style}
        referrerPolicy="no-referrer"
      />
    );
  }

  // High-fidelity vector SVG reproduction of official Fairfax County Public Schools (FCPS) emblem
  return (
    <svg
      viewBox="0 0 300 180"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fairfax County Public Schools Logo"
    >
      <defs>
        <linearGradient id="fcpsTealGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00A8B5" />
          <stop offset="100%" stopColor="#006680" />
        </linearGradient>
        <linearGradient id="fcpsGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC800" />
          <stop offset="100%" stopColor="#E6A100" />
        </linearGradient>
      </defs>

      {/* Top 3 Gold Stars */}
      {/* Center Top Star */}
      <polygon
        points="150,12 153,20 161,20 155,25 157,33 150,28 143,33 145,25 139,20 147,20"
        fill="url(#fcpsGoldGrad)"
      />
      {/* Left Star */}
      <polygon
        points="120,24 122,30 128,30 123,34 125,40 120,36 115,40 117,34 112,30 118,30"
        fill="url(#fcpsGoldGrad)"
      />
      {/* Right Star */}
      <polygon
        points="180,24 182,30 188,30 183,34 185,40 180,36 175,40 177,34 172,30 178,30"
        fill="url(#fcpsGoldGrad)"
      />

      {/* Stylized Flame of Learning */}
      <path
        d="M 150,18 C 160,35 168,48 152,65 C 145,55 142,42 150,18 Z"
        fill="url(#fcpsTealGrad)"
      />
      <path
        d="M 152,28 C 158,40 160,50 148,64 C 144,54 146,42 152,28 Z"
        fill="url(#fcpsGoldGrad)"
      />

      {/* Open Book */}
      <path
        d="M 90,75 Q 120,60 148,72 L 148,88 Q 120,76 90,87 Z"
        fill="url(#fcpsTealGrad)"
      />
      <path
        d="M 210,75 Q 180,60 152,72 L 152,88 Q 180,76 210,87 Z"
        fill="url(#fcpsTealGrad)"
      />

      {/* Main Text: Fairfax County */}
      <text
        x="150"
        y="122"
        fontFamily="System-UI, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="800"
        fill="#006680"
        textAnchor="middle"
        letterSpacing="-0.5"
      >
        Fairfax County
      </text>

      {/* Secondary Text: PUBLIC SCHOOLS */}
      <text
        x="150"
        y="148"
        fontFamily="System-UI, -apple-system, sans-serif"
        fontSize="19"
        fontWeight="800"
        fill="#006680"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        PUBLIC SCHOOLS
      </text>

      {/* Tagline: ENGAGE • INSPIRE • THRIVE */}
      <text
        x="150"
        y="168"
        fontFamily="System-UI, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="800"
        fill="#475569"
        textAnchor="middle"
        letterSpacing="2"
      >
        ENGAGE • INSPIRE • THRIVE
      </text>
    </svg>
  );
};

