import React from 'react';
import { Player, PlayerColor } from '../types';
import { COLOR_HEX } from '../utils/ludoLogic';

interface RoomPlayerBadgeProps {
  player: Player;
  isTurn: boolean;
  isRolling: boolean;
  onToggleType?: (color: PlayerColor) => void;
  cx: number;
  cy: number;
}

/**
 * RoomPlayerBadge: Embedded directly on each player's home room (yard) on the board.
 * Displays player avatar icon (Human vs Bot), player name, interactive toggle,
 * turn glow, and finished token progress.
 */
export const RoomPlayerBadge: React.FC<RoomPlayerBadgeProps> = ({
  player,
  isTurn,
  isRolling,
  onToggleType,
  cx,
  cy,
}) => {
  const hex = COLOR_HEX[player.color];
  const is6P = player.color === 'orange' || player.color === 'purple' || player.tokens.some((t) => t.step > 56);
  const finishedCount = player.tokens.filter((t) => t.step >= (is6P ? 70 : 56)).length;
  const isHuman = player.type === 'human';

  return (
    <g
      id={`room-badge-${player.color}`}
      className="select-none"
    >
      {/* 1. Active Turn Pulsing Halo around the room medallion */}
      {isTurn && (
        <>
          <rect
            x={cx - 68}
            y={cy - 48}
            width="136"
            height="96"
            rx="24"
            fill="none"
            stroke={hex.primary}
            strokeWidth="3.5"
            strokeDasharray="8 6"
            opacity="0.8"
            className="animate-spin"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
          <rect
            x={cx - 64}
            y={cy - 44}
            width="128"
            height="88"
            rx="22"
            fill={hex.glow}
            opacity="0.5"
            className="animate-pulse"
          />
        </>
      )}

      {/* 2. Main Beveled Room Medallion */}
      <rect
        x={cx - 60}
        y={cy - 40}
        width="120"
        height="80"
        rx="20"
        fill="#ffffff"
        stroke={isTurn ? hex.primary : '#cbd5e1'}
        strokeWidth={isTurn ? 4 : 2.5}
        filter="url(#board-inset-shadow)"
      />

      {/* Subtle top gloss highlight */}
      <path
        d={`M ${cx - 58} ${cy - 20} Q ${cx} ${cy - 12} ${cx + 58} ${cy - 20} L ${cx + 58} ${cy - 38} Q ${cx + 58} ${cy - 38} ${cx + 40} ${cy - 38} L ${cx - 40} ${cy - 38} Q ${cx - 58} ${cy - 38} ${cx - 58} ${cy - 20} Z`}
        fill="rgba(255, 255, 255, 0.7)"
        pointerEvents="none"
      />

      {/* 3. Turn Ribbon / Roll Hint on Top */}
      {isTurn && (
        <g transform={`translate(${cx}, ${cy - 42})`}>
          <rect
            x="-34"
            y="-10"
            width="68"
            height="20"
            rx="10"
            fill={hex.primary}
            stroke="#ffffff"
            strokeWidth="2"
            className="shadow-md animate-bounce"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fontFamily="sans-serif"
            fill="#ffffff"
            letterSpacing="0.5"
          >
            {isRolling ? 'ROLLING' : 'MY TURN'}
          </text>
        </g>
      )}

      {/* 4. Player Avatar Icon (Human with Crown vs Smart Robot) */}
      <g transform={`translate(${cx}, ${cy - 14})`}>
        {isHuman ? (
          /* Human Player Avatar with Golden Crown */
          <g>
            {/* Small golden crown */}
            <path
              d="M -10 -11 L -6 -6 L 0 -12 L 6 -6 L 10 -11 L 8 -3 L -8 -3 Z"
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth="1"
            />
            {/* Head circle */}
            <circle cx="0" cy="1" r="7" fill={hex.primary} stroke="#ffffff" strokeWidth="1.5" />
            {/* Shoulders */}
            <path
              d="M -11 13 C -11 8, -6 6, 0 6 C 6 6, 11 8, 11 13 Z"
              fill={hex.dark}
              stroke="#ffffff"
              strokeWidth="1.2"
            />
          </g>
        ) : (
          /* Smart Robot AI Avatar */
          <g>
            {/* Antenna */}
            <line x1="0" y1="-10" x2="0" y2="-7" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="0" cy="-11" r="2" fill="#ef4444" />
            {/* Robot Head */}
            <rect
              x="-9"
              y="-7"
              width="18"
              height="14"
              rx="4"
              fill="#64748b"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Eyes */}
            <circle cx="-4" cy="0" r="2" fill="#38bdf8" />
            <circle cx="4" cy="0" r="2" fill="#38bdf8" />
            {/* Mouth grill */}
            <line x1="-4" y1="4" x2="4" y2="4" stroke="#e2e8f0" strokeWidth="1" />
          </g>
        )}
      </g>

      {/* 5. Player Name Text */}
      <text
        x={cx}
        y={cy + 13}
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fontFamily="sans-serif"
        fill={hex.text}
        letterSpacing="0.5"
      >
        {player.name.toUpperCase()}
      </text>

      {/* 6. Interactive Player Type Toggle Button (YOU / BOT) */}
      <g
        id={`room-toggle-${player.color}`}
        transform={`translate(${cx}, ${cy + 26})`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleType?.(player.color);
        }}
        className="cursor-pointer group"
      >
        <rect
          x="-35"
          y="-8"
          width="70"
          height="16"
          rx="8"
          fill={isHuman ? '#ecfdf5' : '#f1f5f9'}
          stroke={isHuman ? '#10b981' : '#94a3b8'}
          strokeWidth="1.5"
          className="group-hover:opacity-85 transition-opacity"
        />
        <text
          x="0"
          y="3.5"
          textAnchor="middle"
          fontSize="9"
          fontWeight="800"
          fontFamily="sans-serif"
          fill={isHuman ? '#047857' : '#475569'}
          letterSpacing="0.4"
        >
          {isHuman ? 'YOU ⇄' : 'AI ⇄'}
        </text>
      </g>

      {/* 7. Home Tokens Progress Indicator (Small dots at bottom) */}
      <g transform={`translate(${cx}, ${cy + 37})`}>
        {[0, 1, 2, 3].map((i) => {
          const isDone = i < finishedCount;
          return (
            <circle
              key={`home-dot-${player.color}-${i}`}
              cx={(i - 1.5) * 8}
              cy="0"
              r="2.2"
              fill={isDone ? hex.primary : '#e2e8f0'}
              stroke={isDone ? '#ffffff' : '#cbd5e1'}
              strokeWidth="0.8"
            />
          );
        })}
      </g>
    </g>
  );
};
