import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { GameLogEntry, GameMode } from '../types';
import { COLOR_HEX } from '../utils/ludoLogic';

interface GameControlsProps {
  mode: GameMode;
  latestLog?: GameLogEntry | null;
  onGoHome?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  mode,
  latestLog,
  onGoHome,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto flex items-center justify-between gap-2 px-3 py-1 select-none z-10">
      {/* Return to Home / Menu */}
      {onGoHome && (
        <button
          id="game-back-to-home-btn"
          type="button"
          onClick={onGoHome}
          className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-md border border-white/50 backdrop-blur-md transition-all hover:scale-105 cursor-pointer font-heading"
          title="Return to Home Screen"
        >
          <ChevronLeft className="w-4 h-4 text-amber-600" />
          <span>Home</span>
        </button>
      )}

      {/* Active Turn / Event Status */}
      {latestLog ? (
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md border backdrop-blur-md max-w-[220px] sm:max-w-xs truncate"
          style={{
            backgroundColor: COLOR_HEX[latestLog.color].light,
            borderColor: COLOR_HEX[latestLog.color].border,
            color: COLOR_HEX[latestLog.color].text,
          }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{ backgroundColor: COLOR_HEX[latestLog.color].primary }}
          />
          <span className="truncate">{latestLog.message}</span>
        </div>
      ) : (
        <span className="text-xs font-bold text-white/80 drop-shadow-sm">
          {mode === '2-player'
            ? '2-Player Duel'
            : mode === '3-player'
            ? '3-Player Match'
            : mode === '5-player'
            ? '5-Player Classic'
            : mode === '6-player'
            ? '6-Player Grand Match'
            : '4-Player Classic'}
        </span>
      )}
    </header>
  );
};
