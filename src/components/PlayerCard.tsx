import React from 'react';
import { Bot, Crown, User } from 'lucide-react';
import { Player, PlayerColor } from '../types';
import { COLOR_HEX } from '../utils/ludoLogic';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  isCurrentTurn: boolean;
  onToggleType?: (color: PlayerColor) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isActive,
  isCurrentTurn,
  onToggleType,
}) => {
  const hex = COLOR_HEX[player.color];

  // Token status counts
  const tokensHome = player.tokens.filter((t) => t.step >= 56).length;
  const tokensInBase = player.tokens.filter((t) => t.step === -1).length;
  const tokensOnTrack = player.tokens.filter((t) => t.step >= 0 && t.step < 56).length;

  return (
    <div
      id={`player-card-${player.color}`}
      className={`relative flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl border transition-all duration-300 bg-white/95 backdrop-blur-sm ${
        isCurrentTurn
          ? 'ring-2 sm:ring-4 ring-offset-1 shadow-md scale-[1.02]'
          : 'border-slate-200/80 opacity-90'
      }`}
      style={{
        borderColor: isCurrentTurn ? hex.border : undefined,
        boxShadow: isCurrentTurn ? `0 4px 14px 0 ${hex.primary}30` : undefined,
      }}
    >
      {/* Turn indicator ribbon */}
      {isCurrentTurn && (
        <span
          className="absolute -top-2 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full text-white shadow-sm"
          style={{ backgroundColor: hex.primary }}
        >
          Active Turn
        </span>
      )}

      {/* Color Avatar & Icon */}
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md relative flex-shrink-0 border-2 border-white"
        style={{
          background: `linear-gradient(135deg, ${hex.gradientTop}, ${hex.primary})`,
        }}
      >
        {player.hasWon ? (
          <Crown className="w-5 h-5 text-amber-200 fill-amber-300 animate-bounce" />
        ) : player.type === 'computer' ? (
          <Bot className="w-5 h-5 text-white drop-shadow-sm" />
        ) : (
          <User className="w-5 h-5 text-white drop-shadow-sm" />
        )}
      </div>

      {/* Player info & tokens */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 truncate">
            <span
              className="text-xs sm:text-sm font-extrabold truncate font-heading tracking-wide"
              style={{ color: hex.text }}
            >
              {player.name}
            </span>
            {/* Clickable AI/Human toggle button if handler provided */}
            {onToggleType ? (
              <button
                type="button"
                onClick={() => onToggleType(player.color)}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-0.5 border border-slate-200 shadow-2xs font-heading"
                title={`Click to switch to ${player.type === 'human' ? 'AI' : 'Human'}`}
              >
                {player.type === 'computer' ? '🤖 AI' : '👤 You'}
              </button>
            ) : (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-heading">
                {player.type === 'computer' ? 'AI' : 'Human'}
              </span>
            )}
          </div>

          {/* Tokens Home Badge */}
          <div className="flex items-center gap-1 flex-shrink-0 font-heading">
            <span className="text-[11px] font-black text-slate-800">
              {tokensHome}/4
            </span>
            <span className="text-[10px] font-semibold text-slate-500">Home</span>
          </div>
        </div>

        {/* Mini progress dots */}
        <div className="flex items-center gap-1 mt-1.5">
          {player.tokens.map((token) => (
            <div
              key={`token-dot-${token.id}`}
              className="h-2 flex-1 rounded-full transition-all border border-black/5"
              style={{
                background:
                  token.step >= 56
                    ? `linear-gradient(to right, ${hex.gradientTop}, ${hex.primary})`
                    : token.step >= 0
                    ? `${hex.primary}`
                    : '#e2e8f0',
              }}
              title={`Token ${token.id + 1}: ${
                token.step >= 56
                  ? 'Home'
                  : token.step >= 0
                  ? `On Track (${token.step}/56)`
                  : 'In Yard'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
