import React, { useEffect } from 'react';
import { AlertTriangle, Home, Play, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface QuitConfirmModalProps {
  isOpen: boolean;
  gameName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const QuitConfirmModal: React.FC<QuitConfirmModalProps> = ({
  isOpen,
  gameName = 'Game',
  onConfirm,
  onCancel,
}) => {
  // Handle ESC key to cancel
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sounds.playClick();
          onCancel();
        }
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#1e1b4b] via-[#172554] to-[#0f172a] border-2 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.35),0_15px_30px_rgba(0,0,0,0.8)] p-5 text-white text-center transform scale-100 transition-all select-none">
        {/* Close Icon Top Right */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onCancel();
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon with Amber Glow */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] mb-3.5 border-2 border-yellow-200">
          <AlertTriangle className="w-8 h-8 text-amber-950 stroke-[2.5]" />
        </div>

        {/* Title */}
        <h2
          id="quit-modal-title"
          className="text-lg sm:text-xl font-black font-heading tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 drop-shadow-sm mb-1.5"
        >
          Exit {gameName}?
        </h2>

        {/* Description in English & Hindi */}
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mb-1">
          Are you sure you want to leave the current match and go back to the Home screen?
        </p>
        <p className="text-[11px] sm:text-xs text-amber-300/90 font-medium mb-5">
          (आपकी वर्तमान गेम प्रगति समाप्त हो जाएगी)
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          {/* Cancel / Keep Playing */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 font-heading font-black text-xs sm:text-sm tracking-wide shadow-md border border-emerald-400/40 flex items-center justify-center gap-1.5 cursor-pointer text-white"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Keep Playing</span>
          </button>

          {/* Confirm / Quit to Home */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onConfirm();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 active:scale-95 font-heading font-black text-xs sm:text-sm tracking-wide shadow-md border border-red-400/40 flex items-center justify-center gap-1.5 cursor-pointer text-white"
          >
            <Home className="w-4 h-4" />
            <span>Leave Match</span>
          </button>
        </div>
      </div>
    </div>
  );
};
