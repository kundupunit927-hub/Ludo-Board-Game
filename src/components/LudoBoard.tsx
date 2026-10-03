import React from 'react';
import { Player, PlayerColor, Token } from '../types';
import {
  BOARD_SIZE,
  CELL_SIZE,
  COLOR_HEX,
  getTokenPixelCoord,
  HOME_STRETCH_CELLS,
  SAFE_TRACK_INDICES,
  TRACK_CELLS,
  YARD_TOKEN_COORDS,
} from '../utils/ludoLogic';
import { PawnToken } from './PawnToken';
import { RoomPlayerBadge } from './RoomPlayerBadge';

export interface AnimatingTokenInfo {
  color: PlayerColor;
  id: number;
  currentX: number;
  currentY: number;
  hopY?: number;
  scaleX?: number;
  scaleY?: number;
  shadowScale?: number;
  tiltAngle?: number;
  hasLandingRipple?: boolean;
}

interface LudoBoardProps {
  players: Player[];
  activePlayerColor: PlayerColor;
  validTokenIds: number[];
  isRolling: boolean;
  onTokenClick: (tokenId: number) => void;
  animatingToken?: AnimatingTokenInfo | null;
  onTogglePlayerType?: (color: PlayerColor) => void;
  centerDiceSlot?: React.ReactNode;
}

// 8-pointed decorative star / rosette path centered at (cx, cy)
function getStarPath(cx: number, cy: number, outerR: number, innerR: number, points = 8): string {
  let path = '';
  const total = points * 2;
  for (let i = 0; i < total; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) {
      path += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  path += ' Z';
  return path;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  activePlayerColor,
  validTokenIds,
  isRolling,
  onTokenClick,
  animatingToken,
  onTogglePlayerType,
  centerDiceSlot,
}) => {
  // Find players for room badge rendering
  const redPlayer = players.find((p) => p.color === 'red');
  const greenPlayer = players.find((p) => p.color === 'green');
  const yellowPlayer = players.find((p) => p.color === 'yellow');
  const bluePlayer = players.find((p) => p.color === 'blue');

  // Collect all active tokens and calculate clustering offsets for overlapping tokens on the same cell
  const tokensToRender: {
    token: Token;
    x: number;
    y: number;
    isClickable: boolean;
    isAnimating: boolean;
    hopY?: number;
    scaleX?: number;
    scaleY?: number;
    shadowScale?: number;
    tiltAngle?: number;
    hasLandingRipple?: boolean;
  }[] = [];

  // Group tokens by cell key to handle overlapping on track or safe squares
  const cellGroups = new Map<string, { token: Token; isClickable: boolean }[]>();

  players.forEach((player) => {
    const isCurrentPlayer = player.color === activePlayerColor;
    player.tokens.forEach((token) => {
      const isClickable =
        isCurrentPlayer && !isRolling && validTokenIds.includes(token.id);

      // Key based on position
      let key = '';
      if (token.step === -1) {
        key = `yard_${token.color}_${token.id}`; // Base tokens never overlap
      } else if (token.step >= 56) {
        key = `home_${token.color}_${token.id}`; // Home tokens have dedicated offsets
      } else {
        const coord = getTokenPixelCoord(token);
        key = `${Math.round(coord.x)}_${Math.round(coord.y)}`;
      }

      const list = cellGroups.get(key) || [];
      list.push({ token, isClickable });
      cellGroups.set(key, list);
    });
  });

  cellGroups.forEach((group) => {
    const total = group.length;
    group.forEach((item, index) => {
      const baseCoord = getTokenPixelCoord(item.token);
      let x = baseCoord.x;
      let y = baseCoord.y;

      // Apply slight offset if multiple tokens share the track cell
      if (total > 1 && item.token.step >= 0 && item.token.step < 56) {
        const radius = 20;
        const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
        x += Math.cos(angle) * radius;
        y += Math.sin(angle) * radius;
      }

      const isAnim =
        animatingToken?.color === item.token.color &&
        animatingToken?.id === item.token.id;

      tokensToRender.push({
        token: item.token,
        x: isAnim ? animatingToken.currentX : x,
        y: isAnim ? animatingToken.currentY : y,
        isClickable: item.isClickable,
        isAnimating: isAnim,
        hopY: isAnim ? animatingToken.hopY : 0,
        scaleX: isAnim ? animatingToken.scaleX : 1,
        scaleY: isAnim ? animatingToken.scaleY : 1,
        shadowScale: isAnim ? animatingToken.shadowScale : 1,
        tiltAngle: isAnim ? (animatingToken.tiltAngle ?? 0) : 0,
        hasLandingRipple: isAnim ? animatingToken.hasLandingRipple : false,
      });
    });
  });

  return (
    <div className="relative w-full max-w-[620px] aspect-square mx-auto select-none p-1 sm:p-2">
      <svg
        id="ludo-game-board"
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
        className="w-full h-full drop-shadow-2xl rounded-3xl bg-[#fdfbf7] border-4 border-slate-800 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      >
        <defs>
          {/* Base Yard Gradients with rich vibrant saturation */}
          <linearGradient id="yard-grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="60%" stopColor={COLOR_HEX.red.primary} />
            <stop offset="100%" stopColor={COLOR_HEX.red.dark} />
          </linearGradient>
          <linearGradient id="yard-grad-green" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#81c784" />
            <stop offset="60%" stopColor={COLOR_HEX.green.primary} />
            <stop offset="100%" stopColor={COLOR_HEX.green.dark} />
          </linearGradient>
          <linearGradient id="yard-grad-yellow" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#fff59d" />
            <stop offset="50%" stopColor={COLOR_HEX.yellow.primary} />
            <stop offset="100%" stopColor={COLOR_HEX.yellow.dark} />
          </linearGradient>
          <linearGradient id="yard-grad-blue" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64b5f6" />
            <stop offset="60%" stopColor={COLOR_HEX.blue.primary} />
            <stop offset="100%" stopColor={COLOR_HEX.blue.dark} />
          </linearGradient>

          {/* Center Medallion Golden Gradients */}
          <radialGradient id="center-gold-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="45%" stopColor="#fde047" />
            <stop offset="85%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
          <linearGradient id="gold-facet-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="gold-facet-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* 3D Pawn Token Gradients for each color */}
          {(['red', 'green', 'yellow', 'blue'] as PlayerColor[]).map((c) => {
            const h = COLOR_HEX[c];
            return (
              <React.Fragment key={`pawn-defs-${c}`}>
                {/* Pawn base ring gradient */}
                <linearGradient id={`cone-base-grad-${c}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={h.gradientTop} />
                  <stop offset="40%" stopColor={h.primary} />
                  <stop offset="100%" stopColor={h.dark} />
                </linearGradient>

                {/* Pawn cone body gradient (Left-lit 3D curvature) */}
                <linearGradient id={`cone-body-grad-${c}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={h.gradientTop} />
                  <stop offset="25%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="50%" stopColor={h.primary} />
                  <stop offset="100%" stopColor={h.dark} />
                </linearGradient>

                {/* Pawn spherical head gradient (Top-left sphere highlight) */}
                <radialGradient
                  id={`sphere-head-grad-${c}`}
                  cx="35%"
                  cy="35%"
                  r="65%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="28%" stopColor={h.gradientTop} />
                  <stop offset="70%" stopColor={h.primary} />
                  <stop offset="100%" stopColor={h.dark} />
                </radialGradient>

                {/* Internal Gem Core Glowing Radial Gradient */}
                <radialGradient
                  id={`core-glow-${c}`}
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="45%" stopColor={h.gradientTop} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={h.primary} stopOpacity="0" />
                </radialGradient>
              </React.Fragment>
            );
          })}

          {/* Pedestal recessed slot gradient */}
          <radialGradient id="slot-recess" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Drop shadow filters */}
          <filter id="token-shadow-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="board-inset-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.15)" />
          </filter>
        </defs>

        {/* 1. GRID BACKGROUND & TRACK CELLS */}
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            const isCorner =
              (r < 6 && c < 6) ||
              (r < 6 && c > 8) ||
              (r > 8 && c < 6) ||
              (r > 8 && c > 8);
            const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

            if (isCorner || isCenter) return null;

            return (
              <rect
                key={`grid-cell-${c}-${r}`}
                x={c * CELL_SIZE}
                y={r * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="2.5"
              />
            );
          })
        )}

        {/* 2. CORNER BASES (YARDS) with original geometry & double-beveled borders */}
        {/* RED BASE (Top-Left) */}
        <g id="base-red">
          <rect x="0" y="0" width="600" height="600" fill="url(#yard-grad-red)" />
          {/* Subtle quadrant geometric corner accent */}
          <path d="M 0 0 L 140 0 L 0 140 Z" fill="rgba(255,255,255,0.15)" />
          <rect
            x="75"
            y="75"
            width="450"
            height="450"
            rx="32"
            fill="#ffffff"
            stroke="#fecaca"
            strokeWidth="10"
            filter="url(#board-inset-shadow)"
          />
          {/* Yard Pedestals */}
          {YARD_TOKEN_COORDS.red.map((coord, i) => (
            <g key={`red-slot-${i}`}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r="52"
                fill="url(#slot-recess)"
                stroke={COLOR_HEX.red.primary}
                strokeWidth="6"
              />
              <circle cx={coord.x} cy={coord.y} r="28" fill={COLOR_HEX.red.light} />
              <circle cx={coord.x} cy={coord.y} r="12" fill={COLOR_HEX.red.primary} opacity="0.6" />
            </g>
          ))}
          {/* In-Room Player Badge (Name, Avatar Icon, Turn Highlight & Type Toggle) */}
          {redPlayer && (
            <RoomPlayerBadge
              player={redPlayer}
              isTurn={activePlayerColor === 'red'}
              isRolling={isRolling}
              onToggleType={onTogglePlayerType}
              cx={300}
              cy={300}
            />
          )}
        </g>

        {/* GREEN BASE (Top-Right) */}
        <g id="base-green">
          <rect x="900" y="0" width="600" height="600" fill="url(#yard-grad-green)" />
          <path d="M 1500 0 L 1360 0 L 1500 140 Z" fill="rgba(255,255,255,0.15)" />
          <rect
            x="975"
            y="75"
            width="450"
            height="450"
            rx="32"
            fill="#ffffff"
            stroke="#bbf7d0"
            strokeWidth="10"
            filter="url(#board-inset-shadow)"
          />
          {YARD_TOKEN_COORDS.green.map((coord, i) => (
            <g key={`green-slot-${i}`}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r="52"
                fill="url(#slot-recess)"
                stroke={COLOR_HEX.green.primary}
                strokeWidth="6"
              />
              <circle cx={coord.x} cy={coord.y} r="28" fill={COLOR_HEX.green.light} />
              <circle cx={coord.x} cy={coord.y} r="12" fill={COLOR_HEX.green.primary} opacity="0.6" />
            </g>
          ))}
          {/* In-Room Player Badge (Name, Avatar Icon, Turn Highlight & Type Toggle) */}
          {greenPlayer && (
            <RoomPlayerBadge
              player={greenPlayer}
              isTurn={activePlayerColor === 'green'}
              isRolling={isRolling}
              onToggleType={onTogglePlayerType}
              cx={1200}
              cy={300}
            />
          )}
        </g>

        {/* YELLOW BASE (Bottom-Right) */}
        <g id="base-yellow">
          <rect x="900" y="900" width="600" height="600" fill="url(#yard-grad-yellow)" />
          <path d="M 1500 1500 L 1360 1500 L 1500 1360 Z" fill="rgba(255,255,255,0.15)" />
          <rect
            x="975"
            y="975"
            width="450"
            height="450"
            rx="32"
            fill="#ffffff"
            stroke="#fef08a"
            strokeWidth="10"
            filter="url(#board-inset-shadow)"
          />
          {YARD_TOKEN_COORDS.yellow.map((coord, i) => (
            <g key={`yellow-slot-${i}`}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r="52"
                fill="url(#slot-recess)"
                stroke={COLOR_HEX.yellow.primary}
                strokeWidth="6"
              />
              <circle cx={coord.x} cy={coord.y} r="28" fill={COLOR_HEX.yellow.light} />
              <circle cx={coord.x} cy={coord.y} r="12" fill={COLOR_HEX.yellow.primary} opacity="0.6" />
            </g>
          ))}
          {/* In-Room Player Badge (Name, Avatar Icon, Turn Highlight & Type Toggle) */}
          {yellowPlayer && (
            <RoomPlayerBadge
              player={yellowPlayer}
              isTurn={activePlayerColor === 'yellow'}
              isRolling={isRolling}
              onToggleType={onTogglePlayerType}
              cx={1200}
              cy={1200}
            />
          )}
        </g>

        {/* BLUE BASE (Bottom-Left) */}
        <g id="base-blue">
          <rect x="0" y="900" width="600" height="600" fill="url(#yard-grad-blue)" />
          <path d="M 0 1500 L 140 1500 L 0 1360 Z" fill="rgba(255,255,255,0.15)" />
          <rect
            x="75"
            y="975"
            width="450"
            height="450"
            rx="32"
            fill="#ffffff"
            stroke="#bfdbfe"
            strokeWidth="10"
            filter="url(#board-inset-shadow)"
          />
          {YARD_TOKEN_COORDS.blue.map((coord, i) => (
            <g key={`blue-slot-${i}`}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r="52"
                fill="url(#slot-recess)"
                stroke={COLOR_HEX.blue.primary}
                strokeWidth="6"
              />
              <circle cx={coord.x} cy={coord.y} r="28" fill={COLOR_HEX.blue.light} />
              <circle cx={coord.x} cy={coord.y} r="12" fill={COLOR_HEX.blue.primary} opacity="0.6" />
            </g>
          ))}
          {/* In-Room Player Badge (Name, Avatar Icon, Turn Highlight & Type Toggle) */}
          {bluePlayer && (
            <RoomPlayerBadge
              player={bluePlayer}
              isTurn={activePlayerColor === 'blue'}
              isRolling={isRolling}
              onToggleType={onTogglePlayerType}
              cx={300}
              cy={1200}
            />
          )}
        </g>

        {/* 3. HOME RUNWAYS (COLORED PATHWAYS TO CENTER) */}
        {/* Red Home Stretch (Pointing Right) */}
        {HOME_STRETCH_CELLS.red.map((cell, i) => (
          <g key={`red-stretch-${i}`}>
            <rect
              x={cell.col * CELL_SIZE}
              y={cell.row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={COLOR_HEX.red.primary}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Subtle directional chevron indicator */}
            <path
              d={`M ${cell.col * CELL_SIZE + 40} ${cell.row * CELL_SIZE + 35} L ${
                cell.col * CELL_SIZE + 60
              } ${cell.row * CELL_SIZE + 50} L ${cell.col * CELL_SIZE + 40} ${
                cell.row * CELL_SIZE + 65
              }`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        ))}

        {/* Green Home Stretch (Pointing Down) */}
        {HOME_STRETCH_CELLS.green.map((cell, i) => (
          <g key={`green-stretch-${i}`}>
            <rect
              x={cell.col * CELL_SIZE}
              y={cell.row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={COLOR_HEX.green.primary}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path
              d={`M ${cell.col * CELL_SIZE + 35} ${cell.row * CELL_SIZE + 40} L ${
                cell.col * CELL_SIZE + 50
              } ${cell.row * CELL_SIZE + 60} L ${cell.col * CELL_SIZE + 65} ${
                cell.row * CELL_SIZE + 40
              }`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        ))}

        {/* Yellow Home Stretch (Pointing Left) */}
        {HOME_STRETCH_CELLS.yellow.map((cell, i) => (
          <g key={`yellow-stretch-${i}`}>
            <rect
              x={cell.col * CELL_SIZE}
              y={cell.row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={COLOR_HEX.yellow.primary}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path
              d={`M ${cell.col * CELL_SIZE + 60} ${cell.row * CELL_SIZE + 35} L ${
                cell.col * CELL_SIZE + 40
              } ${cell.row * CELL_SIZE + 50} L ${cell.col * CELL_SIZE + 60} ${
                cell.row * CELL_SIZE + 65
              }`}
              fill="none"
              stroke={COLOR_HEX.yellow.dark}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        ))}

        {/* Blue Home Stretch (Pointing Up) */}
        {HOME_STRETCH_CELLS.blue.map((cell, i) => (
          <g key={`blue-stretch-${i}`}>
            <rect
              x={cell.col * CELL_SIZE}
              y={cell.row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={COLOR_HEX.blue.primary}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <path
              d={`M ${cell.col * CELL_SIZE + 35} ${cell.row * CELL_SIZE + 60} L ${
                cell.col * CELL_SIZE + 50
              } ${cell.row * CELL_SIZE + 40} L ${cell.col * CELL_SIZE + 65} ${
                cell.row * CELL_SIZE + 60
              }`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        ))}

        {/* 4. COLORED START CELLS ON OUTER TRACK */}
        <rect
          x={1 * CELL_SIZE}
          y={6 * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={COLOR_HEX.red.primary}
          stroke="#ffffff"
          strokeWidth="2.5"
        />
        <rect
          x={8 * CELL_SIZE}
          y={1 * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={COLOR_HEX.green.primary}
          stroke="#ffffff"
          strokeWidth="2.5"
        />
        <rect
          x={13 * CELL_SIZE}
          y={8 * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={COLOR_HEX.yellow.primary}
          stroke="#ffffff"
          strokeWidth="2.5"
        />
        <rect
          x={6 * CELL_SIZE}
          y={13 * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={COLOR_HEX.blue.primary}
          stroke="#ffffff"
          strokeWidth="2.5"
        />

        {/* 5. SAFE STAR & CROSS SQUARES (Traditional Ludo Safe Cross 'X' Zones) */}
        {Array.from(SAFE_TRACK_INDICES).map((trackIdx) => {
          const cell = TRACK_CELLS[trackIdx];
          const cx = cell.col * CELL_SIZE + CELL_SIZE / 2;
          const cy = cell.row * CELL_SIZE + CELL_SIZE / 2;
          const isStartSquare = [0, 13, 26, 39].includes(trackIdx);

          return (
            <g key={`safe-star-${trackIdx}`} className="pointer-events-none">
              {/* Outer rosette glow */}
              <circle
                cx={cx}
                cy={cy}
                r="40"
                fill={isStartSquare ? 'rgba(255,255,255,0.3)' : 'rgba(245, 158, 11, 0.2)'}
              />
              {/* Traditional Star Rosette */}
              <path
                d={getStarPath(cx, cy, 32, 16, 8)}
                fill={isStartSquare ? '#ffffff' : '#f59e0b'}
                stroke={isStartSquare ? 'rgba(0,0,0,0.15)' : '#b45309'}
                strokeWidth="1.5"
                filter="url(#board-inset-shadow)"
              />
              {/* Traditional Safe Cross (✖) Mark */}
              <path
                d={`M ${cx - 16} ${cy - 16} L ${cx + 16} ${cy + 16} M ${cx + 16} ${cy - 16} L ${cx - 16} ${cy + 16}`}
                stroke={isStartSquare ? '#b91c1c' : '#78350f'}
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle
                cx={cx}
                cy={cy}
                r="5"
                fill="#ffffff"
                stroke={isStartSquare ? '#b91c1c' : '#78350f'}
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* 6. ORIGINAL DECORATIVE CENTER DESIGN (Artwork specific for this board) */}
        <g id="center-decorative-sanctuary">
          {/* Outer center frame (600..900) */}
          <rect
            x="600"
            y="600"
            width="300"
            height="300"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="4"
          />

          {/* Red Left Triangle Bay */}
          <polygon
            points="600,600 750,750 600,900"
            fill="url(#yard-grad-red)"
            stroke="#ffffff"
            strokeWidth="3"
          />
          {/* Green Top Triangle Bay */}
          <polygon
            points="600,600 900,600 750,750"
            fill="url(#yard-grad-green)"
            stroke="#ffffff"
            strokeWidth="3"
          />
          {/* Yellow Right Triangle Bay */}
          <polygon
            points="900,600 900,900 750,750"
            fill="url(#yard-grad-yellow)"
            stroke="#ffffff"
            strokeWidth="3"
          />
          {/* Blue Bottom Triangle Bay */}
          <polygon
            points="600,900 900,900 750,750"
            fill="url(#yard-grad-blue)"
            stroke="#ffffff"
            strokeWidth="3"
          />

          {/* Inner concentric geometric bay chevron lines */}
          <path
            d="M 640 660 L 715 750 L 640 840"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="4"
          />
          <path
            d="M 660 640 L 750 715 L 840 640"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="4"
          />
          <path
            d="M 860 660 L 785 750 L 860 840"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="4"
          />
          <path
            d="M 660 860 L 750 785 L 840 860"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="4"
          />

          {/* Multi-Tiered Center Sunburst Medallion */}
          {/* Outer golden starburst rays */}
          <path
            d={getStarPath(750, 750, 68, 38, 8)}
            fill="url(#center-gold-radial)"
            stroke="#92400e"
            strokeWidth="2.5"
            filter="url(#board-inset-shadow)"
          />

          {/* Middle ivory ring */}
          <circle cx="750" cy="750" r="42" fill="#ffffff" stroke="#d97706" strokeWidth="3" />

          {/* Faceted inner 8-point geometric jewel */}
          <path
            d={getStarPath(750, 750, 34, 18, 8)}
            fill="url(#gold-facet-1)"
            stroke="#b45309"
            strokeWidth="1.5"
          />

          {/* Central ruby / diamond gem */}
          <circle cx="750" cy="750" r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="747" cy="747" r="4" fill="#ffffff" opacity="0.8" />
        </g>

        {/* 7. TOKENS LAYER (Rendered with custom 3D cone/pawn tokens with glossy shine) */}
        <g id="tokens-layer">
          {tokensToRender.map((item) => (
            <g
              key={`rendered-token-${item.token.color}-${item.token.id}`}
              transform={`translate(${item.x}, ${item.y})`}
            >
              <PawnToken
                color={item.token.color}
                id={item.token.id}
                isClickable={item.isClickable}
                isFinished={item.token.step >= 56}
                isAnimating={item.isAnimating}
                hopY={item.hopY}
                scaleX={item.scaleX}
                scaleY={item.scaleY}
                shadowScale={item.shadowScale}
                tiltAngle={item.tiltAngle}
                hasLandingRipple={item.hasLandingRipple}
                onClick={() => item.isClickable && onTokenClick(item.token.id)}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* CENTER INTERACTIVE 3D DICE */}
      {centerDiceSlot && (
        <div
          id="board-center-dice-slot"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
        >
          {centerDiceSlot}
        </div>
      )}
    </div>
  );
};
