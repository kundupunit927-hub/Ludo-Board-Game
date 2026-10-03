import React from 'react';

/**
 * High-fidelity vector graphics matching the reference design:
 * Ludo 3D Logo, Pawns, Dice, Numbers 2 & 4, Earth globe, Star cube, Badges & Dock icons.
 */

// 1. Repeating Diamond Pattern for the Royal Purple Wallpaper
export const PurpleDiamondPattern: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="ludo-diamond-pat" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M20 0 L40 20 L20 40 L0 20 Z"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <path
          d="M20 8 L32 20 L20 32 L8 20 Z"
          fill="none"
          stroke="#c084fc"
          strokeWidth="0.8"
          strokeOpacity="0.2"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ludo-diamond-pat)" />
  </svg>
);

// 2. Center 3D Ludo Crown Logo with Tilted Board & Dice
export const LudoCrownLogo: React.FC<{ className?: string }> = ({ className = 'w-48 h-32' }) => (
  <svg viewBox="0 0 320 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.6" />
      </filter>
      {/* Gold gradient */}
      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      {/* Pink/Magenta 3D extrusion gradient */}
      <linearGradient id="pink-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="50%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
      {/* Board gradient */}
      <linearGradient id="board-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#4c1d95" />
      </linearGradient>
      {/* Crown gold */}
      <linearGradient id="crown-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    {/* Tilted Isometric Ludo Board Base */}
    <g filter="url(#logo-shadow)" transform="translate(0, 45)">
      {/* Golden border platform */}
      <polygon
        points="160,50 280,105 160,160 40,105"
        fill="#f59e0b"
        stroke="#ca8a04"
        strokeWidth="4"
      />
      <polygon
        points="160,55 272,105 160,154 48,105"
        fill="url(#board-grad)"
        stroke="#e2e8f0"
        strokeWidth="2"
      />
      {/* Inner mini grid lines */}
      <polygon points="160,65 250,105 160,145 70,105" fill="#10b981" fillOpacity="0.85" />
      <polygon points="160,75 220,105 160,135 100,105" fill="#ffffff" fillOpacity="0.9" />

      {/* 3D White Die in the center */}
      <g transform="translate(145, 95)">
        {/* Die Top */}
        <polygon points="15,0 30,8 15,16 0,8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        {/* Die Left */}
        <polygon points="0,8 15,16 15,32 0,24" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        {/* Die Right */}
        <polygon points="15,16 30,8 30,24 15,32" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        {/* Dots */}
        <circle cx="15" cy="8" r="2" fill="#e11d48" />
        <circle cx="8" cy="20" r="1.5" fill="#0f172a" />
        <circle cx="22" cy="20" r="1.5" fill="#0f172a" />
      </g>
    </g>

    {/* Golden Royal Crown */}
    <g transform="translate(132, 10)">
      <path
        d="M0,32 L8,8 L24,22 L40,8 L48,32 Z"
        fill="url(#crown-grad)"
        stroke="#78350f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Crown jewels */}
      <circle cx="8" cy="8" r="3.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
      <circle cx="24" cy="22" r="3.5" fill="#38bdf8" stroke="#fff" strokeWidth="1" />
      <circle cx="40" cy="8" r="3.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
      {/* Crown base gems */}
      <rect x="6" y="27" width="36" height="5" rx="2" fill="#b45309" />
      <circle cx="15" cy="29.5" r="1.5" fill="#fef08a" />
      <circle cx="24" cy="29.5" r="1.5" fill="#38bdf8" />
      <circle cx="33" cy="29.5" r="1.5" fill="#fef08a" />
    </g>

    {/* 3D Extruded "Ludo" Text */}
    <g filter="url(#logo-shadow)">
      {/* 3D Pink Bevel Behind */}
      <text
        x="160"
        y="112"
        textAnchor="middle"
        fontSize="76"
        fontFamily="'Fredoka', 'Poppins', sans-serif"
        fontWeight="900"
        fill="url(#pink-grad)"
        stroke="#881337"
        strokeWidth="14"
        strokeLinejoin="round"
        letterSpacing="2"
      >
        Ludo
      </text>
      {/* Inner Pink layer */}
      <text
        x="160"
        y="108"
        textAnchor="middle"
        fontSize="76"
        fontFamily="'Fredoka', 'Poppins', sans-serif"
        fontWeight="900"
        fill="#e11d48"
        stroke="#be123c"
        strokeWidth="8"
        strokeLinejoin="round"
        letterSpacing="2"
      >
        Ludo
      </text>
      {/* Shiny Golden Face */}
      <text
        x="160"
        y="104"
        textAnchor="middle"
        fontSize="76"
        fontFamily="'Fredoka', 'Poppins', sans-serif"
        fontWeight="900"
        fill="url(#gold-grad)"
        stroke="#78350f"
        strokeWidth="3"
        strokeLinejoin="round"
        letterSpacing="2"
      >
        Ludo
      </text>

      {/* "CLASSIC" small badge */}
      <g transform="translate(195, 62)">
        <rect x="0" y="0" width="62" height="18" rx="6" fill="#1e1b4b" stroke="#eab308" strokeWidth="1.5" />
        <text
          x="31"
          y="13"
          textAnchor="middle"
          fontSize="10"
          fontWeight="900"
          fontFamily="'Poppins', sans-serif"
          fill="#fef08a"
          letterSpacing="1"
        >
          CLASSIC
        </text>
      </g>
    </g>
  </svg>
);

// 3. 3D Pawns Graphic (Red, Green, Yellow, Blue)
export const Pawn3D: React.FC<{ color: 'red' | 'green' | 'yellow' | 'blue'; size?: number }> = ({
  color,
  size = 32,
}) => {
  const colorMap = {
    red: {
      head1: '#f87171',
      head2: '#dc2626',
      body1: '#ef4444',
      body2: '#991b1b',
      base: '#7f1d1d',
    },
    blue: {
      head1: '#60a5fa',
      head2: '#2563eb',
      body1: '#3b82f6',
      body2: '#1e40af',
      base: '#1e3a8a',
    },
    green: {
      head1: '#4ade80',
      head2: '#16a34a',
      body1: '#22c55e',
      body2: '#166534',
      base: '#14532d',
    },
    yellow: {
      head1: '#fde047',
      head2: '#ca8a04',
      body1: '#eab308',
      body2: '#854d0e',
      base: '#713f12',
    },
  }[color];

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none">
      <defs>
        <radialGradient id={`pawn-head-${color}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="30%" stopColor={colorMap.head1} />
          <stop offset="100%" stopColor={colorMap.head2} />
        </radialGradient>
        <linearGradient id={`pawn-body-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colorMap.body1} />
          <stop offset="60%" stopColor={colorMap.body2} />
          <stop offset="100%" stopColor={colorMap.base} />
        </linearGradient>
      </defs>
      {/* Base shadow */}
      <ellipse cx="20" cy="48" rx="16" ry="4" fill="#000000" fillOpacity="0.35" />
      {/* Pawn Base Rim */}
      <ellipse cx="20" cy="45" rx="15" ry="4.5" fill={colorMap.base} />
      <ellipse cx="20" cy="43" rx="14" ry="4" fill={colorMap.body1} />
      {/* Pawn Body */}
      <path
        d="M13,26 C13,26 8,39 6,43 C10,46 30,46 34,43 C32,39 27,26 27,26 Z"
        fill={`url(#pawn-body-${color})`}
      />
      {/* Neck ring */}
      <ellipse cx="20" cy="25" rx="8" ry="2.5" fill={colorMap.base} />
      <ellipse cx="20" cy="24" rx="7.5" ry="2" fill={colorMap.head1} />
      {/* Head sphere */}
      <circle cx="20" cy="14" r="12" fill={`url(#pawn-head-${color})`} />
      {/* Highlight gleam */}
      <ellipse cx="17" cy="10" rx="4" ry="2.5" fill="#ffffff" fillOpacity="0.65" transform="rotate(-20 17 10)" />
    </svg>
  );
};

// 4. Stacked Pawns for Two Player & Four Player Cards (Slightly more compact for lighter screen feel)
export const TwoPlayerPawnsStack: React.FC = () => (
  <div className="relative w-13 h-14 flex items-center justify-center">
    <div className="absolute left-0 bottom-0 z-10 transform -rotate-6">
      <Pawn3D color="red" size={28} />
    </div>
    <div className="absolute right-0 bottom-1 z-0 transform rotate-12">
      <Pawn3D color="blue" size={26} />
    </div>
  </div>
);

export const FourPlayerPawnsStack: React.FC = () => (
  <div className="relative w-14 h-14 flex items-center justify-center">
    <div className="absolute left-0 top-0 z-0">
      <Pawn3D color="green" size={22} />
    </div>
    <div className="absolute right-0 top-0 z-0">
      <Pawn3D color="yellow" size={22} />
    </div>
    <div className="absolute left-0.5 bottom-0 z-10">
      <Pawn3D color="red" size={26} />
    </div>
    <div className="absolute right-0.5 bottom-0 z-10">
      <Pawn3D color="blue" size={26} />
    </div>
  </div>
);

// 5. Giant 3D Golden Numbers "2" & "4" (Light and balanced)
export const GoldenNumber3D: React.FC<{ num: '2' | '4' }> = ({ num }) => (
  <svg viewBox="0 0 100 110" className="w-14 h-16 select-none filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
    <defs>
      <linearGradient id={`gold-num-${num}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <linearGradient id={`gold-bevel-${num}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ca8a04" />
        <stop offset="50%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
    </defs>
    {/* 3D Extrusion base */}
    <text
      x="50"
      y="94"
      textAnchor="middle"
      fontSize="96"
      fontFamily="'Fredoka', 'Poppins', sans-serif"
      fontWeight="900"
      fill={`url(#gold-bevel-${num})`}
      stroke="#713f12"
      strokeWidth="10"
      strokeLinejoin="round"
    >
      {num}
    </text>
    {/* Mid Bevel */}
    <text
      x="50"
      y="90"
      textAnchor="middle"
      fontSize="96"
      fontFamily="'Fredoka', 'Poppins', sans-serif"
      fontWeight="900"
      fill="#b45309"
      stroke="#92400e"
      strokeWidth="4"
      strokeLinejoin="round"
    >
      {num}
    </text>
    {/* Golden Face */}
    <text
      x="50"
      y="86"
      textAnchor="middle"
      fontSize="96"
      fontFamily="'Fredoka', 'Poppins', sans-serif"
      fontWeight="900"
      fill={`url(#gold-num-${num})`}
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      {num}
    </text>
  </svg>
);

// 6. Secondary Mode Graphics
// A. Play with Friends (Mini board with dice)
export const FriendsMiniBoardGraphic: React.FC = () => (
  <svg viewBox="0 0 100 85" className="w-13 h-11">
    <g transform="translate(10, 10)">
      {/* Tilted board */}
      <polygon points="40,5 75,25 40,48 5,25" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
      <polygon points="40,8 72,25 40,44 8,25" fill="#e2e8f0" />
      {/* Quadrants */}
      <polygon points="40,8 55,16 40,25 25,16" fill="#ef4444" />
      <polygon points="55,16 72,25 55,34 40,25" fill="#22c55e" />
      <polygon points="40,25 55,34 40,44 25,34" fill="#eab308" />
      <polygon points="25,16 40,25 25,34 8,25" fill="#3b82f6" />
      {/* White Die on top */}
      <g transform="translate(32, 12)">
        <polygon points="10,0 20,5 10,11 0,5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <polygon points="0,5 10,11 10,21 0,15" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
        <polygon points="10,11 20,5 20,15 10,21" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
        <circle cx="10" cy="5.5" r="1.5" fill="#dc2626" />
        <circle cx="5" cy="13" r="1" fill="#0f172a" />
        <circle cx="15" cy="13" r="1" fill="#0f172a" />
      </g>
    </g>
  </svg>
);

// B. Meta Game Mode (Golden star cube with lightning sparks)
export const MetaGameCubeGraphic: React.FC = () => (
  <svg viewBox="0 0 100 85" className="w-16 h-14">
    <defs>
      <linearGradient id="cube-top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#facc15" />
      </linearGradient>
      <linearGradient id="cube-left" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <linearGradient id="cube-right" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>
    {/* Lightning sparks */}
    <path d="M16 28 L28 35 L22 38 L34 46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M84 28 L72 35 L78 38 L66 46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Glow */}
    <circle cx="50" cy="40" r="28" fill="#facc15" fillOpacity="0.25" />
    {/* 3D Cube */}
    <g transform="translate(25, 15)">
      {/* Top face */}
      <polygon points="25,0 48,12 25,24 2,12" fill="url(#cube-top)" stroke="#ca8a04" strokeWidth="1" />
      {/* Left face */}
      <polygon points="2,12 25,24 25,48 2,36" fill="url(#cube-left)" stroke="#a16207" strokeWidth="1" />
      {/* Right face */}
      <polygon points="25,24 48,12 48,36 25,48" fill="url(#cube-right)" stroke="#78350f" strokeWidth="1" />
      {/* Center Star on top face */}
      <path
        d="M25,5 L27,10 L32,10.5 L28,14 L29,19 L25,16.5 L21,19 L22,14 L18,10.5 L23,10 Z"
        fill="#ffffff"
        stroke="#eab308"
        strokeWidth="1"
      />
    </g>
  </svg>
);

// C. Play Online (Earth Globe with 4 orbiting pawns)
export const PlayOnlineGlobeGraphic: React.FC = () => (
  <svg viewBox="0 0 110 85" className="w-14 h-11">
    <defs>
      <radialGradient id="globe-ocean" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="40%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0369a1" />
      </radialGradient>
    </defs>
    {/* Orbit dashed ring */}
    <ellipse cx="55" cy="45" rx="44" ry="18" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.85" />
    
    {/* Earth Globe Sphere */}
    <circle cx="55" cy="42" r="24" fill="url(#globe-ocean)" stroke="#bae6fd" strokeWidth="1.5" />
    {/* Continents (green shapes) */}
    <path
      d="M44 32 C48 28 56 30 58 35 C60 40 52 44 48 42 C44 40 42 35 44 32 Z"
      fill="#22c55e"
      opacity="0.9"
    />
    <path
      d="M58 44 C64 42 70 46 68 52 C65 56 58 55 58 44 Z"
      fill="#22c55e"
      opacity="0.9"
    />
    {/* Globe gleam */}
    <ellipse cx="50" cy="34" rx="7" ry="4" fill="#ffffff" fillOpacity="0.4" transform="rotate(-20 50 34)" />

    {/* 4 Pawns around the globe */}
    {/* Top Green pawn */}
    <circle cx="24" cy="30" r="5" fill="#22c55e" stroke="#fff" strokeWidth="1" />
    {/* Top Yellow pawn */}
    <circle cx="86" cy="30" r="5" fill="#eab308" stroke="#fff" strokeWidth="1" />
    {/* Bottom Red pawn */}
    <circle cx="24" cy="58" r="5" fill="#ef4444" stroke="#fff" strokeWidth="1" />
    {/* Bottom Blue pawn */}
    <circle cx="86" cy="58" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1" />
  </svg>
);

// 7. Floating Badges Icons
// A. Target Dartboard (Top Left)
export const TargetDartIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" className="drop-shadow-md">
    {/* Target rings */}
    <circle cx="25" cy="25" r="23" fill="#ffffff" stroke="#991b1b" strokeWidth="2" />
    <circle cx="25" cy="25" r="18" fill="#dc2626" />
    <circle cx="25" cy="25" r="12" fill="#ffffff" />
    <circle cx="25" cy="25" r="6" fill="#dc2626" />
    {/* Yellow dart arrow hitting bullseye */}
    <g transform="translate(25, 25)">
      <path d="M-1 -1 L18 -18" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
      <polygon points="18,-18 24,-16 20,-10" fill="#f59e0b" />
      <polygon points="20,-20 25,-15 15,-25" fill="#facc15" />
    </g>
  </svg>
);

// B. Free Coins Sack (Left)
export const FreeCoinsSackIcon: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <div className="flex flex-col items-center">
    <svg width={size} height={size * 0.85} viewBox="0 0 54 46" className="drop-shadow-md">
      <defs>
        <radialGradient id="gold-coin-glow" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
      </defs>
      {/* Coins piling at top */}
      <circle cx="27" cy="14" r="7" fill="url(#gold-coin-glow)" stroke="#854d0e" strokeWidth="1" />
      <circle cx="20" cy="18" r="6" fill="url(#gold-coin-glow)" stroke="#854d0e" strokeWidth="1" />
      <circle cx="34" cy="18" r="6" fill="url(#gold-coin-glow)" stroke="#854d0e" strokeWidth="1" />
      {/* Brown Burlap Sack */}
      <path
        d="M12,24 C8,34 10,44 27,44 C44,44 46,34 42,24 C38,20 34,22 27,22 C20,22 16,20 12,24 Z"
        fill="#854d0e"
        stroke="#451a03"
        strokeWidth="1.5"
      />
      {/* Sack tie string */}
      <path d="M18,22 Q27,24 36,22" stroke="#fde047" strokeWidth="2" fill="none" />
      {/* Star symbol on sack */}
      <polygon points="27,30 29,34 33,34.5 30,37 31,41 27,39 23,41 24,37 21,34.5 25,34" fill="#fde047" />
    </svg>
    <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-heading">
      FREE
    </span>
  </div>
);

// C. NO ADS Badge (Top Right)
export const NoAdsIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" className="drop-shadow-md">
    <circle cx="25" cy="25" r="23" fill="#ffffff" stroke="#991b1b" strokeWidth="2" />
    <circle cx="25" cy="25" r="20" fill="#dc2626" />
    <text
      x="25"
      y="22"
      textAnchor="middle"
      fontSize="12"
      fontFamily="'Poppins', sans-serif"
      fontWeight="900"
      fill="#ffffff"
    >
      NO
    </text>
    <text
      x="25"
      y="35"
      textAnchor="middle"
      fontSize="12"
      fontFamily="'Poppins', sans-serif"
      fontWeight="900"
      fill="#ffffff"
    >
      ADS
    </text>
    {/* Diagonal Strike */}
    <line x1="8" y1="8" x2="42" y2="42" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// D. Question Mark / Help Badge (Right)
export const QuestionHelpIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" className="drop-shadow-md">
    <circle cx="25" cy="25" r="23" fill="#15803d" stroke="#facc15" strokeWidth="3" />
    <text
      x="25"
      y="35"
      textAnchor="middle"
      fontSize="28"
      fontFamily="'Fredoka', 'Poppins', sans-serif"
      fontWeight="900"
      fill="#fde047"
      stroke="#854d0e"
      strokeWidth="1"
    >
      ?
    </text>
  </svg>
);

// E. Clapperboard AD x5 1000 FREE (Bottom Left)
export const FreeAdRewardIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <div className="flex flex-col items-center">
    <svg width={size} height={size * 0.75} viewBox="0 0 54 40" className="drop-shadow-md">
      {/* Movie clapperboard base */}
      <rect x="6" y="14" width="42" height="24" rx="4" fill="#1e1b4b" stroke="#ffffff" strokeWidth="1.5" />
      {/* Top stripes */}
      <g transform="translate(6, 4)">
        <rect x="0" y="0" width="42" height="10" rx="2" fill="#ef4444" />
        <polygon points="6,0 12,0 8,10 2,10" fill="#ffffff" />
        <polygon points="18,0 24,0 20,10 14,10" fill="#ffffff" />
        <polygon points="30,0 36,0 32,10 26,10" fill="#ffffff" />
      </g>
      {/* Play triangle */}
      <polygon points="14,21 14,31 22,26" fill="#ef4444" />
      {/* Text AD x5 / 1000 */}
      <text x="34" y="24" textAnchor="middle" fontSize="7" fontWeight="900" fill="#ffffff" fontFamily="'Poppins', sans-serif">
        AD x5
      </text>
      <text x="34" y="33" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fde047" fontFamily="'Poppins', sans-serif">
        1000
      </text>
    </svg>
    <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-heading">
      FREE
    </span>
  </div>
);

// F. Lucky Fortune Spin Wheel (Bottom Right)
export const LuckySpinWheelIcon: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" className="drop-shadow-md animate-spin-slow">
    {/* Outer gold rim */}
    <circle cx="30" cy="30" r="28" fill="#b45309" stroke="#fde047" strokeWidth="3" />
    <circle cx="30" cy="30" r="25" fill="#1e1b4b" />
    {/* Colored wheel wedges */}
    {/* Wedge 1: Pink */}
    <path d="M30 30 L30 6 A24 24 0 0 1 51 18 Z" fill="#ec4899" />
    {/* Wedge 2: Cyan */}
    <path d="M30 30 L51 18 A24 24 0 0 1 54 30 Z" fill="#06b6d4" />
    {/* Wedge 3: Orange */}
    <path d="M30 30 L54 30 A24 24 0 0 1 42 51 Z" fill="#f97316" />
    {/* Wedge 4: Green */}
    <path d="M30 30 L42 51 A24 24 0 0 1 18 51 Z" fill="#22c55e" />
    {/* Wedge 5: Purple */}
    <path d="M30 30 L18 51 A24 24 0 0 1 6 30 Z" fill="#8b5cf6" />
    {/* Wedge 6: Yellow */}
    <path d="M30 30 L6 30 A24 24 0 0 1 9 18 Z" fill="#eab308" />
    {/* Wedge 7: Blue */}
    <path d="M30 30 L9 18 A24 24 0 0 1 30 6 Z" fill="#3b82f6" />
    {/* Center Gold Star */}
    <circle cx="30" cy="30" r="8" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
    <polygon
      points="30,24 32,28 36,28.5 33,31 34,35 30,33 26,35 27,31 24,28.5 28,28"
      fill="#ffffff"
    />
  </svg>
);

// 8. Boy Avatar with Level 5 Badge
export const BoyAvatarBadge: React.FC<{ level?: number }> = ({ level = 5 }) => (
  <div className="relative flex flex-col items-center select-none cursor-pointer group">
    {/* Avatar circle */}
    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-white p-0.5 bg-gradient-to-b from-purple-500 to-indigo-700 shadow-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Soft Background */}
        <circle cx="50" cy="50" r="50" fill="#fcd34d" />
        {/* Boy body */}
        <path d="M15,95 C15,75 30,65 50,65 C70,65 85,75 85,95 Z" fill="#b91c1c" />
        <path d="M35,68 L50,82 L65,68" fill="#ffffff" />
        {/* Neck */}
        <rect x="42" y="52" width="16" height="18" fill="#fbcfe8" rx="2" />
        {/* Head */}
        <ellipse cx="50" cy="42" rx="22" ry="24" fill="#fbcfe8" />
        {/* Hair - black curls */}
        <path
          d="M26,38 C24,20 40,12 50,12 C60,12 76,20 74,38 C70,30 65,22 50,22 C35,22 30,30 26,38 Z"
          fill="#1f2937"
        />
        <circle cx="28" cy="26" r="8" fill="#1f2937" />
        <circle cx="72" cy="26" r="8" fill="#1f2937" />
        <circle cx="50" cy="18" r="10" fill="#1f2937" />
        {/* Eyes & smile */}
        <ellipse cx="42" cy="40" rx="3" ry="4" fill="#1f2937" />
        <ellipse cx="58" cy="40" rx="3" ry="4" fill="#1f2937" />
        <circle cx="43" cy="38" r="1" fill="#ffffff" />
        <circle cx="59" cy="38" r="1" fill="#ffffff" />
        <path d="M44,48 Q50,54 56,48" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
    {/* Level Star Badge */}
    <div className="absolute -bottom-2.5 z-10 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 30 30">
        <polygon
          points="15,2 18,10 27,10 20,16 23,25 15,19 7,25 10,16 3,10 12,10"
          fill="#facc15"
          stroke="#b45309"
          strokeWidth="1.5"
        />
        <text
          x="15"
          y="18"
          textAnchor="middle"
          fontSize="10"
          fontFamily="'Poppins', sans-serif"
          fontWeight="900"
          fill="#78350f"
        >
          {level}
        </text>
      </svg>
    </div>
  </div>
);

// 9. Bottom Navigation Dock Icons (Event, Inventory, Home, Social, Store)
// A. Event Calendar with number 5
export const EventDockIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" className="w-7 h-7">
    {/* Notepad body */}
    <rect x="8" y="10" width="24" height="26" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
    <path d="M8 10 L8 18 L32 18 L32 10 Z" fill="#93c5fd" />
    {/* Binder rings */}
    <rect x="12" y="6" width="3" height="7" rx="1.5" fill="#64748b" />
    <rect x="19" y="6" width="3" height="7" rx="1.5" fill="#64748b" />
    <rect x="26" y="6" width="3" height="7" rx="1.5" fill="#64748b" />
    {/* Number 5 */}
    <text x="20" y="30" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1d4ed8" fontFamily="'Poppins', sans-serif">
      5
    </text>
  </svg>
);

// B. Inventory Dice
export const InventoryDockIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" className="w-7 h-7">
    {/* Die 1 */}
    <g transform="translate(6, 12)">
      <polygon points="10,0 20,5 10,10 0,5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="0,5 10,10 10,20 0,15" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="10,10 20,5 20,15 10,20" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
      <circle cx="10" cy="5" r="1.5" fill="#0f172a" />
      <circle cx="5" cy="12" r="1" fill="#0f172a" />
      <circle cx="15" cy="12" r="1" fill="#0f172a" />
    </g>
    {/* Die 2 */}
    <g transform="translate(18, 6)">
      <polygon points="9,0 18,4 9,8 0,4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="0,4 9,8 9,17 0,13" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="9,8 18,4 18,13 9,17" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
      <circle cx="9" cy="4" r="1.2" fill="#ef4444" />
      <circle cx="4.5" cy="10" r="1" fill="#0f172a" />
    </g>
  </svg>
);

// C. Home House (Elevated center tab)
export const HomeDockHouseIcon: React.FC = () => (
  <svg viewBox="0 0 54 46" className="w-10 h-8">
    <defs>
      <linearGradient id="roof-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    {/* Chimney */}
    <rect x="36" y="8" width="6" height="12" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
    {/* Roof */}
    <polygon points="27,4 52,22 2,22" fill="url(#roof-grad)" stroke="#78350f" strokeWidth="1.5" />
    {/* House walls */}
    <rect x="8" y="22" width="38" height="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
    {/* Door */}
    <path d="M21,44 L21,29 C21,25 33,25 33,29 L33,44 Z" fill="#78350f" />
    <circle cx="24" cy="36" r="1.5" fill="#facc15" />
  </svg>
);

// D. Social People
export const SocialDockIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" className="w-7 h-7">
    {/* Left person */}
    <circle cx="12" cy="16" r="5" fill="#fed7aa" stroke="#ca8a04" strokeWidth="1" />
    <path d="M6,32 C6,25 12,23 18,23 C19,23 20,24 21,25 C16,26 13,29 13,32 Z" fill="#ffffff" stroke="#ca8a04" strokeWidth="1" />
    {/* Right person */}
    <circle cx="28" cy="16" r="5" fill="#fed7aa" stroke="#ca8a04" strokeWidth="1" />
    <path d="M34,32 C34,25 28,23 22,23 C21,23 20,24 19,25 C24,26 27,29 27,32 Z" fill="#ffffff" stroke="#ca8a04" strokeWidth="1" />
    {/* Center front person */}
    <circle cx="20" cy="13" r="6" fill="#fed7aa" stroke="#ca8a04" strokeWidth="1" />
    <path d="M11,32 C11,24 15,22 20,22 C25,22 29,24 29,32 Z" fill="#ffffff" stroke="#ca8a04" strokeWidth="1" />
  </svg>
);

// E. Store Shopping Cart
export const StoreDockIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" className="w-7 h-7">
    {/* Golden shopping basket */}
    <path
      d="M10,12 L32,12 L28,28 L14,28 Z"
      fill="#f59e0b"
      stroke="#b45309"
      strokeWidth="1.5"
    />
    {/* Inner grid lines */}
    <line x1="16" y1="12" x2="18" y2="28" stroke="#78350f" strokeWidth="1" />
    <line x1="22" y1="12" x2="22" y2="28" stroke="#78350f" strokeWidth="1" />
    <line x1="28" y1="12" x2="26" y2="28" stroke="#78350f" strokeWidth="1" />
    <line x1="12" y1="20" x2="30" y2="20" stroke="#78350f" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="16" cy="32" r="3" fill="#1e1b4b" stroke="#ca8a04" strokeWidth="1" />
    <circle cx="26" cy="32" r="3" fill="#1e1b4b" stroke="#ca8a04" strokeWidth="1" />
    {/* Handle */}
    <path d="M32,12 L35,6" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// F. Setting Gear Dock Icon
export const SettingDockIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" className="w-7 h-7">
    <defs>
      <linearGradient id="gear-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>
    {/* 3D Gear shape */}
    <path
      d="M23.5,6 L25,10.2 C26.3,10.7 27.5,11.5 28.5,12.5 L32.7,11.3 L35,15.3 L31.5,18 C31.6,18.7 31.7,19.3 31.7,20 C31.7,20.7 31.6,21.3 31.5,22 L35,24.7 L32.7,28.7 L28.5,27.5 C27.5,28.5 26.3,29.3 25,29.8 L23.5,34 L16.5,34 L15,29.8 C13.7,29.3 12.5,28.5 11.5,27.5 L7.3,28.7 L5,24.7 L8.5,22 C8.4,21.3 8.3,20.7 8.3,20 C8.3,19.3 8.4,18.7 8.5,18 L5,15.3 L7.3,11.3 L11.5,12.5 C12.5,11.5 13.7,10.7 15,10.2 L16.5,6 Z"
      fill="url(#gear-gold-grad)"
      stroke="#78350f"
      strokeWidth="1.2"
    />
    <circle cx="20" cy="20" r="5.5" fill="#1e1b4b" stroke="#78350f" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="2.5" fill="#fef08a" />
  </svg>
);

// G. Snake and Leder Dock Icon (Winding 3D Snake with Golden Ladder)
export const SnakeLederDockIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" className="w-7 h-7">
    <defs>
      <linearGradient id="dock-ladder-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    {/* Golden Ladder Rails */}
    <rect x="14" y="6" width="2.5" height="28" rx="1.2" fill="url(#dock-ladder-grad)" stroke="#78350f" strokeWidth="0.8" />
    <rect x="24" y="6" width="2.5" height="28" rx="1.2" fill="url(#dock-ladder-grad)" stroke="#78350f" strokeWidth="0.8" />
    {/* Rungs */}
    <rect x="15" y="11" width="10" height="2" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.6" />
    <rect x="15" y="18" width="10" height="2" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.6" />
    <rect x="15" y="25" width="10" height="2" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.6" />
    {/* 3D Winding Green/Emerald Snake */}
    <path
      d="M7,31 Q14,33 19,25 T24,14 Q28,9 33,10"
      fill="none"
      stroke="#047857"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <path
      d="M7,31 Q14,33 19,25 T24,14 Q28,9 33,10"
      fill="none"
      stroke="#10b981"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M7,31 Q14,33 19,25 T24,14 Q28,9 33,10"
      fill="none"
      stroke="#6ee7b7"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Snake Head */}
    <ellipse cx="33" cy="10" rx="3.2" ry="2.6" fill="#059669" stroke="#064e3b" strokeWidth="0.6" />
    <circle cx="34" cy="9" r="0.9" fill="#facc15" />
    <circle cx="34" cy="9" r="0.4" fill="#000" />
    {/* Red Flickering Tongue */}
    <path d="M36,10 L39,9 M36,10 L39,11" stroke="#ef4444" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

// G. 3D Saanp Seedhi / Snakes & Ladders Card Graphic
export const SnakesLaddersBannerGraphic: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <defs>
      <linearGradient id="sl-ladder-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="sl-snake-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
    </defs>

    {/* Golden Ladder Tilted Upwards */}
    <g transform="translate(16, 8) rotate(-18)">
      {/* Left Rail */}
      <rect x="0" y="0" width="3.5" height="52" rx="1.7" fill="url(#sl-ladder-grad)" stroke="#78350f" strokeWidth="0.8" />
      {/* Right Rail */}
      <rect x="14" y="0" width="3.5" height="52" rx="1.7" fill="url(#sl-ladder-grad)" stroke="#78350f" strokeWidth="0.8" />
      {/* Rungs */}
      <rect x="3" y="10" width="12" height="2.5" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.5" />
      <rect x="3" y="22" width="12" height="2.5" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.5" />
      <rect x="3" y="34" width="12" height="2.5" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.5" />
      <rect x="3" y="44" width="12" height="2.5" rx="1" fill="#fde047" stroke="#78350f" strokeWidth="0.5" />
    </g>

    {/* 3D Serpentine Snake Winding Across */}
    <g>
      {/* Body shadow */}
      <path
        d="M 58,16 C 68,26 44,40 60,54 C 68,62 58,72 46,74"
        fill="none"
        stroke="#000000"
        strokeWidth="6.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* Main green body */}
      <path
        d="M 56,14 C 66,24 42,38 58,52 C 66,60 56,70 44,72"
        fill="none"
        stroke="url(#sl-snake-grad)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Yellow rings along snake */}
      <path
        d="M 56,14 C 66,24 42,38 58,52 C 66,60 56,70 44,72"
        fill="none"
        stroke="#fef08a"
        strokeWidth="3.5"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      {/* Snake Head */}
      <g transform="translate(56, 14) rotate(-30)">
        {/* Tongue */}
        <path d="M 0,-4 L -2,-9 M 0,-4 L 2,-9" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
        {/* Skull */}
        <ellipse cx="0" cy="0" rx="5.5" ry="4" fill="#15803d" stroke="#052e16" strokeWidth="0.8" />
        {/* Eyes */}
        <circle cx="-2.5" cy="-1.5" r="1.5" fill="#facc15" />
        <circle cx="-2.5" cy="-1.5" r="0.7" fill="#000000" />
        <circle cx="2.5" cy="-1.5" r="1.5" fill="#facc15" />
        <circle cx="2.5" cy="-1.5" r="0.7" fill="#000000" />
      </g>
    </g>

    {/* Sparkling 3D Dice at base */}
    <g transform="translate(18, 54)">
      <rect x="0" y="0" width="16" height="16" rx="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.5))" />
      <circle cx="4.5" cy="4.5" r="1.5" fill="#ef4444" />
      <circle cx="11.5" cy="4.5" r="1.5" fill="#ef4444" />
      <circle cx="8" cy="8" r="1.8" fill="#ef4444" />
      <circle cx="4.5" cy="11.5" r="1.5" fill="#ef4444" />
      <circle cx="11.5" cy="11.5" r="1.5" fill="#ef4444" />
    </g>
  </svg>
);

