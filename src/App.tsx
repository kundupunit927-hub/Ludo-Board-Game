import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dice } from './components/Dice';
import { GameControls } from './components/GameControls';
import { HomePage } from './components/HomePage';
import { AnimatingTokenInfo, LudoBoard } from './components/LudoBoard';
import { HexLudoBoard } from './components/HexLudoBoard';
import { ModeModal } from './components/ModeModal';
import { OnlineModal } from './components/OnlineModal';
import { VictoryModal } from './components/VictoryModal';
import { QuitConfirmModal } from './components/QuitConfirmModal';
import { SnakesGame } from './components/snakes/SnakesGame';
import { GameLogEntry, GameMode, MoveOption, Player, PlayerColor, PlayerType } from './types';
import { sounds } from './utils/audio';
import ludoBgImage from './assets/images/ludo_game_bg_1789015856470.jpg';
import homeLudoBgImage from './assets/images/home_ludo_bg_1789017165898.jpg';
import {
  COLOR_DISPLAY_NAMES,
  COLOR_HEX,
  COLOR_START_TRACK_INDEX,
  getAllValidMoves,
  getCapturedTokens,
  getTokenPixelCoord,
  getValidMoveForToken,
  isTokenSafe,
  MAX_STEPS,
  MAX_STEPS_6P,
  selectBestAIMove,
  YARD_TOKEN_COORDS,
  YARD_TOKEN_COORDS_6P,
} from './utils/ludoLogic';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'game' | 'snakes'>('home');
  const [snakesConfig, setSnakesConfig] = useState<{ playerCount: 2 | 3 | 4; vsAi: boolean }>({
    playerCount: 2,
    vsAi: true,
  });
  const [mode, setMode] = useState<GameMode>('4-player');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<'warm-gold' | 'deep-blue'>('warm-gold');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isOnlineOpen, setIsOnlineOpen] = useState<boolean>(false);
  const [isQuitLudoConfirmOpen, setIsQuitLudoConfirmOpen] = useState<boolean>(false);

  // Players state - 4 players active by default
  const [players, setPlayers] = useState<Player[]>([
    {
      color: 'red',
      name: 'Red',
      type: 'human',
      tokens: [
        { id: 0, color: 'red', step: -1 },
        { id: 1, color: 'red', step: -1 },
        { id: 2, color: 'red', step: -1 },
        { id: 3, color: 'red', step: -1 },
      ],
      hasWon: false,
    },
    {
      color: 'green',
      name: 'Green',
      type: 'computer',
      tokens: [
        { id: 0, color: 'green', step: -1 },
        { id: 1, color: 'green', step: -1 },
        { id: 2, color: 'green', step: -1 },
        { id: 3, color: 'green', step: -1 },
      ],
      hasWon: false,
    },
    {
      color: 'yellow',
      name: 'Yellow',
      type: 'computer',
      tokens: [
        { id: 0, color: 'yellow', step: -1 },
        { id: 1, color: 'yellow', step: -1 },
        { id: 2, color: 'yellow', step: -1 },
        { id: 3, color: 'yellow', step: -1 },
      ],
      hasWon: false,
    },
    {
      color: 'blue',
      name: 'Blue',
      type: 'computer',
      tokens: [
        { id: 0, color: 'blue', step: -1 },
        { id: 1, color: 'blue', step: -1 },
        { id: 2, color: 'blue', step: -1 },
        { id: 3, color: 'blue', step: -1 },
      ],
      hasWon: false,
    },
  ]);

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [canRoll, setCanRoll] = useState<boolean>(true);
  const [validMoves, setValidMoves] = useState<MoveOption[]>([]);
  const [hasBonusTurn, setHasBonusTurn] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | null>(null);

  // Animation state with 3D hop arc, squash & stretch, and separated shadow
  const [animatingToken, setAnimatingToken] = useState<AnimatingTokenInfo | null>(null);

  // Game log state
  const [logs, setLogs] = useState<GameLogEntry[]>([
    {
      id: 'init',
      timestamp: '00:00',
      color: 'red',
      message: 'Game started! Red rolls first.',
      type: 'info',
    },
  ]);

  // Turn management ref to prevent race conditions during async animations
  const turnInProgressRef = useRef(false);

  const activePlayer = players[activePlayerIndex] || players[0];

  const addLog = useCallback(
    (color: PlayerColor, message: string, type: GameLogEntry['type'] = 'info') => {
      const now = new Date();
      const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
      const entry: GameLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        color,
        message,
        type,
      };
      setLogs((prev) => [entry, ...prev.slice(0, 19)]);
    },
    []
  );

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  /**
   * Initializes or restarts game with specified configuration
   */
  const startNewGame = useCallback(
    (config: {
      mode: GameMode;
      playerTypes: Record<PlayerColor, PlayerType>;
      customNames?: string[];
    }) => {
      let activeColors: PlayerColor[];
      if (config.mode === '2-player') {
        activeColors = ['red', 'yellow'];
      } else if (config.mode === '3-player') {
        activeColors = ['red', 'green', 'yellow'];
      } else if (config.mode === '5-player') {
        activeColors = ['red', 'green', 'yellow', 'blue', 'orange'];
      } else if (config.mode === '6-player') {
        activeColors = ['red', 'green', 'yellow', 'blue', 'orange', 'purple'];
      } else {
        activeColors = ['red', 'green', 'yellow', 'blue'];
      }

      const newPlayers: Player[] = activeColors.map((col, idx) => {
        let displayName = COLOR_DISPLAY_NAMES[col];
        if (config.customNames && config.customNames[idx]) {
          displayName = config.customNames[idx];
        }
        return {
          color: col,
          name: displayName,
          type: config.playerTypes[col] || (col === 'red' ? 'human' : 'human'),
          tokens: [
            { id: 0, color: col, step: -1 },
            { id: 1, color: col, step: -1 },
            { id: 2, color: col, step: -1 },
            { id: 3, color: col, step: -1 },
          ],
          hasWon: false,
        };
      });

      setMode(config.mode);
      setPlayers(newPlayers);
      setActivePlayerIndex(0);
      setDiceValue(null);
      setIsRolling(false);
      setCanRoll(true);
      setValidMoves([]);
      setHasBonusTurn(false);
      setWinner(null);
      setAnimatingToken(null);
      turnInProgressRef.current = false;
      setIsSettingsOpen(false);

      addLog('red', `New ${config.mode} game started! Red's turn.`, 'info');
    },
    [addLog]
  );

  /**
   * Resets the current game with same player setup
   */
  const handleResetCurrentGame = () => {
    const types: Record<PlayerColor, PlayerType> = {
      red: 'human',
      green: 'computer',
      yellow: 'computer',
      blue: 'computer',
      orange: 'computer',
      purple: 'computer',
    };
    players.forEach((p) => {
      types[p.color] = p.type;
    });
    startNewGame({
      mode,
      playerTypes: types,
      customNames: players.map((p) => p.name),
    });
  };

  /**
   * Toggles a player between Human and Computer during gameplay
   */
  const handleTogglePlayerType = (color: PlayerColor) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.color === color
          ? { ...p, type: p.type === 'human' ? 'computer' : 'human' }
          : p
      )
    );
    addLog(
      color,
      `${COLOR_DISPLAY_NAMES[color]} switched to ${
        players.find((p) => p.color === color)?.type === 'human'
          ? 'Computer (AI)'
          : 'Human Player'
      }`,
      'info'
    );
  };

  /**
   * Advance turn to the next player
   */
  const advanceToNextPlayer = useCallback(() => {
    setDiceValue(null);
    setValidMoves([]);
    setHasBonusTurn(false);
    turnInProgressRef.current = false;

    setActivePlayerIndex((prevIdx) => {
      const nextIdx = (prevIdx + 1) % players.length;
      const nextPlayer = players[nextIdx];
      setCanRoll(true);
      addLog(nextPlayer.color, `${nextPlayer.name}'s turn. Roll the dice!`, 'info');
      return nextIdx;
    });
  }, [players, addLog]);

  /**
   * Executes token move with smooth step-by-step animation
   */
  const executeMove = useCallback(
    async (move: MoveOption) => {
      if (turnInProgressRef.current) return;
      turnInProgressRef.current = true;
      setCanRoll(false);
      setValidMoves([]);

      const player = activePlayer;
      const token = player.tokens.find((t) => t.id === move.tokenId);
      if (!token) {
        turnInProgressRef.current = false;
        return;
      }

      const is6P = players.length > 4 || mode === '5-player' || mode === '6-player';
      const maxSteps = is6P ? MAX_STEPS_6P : MAX_STEPS;

      // Moderate, realistic physical token movement animation with dynamic tilt, squash & stretch, and separated ground shadow
      if (move.isExit) {
        const yardCoord = is6P
          ? YARD_TOKEN_COORDS_6P[token.color][token.id]
          : YARD_TOKEN_COORDS[token.color][token.id];
        const startTargetCoord = getTokenPixelCoord(
          { ...token, step: 0 },
          is6P
        );

        const midX = (yardCoord.x + startTargetCoord.x) / 2;
        const midY = (yardCoord.y + startTargetCoord.y) / 2;
        const dx = startTargetCoord.x - yardCoord.x;
        const tilt = Math.sign(dx) * 14;

        // Phase 1: High parabolic leap out of yard (~110ms)
        setAnimatingToken({
          color: token.color,
          id: token.id,
          currentX: midX,
          currentY: midY,
          hopY: -44,
          scaleX: 0.88,
          scaleY: 1.24,
          shadowScale: 1.5,
          tiltAngle: tilt,
          hasLandingRipple: false,
        });
        await new Promise((r) => setTimeout(r, 110));

        // Phase 2: Touchdown on start square with impact squash & ripple (~95ms)
        setAnimatingToken({
          color: token.color,
          id: token.id,
          currentX: startTargetCoord.x,
          currentY: startTargetCoord.y,
          hopY: 0,
          scaleX: 1.18,
          scaleY: 0.86,
          shadowScale: 1.0,
          tiltAngle: 0,
          hasLandingRipple: true,
        });
        sounds.playExitBase();
        await new Promise((r) => setTimeout(r, 95));

        // Phase 3: Settle (~25ms)
        setAnimatingToken({
          color: token.color,
          id: token.id,
          currentX: startTargetCoord.x,
          currentY: startTargetCoord.y,
          hopY: 0,
          scaleX: 1.0,
          scaleY: 1.0,
          shadowScale: 1.0,
          tiltAngle: 0,
          hasLandingRipple: false,
        });
        await new Promise((r) => setTimeout(r, 25));
      } else {
        // Fluid, step-by-step movement along board path cells (195ms per cell, perfectly in 150-250ms range):
        // Token lifts slightly, stretches along jump vector, dynamic tilt, squashes on landing with ripple
        for (let s = move.fromStep + 1; s <= move.toStep; s++) {
          const startCoord = getTokenPixelCoord(
            { ...token, step: s - 1 },
            is6P
          );
          const targetCoord = getTokenPixelCoord(
            { ...token, step: s },
            is6P
          );

          const midX = (startCoord.x + targetCoord.x) / 2;
          const midY = (startCoord.y + targetCoord.y) / 2;
          const dx = targetCoord.x - startCoord.x;
          const dy = targetCoord.y - startCoord.y;
          // Dynamic realistic tilt in the movement trajectory
          const tilt = Math.abs(dx) > 10 ? (dx > 0 ? 12 : -12) : (dy > 0 ? 5 : -5);

          // Phase 1: Airborne Apex (~95ms) - arc lift, scale up & stretch, expanded shadow, forward tilt
          setAnimatingToken({
            color: token.color,
            id: token.id,
            currentX: midX,
            currentY: midY,
            hopY: -30,
            scaleX: 0.9,
            scaleY: 1.2,
            shadowScale: 1.4,
            tiltAngle: tilt,
            hasLandingRipple: false,
          });
          await new Promise((r) => setTimeout(r, 95));

          // Phase 2: Impact Landing (~85ms) - firm board contact, scale-down squash, shockwave ripple, step tap sound
          setAnimatingToken({
            color: token.color,
            id: token.id,
            currentX: targetCoord.x,
            currentY: targetCoord.y,
            hopY: 0,
            scaleX: 1.18,
            scaleY: 0.86,
            shadowScale: 1.0,
            tiltAngle: 0,
            hasLandingRipple: true,
          });
          sounds.playStep();
          await new Promise((r) => setTimeout(r, 85));

          // Phase 3: Short rebound to neutral scale before next cell (~20ms)
          setAnimatingToken({
            color: token.color,
            id: token.id,
            currentX: targetCoord.x,
            currentY: targetCoord.y,
            hopY: 0,
            scaleX: 1.0,
            scaleY: 1.0,
            shadowScale: 1.0,
            tiltAngle: 0,
            hasLandingRipple: false,
          });
          await new Promise((r) => setTimeout(r, 20));
        }

        // Home arrival celebratory double bounce + sparkle
        if (move.toStep >= maxSteps) {
          sounds.playHomeArrival();
          const finalCoord = getTokenPixelCoord({ ...token, step: move.toStep }, is6P);

          // Bounce 1: Big joyous leap
          setAnimatingToken({
            color: token.color,
            id: token.id,
            currentX: finalCoord.x,
            currentY: finalCoord.y,
            hopY: -28,
            scaleX: 0.88,
            scaleY: 1.24,
            shadowScale: 1.35,
            tiltAngle: 0,
            hasLandingRipple: false,
          });
          await new Promise((r) => setTimeout(r, 110));

          setAnimatingToken({
            color: token.color,
            id: token.id,
            currentX: finalCoord.x,
            currentY: finalCoord.y,
            hopY: 0,
            scaleX: 1.16,
            scaleY: 0.86,
            shadowScale: 1.0,
            tiltAngle: 0,
            hasLandingRipple: true,
          });
          await new Promise((r) => setTimeout(r, 85));

          // Bounce 2: Victory settle hop
          setAnimatingToken({
            color: token.color,
            id: token.id,
            currentX: finalCoord.x,
            currentY: finalCoord.y,
            hopY: -16,
            scaleX: 0.94,
            scaleY: 1.12,
            shadowScale: 1.2,
            tiltAngle: 0,
            hasLandingRipple: false,
          });
          await new Promise((r) => setTimeout(r, 80));

          setAnimatingToken({
            color: token.color,
            id: token.id,
            currentX: finalCoord.x,
            currentY: finalCoord.y,
            hopY: 0,
            scaleX: 1.08,
            scaleY: 0.92,
            shadowScale: 1.0,
            tiltAngle: 0,
            hasLandingRipple: true,
          });
          await new Promise((r) => setTimeout(r, 75));
        }
      }

      setAnimatingToken(null);

      // Check captured tokens at landing square
      const captured = getCapturedTokens(player.color, move.toStep, players, is6P);

      // Animate captured opponent piece knockout / smooth flight & shrinking back to yard base
      if (captured.length > 0) {
        const victim = captured[0];
        const victimYard = is6P
          ? YARD_TOKEN_COORDS_6P[victim.color][victim.tokenId]
          : YARD_TOKEN_COORDS[victim.color][victim.tokenId];
        const landingCoord = getTokenPixelCoord({ ...token, step: move.toStep }, is6P);
        sounds.playCapture();

        // 6 smooth flight interpolation frames over ~420ms with easing
        const totalFrames = 6;
        for (let f = 1; f <= totalFrames; f++) {
          const t = f / totalFrames;
          const easeT = Math.sin((t * Math.PI) / 2); // Ease-out curve
          const arc = Math.sin(t * Math.PI); // Parabolic vertical arc

          setAnimatingToken({
            color: victim.color,
            id: victim.tokenId,
            currentX: landingCoord.x + (victimYard.x - landingCoord.x) * easeT,
            currentY: landingCoord.y + (victimYard.y - landingCoord.y) * easeT,
            hopY: -arc * 45,
            scaleX: Math.max(0.65, 1 - t * 0.35),
            scaleY: Math.max(0.65, 1 - t * 0.35),
            shadowScale: 1 + arc * 0.45,
            tiltAngle: t * 360,
            hasLandingRipple: f === totalFrames,
          });
          await new Promise((r) => setTimeout(r, 70));
        }
        setAnimatingToken(null);
      }

      // Apply state update
      let grantBonus = false;

      setPlayers((prevPlayers) => {
        return prevPlayers.map((p) => {
          if (p.color === player.color) {
            const updatedTokens = p.tokens.map((t) =>
              t.id === move.tokenId ? { ...t, step: move.toStep } : t
            );
            const hasWon = updatedTokens.every((t) => t.step >= maxSteps);
            return {
              ...p,
              tokens: updatedTokens,
              hasWon,
            };
          }

          // Check if any tokens of other players were captured
          const hasVictim = captured.some((c) => c.color === p.color);
          if (hasVictim) {
            const victimIds = captured
              .filter((c) => c.color === p.color)
              .map((c) => c.tokenId);
            return {
              ...p,
              tokens: p.tokens.map((t) =>
                victimIds.includes(t.id) ? { ...t, step: -1 } : t
              ),
            };
          }

          return p;
        });
      });

      // Sound & Log feedback
      if (move.isExit) {
        addLog(player.color, `${player.name} moved a token out of the yard!`, 'move');
      } else if (move.toStep >= maxSteps) {
        sounds.playHomeArrival();
        addLog(player.color, `🎯 ${player.name}'s token reached HOME!`, 'home');
      }

      if (captured.length > 0) {
        sounds.playCapture();
        grantBonus = true;
        const capturedNames = captured
          .map((c) => COLOR_DISPLAY_NAMES[c.color])
          .join(', ');
        addLog(
          player.color,
          `💥 ${player.name} captured ${capturedNames}'s token!`,
          'capture'
        );
      } else if (isTokenSafe(player.color, move.toStep, is6P)) {
        sounds.playSafeLanding();
      }

      // Check victory
      const allHome = player.tokens.every((t) =>
        t.id === move.tokenId ? move.toStep >= maxSteps : t.step >= maxSteps
      );

      if (allHome) {
        sounds.playVictory();
        setWinner(player);
        addLog(player.color, `👑 ${player.name} has WON the game!`, 'win');
        turnInProgressRef.current = false;
        return;
      }

      // Extra turn rule:
      // Rolling a 6 gives an extra turn; capturing an opponent also gives an extra turn!
      if (diceValue === 6 || grantBonus) {
        setHasBonusTurn(true);
        setCanRoll(true);
        turnInProgressRef.current = false;
        addLog(
          player.color,
          `⭐ ${player.name} earned an extra turn! Roll again.`,
          'info'
        );
      } else {
        // Normal turn completion
        await new Promise((r) => setTimeout(r, 400));
        advanceToNextPlayer();
      }
    },
    [activePlayer, players, diceValue, addLog, advanceToNextPlayer]
  );

  /**
   * Handle dice roll trigger (by user click or AI loop)
   */
  const rollDice = useCallback(() => {
    if (!canRoll || isRolling || winner || turnInProgressRef.current) return;

    setIsRolling(true);
    setCanRoll(false);
    sounds.playDiceRoll();

    // Ludo King authentic roll duration (780ms)
    setTimeout(() => {
      // Final true random roll
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalRoll);
      setIsRolling(false);

      const currentActive = players[activePlayerIndex];
      addLog(
        currentActive.color,
        `${currentActive.name} rolled a ${finalRoll}!`,
        'roll'
      );

      // If rolled 6, play bonus turn chime
      if (finalRoll === 6) {
        sounds.playBonusTurn();
      }

      // Calculate valid moves
      const moves = getAllValidMoves(currentActive, finalRoll, players);
      setValidMoves(moves);

      if (moves.length === 0) {
        // No moves available
        sounds.playPass();
        addLog(
          currentActive.color,
          `No valid moves with roll ${finalRoll}. Passing turn...`,
          'info'
        );
        setTimeout(() => {
          advanceToNextPlayer();
        }, 1100);
      }
    }, 780);
  }, [
    canRoll,
    isRolling,
    winner,
    players,
    activePlayerIndex,
    addLog,
    advanceToNextPlayer,
  ]);

  /**
   * Handle token click by Human player
   */
  const handleTokenClick = (tokenId: number) => {
    if (activePlayer.type !== 'human') return;
    if (canRoll || isRolling || turnInProgressRef.current) return;

    const chosenMove = validMoves.find((m) => m.tokenId === tokenId);
    if (chosenMove) {
      executeMove(chosenMove);
    }
  };

  /**
   * AI Turn Automation: automatically rolls and selects moves for computer players
   */
  useEffect(() => {
    if (currentView === 'home' || winner || turnInProgressRef.current) return;

    if (activePlayer.type === 'computer') {
      // Step 1: Roll if can roll
      if (canRoll && !isRolling) {
        const timer = setTimeout(() => {
          rollDice();
        }, 700);
        return () => clearTimeout(timer);
      }

      // Step 2: Choose best move if moves exist
      if (!canRoll && !isRolling && validMoves.length > 0) {
        const timer = setTimeout(() => {
          if (diceValue !== null) {
            const bestMove = selectBestAIMove(activePlayer, diceValue, players);
            if (bestMove) {
              executeMove(bestMove);
            }
          }
        }, 750);
        return () => clearTimeout(timer);
      }
    }
  }, [
    currentView,
    activePlayer,
    canRoll,
    isRolling,
    validMoves,
    diceValue,
    winner,
    players,
    rollDice,
    executeMove,
  ]);

  // Valid token IDs for board highlights
  const validTokenIds = validMoves.map((m) => m.tokenId);

  return (
    <div
      className={`relative min-h-screen ${
        currentView === 'home'
          ? 'p-2 sm:p-4 overflow-y-auto'
          : 'p-1 sm:p-3 overflow-hidden'
      } text-slate-100 flex flex-col items-center justify-between font-sans selection:bg-amber-500 selection:text-slate-900 w-full max-w-full overflow-x-hidden`}
    >
      {/* 
        CINEMATIC 3D LUDO ACTION BACKGROUND IMAGE
        Positioned fixed behind all game elements with clarity overlay:
        "is image ko game ke background me lagao lakin game clear dikhna chahiye"
      */}
      {/* 
        CINEMATIC 3D BACKGROUND IMAGE:
        Home Page: Vibrant purple floating 3D dice and pawns artwork
        Game Page: 3D energetic stadium background
        Protected with clarity overlay for pristine readability
      */}
      <div
        id="app-cinematic-bg-container"
        className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none"
        aria-hidden="true"
      >
        <img
          src={currentView === 'home' ? homeLudoBgImage : ludoBgImage}
          alt={
            currentView === 'home'
              ? 'Ludo Magical 3D Dice and Pawns Background'
              : 'Ludo Action Stadium Background'
          }
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transform transition-all duration-700 ${
            currentView === 'home'
              ? 'brightness-100 saturate-[1.1] scale-100'
              : 'brightness-[0.82] saturate-[1.2] scale-105'
          }`}
        />

        {/* 
          CLARITY OVERLAY:
          For Game: dark scrim for playing board
          For Home: very gentle gradient so the beautiful purple dice/pawns image shines at full glory
        */}
        {currentView === 'game' ? (
          <>
            <div className="absolute inset-0 bg-slate-950/72 backdrop-blur-[1.5px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(2,6,23,0.85)_85%)]" />
            <div
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                theme === 'warm-gold'
                  ? 'bg-amber-950/20 mix-blend-color'
                  : 'bg-indigo-950/25 mix-blend-color'
              }`}
            />
          </>
        ) : (
          <>
            {/* Very light gradient for home screen: keeps center artwork bright & clear */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50 pointer-events-none" />
          </>
        )}
      </div>
      {currentView === 'home' ? (
        <HomePage
          mode={mode}
          onSelectMode={(newMode) => {
            const types: Record<PlayerColor, PlayerType> = {
              red: 'human',
              green: 'computer',
              yellow: 'computer',
              blue: 'computer',
              orange: 'computer',
              purple: 'computer',
            };
            players.forEach((p) => {
              types[p.color] = p.type;
            });
            startNewGame({ mode: newMode, playerTypes: types });
          }}
          onStartGame={() => setCurrentView('game')}
          onStartModeWithAI={(chosenMode, vsAI) => {
            if (vsAI) {
              const aiTypes: Record<PlayerColor, PlayerType> = {
                red: 'human',
                green: 'computer',
                yellow: 'computer',
                blue: 'computer',
                orange: 'computer',
                purple: 'computer',
              };
              const names =
                chosenMode === '2-player'
                  ? ['You (Player)', 'AI (Yellow)']
                  : [
                      'You (Player)',
                      'AI 1 (Green)',
                      'AI 2 (Yellow)',
                      'AI 3 (Blue)',
                    ];
              startNewGame({ mode: chosenMode, playerTypes: aiTypes, customNames: names });
            } else {
              const multiTypes: Record<PlayerColor, PlayerType> = {
                red: 'human',
                green: 'human',
                yellow: 'human',
                blue: 'human',
                orange: 'human',
                purple: 'human',
              };
              const names =
                chosenMode === '2-player'
                  ? ['Player 1 (Red)', 'Player 2 (Yellow)']
                  : [
                      'Player 1 (Red)',
                      'Player 2 (Green)',
                      'Player 3 (Yellow)',
                      'Player 4 (Blue)',
                    ];
              startNewGame({ mode: chosenMode, playerTypes: multiTypes, customNames: names });
            }
            setCurrentView('game');
          }}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          theme={theme}
          onToggleTheme={() =>
            setTheme((prev) => (prev === 'warm-gold' ? 'deep-blue' : 'warm-gold'))
          }
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenOnline={() => setIsOnlineOpen(true)}
          onSelectMultiplayer={() => {
            // Configure Pass & Play multiplayer with all human players
            const multiTypes: Record<PlayerColor, PlayerType> = {
              red: 'human',
              green: 'human',
              yellow: 'human',
              blue: 'human',
              orange: 'human',
              purple: 'human',
            };
            startNewGame({ mode, playerTypes: multiTypes });
            setCurrentView('game');
          }}
          onStartFriendsMatch={(count, names) => {
            const multiTypes: Record<PlayerColor, PlayerType> = {
              red: 'human',
              green: 'human',
              yellow: 'human',
              blue: 'human',
              orange: 'human',
              purple: 'human',
            };
            const chosenMode = `${count}-player` as GameMode;
            startNewGame({ mode: chosenMode, playerTypes: multiTypes, customNames: names });
            setCurrentView('game');
          }}
          onStartSnakesGame={(playerCount, vsAi) => {
            setSnakesConfig({ playerCount, vsAi });
            setCurrentView('snakes');
          }}
          onResetGame={handleResetCurrentGame}
        />
      ) : currentView === 'snakes' ? (
        <SnakesGame
          playerCount={snakesConfig.playerCount}
          vsAi={snakesConfig.vsAi}
          onGoHome={() => setCurrentView('home')}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      ) : (
        <>
          {/* Game screen: only pure game with minimal back to home button */}
          <GameControls
            mode={mode}
            latestLog={logs[0]}
            onGoHome={() => {
              sounds.playClick();
              setIsQuitLudoConfirmOpen(true);
            }}
          />

          {/* Main Game Stage */}
          <main className="w-full flex-1 flex flex-col items-center justify-center my-1 sm:my-2">
            {mode === '5-player' || mode === '6-player' || players.length > 4 ? (
              <HexLudoBoard
                players={players}
                activePlayerColor={activePlayer.color}
                validTokenIds={validTokenIds}
                isRolling={isRolling}
                onTokenClick={handleTokenClick}
                animatingToken={animatingToken}
                onTogglePlayerType={handleTogglePlayerType}
                centerDiceSlot={
                  <Dice
                    value={diceValue}
                    isRolling={isRolling}
                    canRoll={canRoll && activePlayer.type === 'human'}
                    color={activePlayer.color}
                    onRoll={rollDice}
                    hasBonusTurn={hasBonusTurn}
                    message={
                      activePlayer.type === 'computer'
                        ? isRolling
                          ? 'AI is rolling...'
                          : validMoves.length > 0
                          ? 'AI is moving...'
                          : `${activePlayer.name} (AI)`
                        : validMoves.length > 0
                        ? 'Tap a piece to move'
                        : undefined
                    }
                  />
                }
              />
            ) : (
              <LudoBoard
                players={players}
                activePlayerColor={activePlayer.color}
                validTokenIds={validTokenIds}
                isRolling={isRolling}
                onTokenClick={handleTokenClick}
                animatingToken={animatingToken}
                onTogglePlayerType={handleTogglePlayerType}
                centerDiceSlot={
                  <Dice
                    value={diceValue}
                    isRolling={isRolling}
                    canRoll={canRoll && activePlayer.type === 'human'}
                    color={activePlayer.color}
                    onRoll={rollDice}
                    hasBonusTurn={hasBonusTurn}
                    message={
                      activePlayer.type === 'computer'
                        ? isRolling
                          ? 'AI is rolling...'
                          : validMoves.length > 0
                          ? 'AI is moving...'
                          : `${activePlayer.name} (AI)`
                        : validMoves.length > 0
                        ? 'Tap a piece to move'
                        : undefined
                    }
                  />
                }
              />
            )}
          </main>
        </>
      )}

      {/* Modals */}
      <ModeModal
        isOpen={isSettingsOpen}
        currentMode={mode}
        onClose={() => setIsSettingsOpen(false)}
        onStartGame={startNewGame}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenOnline={() => {
          setIsSettingsOpen(false);
          setIsOnlineOpen(true);
        }}
      />

      <OnlineModal
        isOpen={isOnlineOpen}
        onClose={() => setIsOnlineOpen(false)}
        onStartOnlineGame={(roomCode, chosenMode, hostName) => {
          // Setup online player room
          const onlinePlayerTypes: Record<PlayerColor, PlayerType> = {
            red: 'human',
            green: 'human',
            yellow: 'human',
            blue: 'human',
            orange: 'human',
            purple: 'human',
          };
          startNewGame({ mode: chosenMode, playerTypes: onlinePlayerTypes });
          addLog('red', `Online Room #${roomCode} connected! Host: ${hostName}.`, 'info');
          setCurrentView('game');
        }}
      />

      {winner && (
        <VictoryModal
          winner={winner}
          onRestart={handleResetCurrentGame}
          onChangeMode={() => {
            setWinner(null);
            setIsSettingsOpen(true);
          }}
        />
      )}

      {/* Permission Confirmation Modal for Leaving Ludo Match */}
      <QuitConfirmModal
        isOpen={isQuitLudoConfirmOpen}
        gameName="Ludo"
        onConfirm={() => {
          setIsQuitLudoConfirmOpen(false);
          setCurrentView('home');
        }}
        onCancel={() => setIsQuitLudoConfirmOpen(false)}
      />
    </div>
  );
}
