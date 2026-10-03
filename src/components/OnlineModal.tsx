import React, { useState } from 'react';
import { Check, Copy, Globe, RefreshCw, Users, Wifi, X } from 'lucide-react';
import { GameMode } from '../types';

interface OnlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnlineGame: (roomCode: string, mode: GameMode, playerName: string) => void;
}

export const OnlineModal: React.FC<OnlineModalProps> = ({
  isOpen,
  onClose,
  onStartOnlineGame,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [roomMode, setRoomMode] = useState<GameMode>('4-player');
  const [playerName, setPlayerName] = useState('Player 1');
  const [generatedCode, setGeneratedCode] = useState(() =>
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    setGeneratedCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    setCopied(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateRoom = () => {
    setIsSearching(true);
    setSearchStatus('Room created! Waiting for opponents to connect...');
    setTimeout(() => {
      setIsSearching(false);
      onStartOnlineGame(generatedCode, roomMode, playerName || 'Host');
      onClose();
    }, 1200);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputCode.trim().toUpperCase();
    if (!code) return;

    setIsSearching(true);
    setSearchStatus(`Connecting to room #${code}...`);
    setTimeout(() => {
      setIsSearching(false);
      onStartOnlineGame(code, '4-player', playerName || 'Guest');
      onClose();
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="online-mode-dialog"
        className="relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-slate-900 border border-amber-400/40 p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.8)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-white/10 shadow-sm z-10"
          aria-label="Close dialog"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30 flex-shrink-0">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-heading text-white tracking-wide">
              Online Multiplayer
            </h2>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live Matchmaking & Private Rooms
            </p>
          </div>
        </div>

        {/* Tabs: Create Room vs Join Room */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 mb-4">
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer font-heading flex items-center justify-center gap-1.5 ${
              tab === 'create'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wifi className="w-3 h-3" />
            <span>Create Room</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer font-heading flex items-center justify-center gap-1.5 ${
              tab === 'join'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Join Room</span>
          </button>
        </div>

        {/* Player Name Input */}
        <div className="mb-3.5">
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={14}
            className="w-full py-1.5 px-3 rounded-xl bg-black/50 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400 placeholder:text-slate-500 font-heading"
            placeholder="Enter player name"
          />
        </div>

        {tab === 'create' ? (
          <>
            {/* Mode selection for created room */}
            <div className="mb-3.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Room Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRoomMode('4-player')}
                  className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 font-heading ${
                    roomMode === '4-player'
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/15 text-slate-400 hover:border-white/30'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>4 Players</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoomMode('2-player')}
                  className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 font-heading ${
                    roomMode === '2-player'
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/15 text-slate-400 hover:border-white/30'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>2P Duel</span>
                </button>
              </div>
            </div>

            {/* Generated Room Code Box */}
            <div className="mb-4 p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Room Code</span>
                <span className="text-base font-black tracking-widest text-amber-300 font-heading">
                  {generatedCode}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Generate new code"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="py-1 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Copy room code"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Start / Create button */}
            <button
              type="button"
              disabled={isSearching}
              onClick={handleCreateRoom}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-xs sm:text-sm font-heading shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>{isSearching ? 'Creating Room...' : 'Start Online Room'}</span>
            </button>
          </>
        ) : (
          <form onSubmit={handleJoinRoom} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Enter Room Code
              </label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={8}
                className="w-full py-2 px-3 rounded-xl bg-black/50 border border-white/20 text-amber-300 text-sm font-black tracking-widest text-center focus:outline-none focus:border-emerald-400 uppercase placeholder:text-slate-600 font-heading"
                placeholder="E.G. ABC123"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSearching || !inputCode.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-xs sm:text-sm font-heading shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isSearching ? 'Connecting...' : 'Join Game'}</span>
            </button>
          </form>
        )}

        {searchStatus && (
          <p className="mt-3 text-center text-[11px] font-semibold text-amber-300 animate-pulse">
            {searchStatus}
          </p>
        )}
      </div>
    </div>
  );
};
