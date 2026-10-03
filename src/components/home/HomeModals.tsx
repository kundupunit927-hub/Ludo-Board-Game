import React, { useEffect, useState } from 'react';
import { Award, Bell, Bot, Check, Clock, Gift, HelpCircle, Sparkles, Trophy, User, Users, X, Zap } from 'lucide-react';
import { PlayerColor } from '../../types';
import { sounds } from '../../utils/audio';

/**
 * Utility helper to get today's date string in YYYY-MM-DD format
 */
const getTodayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Reusable hook to close modal on Escape key press
 */
export const useEscapeKey = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
};

/**
 * High-visibility, responsive close button for modals with 40px touch zone and audio feedback
 */
export const ModalCloseButton: React.FC<{
  onClose: () => void;
  className?: string;
}> = ({ onClose, className = '' }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      sounds.playClick();
      onClose();
    }}
    className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer z-30 border border-white/20 shadow-md ${className}`}
    aria-label="Close dialog"
    title="Close (Esc)"
  >
    <X className="w-5 h-5 drop-shadow-sm" />
  </button>
);

// =========================================================================
// 1. LUCKY FORTUNE SPIN WHEEL DIALOG WITH VISIBLE NUMBERS & DAILY LIMIT
// =========================================================================
export const LuckySpinModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onReward: (coins: number, gems: number) => void;
}> = ({ isOpen, onClose, onReward }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [alreadyClaimedToday, setAlreadyClaimedToday] = useState(false);

  const todayStr = getTodayStr();
  useEscapeKey(isOpen, onClose);

  // Check daily limit on mount / open
  useEffect(() => {
    if (isOpen) {
      const lastSpin = localStorage.getItem('ludo_daily_spin_date');
      setAlreadyClaimedToday(lastSpin === todayStr);
      setWonPrize(null);
    }
  }, [isOpen, todayStr]);

  if (!isOpen) return null;

  // 8 Colorful Wedges with Coins in every single box & wedge
  const prizes = [
    { num: '500', coins: 500, gems: 0, color: '#e11d48', label: '500 Coins' },
    { num: '800', coins: 800, gems: 20, color: '#0284c7', label: '800 Coins + 20 Gems' },
    { num: '1000', coins: 1000, gems: 0, color: '#ea580c', label: '1000 Coins' },
    { num: '1500', coins: 1500, gems: 50, color: '#16a34a', label: '1500 Coins + 50 Gems' },
    { num: '2500', coins: 2500, gems: 0, color: '#9333ea', label: '2500 Coins' },
    { num: '10K', coins: 10000, gems: 100, color: '#eab308', label: 'JACKPOT 10,000 Coins' },
    { num: '3500', coins: 3500, gems: 50, color: '#0d9488', label: '3500 Coins + 50 Gems' },
    { num: '5000', coins: 5000, gems: 0, color: '#2563eb', label: '5000 Coins' },
  ];

  const handleSpin = () => {
    if (isSpinning || alreadyClaimedToday) return;
    setIsSpinning(true);
    setWonPrize(null);
    sounds.playDiceRoll();

    const selectedIndex = Math.floor(Math.random() * prizes.length);
    const step = 360 / prizes.length;
    const extraSpins = 360 * 6;
    
    // Wedge selectedIndex is at (selectedIndex * step) from top (12 o'clock).
    // Rotating clockwise by (360 - selectedIndex * step) brings it directly under the needle.
    setRotation((prev) => {
      const currentMod = prev % 360;
      const targetAngle = extraSpins + (360 - selectedIndex * step);
      return prev + targetAngle - currentMod;
    });

    setTimeout(() => {
      setIsSpinning(false);
      const prize = prizes[selectedIndex];
      setWonPrize(prize.label);
      setAlreadyClaimedToday(true);
      localStorage.setItem('ludo_daily_spin_date', todayStr);
      sounds.playCapture();
      onReward(prize.coins, prize.gems);
    }, 3800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs sm:max-w-sm rounded-3xl bg-gradient-to-b from-[#3b0764] to-[#1e1b4b] border-2 border-amber-400 p-4 sm:p-5 shadow-2xl text-white text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} />

        <h3 className="text-xl font-black font-heading text-amber-300 drop-shadow-md mb-1">
          LUCKY SPIN WHEEL
        </h3>

        {/* Daily limit badge */}
        <div className="inline-flex items-center gap-1 py-0.5 px-3 rounded-full bg-black/40 border border-amber-400/40 text-[11px] font-bold text-amber-200 mb-2.5 font-heading">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Daily Limit: 1 Free Spin Per Day</span>
        </div>

        {/* Wheel container with pointer */}
        <div className="relative w-56 h-56 sm:w-60 sm:h-60 mx-auto mb-2 flex items-center justify-center">
          {/* Top Golden Needle Pointer */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-amber-400" />
          </div>

          {/* Rotating Wheel with Clear Numbers & Coins on Every Wedge */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] overflow-hidden bg-slate-900"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3.8s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer Golden Rim Studs */}
              <circle cx="50" cy="50" r="49" fill="none" stroke="#ca8a04" strokeWidth="2" />

              {/* Wedges with accurate top-referenced angle geometry */}
              {prizes.map((p, i) => {
                const step = 360 / prizes.length;
                const r = 49;
                const degToRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
                const startAngle = degToRad(i * step - step / 2);
                const endAngle = degToRad(i * step + step / 2);
                const midAngle = i * step;

                const x1 = 50 + r * Math.cos(startAngle);
                const y1 = 50 + r * Math.sin(startAngle);
                const x2 = 50 + r * Math.cos(endAngle);
                const y2 = 50 + r * Math.sin(endAngle);

                return (
                  <g key={i}>
                    {/* Wedge slice */}
                    <path
                      d={`M50,50 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                      fill={p.color}
                      stroke="#ffffff"
                      strokeWidth="0.75"
                    />

                    {/* Prize Number, Coin Label & Coin Icon centered in each wedge */}
                    <g transform={`rotate(${midAngle} 50 50)`}>
                      {/* Bold High-Contrast Coin Number */}
                      <text
                        x="50"
                        y="14"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="5.8"
                        fontWeight="900"
                        fontFamily="'Fredoka', 'Poppins', sans-serif"
                        stroke="#000000"
                        strokeWidth="0.8"
                        paintOrder="stroke fill"
                      >
                        {p.num}
                      </text>
                      {/* Sub-label COINS */}
                      <text
                        x="50"
                        y="19.5"
                        textAnchor="middle"
                        fill="#fef08a"
                        fontSize="3"
                        fontWeight="800"
                        fontFamily="'Poppins', sans-serif"
                        stroke="#713f12"
                        strokeWidth="0.4"
                        paintOrder="stroke fill"
                      >
                        COINS
                      </text>
                      {/* Gold Coin Icon */}
                      <circle cx="50" cy="24" r="2.2" fill="#facc15" stroke="#78350f" strokeWidth="0.4" />
                      <text
                        x="50"
                        y="24.8"
                        textAnchor="middle"
                        fill="#78350f"
                        fontSize="1.8"
                        fontWeight="900"
                      >
                        ★
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Center Golden Dome Base */}
              <circle cx="50" cy="50" r="14" fill="#facc15" stroke="#78350f" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="11" fill="#eab308" />
            </svg>
          </div>

          {/* Center Golden Button */}
          <button
            type="button"
            disabled={isSpinning || alreadyClaimedToday}
            onClick={handleSpin}
            className="absolute z-20 w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 text-slate-950 font-black text-xs font-heading shadow-xl border-2 border-white hover:scale-105 active:scale-95 disabled:opacity-85 cursor-pointer flex items-center justify-center"
          >
            {isSpinning ? '...' : alreadyClaimedToday ? 'DONE' : 'SPIN'}
          </button>
        </div>

        {/* 8 Prize Boxes Grid - All boxes clearly showing coins */}
        <div className="mb-3 grid grid-cols-4 gap-1.5 text-center">
          {prizes.map((p, idx) => (
            <div
              key={idx}
              className="py-1 px-0.5 rounded-xl bg-black/40 border border-amber-400/30 flex flex-col items-center justify-center shadow-xs"
            >
              <div className="flex items-center gap-0.5 text-amber-300 font-black text-[10px] sm:text-[11px] font-heading">
                <span>🪙</span>
                <span>{p.num}</span>
              </div>
              <span className="text-[8.5px] text-slate-300 font-bold">Coins</span>
            </div>
          ))}
        </div>

        {wonPrize ? (
          <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 font-black text-sm animate-bounce font-heading">
            🎉 Congratulations! You won {wonPrize}!
          </div>
        ) : alreadyClaimedToday ? (
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-400/40 text-slate-300 text-xs font-heading">
            ✅ You claimed today's free spin! Next spin available tomorrow.
          </div>
        ) : (
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className="w-full py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white font-black text-sm font-heading shadow-lg cursor-pointer disabled:opacity-50"
          >
            {isSpinning ? 'SPINNING...' : 'FREE SPIN NOW (1/1 TODAY)'}
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 2. INBOX & REWARDS MODAL WITH DAILY CLAIM LIMIT
// =========================================================================
export const MailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onClaim: (amount: number) => void;
}> = ({ isOpen, onClose, onClaim }) => {
  const [claimedItems, setClaimedItems] = useState<Record<number, boolean>>({});
  const todayStr = getTodayStr();

  const messages = [
    { id: 1, title: 'Daily Login Reward', desc: 'Daily attendance reward: +1000 Coins', coins: 1000 },
    { id: 2, title: 'Champion Care Package', desc: 'Daily player care bonus: +1500 Coins', coins: 1500 },
    { id: 3, title: 'Evening Feast Box', desc: 'Special classic feast bonus: +2000 Coins', coins: 2000 },
  ];

  // Sync claimed status from localStorage with daily limit
  useEscapeKey(isOpen, onClose);
  useEffect(() => {
    if (isOpen) {
      const status: Record<number, boolean> = {};
      messages.forEach((m) => {
        const key = `ludo_mail_claim_${todayStr}_${m.id}`;
        status[m.id] = localStorage.getItem(key) === 'true';
      });
      setClaimedItems(status);
    }
  }, [isOpen, todayStr]);

  if (!isOpen) return null;

  const handleClaimItem = (id: number, coins: number) => {
    if (claimedItems[id]) return;
    localStorage.setItem(`ludo_mail_claim_${todayStr}_${id}`, 'true');
    setClaimedItems((prev) => ({ ...prev, [id]: true }));
    sounds.playCapture();
    onClaim(coins);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-purple-400/50 p-5 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} />

        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base font-black font-heading text-white">Inbox & Rewards</h3>
            <p className="text-xs text-purple-300">Claim your special daily game gifts</p>
          </div>
        </div>

        <div className="mb-3 py-1 px-3 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center gap-1.5 text-[11px] text-amber-200 font-heading">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Daily Limit: 1 Claim Per Reward Each Day</span>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {messages.map((m) => {
            const isClaimed = claimedItems[m.id];
            return (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-white font-heading">{m.title}</h4>
                  <p className="text-[11px] text-slate-400">{m.desc}</p>
                  <span className="text-[10px] font-bold text-amber-400">+{m.coins} Coins</span>
                </div>
                <button
                  type="button"
                  disabled={isClaimed}
                  onClick={() => handleClaimItem(m.id, m.coins)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black font-heading transition-all ${
                    isClaimed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-not-allowed opacity-80'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 hover:scale-105 shadow-md cursor-pointer'
                  }`}
                >
                  {isClaimed ? 'Claimed' : 'Claim'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. TREASURY STORE MODAL WITH DAILY CLAIM LIMIT
// =========================================================================
export const StoreModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddCoins: (amount: number) => void;
  onAddGems: (amount: number) => void;
}> = ({ isOpen, onClose, onAddCoins, onAddGems }) => {
  const todayStr = getTodayStr();
  const [coinsClaimedToday, setCoinsClaimedToday] = useState(false);
  const [gemsClaimedToday, setGemsClaimedToday] = useState(false);
  useEscapeKey(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setCoinsClaimedToday(localStorage.getItem('ludo_store_coins_date') === todayStr);
      setGemsClaimedToday(localStorage.getItem('ludo_store_gems_date') === todayStr);
    }
  }, [isOpen, todayStr]);

  if (!isOpen) return null;

  const handleClaimCoins = () => {
    if (coinsClaimedToday) return;
    localStorage.setItem('ludo_store_coins_date', todayStr);
    setCoinsClaimedToday(true);
    onAddCoins(10000);
    sounds.playCapture();
  };

  const handleClaimGems = () => {
    if (gemsClaimedToday) return;
    localStorage.setItem('ludo_store_gems_date', todayStr);
    setGemsClaimedToday(true);
    onAddGems(5000);
    sounds.playCapture();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-amber-400 p-5 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} />

        <h3 className="text-base font-black font-heading text-amber-300 mb-1 text-center">
          TREASURY STORE
        </h3>
        <p className="text-xs text-purple-200 text-center mb-3">Daily Claim Limits: 1 Claim per item per day</p>

        <div className="grid grid-cols-2 gap-2.5 mb-2">
          {/* Daily Coins */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/15 text-center flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-heading">Daily Starter Coins</span>
              <span className="text-base font-black text-amber-300 block my-1">10,000</span>
              <span className="text-[10px] text-slate-400 block mb-2">1 Free Claim / Day</span>
            </div>
            <button
              type="button"
              disabled={coinsClaimedToday}
              onClick={handleClaimCoins}
              className={`w-full py-1.5 rounded-xl font-black text-xs font-heading ${
                coinsClaimedToday
                  ? 'bg-slate-800 text-slate-400 border border-white/10 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
              }`}
            >
              {coinsClaimedToday ? 'Claimed Today' : 'FREE CLAIM'}
            </button>
          </div>

          {/* Daily Gems */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/15 text-center flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-heading">Daily Gem Pouch</span>
              <span className="text-base font-black text-cyan-300 block my-1">5,000</span>
              <span className="text-[10px] text-slate-400 block mb-2">1 Free Claim / Day</span>
            </div>
            <button
              type="button"
              disabled={gemsClaimedToday}
              onClick={handleClaimGems}
              className={`w-full py-1.5 rounded-xl font-black text-xs font-heading ${
                gemsClaimedToday
                  ? 'bg-slate-800 text-slate-400 border border-white/10 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md cursor-pointer'
              }`}
            >
              {gemsClaimedToday ? 'Claimed Today' : 'FREE CLAIM'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. PLAY WITH FRIENDS MODAL: 2, 3, 4 PLAYERS WITH NAME INPUTS
// =========================================================================
export const PlayWithFriendsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (playerCount: 2 | 3 | 4, playerNames: string[]) => void;
}> = ({ isOpen, onClose, onStartMatch }) => {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(4);
  const [customNames, setCustomNames] = useState<Partial<Record<PlayerColor, string>>>({
    red: 'Player 1 (Red)',
    green: 'Player 2 (Green)',
    yellow: 'Player 3 (Yellow)',
    blue: 'Player 4 (Blue)',
  });
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const colorStyles: Record<
    'red' | 'green' | 'yellow' | 'blue',
    { label: string; colorClass: string; borderClass: string; defaultName: string }
  > = {
    red: { label: 'Red', colorClass: 'bg-rose-600', borderClass: 'border-rose-400', defaultName: 'Player 1 (Red)' },
    green: { label: 'Green', colorClass: 'bg-emerald-600', borderClass: 'border-emerald-400', defaultName: 'Player 2 (Green)' },
    yellow: { label: 'Yellow', colorClass: 'bg-amber-500', borderClass: 'border-amber-300', defaultName: 'Player 3 (Yellow)' },
    blue: { label: 'Blue', colorClass: 'bg-blue-600', borderClass: 'border-blue-400', defaultName: 'Player 4 (Blue)' },
  };

  const getColorsForCount = (count: 2 | 3 | 4): PlayerColor[] => {
    if (count === 2) return ['red', 'yellow'];
    if (count === 3) return ['red', 'green', 'yellow'];
    return ['red', 'green', 'yellow', 'blue'];
  };

  const activeColors = getColorsForCount(playerCount);

  const handleNameChange = (color: PlayerColor, val: string) => {
    setCustomNames((prev) => ({
      ...prev,
      [color]: val,
    }));
  };

  const handleStart = () => {
    sounds.playDiceRoll();
    const finalNames = activeColors.map(
      (col, i) => customNames[col] || `Player ${i + 1} (${colorStyles[col].label})`
    );
    onStartMatch(playerCount, finalNames);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-gradient-to-b from-[#2e0854] via-[#1f053a] to-[#120224] border-2 border-amber-400 p-5 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} />

        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-heading text-amber-300">
              PLAY WITH FRIENDS
            </h3>
            <p className="text-xs text-purple-200">Local Pass & Play on One Device</p>
          </div>
        </div>

        {/* 1. SELECT NUMBER OF PLAYERS (2, 3, 4 Players Only) */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 block mb-2 font-heading">
            Choose Number of Players:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([2, 3, 4] as const).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPlayerCount(num)}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-black font-heading transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  playerCount === num
                    ? 'bg-gradient-to-b from-amber-400 to-yellow-600 text-slate-950 border-2 border-white shadow-lg scale-105'
                    : 'bg-white/10 text-slate-300 border border-white/15 hover:bg-white/15'
                }`}
              >
                <span>{num} Players</span>
                <span className="text-[10px] opacity-80">
                  {num === 2 ? '2 Colors' : num === 3 ? '3 Colors' : '4 Colors'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. PLAYER NAMES LIST */}
        <div className="mb-4 max-h-48 overflow-y-auto pr-1 space-y-2">
          <label className="text-xs font-bold text-slate-300 block mb-1 font-heading">
            Customize Friends' Names:
          </label>
          {activeColors.map((color, idx) => {
            const style = colorStyles[color];
            return (
              <div
                key={color}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10"
              >
                <span
                  className={`w-6 h-6 rounded-lg ${style.colorClass} ${style.borderClass} border text-[10px] font-black flex items-center justify-center text-white`}
                >
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={customNames[color] ?? `Player ${idx + 1} (${style.label})`}
                  onChange={(e) => handleNameChange(color, e.target.value)}
                  maxLength={16}
                  className="flex-1 bg-transparent text-xs sm:text-sm font-bold text-white outline-none placeholder:text-slate-500 font-heading"
                  placeholder={`Player ${idx + 1} (${style.label})`}
                />
                <span className="text-[10px] font-bold text-slate-400 pr-1">{style.label}</span>
              </div>
            );
          })}
        </div>

        {/* START MATCH BUTTON */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm font-heading shadow-xl border border-emerald-300 hover:scale-102 active:scale-98 transition-transform cursor-pointer"
        >
          START {playerCount}-PLAYER MATCH NOW
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 5. GAME RULES MODAL
// =========================================================================
export const GameRulesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-emerald-400/50 p-5 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} />

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black font-heading text-white">Ludo Classic Rules</h3>
        </div>

        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
            <strong className="text-amber-300 block mb-0.5">🎲 Roll 6 to Exit Yard:</strong>
            Rolling a 6 releases a pawn to the starting cell and gives you an extra bonus roll!
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
            <strong className="text-emerald-300 block mb-0.5">⭐ Safe Star Cells:</strong>
            Tokens landing on Star tiles cannot be captured by any opponent.
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
            <strong className="text-rose-300 block mb-0.5">⚔️ Capturing:</strong>
            Landing on an opponent sends their token back to their home yard and grants a bonus roll!
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
            <strong className="text-cyan-300 block mb-0.5">🏆 Winning:</strong>
            The first player to guide all 4 tokens around the board and into the home triangle wins!
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 6. SOCIAL & LEADERBOARD MODAL
// =========================================================================
export const SocialModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onChallengeFriend?: (name: string) => void;
}> = ({ isOpen, onClose, onChallengeFriend }) => {
  const [tab, setTab] = useState<'friends' | 'leaderboard'>('friends');
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const friends = [
    { name: 'Rahul Sharma', status: 'Online', rank: 'Pro', wins: 48 },
    { name: 'Vikram Singh', status: 'In Game', rank: 'Master', wins: 92 },
    { name: 'Ananya Verma', status: 'Online', rank: 'Ace', wins: 34 },
  ];

  const leaderboard = [
    { rank: 1, name: 'LudoClassic_99', trophies: 2840, winRate: '78%' },
    { rank: 2, name: 'Dragon_Slayer', trophies: 2710, winRate: '74%' },
    { rank: 3, name: 'You (Player 1)', trophies: 2540, winRate: '71%' },
    { rank: 4, name: 'Golden_Dice', trophies: 2420, winRate: '68%' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-purple-400/50 p-5 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} />

        <div className="flex items-center gap-2 mb-4 pr-6">
          <button
            type="button"
            onClick={() => setTab('friends')}
            className={`py-1.5 px-3 rounded-xl text-xs font-black font-heading transition-all cursor-pointer ${
              tab === 'friends'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            Friends (3)
          </button>
          <button
            type="button"
            onClick={() => setTab('leaderboard')}
            className={`py-1.5 px-3 rounded-xl text-xs font-black font-heading transition-all cursor-pointer ${
              tab === 'leaderboard'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            Global Rankings
          </button>
        </div>

        {tab === 'friends' ? (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {friends.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center font-bold text-xs">
                    {f.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-heading">{f.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {f.status} • {f.wins} Wins
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    if (onChallengeFriend) onChallengeFriend(f.name);
                    onClose();
                  }}
                  className="py-1 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs font-heading hover:scale-105 shadow-md cursor-pointer"
                >
                  Play
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {leaderboard.map((u, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-2xl border flex items-center justify-between ${
                  u.rank === 3
                    ? 'bg-purple-900/40 border-amber-400'
                    : 'bg-black/40 border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-heading ${
                      u.rank === 1
                        ? 'bg-amber-400 text-slate-950'
                        : u.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : u.rank === 3
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{u.rank}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white font-heading">{u.name}</h5>
                    <span className="text-[10px] text-slate-400">Win Rate: {u.winRate}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-300 font-heading">
                  {u.trophies} 🏆
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 7. PROFILE MODAL
// =========================================================================
export const ProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  gems: number;
}> = ({ isOpen, onClose, coins, gems }) => {
  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-amber-400 p-5 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} />

        <h3 className="text-base font-black font-heading text-amber-300 mb-3 text-center">
          PLAYER PROFILE
        </h3>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 border-2 border-amber-400 flex items-center justify-center text-xl font-black">
            👦
          </div>
          <div>
            <h4 className="text-sm font-black text-white font-heading">Master Player</h4>
            <span className="text-xs text-amber-400 font-bold block">Level 5 Star Champion ⭐</span>
            <span className="text-[11px] text-slate-400">Ludo Classic Board Master</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-2 text-center">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-slate-400 block font-heading">Gold Coins</span>
            <span className="text-sm font-black text-amber-300">{coins.toLocaleString()}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-slate-400 block font-heading">Gems</span>
            <span className="text-sm font-black text-cyan-300">{gems.toLocaleString()}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-slate-400 block font-heading">Matches Played</span>
            <span className="text-sm font-black text-emerald-400">42</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-slate-400 block font-heading">Win Ratio</span>
            <span className="text-sm font-black text-purple-400">76%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 8. QUICK MODE SETUP MODAL (2-PLAYER & 4-PLAYER: HUMAN VS AI OR PASS & PLAY)
// =========================================================================
export const QuickModeModal: React.FC<{
  isOpen: boolean;
  mode: '2-player' | '4-player' | null;
  onClose: () => void;
  onSelectOption: (mode: '2-player' | '4-player', vsAI: boolean) => void;
}> = ({ isOpen, mode, onClose, onSelectOption }) => {
  useEscapeKey(isOpen, onClose);
  if (!isOpen || !mode) return null;

  const is2P = mode === '2-player';

  return (
    <div
      id="quick-mode-setup-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="quick-mode-setup-content"
        className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-gradient-to-b from-[#2e0854] via-[#1f053a] to-[#120224] border-2 border-amber-400 p-5 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} />

        <div className="flex items-center gap-2.5 mb-4 pr-10">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${
              is2P
                ? 'bg-gradient-to-br from-lime-500 to-green-700 border border-lime-300'
                : 'bg-gradient-to-br from-rose-500 to-red-700 border border-rose-300'
            }`}
          >
            {is2P ? '2P' : '4P'}
          </div>
          <div>
            <h3 className="text-lg font-black font-heading text-amber-300 tracking-wide">
              {is2P ? '2 PLAYERS MATCH SETUP' : '4 PLAYERS MATCH SETUP'}
            </h3>
            <p className="text-xs text-purple-200">
              Select play against AI or local friends
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-2">
          {/* OPTION 1: VS COMPUTER (AI) */}
          <div
            onClick={() => {
              sounds.playDiceRoll();
              onSelectOption(mode, true);
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border-2 border-cyan-400 hover:border-cyan-300 hover:scale-102 active:scale-98 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/40">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black font-heading text-white group-hover:text-cyan-200 transition-colors">
                    {is2P ? '1 Player vs 1 AI' : '1 Player vs 3 AI'}
                  </h4>
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                    🤖 Single Player vs Computer
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black font-heading shadow-xs">
                VS AI
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 mt-2 py-1 px-2 rounded-lg bg-black/40 border border-white/5">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <User className="w-3.5 h-3.5" />
                <span>You (Player)</span>
              </div>
              <span className="text-slate-500 font-bold">vs</span>
              <div className="flex items-center gap-1 text-cyan-400 font-bold">
                <Bot className="w-3.5 h-3.5" />
                <span>{is2P ? '1 Smart AI' : '3 Smart AI'}</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-2.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs font-heading shadow-md transition-all cursor-pointer"
            >
              START GAME VS AI 🤖
            </button>
          </div>

          {/* OPTION 2: PASS & PLAY (HUMAN PLAYERS) */}
          <div
            onClick={() => {
              sounds.playDiceRoll();
              onSelectOption(mode, false);
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border-2 border-emerald-400 hover:border-emerald-300 hover:scale-102 active:scale-98 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/40">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black font-heading text-white group-hover:text-emerald-200 transition-colors">
                    {is2P ? '2 Human Players (Pass & Play)' : '4 Human Players (Pass & Play)'}
                  </h4>
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                    👥 Local Multiplayer on 1 Device
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black font-heading shadow-xs">
                PASS & PLAY
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2 py-1 px-2 rounded-lg bg-black/40 border border-white/5">
              <span className="text-emerald-300 font-medium">
                {is2P
                  ? '👤 Player 1 (Red) and 👤 Player 2 (Yellow) play turn by turn'
                  : '👤 4 Friends (Red, Green, Yellow, Blue) take turns on this screen'}
              </span>
            </div>

            <button
              type="button"
              className="w-full mt-2.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs font-heading shadow-md transition-all cursor-pointer"
            >
              START {is2P ? '2-PLAYER' : '4-PLAYER'} PASS & PLAY 👥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
