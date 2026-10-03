import React from 'react';
import { SnakeOrLadderItem, SnakePlayer } from '../../types/snakes';
import {
  getSquareCoord,
  LADDERS,
  SNAKE_COLOR_CONFIG,
  SNAKES,
} from '../../utils/snakesLogic';

interface SnakesBoardProps {
  players: SnakePlayer[];
  activePlayerIndex: number;
  animatingPlayerId: number | null;
  animatingSquare: number | null;
  animatingHop: boolean;
  is3dView: boolean;
  onTileClick?: (square: number) => void;
}

export const SnakesBoard: React.FC<SnakesBoardProps> = ({
  players,
  activePlayerIndex,
  animatingPlayerId,
  animatingSquare,
  animatingHop,
  is3dView,
}) => {
  // Generate all 100 tiles ordered in traditional visual grid order:
  // Row 0 (top, r=9): 100 down to 91
  // Row 1 (r=8): 81 up to 90
  // ...
  // Row 9 (bottom, r=0): 1 up to 10 (1 is at bottom-left, 10 is at bottom-right)
  const tiles = Array.from({ length: 100 }, (_, index) => {
    const gridRowIdx = Math.floor(index / 10); // 0 (top) to 9 (bottom)
    const gridColIdx = index % 10; // 0 (left) to 9 (right)
    const r = 9 - gridRowIdx; // r=0 is bottom row, r=9 is top row
    const isEven = r % 2 === 0;
    const num = isEven ? r * 10 + gridColIdx + 1 : r * 10 + (9 - gridColIdx) + 1;
    return num;
  });

  // Helper to render 3D Ladder
  const renderLadder = (item: SnakeOrLadderItem) => {
    const pStart = getSquareCoord(item.start);
    const pEnd = getSquareCoord(item.end);

    const dx = pEnd.x - pStart.x;
    const dy = pEnd.y - pStart.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    // Number of rungs based on ladder length
    const rungCount = Math.max(3, Math.floor(length / 7));
    const width = 3.8; // ladder width in percent

    return (
      <g key={`ladder-${item.id}`} className="pointer-events-none select-none">
        {/* Ladder Drop Shadow for 3D elevation */}
        <g
          transform={`translate(${pStart.x + 1.2}, ${pStart.y + 1.8}) rotate(${angle})`}
          opacity="0.38"
          filter="blur(1px)"
        >
          <rect x="0" y={-width / 2} width={length} height="0.9" fill="#000000" rx="0.4" />
          <rect x="0" y={width / 2 - 0.9} width={length} height="0.9" fill="#000000" rx="0.4" />
          {Array.from({ length: rungCount }).map((_, rIdx) => {
            const rx = (length / (rungCount + 1)) * (rIdx + 1);
            return (
              <rect
                key={`shadow-rung-${rIdx}`}
                x={rx - 0.4}
                y={-width / 2}
                width="0.8"
                height={width}
                fill="#000000"
                rx="0.3"
              />
            );
          })}
        </g>

        {/* 3D Realistic Golden/Wood Ladder */}
        <g transform={`translate(${pStart.x}, ${pStart.y}) rotate(${angle})`}>
          {/* Left Rail (3D cylindrical metallic wood) */}
          <rect
            x="0"
            y={-width / 2}
            width={length}
            height="1.1"
            fill="url(#ladderRailGrad)"
            stroke="#78350f"
            strokeWidth="0.2"
            rx="0.5"
          />
          {/* Right Rail */}
          <rect
            x="0"
            y={width / 2 - 1.1}
            width={length}
            height="1.1"
            fill="url(#ladderRailGrad)"
            stroke="#78350f"
            strokeWidth="0.2"
            rx="0.5"
          />

          {/* 3D Rungs with golden round caps */}
          {Array.from({ length: rungCount }).map((_, rIdx) => {
            const rx = (length / (rungCount + 1)) * (rIdx + 1);
            return (
              <g key={`rung-${rIdx}`}>
                {/* Rung bar */}
                <rect
                  x={rx - 0.45}
                  y={-width / 2 + 0.2}
                  width="0.9"
                  height={width - 0.4}
                  fill="url(#ladderRungGrad)"
                  stroke="#92400e"
                  strokeWidth="0.15"
                  rx="0.4"
                />
                {/* Golden bracket studs */}
                <circle cx={rx} cy={-width / 2 + 0.55} r="0.4" fill="#fef08a" stroke="#78350f" strokeWidth="0.1" />
                <circle cx={rx} cy={width / 2 - 0.55} r="0.4" fill="#fef08a" stroke="#78350f" strokeWidth="0.1" />
              </g>
            );
          })}
        </g>

        {/* Start square ladder icon & end square reward badge */}
        <circle cx={pStart.x} cy={pStart.y} r="2.2" fill="#15803d" stroke="#fef08a" strokeWidth="0.4" />
        <text x={pStart.x} y={pStart.y + 0.7} textAnchor="middle" fontSize="1.8" fill="#ffffff" fontWeight="bold">
          🪜
        </text>
      </g>
    );
  };

  // Helper to render 3D Snake
  const renderSnake = (item: SnakeOrLadderItem) => {
    const pHead = getSquareCoord(item.start);
    const pTail = getSquareCoord(item.end);

    const dx = pTail.x - pHead.x;
    const dy = pTail.y - pHead.y;

    // Generate sinusoidal wavy bezier points between head and tail
    const mx1 = pHead.x + dx * 0.33 + (dy > 0 ? 12 : -12);
    const my1 = pHead.y + dy * 0.33 + (dx > 0 ? -6 : 6);

    const mx2 = pHead.x + dx * 0.66 + (dy > 0 ? -10 : 10);
    const my2 = pHead.y + dy * 0.66 + (dx > 0 ? 8 : -8);

    const pathD = `M ${pHead.x},${pHead.y} C ${mx1},${my1} ${mx2},${my2} ${pTail.x},${pTail.y}`;

    // Angle of the head
    const headAngle = (Math.atan2(my1 - pHead.y, mx1 - pHead.x) * 180) / Math.PI + 180;

    return (
      <g key={`snake-${item.id}`} className="pointer-events-none select-none">
        {/* 1. Deep 3D Contact Shadow on Board */}
        <path
          d={pathD}
          fill="none"
          stroke="#000000"
          strokeWidth="3.4"
          strokeLinecap="round"
          opacity="0.38"
          transform="translate(1.5, 2)"
          filter="blur(1.2px)"
        />

        {/* 2. Outer Dark Body Contour */}
        <path
          d={pathD}
          fill="none"
          stroke="#14532d"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* 3. Textured Colored Body */}
        <path
          d={pathD}
          fill="none"
          stroke={item.color || '#16a34a'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 4. Glossy 3D Highlight Spine (gives cylindrical depth) */}
        <path
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* 5. Distinct Diamond Scale Pattern Rings along body */}
        <path
          d={pathD}
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.6"
          strokeDasharray="1.2 3.5"
          opacity="0.85"
        />

        {/* 6. Realistic 3D Snake Head at Start Square */}
        <g transform={`translate(${pHead.x}, ${pHead.y}) rotate(${headAngle})`}>
          {/* Flickering Red Forked Tongue */}
          <path
            d="M 2.6,0 L 5.2,-0.9 M 2.6,0 L 5.2,0.9"
            stroke="#ef4444"
            strokeWidth="0.5"
            strokeLinecap="round"
          />

          {/* Snake Head Skull (3D Cobra/Viper shape) */}
          <path
            d="M -2,-2.2 C 1.5,-2.5 3,-1.2 3.2,0 C 3,1.2 1.5,2.5 -2,2.2 C -3,1.5 -3,-1.5 -2,-2.2 Z"
            fill={item.color || '#15803d'}
            stroke="#052e16"
            strokeWidth="0.35"
          />

          {/* Venomous Yellow Eyes */}
          <circle cx="0.8" cy="-1.2" r="0.65" fill="#facc15" stroke="#78350f" strokeWidth="0.15" />
          <ellipse cx="0.8" cy="-1.2" rx="0.15" ry="0.45" fill="#000000" />

          <circle cx="0.8" cy="1.2" r="0.65" fill="#facc15" stroke="#78350f" strokeWidth="0.15" />
          <ellipse cx="0.8" cy="1.2" rx="0.15" ry="0.45" fill="#000000" />

          {/* White Sharp Fangs */}
          <polygon points="2.4,-0.8 2.9,-0.6 2.4,-0.4" fill="#ffffff" />
          <polygon points="2.4,0.4 2.9,0.6 2.4,0.8" fill="#ffffff" />
        </g>

        {/* 7. Snake Tail Rattle at Bottom Square */}
        <circle cx={pTail.x} cy={pTail.y} r="1.4" fill="#b45309" stroke="#78350f" strokeWidth="0.3" />
        <circle cx={pTail.x} cy={pTail.y} r="0.7" fill="#fef08a" />
      </g>
    );
  };

  return (
    <div className="relative w-full h-full max-w-[min(98vw,calc(100dvh-170px))] aspect-square mx-auto p-0 sm:p-1 select-none flex items-center justify-center">
      {/* 3D Container Wrapper with dynamic perspective tilt */}
      <div
        className={`relative w-full aspect-square transition-all duration-500 ease-out ${
          is3dView
            ? 'origin-bottom [transform:perspective(1200px)_rotateX(11deg)] filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]'
            : 'filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* 3D Extruded Wooden Edge Underneath (Visible in 3D tilt mode) */}
        {is3dView && (
          <div className="absolute -bottom-2.5 left-1 right-1 h-3 rounded-b-2xl bg-gradient-to-b from-[#451a03] via-[#290e02] to-[#120601] border-x-2 border-b-2 border-[#78350f] shadow-xl z-0" />
        )}

        {/* Outer Beveled Luxury Frame - Ultra slim padding on mobile to maximize board */}
        <div className="relative z-10 p-1 sm:p-2 rounded-2xl bg-gradient-to-br from-[#d97706] via-[#b45309] to-[#78350f] border-2 sm:border-4 border-[#fde047] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_16px_rgba(0,0,0,0.6)]">
          {/* Inner Golden Rim Inset */}
          <div className="relative rounded-xl bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#ca8a04] p-0.5 sm:p-1 shadow-inner">
            {/* 10x10 Board Stage */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-900 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]">
              {/* Grid of 100 Tiles: 10 equal columns and 10 equal rows */}
              <div
                className="absolute inset-0"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                  gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
                }}
              >
                {tiles.map((num) => {
                  const { row, col } = getSquareCoord(num);
                  const isCheckered = (row + col) % 2 === 0;

                  // Tile colors with rich soft pastels & golden glow
                  const isStart = num === 1;
                  const isWin = num === 100;
                  const isSnakeHead = SNAKES.some((s) => s.start === num);
                  const isLadderStart = LADDERS.some((l) => l.start === num);

                  // Calculate grid placement (row 9 is at top, row 0 is at bottom)
                  const gridRow = 10 - row; // 1-indexed for CSS grid
                  const gridCol = col + 1; // 1-indexed

                  return (
                    <div
                      key={`sq-${num}`}
                      style={{
                        gridRowStart: gridRow,
                        gridColumnStart: gridCol,
                      }}
                      className={`relative flex flex-col justify-between p-0.5 sm:p-1 border-[0.5px] border-black/15 transition-all overflow-hidden ${
                        isWin
                          ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 font-black text-amber-950'
                          : isStart
                          ? 'bg-gradient-to-br from-emerald-200 via-emerald-300 to-teal-400 font-black text-emerald-950'
                          : isCheckered
                          ? 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fde68a] text-slate-800'
                          : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-700'
                      }`}
                    >
                      {/* Top bar: Square Number with 3D embossed look */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`font-heading font-black text-[10px] sm:text-xs leading-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] ${
                            isWin
                              ? 'text-amber-900 text-xs sm:text-sm'
                              : isStart
                              ? 'text-emerald-900'
                              : 'text-slate-800'
                          }`}
                        >
                          {num}
                        </span>

                        {/* Special Icon Indicators */}
                        {isWin && (
                          <span className="text-[10px] sm:text-xs animate-bounce" title="Grand Winner Crown">
                            🏆
                          </span>
                        )}
                        {isStart && (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-800">
                            START
                          </span>
                        )}
                        {isSnakeHead && !isWin && (
                          <span className="text-[8px] sm:text-[9px] text-red-600 font-black" title="Snake Mouth Alert">
                            ⚠️
                          </span>
                        )}
                        {isLadderStart && !isStart && (
                          <span className="text-[9px] sm:text-[10px]" title="Ladder Climb Foot">
                            🪜
                          </span>
                        )}
                      </div>

                      {/* Subtle Inset bevel highlight for 3D tile look */}
                      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.1)]" />
                    </div>
                  );
                })}
              </div>

              {/* SVG Overlay: 3D Gradients, Realistic Snakes, and Golden Ladders */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
              >
                <defs>
                  {/* Ladder 3D cylindrical rail gradient */}
                  <linearGradient id="ladderRailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="40%" stopColor="#f59e0b" />
                    <stop offset="85%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>

                  {/* Ladder 3D rung gradient */}
                  <linearGradient id="ladderRungGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="35%" stopColor="#fde047" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#92400e" />
                  </linearGradient>
                </defs>

                {/* Render All 7 3D Ladders */}
                {LADDERS.map(renderLadder)}

                {/* Render All 7 3D Snakes */}
                {SNAKES.map(renderSnake)}
              </svg>

              {/* Layer 30: 3D Dynamic Player Pawns */}
              <div className="absolute inset-0 pointer-events-none z-30">
                {players.map((player, pIdx) => {
                  const isAnimating = animatingPlayerId === player.id;
                  const currentSquare = isAnimating && animatingSquare ? animatingSquare : player.position;

                  // If player hasn't started (position 0), place them outside bottom-left
                  let posX: number;
                  let posY: number;

                  if (currentSquare === 0) {
                    // Holding area at bottom left
                    posX = 3 + pIdx * 4;
                    posY = 97;
                  } else {
                    const coord = getSquareCoord(currentSquare);
                    // Multi-player offset if multiple pawns share square
                    const sharingPlayers = players.filter(
                      (p) =>
                        (animatingPlayerId === p.id && animatingSquare
                          ? animatingSquare
                          : p.position) === currentSquare
                    );
                    const rankOnSquare = sharingPlayers.findIndex((p) => p.id === player.id);
                    const offsetAngle = (rankOnSquare * (2 * Math.PI)) / Math.max(1, sharingPlayers.length);
                    const offsetDist = sharingPlayers.length > 1 ? 1.8 : 0;

                    posX = coord.x + Math.cos(offsetAngle) * offsetDist;
                    posY = coord.y + Math.sin(offsetAngle) * offsetDist;
                  }

                  const config = SNAKE_COLOR_CONFIG[player.color];
                  const isActive = activePlayerIndex === pIdx;

                  return (
                    <div
                      key={`pawn-${player.id}`}
                      className="absolute transition-all duration-200 ease-out"
                      style={{
                        left: `${posX}%`,
                        top: `${posY}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Contact 3D Drop Shadow */}
                      <div
                        className={`w-6 h-2 rounded-full bg-black/60 filter blur-[1px] mx-auto transition-all ${
                          isAnimating && animatingHop ? 'scale-75 opacity-30 translate-y-3' : 'scale-100 opacity-70'
                        }`}
                      />

                      {/* 3D Pawn Body with Hop Physics */}
                      <div
                        className={`relative flex flex-col items-center cursor-pointer transition-transform ${
                          isAnimating && animatingHop ? '-translate-y-5 scale-110' : '-translate-y-1'
                        } ${isActive ? 'scale-105' : ''}`}
                      >
                        {/* Active Player Aura / Halo Ring */}
                        {isActive && (
                          <div className="absolute -inset-1.5 rounded-full border-2 border-amber-300 animate-ping opacity-75 pointer-events-none" />
                        )}

                        {/* 3D Sphere Head */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center font-black text-[9px] text-white bg-gradient-to-tr ${config.gradient}`}
                          style={{
                            boxShadow: `0 3px 6px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.7), 0 0 10px ${config.tokenGlow}`,
                          }}
                        >
                          {/* Radial specular dot highlight */}
                          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white/80 pointer-events-none" />
                          <span className="drop-shadow-sm font-heading">{pIdx + 1}</span>
                        </div>

                        {/* 3D Flared Conical Skirt / Base */}
                        <div
                          className={`w-6 h-3 rounded-b-full border-t border-white/50 bg-gradient-to-b ${config.gradient} shadow-md -mt-1`}
                          style={{
                            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 3px 5px rgba(0,0,0,0.6)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
