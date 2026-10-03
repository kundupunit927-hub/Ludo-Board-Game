import React, { useState } from 'react';
import { Bot, Mail, Plus, Settings, User, Users, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { GameMode } from '../types';
import { sounds } from '../utils/audio';
import {
  BoyAvatarBadge,
  FourPlayerPawnsStack,
  FriendsMiniBoardGraphic,
  GoldenNumber3D,
  HomeDockHouseIcon,
  LuckySpinWheelIcon,
  LudoCrownLogo,
  PlayOnlineGlobeGraphic,
  PurpleDiamondPattern,
  SettingDockIcon,
  SocialDockIcon,
  StoreDockIcon,
  TwoPlayerPawnsStack,
  SnakeLederDockIcon,
} from './home/HomeIcons';
import {
  LuckySpinModal,
  MailModal,
  PlayWithFriendsModal,
  ProfileModal,
  QuickModeModal,
  SocialModal,
  StoreModal,
} from './home/HomeModals';
import { SnakesSetupModal } from './snakes/SnakesSetupModal';

interface HomePageProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onStartModeWithAI?: (mode: GameMode, vsAI: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'warm-gold' | 'deep-blue';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenOnline?: () => void;
  onSelectMultiplayer?: () => void;
  onStartFriendsMatch?: (playerCount: 2 | 3 | 4, playerNames: string[]) => void;
  onStartSnakesGame?: (playerCount: 2 | 3 | 4, vsAi: boolean) => void;
  onResetGame?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectMode,
  onStartGame,
  onStartModeWithAI,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenOnline,
  onSelectMultiplayer,
  onStartFriendsMatch,
  onStartSnakesGame,
}) => {
  // Game Treasury & Status
  const [coins, setCoins] = useState<number>(10008);
  const [gems, setGems] = useState<number>(55597);
  const [activeDockTab, setActiveDockTab] = useState<'store' | 'social' | 'home' | 'snakes'>('home');

  // Modal dialog states
  const [isSpinOpen, setIsSpinOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPlayFriendsOpen, setIsPlayFriendsOpen] = useState(false);
  const [isSnakesSetupOpen, setIsSnakesSetupOpen] = useState(false);
  const [quickSetupMode, setQuickSetupMode] = useState<'2-player' | '4-player' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleStart2PlayerAI = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playDiceRoll();
    if (onStartModeWithAI) {
      onStartModeWithAI('2-player', true);
    } else {
      onSelectMode('2-player');
      onStartGame();
    }
  };

  const handleStart2PlayerHuman = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playDiceRoll();
    if (onStartModeWithAI) {
      onStartModeWithAI('2-player', false);
    } else {
      onSelectMode('2-player');
      onStartGame();
    }
  };

  const handleStart4PlayerAI = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playDiceRoll();
    if (onStartModeWithAI) {
      onStartModeWithAI('4-player', true);
    } else {
      onSelectMode('4-player');
      onStartGame();
    }
  };

  const handleStart4PlayerHuman = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playDiceRoll();
    if (onStartModeWithAI) {
      onStartModeWithAI('4-player', false);
    } else {
      onSelectMode('4-player');
      onStartGame();
    }
  };

  const handlePlayWithFriends = () => {
    sounds.playDiceRoll();
    setIsPlayFriendsOpen(true);
  };

  const handlePlayOnline = () => {
    sounds.playDiceRoll();
    if (onOpenOnline) {
      onOpenOnline();
    } else {
      showToast('Opening Online Multiplayer Room...');
    }
  };

  return (
    <div
      id="home-page-container"
      className="relative w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 select-none min-h-screen bg-gradient-to-b from-[#2e0854] via-[#1f053a] to-[#120224] overflow-x-hidden font-sans"
    >
      {/* Background Repeating Diamond Texture */}
      <PurpleDiamondPattern />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 py-2 px-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm font-heading shadow-2xl border-2 border-white animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* MAIN GAME APP FRAME (Centered Native Mobile Aspect Layout) */}
      <div
        id="home-mobile-frame"
        className="relative w-full max-w-[425px] sm:max-w-[445px] rounded-[36px] sm:rounded-[42px] bg-gradient-to-b from-[#4a1575] via-[#350d55] to-[#200636] border-[3px] border-[#9333ea]/50 shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-3 sm:p-4.5 flex flex-col justify-between min-h-[760px] sm:min-h-[800px] overflow-hidden"
      >
        {/* Subtle inner radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* ============================================================ */}
        {/* 1. TOP HEADER BAR: MAIL, COINS, BOY AVATAR, GEMS, SETTINGS */}
        {/* ============================================================ */}
        <div
          id="home-top-bar"
          className="relative z-10 w-full flex items-center justify-between gap-1 sm:gap-2 mb-2 pt-1"
        >
          {/* Left: Mail Icon with Badge (5) & Coins Counter */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mail Button with (5) notification */}
            <button
              id="home-mail-btn"
              type="button"
              onClick={() => setIsMailOpen(true)}
              className="relative p-2 rounded-2xl bg-gradient-to-b from-[#5b21b6] to-[#3b0764] border border-[#a855f7]/60 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Inbox & Gifts"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 border border-white text-[9px] font-black text-white flex items-center justify-center font-heading shadow-sm">
                5
              </span>
            </button>

            {/* Coins Counter Bar */}
            <div
              id="home-coins-bar"
              onClick={() => setIsStoreOpen(true)}
              className="h-8 sm:h-9 px-1.5 rounded-full bg-[#3b0764]/90 border border-[#a855f7]/60 flex items-center gap-1.5 shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
              title="Click to Open Store"
            >
              <div className="w-5 h-5 rounded-md bg-[#22c55e] border border-white/60 flex items-center justify-center text-white font-black text-xs shadow-xs">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-black text-white tracking-wide font-heading">
                {coins.toLocaleString()}
              </span>
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-amber-600 flex items-center justify-center shadow-sm">
                <span className="text-[10px] text-amber-900 font-black">★</span>
              </div>
            </div>
          </div>

          {/* Center: Boy Avatar Profile with Level 5 Badge */}
          <div
            id="home-avatar-slot"
            onClick={() => setIsProfileOpen(true)}
            className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="View Profile"
          >
            <BoyAvatarBadge level={5} />
          </div>

          {/* Right: Gems Counter & Settings Gear */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Gems Counter Bar */}
            <div
              id="home-gems-bar"
              onClick={() => setIsStoreOpen(true)}
              className="h-8 sm:h-9 px-1.5 rounded-full bg-[#3b0764]/90 border border-[#a855f7]/60 flex items-center gap-1.5 shadow-inner cursor-pointer hover:border-cyan-400 transition-colors"
              title="Click to Open Store"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-cyan-400 fill-cyan-400 filter drop-shadow">
                  <polygon points="12,2 22,8.5 12,22 2,8.5" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-black text-white tracking-wide font-heading">
                {gems.toLocaleString()}
              </span>
              <div className="w-5 h-5 rounded-md bg-[#22c55e] border border-white/60 flex items-center justify-center text-white font-black text-xs shadow-xs">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Purple Round Settings Gear Button */}
            <button
              id="home-settings-btn"
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-2xl bg-gradient-to-b from-[#5b21b6] to-[#3b0764] border border-[#a855f7]/60 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Game Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. CENTER SECTION: 3D LOGO (BALANCED & COMPACT) */}
        {/* ============================================================ */}
        <div
          id="home-hero-section"
          className="relative z-10 w-full flex flex-col items-center justify-center my-1 sm:my-1.5 px-2"
        >
          {/* Center 3D Extruded Crown Ludo Logo */}
          <div
            id="home-logo-container"
            className="flex flex-col items-center justify-center cursor-pointer hover:scale-103 transition-transform"
            onClick={handleStart4PlayerAI}
            title="Start Classic Game"
          >
            <LudoCrownLogo className="w-48 sm:w-56 h-28 sm:h-34" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. ROW 1: PRIMARY PLAY CARDS (TWO PLAYER & FOUR PLAYER) */}
        {/* ============================================================ */}
        <div id="home-primary-modes" className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 my-1 sm:my-1.5 px-1">
          {/* TWO PLAYER (Green Glossy 3D Card with explicit Human and AI options) */}
          <div
            id="home-btn-two-player"
            onClick={() => setQuickSetupMode('2-player')}
            className="group relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#84cc16] via-[#65a30d] to-[#4d7c0f] border-2 border-[#bef264] shadow-[0_6px_0_#365314,0_10px_16px_rgba(0,0,0,0.55)] active:translate-y-1 active:shadow-[0_2px_0_#365314] hover:brightness-105 transition-all cursor-pointer p-2 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-2xl pointer-events-none" />

            {/* Inside Content: Stacked Pawns + Giant 3D Golden "2" */}
            <div className="relative flex items-center justify-between px-1">
              <TwoPlayerPawnsStack />
              <div className="flex flex-col items-end">
                <GoldenNumber3D num="2" />
                <span className="text-[9px] font-black text-lime-100 uppercase tracking-wider font-heading">
                  PLAYERS
                </span>
              </div>
            </div>

            {/* Clear Player vs AI Indicators */}
            <div className="relative my-1 py-0.5 px-1.5 rounded-lg bg-black/35 border border-white/15 flex items-center justify-between text-[9.5px] font-bold text-white">
              <div className="flex items-center gap-1 text-emerald-300">
                <User className="w-3 h-3" />
                <span>Player</span>
              </div>
              <span className="text-white/60 font-black">VS</span>
              <div className="flex items-center gap-1 text-cyan-300">
                <Bot className="w-3 h-3" />
                <span>AI</span>
              </div>
            </div>

            {/* Action Buttons: Play vs AI or 2 Players Pass */}
            <div className="relative grid grid-cols-2 gap-1 pt-0.5">
              <button
                type="button"
                onClick={handleStart2PlayerAI}
                className="py-1 px-1 rounded-lg bg-gradient-to-b from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 active:scale-95 text-white font-black text-[9.5px] sm:text-[10px] font-heading shadow-md flex items-center justify-center gap-0.5 cursor-pointer border border-cyan-200/50"
                title="Play 1 Player vs 1 Computer AI"
              >
                <Bot className="w-3 h-3" />
                <span>VS AI</span>
              </button>
              <button
                type="button"
                onClick={handleStart2PlayerHuman}
                className="py-1 px-1 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-[9.5px] sm:text-[10px] font-heading shadow-md flex items-center justify-center gap-0.5 cursor-pointer border border-amber-200/50"
                title="Play 2 Human Players on this screen"
              >
                <Users className="w-3 h-3" />
                <span>2 PLAYERS</span>
              </button>
            </div>
          </div>

          {/* FOUR PLAYER (Red Glossy 3D Card with explicit Human and AI options) */}
          <div
            id="home-btn-four-player"
            onClick={() => setQuickSetupMode('4-player')}
            className="group relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#f87171] via-[#dc2626] to-[#b91c1c] border-2 border-[#fca5a5] shadow-[0_6px_0_#7f1d1d,0_10px_16px_rgba(0,0,0,0.55)] active:translate-y-1 active:shadow-[0_2px_0_#7f1d1d] hover:brightness-105 transition-all cursor-pointer p-2 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-2xl pointer-events-none" />

            {/* Inside Content: 4 Pawns + Giant 3D Golden "4" */}
            <div className="relative flex items-center justify-between px-1">
              <FourPlayerPawnsStack />
              <div className="flex flex-col items-end">
                <GoldenNumber3D num="4" />
                <span className="text-[9px] font-black text-rose-100 uppercase tracking-wider font-heading">
                  PLAYERS
                </span>
              </div>
            </div>

            {/* Clear Player vs AI Indicators */}
            <div className="relative my-1 py-0.5 px-1.5 rounded-lg bg-black/35 border border-white/15 flex items-center justify-between text-[9.5px] font-bold text-white">
              <div className="flex items-center gap-1 text-emerald-300">
                <User className="w-3 h-3" />
                <span>1 Player</span>
              </div>
              <span className="text-white/60 font-black">VS</span>
              <div className="flex items-center gap-1 text-cyan-300">
                <Bot className="w-3 h-3" />
                <span>3 AI</span>
              </div>
            </div>

            {/* Action Buttons: Play vs 3 AI or 4 Players Pass */}
            <div className="relative grid grid-cols-2 gap-1 pt-0.5">
              <button
                type="button"
                onClick={handleStart4PlayerAI}
                className="py-1 px-1 rounded-lg bg-gradient-to-b from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 active:scale-95 text-white font-black text-[9.5px] sm:text-[10px] font-heading shadow-md flex items-center justify-center gap-0.5 cursor-pointer border border-cyan-200/50"
                title="Play 1 Player vs 3 Computer AI"
              >
                <Bot className="w-3 h-3" />
                <span>VS 3 AI</span>
              </button>
              <button
                type="button"
                onClick={handleStart4PlayerHuman}
                className="py-1 px-1 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-[9.5px] sm:text-[10px] font-heading shadow-md flex items-center justify-center gap-0.5 cursor-pointer border border-amber-200/50"
                title="Play 4 Human Players on this screen"
              >
                <Users className="w-3 h-3" />
                <span>4 PLAYERS</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. ROW 2: SECONDARY MODE TILES (2 BALANCED CARDS) */}
        {/* ============================================================ */}
        <div id="home-secondary-modes" className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 my-1 sm:my-1.5 px-1">
          {/* Card 1: PLAY WITH FRIENDS (Coral/Orange Tile) */}
          <button
            id="home-btn-play-friends"
            type="button"
            onClick={handlePlayWithFriends}
            className="group relative h-20 sm:h-22 rounded-2xl bg-gradient-to-b from-[#fb923c] to-[#ea580c] border-2 border-[#fed7aa] shadow-[0_5px_0_#9a3412,0_8px_14px_rgba(0,0,0,0.45)] active:translate-y-1 active:shadow-[0_2px_0_#9a3412] hover:brightness-105 transition-all cursor-pointer p-1.5 flex flex-col items-center justify-between overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-2xl pointer-events-none" />
            <FriendsMiniBoardGraphic />
            <span className="text-[10px] sm:text-[11px] font-black text-white uppercase text-center leading-tight font-heading drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              PLAY WITH FRIENDS
            </span>
          </button>

          {/* Card 2: PLAY ONLINE (Yellow/Gold Tile) */}
          <button
            id="home-btn-play-online"
            type="button"
            onClick={handlePlayOnline}
            className="group relative h-20 sm:h-22 rounded-2xl bg-gradient-to-b from-[#facc15] to-[#ca8a04] border-2 border-[#fef08a] shadow-[0_5px_0_#854d0e,0_8px_14px_rgba(0,0,0,0.45)] active:translate-y-1 active:shadow-[0_2px_0_#854d0e] hover:brightness-105 transition-all cursor-pointer p-1.5 flex flex-col items-center justify-between overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-2xl pointer-events-none" />
            <PlayOnlineGlobeGraphic />
            <span className="text-[10px] sm:text-[11px] font-black text-white uppercase text-center leading-tight font-heading drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              PLAY ONLINE
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 5. AUDIO & LUCKY WHEEL QUICK BAR */}
        {/* ============================================================ */}
        <div id="home-lower-bar" className="relative z-10 w-full flex items-center justify-between px-3 my-1">
          {/* Audio Quick Mute/Unmute Pill */}
          <button
            type="button"
            onClick={onToggleSound}
            className="py-1 px-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          {/* Lucky Fortune Spin Wheel Button */}
          <button
            id="home-lucky-wheel-btn"
            type="button"
            onClick={() => setIsSpinOpen(true)}
            className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/30 border border-amber-400/50 text-amber-300 hover:text-white text-xs font-black font-heading hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Spin Lucky Wheel for Free Coins"
          >
            <LuckySpinWheelIcon size={24} />
            <span>Lucky Spin</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 6. BOTTOM NAVIGATION DOCK (STORE, SOCIAL, HOME, SETTING) */}
        {/* ============================================================ */}
        <div
          id="home-bottom-dock"
          className="relative z-10 w-full rounded-2xl bg-gradient-to-b from-[#3b0764] to-[#1e1b4b] border border-[#a855f7]/50 shadow-xl flex items-end justify-between px-2 py-1 mt-1"
        >
          {/* 1. STORE Tab */}
          <button
            id="dock-tab-store"
            type="button"
            onClick={() => {
              setActiveDockTab('store');
              setIsStoreOpen(true);
            }}
            className="flex-1 py-1 flex flex-col items-center justify-center gap-0.5 text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <StoreDockIcon />
            <span className="text-[10px] font-black uppercase tracking-wider font-heading">STORE</span>
          </button>

          {/* 2. SOCIAL Tab */}
          <button
            id="dock-tab-social"
            type="button"
            onClick={() => {
              setActiveDockTab('social');
              setIsSocialOpen(true);
            }}
            className="flex-1 py-1 flex flex-col items-center justify-center gap-0.5 text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <SocialDockIcon />
            <span className="text-[10px] font-black uppercase tracking-wider font-heading">SOCIAL</span>
          </button>

          {/* 3. HOME Tab (Elevated Center Active Card) */}
          <button
            id="dock-tab-home"
            type="button"
            onClick={() => {
              setActiveDockTab('home');
              showToast('Ludo Classic Home');
            }}
            className="relative -top-2 px-4 py-1.5 rounded-2xl bg-gradient-to-b from-[#7c3aed] to-[#581c87] border-2 border-amber-300 shadow-[0_4px_12px_rgba(251,191,36,0.35)] flex flex-col items-center justify-center gap-0.5 text-white transition-transform cursor-pointer"
          >
            <HomeDockHouseIcon />
            <span className="text-[10px] font-black uppercase tracking-wider font-heading text-amber-200">
              HOME
            </span>
          </button>

          {/* 4. SNAKE AND LEDER Tab (Requested by user) */}
          <button
            id="dock-tab-snakes-ladders"
            type="button"
            onClick={() => {
              setActiveDockTab('snakes');
              sounds.playClick();
              setIsSnakesSetupOpen(true);
            }}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              activeDockTab === 'snakes' ? 'text-amber-300' : 'text-purple-300 hover:text-white'
            }`}
            title="Snake and Leder"
          >
            <SnakeLederDockIcon />
            <span className="text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-tight font-heading text-center leading-none">
              SNAKE AND LEDER
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. ALL INTERACTIVE MODALS */}
      {/* ============================================================ */}
      {/* Lucky Spin Wheel Dialog */}
      <LuckySpinModal
        isOpen={isSpinOpen}
        onClose={() => setIsSpinOpen(false)}
        onReward={(wonCoins, wonGems) => {
          setCoins((c) => c + wonCoins);
          setGems((g) => g + wonGems);
        }}
      />

      {/* Inbox & Rewards Dialog */}
      <MailModal
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
        onClaim={(rewardCoins) => {
          setCoins((c) => c + rewardCoins);
          showToast(`Claimed +${rewardCoins} Coins!`);
        }}
      />

      {/* Store / Shop Dialog */}
      <StoreModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        onAddCoins={(addedCoins) => {
          setCoins((c) => c + addedCoins);
          showToast(`Added +${addedCoins} Coins!`);
        }}
        onAddGems={(addedGems) => {
          setGems((g) => g + addedGems);
          showToast(`Added +${addedGems} Gems!`);
        }}
      />

      {/* Social & Leaderboards Dialog */}
      <SocialModal
        isOpen={isSocialOpen}
        onClose={() => setIsSocialOpen(false)}
        onChallengeFriend={(friendName) => {
          showToast(`Challenging ${friendName} to a match!`);
          handleStart2PlayerHuman();
        }}
      />

      {/* Player Profile & Stats Dialog */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        coins={coins}
        gems={gems}
      />

      {/* Play With Friends (2, 3, 4 Players) Dialog */}
      <PlayWithFriendsModal
        isOpen={isPlayFriendsOpen}
        onClose={() => setIsPlayFriendsOpen(false)}
        onStartMatch={(count, names) => {
          if (onStartFriendsMatch) {
            onStartFriendsMatch(count, names);
          } else {
            handleStart4PlayerHuman();
          }
        }}
      />

      {/* Quick Mode Dialog (2-Player or 4-Player Detailed Selector with [X] Close) */}
      <QuickModeModal
        isOpen={quickSetupMode !== null}
        mode={quickSetupMode}
        onClose={() => setQuickSetupMode(null)}
        onSelectOption={(chosenMode, vsAI) => {
          if (onStartModeWithAI) {
            onStartModeWithAI(chosenMode, vsAI);
          } else {
            onSelectMode(chosenMode);
            onStartGame();
          }
        }}
      />

      {/* Saanp Seedhi / Snakes & Ladders 3D Setup Modal */}
      <SnakesSetupModal
        isOpen={isSnakesSetupOpen}
        onClose={() => setIsSnakesSetupOpen(false)}
        onStartGame={(cnt, vsAi) => {
          setIsSnakesSetupOpen(false);
          if (onStartSnakesGame) {
            onStartSnakesGame(cnt, vsAi);
          }
        }}
      />
    </div>
  );
};
