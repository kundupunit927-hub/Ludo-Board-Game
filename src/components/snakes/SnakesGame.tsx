import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Box, RotateCcw, Volume2, VolumeX, Trophy, Sparkles, User, Bot, Layers } from 'lucide-react';
import { Dice } from '../Dice';
import { SnakesBoard } from './SnakesBoard';
import { QuitConfirmModal } from '../QuitConfirmModal';
import { SnakePlayer, SnakePlayerColor } from '../../types/snakes';
import {
  createDefaultSnakePlayers,
  LADDERS,
  SNAKE_COLOR_CONFIG,
  SNAKES,
} from '../../utils/snakesLogic';
import { sounds } from '../../utils/audio';

interface SnakesGameProps {
  playerCount: 2 | 3 | 4;
  vsAi: boolean;
  onGoHome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SnakesGame: React.FC<SnakesGameProps> = ({
  playerCount,
  vsAi,
  onGoHome,
  soundEnabled,
  onToggleSound,
}) => {
  // Initialize players starting at square 1
  const [players, setPlayers] = useState<SnakePlayer[]>(() => {
    const list = createDefaultSnakePlayers(playerCount, vsAi);
    return list.map((p) => ({ ...p, position: 1 }));
  });

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [hasBonusTurn, setHasBonusTurn] = useState<boolean>(false);
  const [winner, setWinner] = useState<SnakePlayer | null>(null);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState<boolean>(false);

  // 3D Perspective Tilt View toggle
  const [is3dView, setIs3dView] = useState<boolean>(true);

  // Animation states for tile-by-tile hopping
  const [animatingPlayerId, setAnimatingPlayerId] = useState<number | null>(null);
  const [animatingSquare, setAnimatingSquare] = useState<number | null>(null);
  const [animatingHop, setAnimatingHop] = useState<boolean>(false);

  // Live action message banner
  const [eventLog, setEventLog] = useState<string>('Game started! Roll the dice to begin.');
  const [bannerAlert, setBannerAlert] = useState<{
    type: 'snake' | 'ladder' | 'bonus' | 'pass';
    text: string;
  } | null>(null);

  const activePlayer = players[activePlayerIndex] || players[0];
  const canRoll = !isRolling && !isMoving && !winner && (!activePlayer.isAi || false);

  // Handle resetting current match
  const handleReset = () => {
    sounds.playClick();
    setPlayers(createDefaultSnakePlayers(playerCount, vsAi).map((p) => ({ ...p, position: 1 })));
    setActivePlayerIndex(0);
    setDiceValue(null);
    setIsRolling(false);
    setIsMoving(false);
    setHasBonusTurn(false);
    setWinner(null);
    setBannerAlert(null);
    setEventLog('Game reset. Player 1 rolls first!');
  };

  // Turn advance helper
  const nextTurn = useCallback(() => {
    setActivePlayerIndex((prev) => (prev + 1) % players.length);
    setHasBonusTurn(false);
  }, [players.length]);

  // Main dice roll and movement logic
  const handleRollDice = useCallback(() => {
    if (isRolling || isMoving || winner) return;

    setIsRolling(true);
    setBannerAlert(null);
    sounds.playDiceRoll();

    // 800ms realistic roll duration
    setTimeout(() => {
      const rolledVal = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolledVal);
      setIsRolling(false);

      const currPos = activePlayer.position;
      const targetPos = currPos + rolledVal;

      // Rule: Must land exactly on 100 to win!
      if (targetPos > 100) {
        sounds.playPass();
        const needed = 100 - currPos;
        setEventLog(`${activePlayer.name} rolled ${rolledVal}. Needs exact roll of ${needed} to reach 100!`);
        setBannerAlert({
          type: 'pass',
          text: `Needs exact ${needed} to finish! Turn passed.`,
        });

        setTimeout(() => {
          setBannerAlert(null);
          nextTurn();
        }, 1300);
        return;
      }

      // Start tile-by-tile hopping animation
      setIsMoving(true);
      setAnimatingPlayerId(activePlayer.id);

      let stepNum = currPos;
      const hopInterval = setInterval(() => {
        stepNum += 1;
        sounds.playStep();
        setAnimatingSquare(stepNum);
        setAnimatingHop(true);

        setTimeout(() => {
          setAnimatingHop(false);
        }, 80);

        if (stepNum >= targetPos) {
          clearInterval(hopInterval);

          // Reached intermediate target square
          setTimeout(() => {
            // Check for Winning (100)
            if (targetPos === 100) {
              setPlayers((prev) =>
                prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, position: 100, hasWon: true } : p))
              );
              setAnimatingPlayerId(null);
              setAnimatingSquare(null);
              setIsMoving(false);
              setWinner(activePlayer);
              setEventLog(`🎉 ${activePlayer.name} reached 100 and won the game!`);
              sounds.playVictory();
              return;
            }

            // Check for Ladder Climb
            const ladder = LADDERS.find((l) => l.start === targetPos);
            if (ladder) {
              sounds.playLadderClimb();
              setBannerAlert({
                type: 'ladder',
                text: `🪜 Awesome! ${activePlayer.name} climbed ladder from ${ladder.start} to ${ladder.end}!`,
              });
              setEventLog(`🪜 ${activePlayer.name} climbed from ${ladder.start} to ${ladder.end}!`);

              // Animate climb
              setTimeout(() => {
                setAnimatingSquare(ladder.end);
                setPlayers((prev) =>
                  prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, position: ladder.end } : p))
                );

                setTimeout(() => {
                  setAnimatingPlayerId(null);
                  setAnimatingSquare(null);
                  setIsMoving(false);
                  finishTurn(rolledVal);
                }, 700);
              }, 400);
              return;
            }

            // Check for Snake Bite
            const snake = SNAKES.find((s) => s.start === targetPos);
            if (snake) {
              sounds.playSnakeBite();
              setBannerAlert({
                type: 'snake',
                text: `🐍 Watch out! ${activePlayer.name} bitten by Snake at ${snake.start}, slid down to ${snake.end}!`,
              });
              setEventLog(`🐍 ${activePlayer.name} bitten at ${snake.start}, slid to ${snake.end}!`);

              // Animate slide
              setTimeout(() => {
                setAnimatingSquare(snake.end);
                setPlayers((prev) =>
                  prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, position: snake.end } : p))
                );

                setTimeout(() => {
                  setAnimatingPlayerId(null);
                  setAnimatingSquare(null);
                  setIsMoving(false);
                  finishTurn(rolledVal);
                }, 700);
              }, 400);
              return;
            }

            // Normal square landing
            setPlayers((prev) =>
              prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, position: targetPos } : p))
            );
            setAnimatingPlayerId(null);
            setAnimatingSquare(null);
            setIsMoving(false);
            setEventLog(`${activePlayer.name} rolled a ${rolledVal} and moved to square ${targetPos}.`);
            finishTurn(rolledVal);
          }, 200);
        }
      }, 160);
    }, 800);
  }, [activePlayer, activePlayerIndex, isMoving, isRolling, nextTurn, winner]);

  // Handle bonus turn on rolling 6 or passing turn
  const finishTurn = (rolledVal: number) => {
    if (rolledVal === 6) {
      sounds.playBonusTurn();
      setHasBonusTurn(true);
      setBannerAlert({
        type: 'bonus',
        text: `🎲 Rolled a 6! ${activePlayer.name} gets a BONUS TURN!`,
      });
      setTimeout(() => {
        setBannerAlert(null);
      }, 1500);
    } else {
      setHasBonusTurn(false);
      nextTurn();
    }
  };

  // Automated AI turn trigger
  useEffect(() => {
    if (activePlayer.isAi && !isRolling && !isMoving && !winner) {
      const timer = setTimeout(() => {
        handleRollDice();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [activePlayer.isAi, activePlayerIndex, handleRollDice, isMoving, isRolling, winner]);

  const activeConfig = SNAKE_COLOR_CONFIG[activePlayer.color];

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-full bg-radial from-[#1e1b4b] via-[#0f172a] to-[#020617] text-white flex flex-col items-center justify-between p-1 sm:p-2.5 select-none overflow-hidden touch-manipulation">
      {/* ============================================================ */}
      {/* 1. TOP COMPACT HEADER */}
      {/* ============================================================ */}
      <header className="w-full max-w-xl flex items-center justify-between py-1 px-2.5 rounded-xl bg-black/45 border border-white/10 backdrop-blur-md shadow-md shrink-0">
        {/* Back to Home Button with Confirmation Permission */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setIsQuitModalOpen(true);
          }}
          className="py-1 px-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white font-black text-xs font-heading flex items-center gap-1 shadow-sm border border-white/20 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>HOME</span>
        </button>

        {/* Title Badge */}
        <div className="flex items-center gap-1.5 font-heading">
          <span className="text-sm sm:text-base">🐍</span>
          <h1 className="text-xs sm:text-sm font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            SAANP SEEDHI 3D
          </h1>
          <span className="text-sm sm:text-base">🪜</span>
        </div>

        {/* Right Controls: 3D View Toggle & Sound & Reset */}
        <div className="flex items-center gap-1">
          {/* 3D Tilt View Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIs3dView((prev) => !prev);
            }}
            className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              is3dView
                ? 'bg-amber-500/25 border-amber-400/60 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.25)]'
                : 'bg-black/40 border-white/15 text-slate-400 hover:text-white'
            }`}
            title="Toggle 3D Perspective Tilt"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{is3dView ? '3D' : '2D'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Audio"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
          </button>

          {/* Restart Match */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/15 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
            title="Restart Match"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. PLAYERS SINGLE-ROW SLEEK STATUS BAR */}
      {/* ============================================================ */}
      <div className="w-full max-w-xl flex items-center justify-center gap-1.5 px-1 py-1 shrink-0">
        {players.map((p, idx) => {
          const cfg = SNAKE_COLOR_CONFIG[p.color];
          const isActive = activePlayerIndex === idx;

          return (
            <div
              key={p.id}
              className={`relative py-1 px-2 rounded-xl border transition-all flex items-center gap-1.5 flex-1 max-w-[130px] ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-500/15 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.35)] scale-[1.02]'
                  : 'bg-black/35 border-white/10 opacity-70'
              }`}
            >
              {/* Player Avatar Pill */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] text-white bg-gradient-to-tr ${cfg.gradient} border border-white/80 shadow-sm shrink-0`}
              >
                {p.isAi ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </div>

              {/* Name and Square Number */}
              <div className="flex flex-col min-w-0 leading-none">
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] sm:text-[11px] font-black truncate text-white">{p.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-300 font-heading mt-0.5">
                  Sq: {p.position}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Event Notification Pill (Floating Overlay, Zero layout shift) */}
      {bannerAlert && (
        <div
          className={`absolute top-12 sm:top-14 z-40 py-1 px-3.5 rounded-full font-black text-[11px] font-heading shadow-xl animate-bounce pointer-events-none ${
            bannerAlert.type === 'snake'
              ? 'bg-red-600 text-white border border-red-300'
              : bannerAlert.type === 'ladder'
              ? 'bg-emerald-600 text-white border border-emerald-300'
              : bannerAlert.type === 'bonus'
              ? 'bg-amber-500 text-slate-950 border border-yellow-200'
              : 'bg-purple-600 text-white border border-purple-300'
          }`}
        >
          {bannerAlert.text}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. 3D SNAKES & LADDERS BOARD (Expanded to Fill Mobile Screen) */}
      {/* ============================================================ */}
      <main className="w-full flex-1 min-h-0 flex items-center justify-center relative overflow-hidden px-0.5">
        <SnakesBoard
          players={players}
          activePlayerIndex={activePlayerIndex}
          animatingPlayerId={animatingPlayerId}
          animatingSquare={animatingSquare}
          animatingHop={animatingHop}
          is3dView={is3dView}
        />
      </main>

      {/* ============================================================ */}
      {/* 4. BOTTOM DICE CONTROLLER & TURN PROMPT */}
      {/* ============================================================ */}
      <footer className="w-full max-w-md flex flex-col items-center py-1.5 px-3 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-md shadow-xl shrink-0 mt-0.5">
        {/* Turn description and inline event text */}
        <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-200 mb-1 px-1">
          <span className="truncate max-w-[200px] sm:max-w-xs">
            {winner
              ? `🏆 ${winner.name} Won!`
              : activePlayer.isAi
              ? `🤖 ${activePlayer.name} rolling...`
              : `🎯 Turn: ${activePlayer.name}`}
          </span>
          <span className="text-[10px] text-amber-300 font-heading shrink-0 truncate max-w-[140px] text-right">
            {eventLog}
          </span>
        </div>

        {/* Dice Slot & Roll Button */}
        <div className="flex items-center justify-center gap-3">
          <Dice
            value={diceValue}
            isRolling={isRolling}
            canRoll={canRoll}
            color={activePlayer.color}
            onRoll={handleRollDice}
            hasBonusTurn={hasBonusTurn}
            message={isRolling ? '...' : undefined}
          />

          {/* Roll Button for mobile / quick tapping */}
          {!winner && !activePlayer.isAi && (
            <button
              type="button"
              disabled={!canRoll}
              onClick={handleRollDice}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 active:scale-95 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm font-heading shadow-[0_3px_0_#78350f,0_6px_12px_rgba(0,0,0,0.4)] cursor-pointer border border-amber-200"
            >
              {isRolling ? 'ROLLING...' : isMoving ? 'MOVING...' : 'ROLL DICE'}
            </button>
          )}
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 5. VICTORY CELEBRATION MODAL */}
      {/* ============================================================ */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#78350f] via-[#451a03] to-[#1e1b4b] border-4 border-amber-400 p-5 shadow-2xl text-center text-white">
            {/* Sparkles & Trophy */}
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 p-1 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.8)] animate-bounce">
              <Trophy className="w-10 h-10 text-amber-950 drop-shadow-md" />
            </div>

            <h2 className="text-xl font-black font-heading text-amber-300 drop-shadow-lg mb-0.5">
              CHAMPION!
            </h2>
            <p className="text-base font-black font-heading text-white mb-1.5">
              🎉 {winner.name} Reached Square 100!
            </p>
            <p className="text-xs text-amber-200/80 mb-4">
              Congratulations on mastering Saanp Seedhi!
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs font-heading shadow-lg border border-emerald-300 cursor-pointer active:scale-95"
              >
                PLAY AGAIN
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onGoHome();
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs font-heading shadow-lg border border-amber-300 cursor-pointer active:scale-95"
              >
                BACK TO HOME
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Confirmation Modal for Leaving Game */}
      <QuitConfirmModal
        isOpen={isQuitModalOpen}
        gameName="Snake and Ladder"
        onConfirm={() => {
          setIsQuitModalOpen(false);
          onGoHome();
        }}
        onCancel={() => setIsQuitModalOpen(false)}
      />
    </div>
  );
};
