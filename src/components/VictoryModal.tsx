import React, { useEffect } from 'react';
import { Crown, RotateCcw, Trophy, Users, X } from 'lucide-react';
import { Player } from '../types';
import { COLOR_HEX } from '../utils/ludoLogic';

interface VictoryModalProps {
  winner: Player;
  onRestart: () => void;
  onChangeMode: () => void;
  onClose?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  onRestart,
  onChangeMode,
  onClose,
}) => {
  const hex = COLOR_HEX[winner.color];
  const handleDismiss = onClose || onChangeMode;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDismiss]);

  // Lightweight particle canvas
  useEffect(() => {
    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotSpeed: number;
    }[] = [];

    const colors = ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#ec4899', '#8b5cf6'];
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * -h,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 4 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.y > h) {
          p.y = -10;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none"
      onClick={handleDismiss}
    >
      <canvas
        id="confetti-canvas"
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      <div
        id="victory-dialog"
        className="relative z-20 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center border-4 transform transition-all duration-300 scale-100 animate-scale-up"
        style={{ borderColor: hex.border }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close [X] Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-400 hover:text-slate-700 transition-all flex items-center justify-center cursor-pointer border border-slate-200"
          aria-label="Close dialog"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown Icon */}
        <div
          className="w-20 h-20 mx-auto -mt-14 mb-3 rounded-full flex items-center justify-center shadow-xl text-white"
          style={{ backgroundColor: hex.primary }}
        >
          <Trophy className="w-10 h-10 text-amber-300 fill-amber-300" />
        </div>

        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Victory!
        </h2>
        <p className="text-sm font-semibold mt-1" style={{ color: hex.dark }}>
          {winner.name} ({winner.type === 'computer' ? 'Computer' : 'Player'}) has won the game!
        </p>
        <p className="text-xs text-slate-500 mt-2">
          All 4 tokens successfully navigated the track and reached the home goal!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-6">
          <button
            id="restart-game-btn"
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
            style={{ backgroundColor: hex.primary }}
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>

          <button
            id="change-mode-btn"
            type="button"
            onClick={onChangeMode}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Change Game Mode
          </button>
        </div>
      </div>
    </div>
  );
};
