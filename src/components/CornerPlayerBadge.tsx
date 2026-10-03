import React from 'react';
import { Bot, Crown, User } from 'lucide-react';
import { Player, PlayerColor } from '../types';
import { COLOR_HEX } from '../utils/ludoLogic';

interface CornerPlayerBadgeProps {
  player: Player;
  isTurn: boolean;
  isRolling: boolean;
  onToggleType?: (color: PlayerColor) => void;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const CornerPlayerBadge: React.FC<CornerPlayerBadgeProps> = ({
  player,
  isTurn,
  isRolling,
  onToggleType,
  position,
}) => {
  const hex = COLOR_HEX[player.color];
  const tokensHome = player.tokens.filter((t) => t.step >= 56).length;

  const positionClasses = {
    'top-left': 'top-2 left-2 sm:top-3 sm:left-3',
    'top-right': 'top-2 right-2 sm:top-3 sm:right-3',
    'bottom-left': 'bottom-2 left-2 sm:bottom-3 sm:left-3',
    'bottom-right': 'bottom-2 right-2 sm:bottom-3 sm:right-3',
  }[position];

  return (
    <div
      id={`corner-badge-${player.color}`}
      className={`absolute ${positionClasses} z-20 flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl transition-all duration-300 select-none shadow-lg border ${
        isTurn
          ? 'bg-white text-slate-900 ring-3 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.65)] scale-105 z-30'
          : 'bg-white/90 hover:bg-white text-slate-800 border-white/60 shadow-md'
      }`}
      style={{
        borderColor: isTurn ? hex.primary : 'rgba(255,255,255,0.8)',
      }}
    >
      {/* Player Color Avatar with Glow on Turn */}
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-black shadow-sm flex-shrink-0 border-2 border-white"
        style={{
          background: `linear-gradient(135deg, ${hex.gradientTop}, ${hex.primary})`,
        }}
      >
        {player.hasWon ? (
          <Crown className="w-4 h-4 text-amber-200 fill-amber-300 animate-bounce" />
        ) : player.type === 'computer' ? (
          <Bot className="w-4 h-4 text-white drop-shadow-sm" />
        ) : (
          <User className="w-4 h-4 text-white drop-shadow-sm" />
        )}
      </div>

      {/* Name and Turn / Bot status */}
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-center gap-1">
          <span
            className="text-xs sm:text-sm font-extrabold truncate font-heading"
            style={{ color: hex.text }}
          >
            {player.name}
          </span>

          {/* Turn Tag if Active */}
          {isTurn && (
            <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider animate-pulse shadow-2xs font-heading">
              {isRolling ? '...' : 'Turn'}
            </span>
          )}
        </div>

        {/* Human / AI Toggle and Home Count */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold mt-0.5">
          {onToggleType ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleType(player.color);
              }}
              className="px-1.5 py-0.2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
              title="Click to switch between Human and AI"
            >
              {player.type === 'computer' ? '🤖 AI' : '👤 You'}
            </button>
          ) : (
            <span className="text-slate-500">
              {player.type === 'computer' ? '🤖 AI' : '👤 You'}
            </span>
          )}

          <span className="text-slate-600 font-black">
            {tokensHome}/4
          </span>
        </div>
      </div>
    </div>
  );
};
