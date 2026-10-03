import React from 'react';
import { PlayerColor } from '../types';
import { COLOR_HEX } from '../utils/ludoLogic';

interface PawnTokenProps {
  color: PlayerColor;
  id: number;
  isClickable: boolean;
  isFinished?: boolean;
  isAnimating?: boolean;
  hopY?: number;
  scaleX?: number;
  scaleY?: number;
  shadowScale?: number;
  tiltAngle?: number;
  hasLandingRipple?: boolean;
  onClick?: () => void;
}

/**
 * Custom 3D-style cone/pawn token with rich internal jewel shine, shimmering body,
 * dynamic trajectory tilt, base pedestal, neck collar, and spherical crystal head.
 */
export const PawnToken: React.FC<PawnTokenProps> = ({
  color,
  id,
  isClickable,
  isFinished = false,
  isAnimating = false,
  hopY = 0,
  scaleX = 1,
  scaleY = 1,
  shadowScale = 1,
  tiltAngle = 0,
  hasLandingRipple = false,
  onClick,
}) => {
  const hex = COLOR_HEX[color];
  const isAirborne = hopY < -4;

  return (
    <g
      id={`pawn-token-${color}-${id}`}
      onClick={onClick}
      className={`transition-all duration-75 ${
        isClickable ? 'cursor-pointer hover:scale-110' : ''
      }`}
      style={{
        pointerEvents: isClickable ? 'auto' : 'none',
        filter: isClickable ? 'drop-shadow(0 0 12px #facc15)' : undefined,
      }}
    >
      {/* 1. Pulsing golden aura if token can be moved */}
      {isClickable && (
        <g id={`token-aura-${color}-${id}`}>
          <ellipse
            cx="0"
            cy="18"
            rx="36"
            ry="17"
            fill="none"
            stroke="#facc15"
            strokeWidth="3.5"
            className="animate-ring-pulse"
            opacity="0.8"
          />
          <ellipse
            cx="0"
            cy="18"
            rx="32"
            ry="15"
            fill="none"
            stroke="#eab308"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-aura-spin"
          />
        </g>
      )}

      {/* 2. Tactile Landing Shockwave Ripple + Sparkle Burst */}
      {hasLandingRipple && (
        <g id={`token-landing-ripple-${color}-${id}`}>
          <circle
            cx="0"
            cy="18"
            r="14"
            fill="none"
            stroke={hex.primary}
            strokeWidth="3.5"
            className="animate-landing-ripple"
          />
          {/* Sparkle particle burst on touchdown */}
          <circle cx="-16" cy="18" r="2.5" fill="#facc15" className="animate-ping" opacity="0.85" />
          <circle cx="16" cy="18" r="2.5" fill="#facc15" className="animate-ping" opacity="0.85" />
          <circle cx="0" cy="8" r="2" fill="#ffffff" className="animate-ping" opacity="0.9" />
          <circle cx="0" cy="27" r="2" fill={hex.gradientTop} className="animate-ping" opacity="0.9" />
        </g>
      )}

      {/* 3. Cast Ground Shadow (Stays firmly on board surface during jump) */}
      <ellipse
        cx="0"
        cy="22"
        rx={26 * shadowScale}
        ry={10 * shadowScale}
        fill={isAirborne ? 'rgba(15, 23, 42, 0.22)' : 'rgba(15, 23, 42, 0.48)'}
        filter="url(#token-shadow-blur)"
      />

      {/* 4. 3D Pawn Body Group (Lifts up with hopY, squashes/stretches, and tilts dynamically) */}
      <g
        transform={`translate(0, ${hopY}) rotate(${tiltAngle} 0 18) scale(${scaleX}, ${scaleY})`}
        className={isClickable && !isAnimating ? 'animate-token-bob' : ''}
      >
        {/* Base Pedestal Ring (Bottom extrusion of pawn) */}
        <ellipse
          cx="0"
          cy="18"
          rx="24"
          ry="11"
          fill={hex.dark}
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Base Upper Step Ring */}
        <ellipse
          cx="0"
          cy="14"
          rx="21"
          ry="9.5"
          fill={`url(#cone-base-grad-${color})`}
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="1.5"
        />

        {/* Tapered 3D Cone Body */}
        <path
          d="M -18 14 C -14 2, -10 -6, -8 -15 L 8 -15 C 10 -6, 14 2, 18 14 Z"
          fill={`url(#cone-body-grad-${color})`}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1"
        />

        {/* Dynamic Internal Shimmer Light Beam gliding inside cone */}
        <ellipse
          cx="0"
          cy="0"
          rx="9"
          ry="2"
          fill="#ffffff"
          opacity="0.38"
          className="animate-shimmer-glance"
        />

        {/* Cone Glossy Reflection Streak (Curved highlight on left flank) */}
        <path
          d="M -14 12 C -11 2, -8 -5, -6 -14 L -3 -14 C -5 -5, -8 2, -11 12 Z"
          fill="rgba(255, 255, 255, 0.45)"
        />

        {/* Neck Collar Ring */}
        <ellipse
          cx="0"
          cy="-15"
          rx="9"
          ry="3.5"
          fill={hex.dark}
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="1"
        />

        {/* Spherical Head (Pawn Finial) */}
        <circle
          cx="0"
          cy="-27"
          r="13.5"
          fill={`url(#sphere-head-grad-${color})`}
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="1.5"
        />

        {/* Internal Core Glowing Energy Radiant inside head */}
        <circle
          cx="0"
          cy="-27"
          r="7.5"
          fill={`url(#core-glow-${color})`}
          className="animate-core-pulse"
        />

        {/* Sparkling 4-point Diamond Crystal Gem Star inside head */}
        <g className="animate-gem-sparkle">
          <polygon
            points="0,-33 1.8,-28.8 6,-27 1.8,-25.2 0,-21 -1.8,-25.2 -6,-27 -1.8,-28.8"
            fill="#ffffff"
            opacity="0.9"
          />
          <circle cx="0" cy="-27" r="1.8" fill="#ffffff" />
        </g>

        {/* Glossy Curved Specular Shine on Head */}
        <ellipse
          cx="-4.5"
          cy="-31.5"
          rx="5.5"
          ry="3"
          transform="rotate(-28 -4.5 -31.5)"
          fill="rgba(255, 255, 255, 0.9)"
        />
        <circle cx="2" cy="-24" r="1.5" fill="rgba(255, 255, 255, 0.5)" />

        {/* Golden Victory Crown / Star for Finished Tokens */}
        {isFinished && (
          <g transform="translate(0, -44) scale(0.9)" className="animate-victory-crown">
            <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <path
              d="M -5 -1 L -1 3 L 5 -4"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Floating Golden Downward Pointer Arrow for Movable Tokens */}
        {isClickable && !isAnimating && (
          <g transform="translate(0, -52)" className="animate-token-pointer">
            <path
              d="M 0 0 L -8 -11 L -3 -11 L -3 -19 L 3 -19 L 3 -11 L 8 -11 Z"
              fill="#facc15"
              stroke="#b45309"
              strokeWidth="1.5"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
            />
            <circle cx="0" cy="-14" r="1.5" fill="#ffffff" />
          </g>
        )}
      </g>

      {/* Enlarged Mobile Touch Area for Clickable Tokens */}
      {isClickable && (
        <circle
          cx="0"
          cy="0"
          r="42"
          fill="transparent"
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
        />
      )}
    </g>
  );
};
