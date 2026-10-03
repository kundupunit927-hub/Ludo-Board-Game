import React, { useState } from 'react';
import { Bot, Users, X, Play } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface SnakesSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (playerCount: 2 | 3 | 4, vsAi: boolean) => void;
}

export const SnakesSetupModal: React.FC<SnakesSetupModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
}) => {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2);
  const [vsAi, setVsAi] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#3b0764] via-[#1e1b4b] to-[#0f172a] border-2 border-amber-400 p-5 shadow-2xl text-white text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 3D Header graphic */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">🐍</span>
          <h2 className="text-xl font-black font-heading text-amber-300 drop-shadow-md">
            SAANP SEEDHI
          </h2>
          <span className="text-2xl">🪜</span>
        </div>
        <p className="text-xs text-amber-200/80 mb-4 font-bold uppercase tracking-wider">
          Snakes & Ladders 3D Edition
        </p>

        {/* 1. Player Count Selection (2, 3, 4 Players) */}
        <div className="mb-4 text-left">
          <label className="block text-[11px] font-black uppercase text-amber-300 tracking-wider mb-2 font-heading">
            1. Select Number of Players
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([2, 3, 4] as const).map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setPlayerCount(cnt);
                }}
                className={`py-2.5 px-2 rounded-2xl border-2 font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer font-heading ${
                  playerCount === cnt
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-102'
                    : 'border-white/15 bg-black/40 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-sm font-black">{cnt}</span>
                <span className="text-[10px] font-bold uppercase">Players</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Opponent Mode Selection */}
        <div className="mb-5 text-left">
          <label className="block text-[11px] font-black uppercase text-amber-300 tracking-wider mb-2 font-heading">
            2. Choose Opponent
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setVsAi(true);
              }}
              className={`p-2.5 rounded-2xl border-2 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-heading ${
                vsAi
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'border-white/15 bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>VS AI</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setVsAi(false);
              }}
              className={`p-2.5 rounded-2xl border-2 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-heading ${
                !vsAi
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'border-white/15 bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>PASS & PLAY</span>
            </button>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onStartGame(playerCount, vsAi);
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 active:scale-95 text-white font-black text-sm font-heading shadow-[0_4px_0_#7f1d1d,0_8px_20px_rgba(0,0,0,0.6)] border border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START SAANP SEEDHI</span>
        </button>
      </div>
    </div>
  );
};
