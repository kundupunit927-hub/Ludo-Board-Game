export type SnakePlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface SnakePlayer {
  id: number;
  name: string;
  color: SnakePlayerColor;
  isAi: boolean;
  position: number; // 0 = not started (waiting at start), 1 to 100
  hasWon: boolean;
  rank?: number;
}

export interface SnakeOrLadderItem {
  id: number;
  start: number;
  end: number;
  type: 'snake' | 'ladder';
  color?: string;
  name?: string;
}

export interface HopStep {
  square: number;
  isLadder?: boolean;
  isSnake?: boolean;
}
