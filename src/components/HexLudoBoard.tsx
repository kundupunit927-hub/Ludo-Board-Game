import React from 'react';
import { Player, PlayerColor, Token } from '../types';
import {
  COLOR_HEX,
  COLOR_SECTOR_INDEX_6P,
  getTokenPixelCoord,
  HOME_STRETCH_CELLS_6P,
  MAX_STEPS_6P,
  rotatePoint,
  SAFE_TRACK_INDICES_6P,
  SIX_PLAYER_COLORS,
  TRACK_CELLS_6P,
  YARD_BASE_CENTERS_6P,
  YARD_TOKEN_COORDS_6P,
} from '../utils/ludoLogic';
import { PawnToken } from './PawnToken';
import { RoomPlayerBadge } from './RoomPlayerBadge';

interface HexLudoBoardProps {
  players: Player[];
  activePlayerColor: PlayerColor;
  validTokenIds: number[];
  isRolling: boolean;
  onTokenClick: (tokenId: number) => void;
  animatingToken: {
    color: PlayerColor;
    id: number;
    currentX: number;
    currentY: number;
    hopY: number;
    scaleX: number;
    scaleY: number;
    shadowScale: number;
    tiltAngle: number;
    hasLandingRipple?: boolean;
  } | null;
  onTogglePlayerType?: (color: PlayerColor) => void;
  centerDiceSlot?: React.ReactNode;
}

/**
 * HexLudoBoard: Dedicated 6-Player Ludo Classic Game Board.
 * Features 6 symmetrical arms, 6 spacious corner yards, a central hexagonal goal star,
 * safe star tiles, 3D dice receptacle, and complete 6-player pass-and-play support.
 */
export const HexLudoBoard: React.FC<HexLudoBoardProps> = ({
  players,
  activePlayerColor,
  validTokenIds,
  isRolling,
  onTokenClick,
  animatingToken,
  onTogglePlayerType,
  centerDiceSlot,
}) => {
  const activePlayer = players.find((p) => p.color === activePlayerColor);

  // Group tokens by their (x, y) to offset stacked pieces
  const tokensOnBoard: { token: Token; isCurrentValid: boolean }[] = [];
  players.forEach((p) => {
    p.tokens.forEach((t) => {
      // Don't draw the token in its static place if currently mid-animation
      if (animatingToken && animatingToken.color === t.color && animatingToken.id === t.id) {
        return;
      }
      const isCurrentValid =
        p.color === activePlayerColor && validTokenIds.includes(t.id);
      tokensOnBoard.push({ token: t, isCurrentValid });
    });
  });

  // Calculate cell stacking offsets
  const cellCounts: Record<string, number> = {};
  tokensOnBoard.forEach(({ token }) => {
    if (token.step >= 0 && token.step < MAX_STEPS_6P) {
      const key = `${token.step}-${token.color}`;
      cellCounts[key] = (cellCounts[key] || 0) + 1;
    }
  });

  const cellIndices: Record<string, number> = {};

  return (
    <div
      id="hex-ludo-board-container"
      className="relative w-full max-w-[min(94vw,620px)] aspect-square mx-auto select-none transition-all duration-300 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)]"
    >
      <svg
        id="hex-ludo-board-svg"
        viewBox="0 0 1500 1500"
        className="w-full h-full block rounded-3xl"
        style={{
          boxShadow: '0 0 0 6px #78350f, 0 0 0 10px #f59e0b, 0 16px 40px rgba(0,0,0,0.8)',
        }}
      >
        <defs>
          {/* Radial Board Glow */}
          <radialGradient id="hex-bg-wood" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Golden Outer Ring Gradient */}
          <linearGradient id="gold-rim-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Color Gradients for 6 Bases */}
          {SIX_PLAYER_COLORS.map((color) => {
            const hex = COLOR_HEX[color];
            return (
              <linearGradient
                key={`hex-yard-grad-${color}`}
                id={`hex-yard-grad-${color}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={hex.gradientTop} />
                <stop offset="50%" stopColor={hex.primary} />
                <stop offset="100%" stopColor={hex.dark} />
              </linearGradient>
            );
          })}

          {/* Token recess slot shadow */}
          <radialGradient id="hex-slot-recess" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="70%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>

          {/* Board Inset Shadow */}
          <filter id="hex-board-inset" x="-10%" y="-10%" width="120%" height="120%">
            <feOffset dx="3" dy="3" />
            <feGaussianBlur stdDeviation="4" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="#000000" floodOpacity="0.4" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* 1. OUTER BOARD BASE & WOOD FRAME */}
        <rect x="0" y="0" width="1500" height="1500" rx="40" fill="url(#hex-bg-wood)" />

        {/* Outer Circular Ring Inlay */}
        <circle
          cx="750"
          cy="750"
          r="730"
          fill="none"
          stroke="url(#gold-rim-grad)"
          strokeWidth="12"
          opacity="0.85"
        />
        <circle
          cx="750"
          cy="750"
          r="718"
          fill="none"
          stroke="#0f172a"
          strokeWidth="3"
        />

        {/* Golden Studs along perimeter */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const x = 750 + 724 * Math.cos(angle);
          const y = 750 + 724 * Math.sin(angle);
          return (
            <circle
              key={`hex-stud-${i}`}
              cx={x}
              cy={y}
              r="4.5"
              fill="#fef08a"
              stroke="#713f12"
              strokeWidth="1.5"
            />
          );
        })}

        {/* 2. SIX ARMS (PATHS) RADIATING OUTWARD */}
        {SIX_PLAYER_COLORS.map((color, s) => {
          const hex = COLOR_HEX[color];
          const angle = s * 60;
          return (
            <g key={`hex-arm-bg-${color}`} transform={`rotate(${angle}, 750, 750)`}>
              {/* Arm background beveled slab */}
              <path
                d="M 645,720 L 645,340 Q 645,300 685,300 L 815,300 Q 855,300 855,340 L 855,720 Z"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="4"
                filter="url(#hex-board-inset)"
              />
              {/* Arm edge highlight line */}
              <line x1="645" y1="340" x2="645" y2="720" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="855" y1="340" x2="855" y2="720" stroke="#e2e8f0" strokeWidth="2" />
            </g>
          );
        })}

        {/* 3. TRACK CELLS & HOME STRETCHES */}
        {/* Render all 66 track cells */}
        {TRACK_CELLS_6P.map((coord, idx) => {
          const isSafe = SAFE_TRACK_INDICES_6P.has(idx);
          // Check which sector this cell belongs to
          const sector = Math.floor(idx / 11);
          const sectorColor = SIX_PLAYER_COLORS[sector];
          const isStartCell = idx % 11 === 0;
          const cellHex = COLOR_HEX[sectorColor];

          return (
            <g key={`hex-track-cell-${idx}`}>
              <rect
                x={coord.x - 32}
                y={coord.y - 32}
                width="64"
                height="64"
                rx="14"
                fill={isStartCell ? cellHex.primary : '#ffffff'}
                stroke={isStartCell ? '#ffffff' : '#94a3b8'}
                strokeWidth={isStartCell ? '3' : '2'}
                filter="url(#hex-board-inset)"
              />
              {/* Inner subtle bevel */}
              <rect
                x={coord.x - 28}
                y={coord.y - 28}
                width="56"
                height="56"
                rx="11"
                fill={isStartCell ? 'none' : isSafe ? cellHex.light : '#ffffff'}
                opacity={isSafe ? '0.85' : '1'}
              />

              {/* Safe Star Icon on safe tiles with Traditional Cross (✖) mark */}
              {isSafe && (
                <g transform={`translate(${coord.x}, ${coord.y}) scale(0.95)`}>
                  <polygon
                    points="0,-16 4.5,-4.5 17,-4.5 7,3.5 11,15.5 0,8 -11,15.5 -7,3.5 -17,-4.5 -4.5,-4.5"
                    fill={isStartCell ? '#ffffff' : '#f59e0b'}
                    stroke={isStartCell ? cellHex.dark : '#78350f'}
                    strokeWidth="1.5"
                  />
                  {/* Traditional Safe Cross (✖) */}
                  <path
                    d="M -10 -10 L 10 10 M 10 -10 L -10 10"
                    stroke={isStartCell ? cellHex.dark : '#78350f'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="3.5"
                    fill={isStartCell ? cellHex.primary : '#fef08a'}
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Render 5 Home Stretch Cells for each of the 6 colors */}
        {SIX_PLAYER_COLORS.map((color) => {
          const cells = HOME_STRETCH_CELLS_6P[color];
          const hex = COLOR_HEX[color];
          return (
            <g key={`hex-home-stretch-${color}`}>
              {cells.map((coord, i) => (
                <g key={`hex-home-cell-${color}-${i}`}>
                  <rect
                    x={coord.x - 32}
                    y={coord.y - 32}
                    width="64"
                    height="64"
                    rx="14"
                    fill={hex.primary}
                    stroke="#ffffff"
                    strokeWidth="3"
                    filter="url(#hex-board-inset)"
                  />
                  {/* Inner shine */}
                  <rect
                    x={coord.x - 27}
                    y={coord.y - 27}
                    width="54"
                    height="54"
                    rx="11"
                    fill="none"
                    stroke={hex.gradientTop}
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  {/* Step arrow pointing towards center */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="8"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="4"
                    fill={hex.dark}
                  />
                </g>
              ))}
            </g>
          );
        })}

        {/* 4. SIX YARDS / BASES */}
        {SIX_PLAYER_COLORS.map((color) => {
          const hex = COLOR_HEX[color];
          const baseCenter = YARD_BASE_CENTERS_6P[color];
          const playerObj = players.find((p) => p.color === color);
          const slots = YARD_TOKEN_COORDS_6P[color];

          return (
            <g key={`hex-base-${color}`}>
              {/* Outer Yard Glow */}
              <circle
                cx={baseCenter.x}
                cy={baseCenter.y}
                r="165"
                fill="none"
                stroke={hex.primary}
                strokeWidth="4"
                opacity="0.5"
              />

              {/* Yard Beveled Base Circle */}
              <circle
                cx={baseCenter.x}
                cy={baseCenter.y}
                r="155"
                fill={`url(#hex-yard-grad-${color})`}
                stroke="#fef08a"
                strokeWidth="7"
                filter="url(#hex-board-inset)"
              />

              {/* Inner White Recessed Plate */}
              <circle
                cx={baseCenter.x}
                cy={baseCenter.y}
                r="125"
                fill="#ffffff"
                stroke={hex.border}
                strokeWidth="4"
              />

              {/* 4 Token Recess Slots */}
              {slots.map((slot, i) => (
                <g key={`hex-slot-${color}-${i}`}>
                  <circle
                    cx={slot.x}
                    cy={slot.y}
                    r="40"
                    fill="url(#hex-slot-recess)"
                    stroke={hex.primary}
                    strokeWidth="4"
                  />
                  <circle
                    cx={slot.x}
                    cy={slot.y}
                    r="22"
                    fill={hex.light}
                  />
                  <circle
                    cx={slot.x}
                    cy={slot.y}
                    r="10"
                    fill={hex.primary}
                    opacity="0.6"
                  />
                </g>
              ))}

              {/* RoomPlayerBadge in Base Center */}
              {playerObj && (
                <RoomPlayerBadge
                  player={playerObj}
                  isTurn={activePlayerColor === color}
                  isRolling={isRolling}
                  onToggleType={onTogglePlayerType}
                  cx={baseCenter.x}
                  cy={baseCenter.y}
                />
              )}
            </g>
          );
        })}

        {/* 5. CENTER GOAL HEXAGONAL STAR MEDALLION */}
        <g id="hex-center-goal">
          {/* Outer Golden Hexagon Ring */}
          <circle
            cx="750"
            cy="750"
            r="168"
            fill="#090d16"
            stroke="url(#gold-rim-grad)"
            strokeWidth="8"
          />

          {/* 6 Triangular Color Bays meeting at center */}
          {SIX_PLAYER_COLORS.map((color, s) => {
            const hex = COLOR_HEX[color];
            const p1 = rotatePoint(685, 620, s * 60);
            const p2 = rotatePoint(815, 620, s * 60);
            return (
              <polygon
                key={`hex-goal-bay-${color}`}
                points={`750,750 ${p1.x},${p1.y} ${p2.x},${p2.y}`}
                fill={hex.primary}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            );
          })}

          {/* Center Medallion Plate */}
          <circle
            cx="750"
            cy="750"
            r="82"
            fill="#0f172a"
            stroke="url(#gold-rim-grad)"
            strokeWidth="6"
            filter="url(#hex-board-inset)"
          />
        </g>

        {/* 6. STATIC TOKENS ON BOARD */}
        {tokensOnBoard.map(({ token, isCurrentValid }) => {
          let pos = getTokenPixelCoord(token, true);

          // If on outer track, check if stacked
          if (token.step >= 0 && token.step < MAX_STEPS_6P) {
            const key = `${token.step}-${token.color}`;
            const total = cellCounts[key] || 1;
            if (total > 1) {
              const currentIdx = cellIndices[key] || 0;
              cellIndices[key] = currentIdx + 1;
              const angle = (currentIdx / total) * 2 * Math.PI;
              pos = {
                x: pos.x + Math.cos(angle) * 14,
                y: pos.y + Math.sin(angle) * 14,
              };
            }
          }

          const isFinished = token.step >= MAX_STEPS_6P;

          return (
            <g
              key={`hex-token-${token.color}-${token.id}`}
              transform={`translate(${pos.x}, ${pos.y})`}
            >
              <PawnToken
                color={token.color}
                id={token.id}
                isClickable={isCurrentValid}
                isFinished={isFinished}
                onClick={() => {
                  if (isCurrentValid) {
                    onTokenClick(token.id);
                  }
                }}
              />
            </g>
          );
        })}

        {/* 7. AIRBORNE / ANIMATING TOKEN */}
        {animatingToken && (
          <g
            id={`hex-animating-token-${animatingToken.color}-${animatingToken.id}`}
            transform={`translate(${animatingToken.currentX}, ${animatingToken.currentY})`}
          >
            <PawnToken
              color={animatingToken.color}
              id={animatingToken.id}
              isClickable={false}
              isAnimating={true}
              hopY={animatingToken.hopY}
              scaleX={animatingToken.scaleX}
              scaleY={animatingToken.scaleY}
              shadowScale={animatingToken.shadowScale}
              tiltAngle={animatingToken.tiltAngle}
              hasLandingRipple={animatingToken.hasLandingRipple}
            />
          </g>
        )}
      </svg>

      {/* 8. CENTER 3D DICE SLOP OVERLAY */}
      {centerDiceSlot && (
        <div
          id="hex-center-dice-overlay"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="pointer-events-auto transform scale-85 sm:scale-100">
            {centerDiceSlot}
          </div>
        </div>
      )}
    </div>
  );
};
