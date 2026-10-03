import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PlayerColor } from '../types';
import { COLOR_HEX } from '../utils/ludoLogic';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  canRoll: boolean;
  color: PlayerColor;
  onRoll: () => void;
  message?: string;
  hasBonusTurn?: boolean;
}

/**
 * 3D Carved Pip (Dot) with physical sunken cavity, enamel/gem fill, and curved glass glint
 */
const Pip: React.FC<{
  isColored?: boolean;
  colorHex?: { primary: string; gradientTop: string; gradientBottom: string; dark: string };
  sizeClass?: string;
  isRoyalCenter?: boolean;
}> = ({
  isColored = false,
  colorHex,
  sizeClass = 'w-3.5 h-3.5 sm:w-4 sm:h-4',
  isRoyalCenter = false,
}) => {
  if (isRoyalCenter && colorHex) {
    // Premium Royal Crown Jewel Pip for 1 with multi-layered gold bezel
    return (
      <div
        className="relative rounded-full flex items-center justify-center p-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform hover:scale-105"
        style={{
          width: '30px',
          height: '30px',
          background: 'linear-gradient(145deg, #fef08a 0%, #f59e0b 45%, #b45309 80%, #78350f 100%)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 1.5px 2px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: `radial-gradient(circle at 35% 28%, ${colorHex.gradientTop} 0%, ${colorHex.primary} 50%, ${colorHex.gradientBottom} 85%, ${colorHex.dark} 100%)`,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7), inset 0 -1.5px 2px rgba(255,255,255,0.45)',
          }}
        >
          {/* Faceted jewel shine */}
          <span className="absolute top-1 left-1.5 w-2 h-1.5 rounded-full bg-white/95 transform -rotate-45 pointer-events-none filter blur-[0.3px]" />
          <span className="absolute bottom-1 right-1.5 w-1 h-1 rounded-full bg-white/50 pointer-events-none" />
          {/* Subtle star gleam in center */}
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 pointer-events-none shadow-[0_0_4px_#fff]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full flex-shrink-0 flex items-center justify-center transition-all ${sizeClass}`}
      style={{
        background: isColored && colorHex
          ? `radial-gradient(circle at 30% 28%, ${colorHex.gradientTop} 0%, ${colorHex.primary} 55%, ${colorHex.dark} 100%)`
          : 'radial-gradient(circle at 30% 28%, #475569 0%, #1e293b 65%, #05070a 100%)',
        boxShadow: isColored && colorHex
          ? `inset 0 2px 3px rgba(0,0,0,0.75), 0 1px 1px rgba(255,255,255,0.95), 0 0 5px ${colorHex.primary}77`
          : 'inset 0 2px 3px rgba(0,0,0,0.9), 0 1px 1.5px rgba(255,255,255,0.9)',
        border: isColored && colorHex ? '1px solid rgba(251, 191, 36, 0.7)' : '1px solid rgba(15, 23, 42, 0.4)',
      }}
    >
      {/* Gloss reflection specular pinpoint */}
      <span className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/90 pointer-events-none" />
    </div>
  );
};

/**
 * Render authentic Ludo King face layout for values 1 to 6
 */
const DiceFaceLayout: React.FC<{
  faceValue: number;
  colorHex: { primary: string; gradientTop: string; gradientBottom: string; dark: string };
  isSix: boolean;
}> = ({ faceValue, colorHex, isSix }) => {
  switch (faceValue) {
    case 1:
      // Royal center jewel pip in player's vivid color
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Pip isColored isRoyalCenter colorHex={colorHex} />
        </div>
      );
    case 2:
      // Two diagonal pips
      return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 p-2 sm:p-2.5 place-items-center">
          <div className="col-start-1 row-start-1">
            <Pip isColored={false} colorHex={colorHex} />
          </div>
          <div className="col-start-2 row-start-2">
            <Pip isColored={false} colorHex={colorHex} />
          </div>
        </div>
      );
    case 3:
      // Three diagonal pips
      return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1.5 sm:p-2 place-items-center">
          <div className="col-start-1 row-start-1">
            <Pip isColored={false} colorHex={colorHex} />
          </div>
          <div className="col-start-2 row-start-2">
            <Pip isColored colorHex={colorHex} sizeClass="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="col-start-3 row-start-3">
            <Pip isColored={false} colorHex={colorHex} />
          </div>
        </div>
      );
    case 4:
      // Four corner pips
      return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 p-2 sm:p-2.5 place-items-center">
          <Pip isColored={false} colorHex={colorHex} />
          <Pip isColored={false} colorHex={colorHex} />
          <Pip isColored={false} colorHex={colorHex} />
          <Pip isColored={false} colorHex={colorHex} />
        </div>
      );
    case 5:
      // Four corner pips + center accent pip
      return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1.5 sm:p-2 place-items-center">
          <div className="col-start-1 row-start-1"><Pip isColored={false} colorHex={colorHex} /></div>
          <div className="col-start-3 row-start-1"><Pip isColored={false} colorHex={colorHex} /></div>
          <div className="col-start-2 row-start-2">
            <Pip isColored colorHex={colorHex} sizeClass="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="col-start-1 row-start-3"><Pip isColored={false} colorHex={colorHex} /></div>
          <div className="col-start-3 row-start-3"><Pip isColored={false} colorHex={colorHex} /></div>
        </div>
      );
    case 6:
    default:
      // Six sparkling pips in two columns of three
      return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-3 p-1.5 sm:p-2 place-items-center gap-y-1">
          <Pip isColored={isSix} colorHex={colorHex} />
          <Pip isColored={isSix} colorHex={colorHex} />
          <Pip isColored={isSix} colorHex={colorHex} />
          <Pip isColored={isSix} colorHex={colorHex} />
          <Pip isColored={isSix} colorHex={colorHex} />
          <Pip isColored={isSix} colorHex={colorHex} />
        </div>
      );
  }
};

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  canRoll,
  color,
  onRoll,
  message,
  hasBonusTurn,
}) => {
  const hex = COLOR_HEX[color];
  const [displayFace, setDisplayFace] = useState<number>(value || 1);
  const [rollCycleKey, setRollCycleKey] = useState<number>(0);
  const [showSparkles, setShowSparkles] = useState<boolean>(false);
  const tumbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync displayed face with value when not rolling
  useEffect(() => {
    if (!isRolling && value && value >= 1 && value <= 6) {
      setDisplayFace(value);
      if (value === 6) {
        setShowSparkles(true);
        const timer = setTimeout(() => setShowSparkles(false), 1400);
        return () => clearTimeout(timer);
      }
    }
  }, [value, isRolling]);

  // When a roll starts, trigger rapid smooth face tumbling
  useEffect(() => {
    if (isRolling) {
      setRollCycleKey((k) => k + 1);
      setShowSparkles(false);

      let count = 0;
      tumbleTimerRef.current = setInterval(() => {
        count++;
        const nextFace = ((count * 3) % 6) + 1;
        setDisplayFace(nextFace);

        if (count >= 10) {
          if (tumbleTimerRef.current) clearInterval(tumbleTimerRef.current);
          if (value) setDisplayFace(value);
        }
      }, 75);

      return () => {
        if (tumbleTimerRef.current) clearInterval(tumbleTimerRef.current);
      };
    }
  }, [isRolling, value]);

  const isSix = displayFace === 6;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Outer interactive button */}
      <button
        id="roll-dice-btn"
        type="button"
        disabled={!canRoll || isRolling}
        onClick={onRoll}
        aria-label="Roll Dice"
        className={`group relative outline-none focus:outline-none ${
          canRoll && !isRolling
            ? 'cursor-pointer transform active:scale-95'
            : 'cursor-not-allowed'
        }`}
      >
        {/* 1. Pulsing Ambient Aura / Halo when it's player's turn to roll */}
        {canRoll && !isRolling && (
          <div
            className="absolute -inset-3.5 sm:-inset-4 rounded-[26px] animate-pulse blur-md transition-opacity duration-300 pointer-events-none z-0"
            style={{
              backgroundColor: hex.glow,
              opacity: 0.85,
            }}
          />
        )}

        {/* 2. Golden Radiant Shimmer for 6 (Bonus Turn) */}
        {(hasBonusTurn || showSparkles) && !isRolling && (
          <div className="absolute -inset-4 sm:-inset-5 rounded-[28px] animate-bonus-glow pointer-events-none z-10" />
        )}

        {/* 3. Board Surface Cast Shadow with Dynamic Height Reaction */}
        <div
          key={`shadow-${rollCycleKey}`}
          className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-14 h-4 sm:w-16 sm:h-5 rounded-full pointer-events-none transition-all ${
            isRolling ? 'animate-ludo-shadow' : 'bg-black/55 blur-[2px]'
          }`}
        />

        {/* 4. MAIN 3D LUDO KING CLASSIC DIE BODY */}
        <div
          key={`dice-${rollCycleKey}`}
          className={`relative w-15 h-15 sm:w-16 sm:h-16 md:w-17 md:h-17 rounded-[20px] sm:rounded-[22px] p-1.5 bg-gradient-to-b from-[#ffffff] via-[#fcfbf9] to-[#ece5d8] border-2 border-amber-200/90 shadow-[inset_0_3px_6px_rgba(255,255,255,1),inset_0_-4px_6px_rgba(0,0,0,0.22),0_10px_22px_rgba(0,0,0,0.5)] ${
            isRolling
              ? 'animate-ludo-roll'
              : canRoll
              ? 'animate-ludo-idle hover:scale-105'
              : ''
          }`}
          style={{
            // 3D edge rim reflecting active player's color and gold edge
            borderBottomColor: hex.dark,
            borderRightColor: hex.primary,
          }}
        >
          {/* Inner Golden Chamfer Bevel Ring */}
          <div className="absolute inset-1 rounded-[16px] border border-amber-300/40 pointer-events-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]" />

          {/* Curved Acrylic High-Gloss Lens Glare across top half */}
          <div className="absolute top-1 left-1.5 right-1.5 h-6 bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-[16px] pointer-events-none" />

          {/* Die Face Layout */}
          <div className="relative w-full h-full flex items-center justify-center">
            <DiceFaceLayout
              faceValue={displayFace}
              colorHex={hex}
              isSix={isSix}
            />
          </div>

          {/* Golden Corner Glint when rolling 6 */}
          {isSix && !isRolling && (
            <div className="absolute -top-1 -right-1 pointer-events-none">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow filter drop-shadow-[0_0_6px_#fbbf24]" />
            </div>
          )}
        </div>

        {/* 5. Bonus Turn Badge for 6 */}
        {hasBonusTurn && !isRolling && (
          <span
            id="dice-bonus-badge"
            className="absolute -top-3.5 -right-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white animate-bounce font-heading z-30"
          >
            +1 Roll!
          </span>
        )}
      </button>

      {/* Floating Status / Action Pill directly below dice */}
      {message ? (
        <div className="absolute -bottom-6 sm:-bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-40 pointer-events-none">
          <span className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 shadow-md border border-amber-400/50 font-heading">
            {message}
          </span>
        </div>
      ) : canRoll && !isRolling ? (
        <div className="absolute -bottom-6 sm:-bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-40 pointer-events-none">
          <span
            className="text-[10px] sm:text-xs font-black uppercase tracking-wider animate-pulse font-heading px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white shadow-md border border-white/20"
            style={{ color: hex.primary === '#eab308' ? '#fde047' : hex.gradientTop }}
          >
            Tap to Roll!
          </span>
        </div>
      ) : null}
    </div>
  );
};
