import React from 'react';

interface GlenForestLogoProps {
  customUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GlenForestLogo: React.FC<GlenForestLogoProps> = ({ customUrl, className = 'h-16 w-auto', style }) => {
  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt="Glen Forest Elementary Eagles Logo"
        className={`${className} object-contain`}
        style={style}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Precision SVG reproduction of the official Glen Forest Eagles crest logo
  return (
    <svg
      viewBox="0 0 500 480"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Glen Forest Eagles Crest Logo"
    >
      <defs>
        <linearGradient id="gfNavyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B365D" />
          <stop offset="100%" stopColor="#0B1B33" />
        </linearGradient>

        <path id="topRibbonPath" d="M 145,115 C 210,88 290,88 355,115" fill="none" />
        <path id="mottoPath" d="M 155,335 C 215,360 285,360 345,335" fill="none" />
      </defs>

      {/* 1. Bright Yellow Outer Crest Outline */}
      <path
        d="M 250,15 
           C 295,55 365,12 465,18 
           C 425,95 485,110 465,225 
           C 435,280 405,298 438,335 
           C 395,360 325,430 250,470 
           C 175,430 105,360 62,335 
           C 95,298 65,280 35,225 
           C 15,110 75,95 35,18 
           C 135,12 205,55 250,15 Z"
        fill="#FFE800"
      />

      {/* 2. Main Dark Navy Wings & Shield Shape */}
      <path
        d="M 250,28 
           C 290,65 355,24 448,30 
           C 410,102 468,118 448,218 
           C 420,270 392,288 422,325 
           C 382,348 318,412 250,448 
           C 182,412 118,348 78,325 
           C 108,288 80,270 52,218 
           C 32,118 90,102 52,30 
           C 145,24 210,65 250,28 Z"
        fill="url(#gfNavyGrad)"
      />

      {/* 3. Sweeping Wing Feathers (White Highlights & Layers) */}
      <path
        d="M 52,42 C 90,75 145,100 205,112 C 160,118 110,108 70,85 Z
           M 45,80 C 88,108 148,132 210,140 C 165,145 115,135 60,112 Z
           M 40,122 C 82,142 138,162 195,168 C 152,172 102,162 50,145 Z"
        fill="#FFFFFF"
      />
      <path
        d="M 448,42 C 410,75 355,100 295,112 C 340,118 390,108 430,85 Z
           M 455,80 C 412,108 352,132 290,140 C 335,145 385,135 440,112 Z
           M 460,122 C 418,142 362,162 305,168 C 348,172 398,162 450,145 Z"
        fill="#FFFFFF"
      />

      {/* 4. Upper Yellow Arch Banner: GLEN FOREST 1957 ELEMENTARY */}
      <path
        d="M 135,118 C 195,88 305,88 365,118 L 358,138 C 302,112 198,112 142,138 Z"
        fill="#FFE800"
      />
      <text
        fontFamily="Arial Black, Impact, sans-serif"
        fontSize="12.5"
        fontWeight="900"
        fill="#0B1B33"
        letterSpacing="1.2"
      >
        <textPath href="#topRibbonPath" startOffset="50%" textAnchor="middle">
          GLEN FOREST  1957  ELEMENTARY
        </textPath>
      </text>

      {/* 5. Central Bald Eagle Head */}
      <path
        d="M 215,182 C 220,138 252,132 282,140 C 298,146 300,160 295,178 C 290,205 260,222 215,212 C 222,198 218,188 215,182 Z"
        fill="#FFFFFF"
      />
      {/* Eagle Beak */}
      <path
        d="M 272,158 C 298,155 306,172 298,188 C 285,185 275,176 272,168 Z"
        fill="#FF6D00"
        stroke="#E65100"
        strokeWidth="1.2"
      />
      {/* Eye & Details */}
      <circle cx="258" cy="162" r="3.8" fill="#0B1B33" />
      <circle cx="259.5" cy="160.5" r="1.2" fill="#FFFFFF" />
      <path d="M 272,168 C 284,171 292,174 296,178" stroke="#0B1B33" strokeWidth="2" fill="none" />

      {/* 6. Central "EAGLES" Block Typography Banner */}
      <path
        d="M 60,218 L 440,218 C 455,218 465,235 450,278 C 438,298 418,308 398,308 L 102,308 C 82,308 62,298 50,278 C 35,235 45,218 60,218 Z"
        fill="#0B1B33"
        stroke="#FFE800"
        strokeWidth="6"
      />
      {/* EAGLES Text with white/blue 3D depth */}
      <text
        x="250"
        y="288"
        fontFamily="Impact, Arial Black, sans-serif"
        fontSize="78"
        fontWeight="900"
        fill="#FFFFFF"
        stroke="#FFE800"
        strokeWidth="2.5"
        textAnchor="middle"
        letterSpacing="3"
      >
        EAGLES
      </text>

      {/* 7. Bottom Ribbon: BELIEVE • ACHIEVE • SUCCEED */}
      <path
        d="M 115,310 C 175,335 325,335 385,310 L 375,355 C 310,380 190,380 125,355 Z"
        fill="#0B1B33"
        stroke="#FFE800"
        strokeWidth="3.5"
      />
      <text
        fontFamily="Arial Black, Impact, sans-serif"
        fontSize="14.5"
        fontWeight="900"
        fill="#FFE800"
        letterSpacing="1.5"
      >
        <textPath href="#mottoPath" startOffset="50%" textAnchor="middle">
          BELIEVE  •  ACHIEVE  •  SUCCEED
        </textPath>
      </text>

      {/* 8. Fanning Tail Feathers */}
      <path
        d="M 210,378 L 182,435 L 222,398 L 250,455 L 278,398 L 318,435 L 290,378 Z"
        fill="#FFFFFF"
        stroke="#0B1B33"
        strokeWidth="2.5"
      />
    </svg>
  );
};

