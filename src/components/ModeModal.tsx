import React, { useEffect, useState } from 'react';
import { Bot, Globe, Play, User, Users, Volume2, VolumeX, X } from 'lucide-react';
import appIconUrl from '../assets/images/ludo_app_icon_1788933256271.jpg';
import { GameMode, PlayerColor, PlayerType } from '../types';
import { COLOR_HEX } from '../utils/ludoLogic';

interface ModeModalProps {
  isOpen: boolean;
  currentMode: GameMode;
  onClose?: () => void;
  onStartGame: (config: {
    mode: GameMode;
    playerTypes: Record<PlayerColor, PlayerType>;
  }) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenOnline?: () => void;
}

export const ModeModal: React.FC<ModeModalProps> = ({
  isOpen,
  currentMode,
  onClose,
  onStartGame,
  soundEnabled,
  onToggleSound,
  onOpenOnline,
}) => {
  const [mode, setMode] = useState<GameMode>(currentMode);
  const [preset, setPreset] = useState<'pvc' | 'pvp' | 'custom'>('pvc');
  const [playerTypes, setPlayerTypes] = useState<Record<PlayerColor, PlayerType>>({
    red: 'human',
    green: 'computer',
    yellow: 'computer',
    blue: 'computer',
    orange: 'computer',
    purple: 'computer',
  });

  useEffect(() => {
    if (isOpen) {
      if (currentMode === '5-player' || currentMode === '6-player') {
        setMode('4-player');
      } else {
        setMode(currentMode);
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentMode, onClose]);

  if (!isOpen) return null;

  const handlePresetSelect = (selectedPreset: 'pvc' | 'pvp' | 'custom') => {
    setPreset(selectedPreset);
    if (selectedPreset === 'pvc') {
      setPlayerTypes({
        red: 'human',
        green: 'computer',
        yellow: 'computer',
        blue: 'computer',
        orange: 'computer',
        purple: 'computer',
      });
    } else if (selectedPreset === 'pvp') {
      setPlayerTypes({
        red: 'human',
        green: 'human',
        yellow: 'human',
        blue: 'human',
        orange: 'human',
        purple: 'human',
      });
    }
  };

  const togglePlayerType = (color: PlayerColor) => {
    setPreset('custom');
    setPlayerTypes((prev) => ({
      ...prev,
      [color]: prev[color] === 'human' ? 'computer' : 'human',
    }));
  };

  const handleStart = () => {
    onStartGame({
      mode,
      playerTypes,
    });
  };

  const activeColors: PlayerColor[] =
    mode === '2-player'
      ? ['red', 'yellow']
      : mode === '3-player'
      ? ['red', 'green', 'yellow']
      : ['red', 'green', 'yellow', 'blue'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="mode-selection-dialog"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center cursor-pointer border border-slate-200"
            aria-label="Close dialog"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border-2 border-slate-200 flex-shrink-0">
            <img
              src={appIconUrl}
              alt="Ludo App Icon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading tracking-tight">
              Ludo Classic Setup
            </h2>
            <p className="text-xs text-slate-500 font-medium font-heading">
              Configure original board players and mode
            </p>
          </div>
        </div>

        {/* 1. Player Count (2, 3, 4 Players Only) */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Number of Players
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { m: '2-player', label: '2 Players' },
              { m: '3-player', label: '3 Players' },
              { m: '4-player', label: '4 Players' },
            ] as const).map(({ m, label }) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`py-2.5 px-2 rounded-xl border-2 font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                  mode === m
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Opponent Preset */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Game Style
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => handlePresetSelect('pvc')}
              className={`p-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                preset === 'pvc'
                  ? 'border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              Play vs Computer
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('pvp')}
              className={`p-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                preset === 'pvp'
                  ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Pass & Play (Local)
            </button>
          </div>

          {onOpenOnline && (
            <button
              type="button"
              onClick={() => {
                onClose?.();
                onOpenOnline();
              }}
              className="w-full py-2 px-3 rounded-xl border border-teal-500/50 bg-teal-50/70 hover:bg-teal-100/70 text-teal-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs font-heading"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>Switch to Online Multiplayer Room</span>
            </button>
          )}
        </div>

        {/* 3. Player Slot Configuration */}
        <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Seat Configuration</span>
            <span className="text-[10px] font-normal text-slate-400">Click to switch AI/human</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {activeColors.map((col) => {
              const hex = COLOR_HEX[col];
              const isHuman = playerTypes[col] === 'human';
              return (
                <button
                  key={`config-${col}`}
                  type="button"
                  onClick={() => togglePlayerType(col)}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-all text-left cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: hex.primary }}
                    />
                    <span className="text-xs font-bold capitalize text-slate-800">
                      {col}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isHuman
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {isHuman ? (
                      <>
                        <User className="w-3 h-3" />
                        Human
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3" />
                        AI
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sound toggle & Start button */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                : 'border-red-200 bg-red-50 text-red-600'
            }`}
            title="Toggle game sound effects"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-red-500" />
                <span>Muted</span>
              </>
            )}
          </button>

          <button
            id="start-new-game-btn"
            type="button"
            onClick={handleStart}
            className="flex-1 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};
