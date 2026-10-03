export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue' | 'orange' | 'purple';

export type PlayerType = 'human' | 'computer';

export interface Token {
  id: number; // 0..3
  color: PlayerColor;
  step: number; // -1: in yard, 0..50: on track, 51..55: home stretch, 56: finished/home
}

export interface Player {
  color: PlayerColor;
  name: string;
  type: PlayerType;
  tokens: Token[];
  hasWon: boolean;
  rank?: number;
}

export interface BoardCellCoord {
  col: number; // 0..14
  row: number; // 0..14
}

export interface GameLogEntry {
  id: string;
  timestamp: string;
  color: PlayerColor;
  message: string;
  type: 'roll' | 'move' | 'capture' | 'home' | 'win' | 'info';
}

export type GameMode = '2-player' | '3-player' | '4-player' | '5-player' | '6-player';

export interface MoveOption {
  tokenId: number;
  fromStep: number;
  toStep: number;
  isExit: boolean;
  isCapture: boolean;
  isHome: boolean;
  score?: number;
}
