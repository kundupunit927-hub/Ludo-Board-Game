import { SnakeOrLadderItem, SnakePlayer, SnakePlayerColor } from '../types/snakes';

// Standard 10x10 Ladders (Climb UP: start < end)
export const LADDERS: SnakeOrLadderItem[] = [
  { id: 1, start: 4, end: 25, type: 'ladder', name: 'Golden Ladder', color: '#f59e0b' },
  { id: 2, start: 13, end: 46, type: 'ladder', name: 'Bamboo Ladder', color: '#10b981' },
  { id: 3, start: 33, end: 70, type: 'ladder', name: 'Royal Ladder', color: '#eab308' },
  { id: 4, start: 42, end: 63, type: 'ladder', name: 'Teak Ladder', color: '#d97706' },
  { id: 5, start: 50, end: 69, type: 'ladder', name: 'Emerald Ladder', color: '#059669' },
  { id: 6, start: 62, end: 81, type: 'ladder', name: 'Imperial Ladder', color: '#d97706' },
  { id: 7, start: 74, end: 92, type: 'ladder', name: 'Skyward Golden Ladder', color: '#eab308' },
];

// Standard 10x10 Snakes (Slide DOWN: start > end)
export const SNAKES: SnakeOrLadderItem[] = [
  { id: 101, start: 27, end: 5, type: 'snake', name: 'Green Viper', color: '#16a34a' },
  { id: 102, start: 43, end: 18, type: 'snake', name: 'Forest Cobra', color: '#0d9488' },
  { id: 103, start: 54, end: 17, type: 'snake', name: 'Spotted Krait', color: '#b91c1c' },
  { id: 104, start: 66, end: 24, type: 'snake', name: 'Emerald Python', color: '#15803d' },
  { id: 105, start: 76, end: 34, type: 'snake', name: 'Crimson Anaconda', color: '#dc2626' },
  { id: 106, start: 89, end: 53, type: 'snake', name: 'Golden Serpent', color: '#ca8a04' },
  { id: 107, start: 99, end: 41, type: 'snake', name: 'Giant King Cobra', color: '#991b1b' },
];

/**
 * Returns (x, y) percent inside 0-100 coordinate space for a square number (1..100)
 * Square 1 is at bottom-left (row 0, col 0)
 * Row 0: 1 to 10 (L to R)
 * Row 1: 20 to 11 (R to L)
 * ...
 * Row 9: 100 to 91 (R to L)
 */
export function getSquareCoord(square: number): { x: number; y: number; row: number; col: number } {
  const clamped = Math.max(1, Math.min(100, square));
  const row = Math.floor((clamped - 1) / 10);
  const isEvenRow = row % 2 === 0;
  const colInRow = (clamped - 1) % 10;
  const col = isEvenRow ? colInRow : 9 - colInRow;

  // col: 0..9 -> x: 5% .. 95%
  const x = col * 10 + 5;
  // row 0 is at bottom (y = 95%), row 9 is at top (y = 5%)
  const y = (9 - row) * 10 + 5;

  return { x, y, row, col };
}

export const SNAKE_COLOR_CONFIG: Record<
  SnakePlayerColor,
  {
    name: string;
    hex: string;
    border: string;
    light: string;
    gradient: string;
    badgeBg: string;
    tokenGlow: string;
  }
> = {
  red: {
    name: 'Red',
    hex: '#ef4444',
    border: '#b91c1c',
    light: '#fee2e2',
    gradient: 'from-red-500 to-rose-700',
    badgeBg: 'bg-red-600',
    tokenGlow: 'rgba(239, 68, 68, 0.6)',
  },
  green: {
    name: 'Green',
    hex: '#22c55e',
    border: '#15803d',
    light: '#dcfce7',
    gradient: 'from-emerald-400 to-green-600',
    badgeBg: 'bg-emerald-600',
    tokenGlow: 'rgba(34, 197, 94, 0.6)',
  },
  yellow: {
    name: 'Yellow',
    hex: '#eab308',
    border: '#a16207',
    light: '#fef9c3',
    gradient: 'from-amber-300 to-yellow-500',
    badgeBg: 'bg-amber-500',
    tokenGlow: 'rgba(234, 179, 8, 0.6)',
  },
  blue: {
    name: 'Blue',
    hex: '#3b82f6',
    border: '#1d4ed8',
    light: '#dbeafe',
    gradient: 'from-sky-400 to-blue-600',
    badgeBg: 'bg-blue-600',
    tokenGlow: 'rgba(59, 130, 246, 0.6)',
  },
};

export function createDefaultSnakePlayers(count: 2 | 3 | 4, vsAi: boolean): SnakePlayer[] {
  const colors: SnakePlayerColor[] = ['red', 'green', 'yellow', 'blue'];
  return colors.slice(0, count).map((color, index) => ({
    id: index,
    name: vsAi ? (index === 0 ? 'You (Player 1)' : `AI ${index + 1}`) : `Player ${index + 1}`,
    color,
    isAi: vsAi ? index > 0 : false,
    position: 0,
    hasWon: false,
  }));
}
