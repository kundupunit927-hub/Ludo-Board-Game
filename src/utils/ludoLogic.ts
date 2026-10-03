import { BoardCellCoord, MoveOption, Player, PlayerColor, Token } from '../types';

export const CELL_SIZE = 100;
export const BOARD_SIZE = 1500;

export const COLOR_HEX: Record<
  PlayerColor,
  {
    primary: string;
    light: string;
    dark: string;
    border: string;
    text: string;
    gradientTop: string;
    gradientBottom: string;
    glow: string;
  }
> = {
  red: {
    primary: '#F44336',
    light: '#ffebee',
    dark: '#c62828',
    border: '#d32f2f',
    text: '#b71c1c',
    gradientTop: '#ff7961',
    gradientBottom: '#ba000d',
    glow: 'rgba(244, 67, 54, 0.4)',
  },
  green: {
    primary: '#4CAF50',
    light: '#e8f5e9',
    dark: '#2e7d32',
    border: '#388e3c',
    text: '#1b5e20',
    gradientTop: '#80e27e',
    gradientBottom: '#087f23',
    glow: 'rgba(76, 175, 80, 0.4)',
  },
  yellow: {
    primary: '#FFEB3B',
    light: '#fffde7',
    dark: '#f57f17',
    border: '#fbc02d',
    text: '#b45309',
    gradientTop: '#ffff72',
    gradientBottom: '#f9a825',
    glow: 'rgba(255, 235, 59, 0.4)',
  },
  blue: {
    primary: '#2196F3',
    light: '#e3f2fd',
    dark: '#1565c0',
    border: '#1976d2',
    text: '#0d47a1',
    gradientTop: '#6ec6ff',
    gradientBottom: '#0069c0',
    glow: 'rgba(33, 150, 243, 0.4)',
  },
  orange: {
    primary: '#FF9800',
    light: '#fff3e0',
    dark: '#e65100',
    border: '#f57c00',
    text: '#c2410c',
    gradientTop: '#ffb74d',
    gradientBottom: '#f57c00',
    glow: 'rgba(255, 152, 0, 0.4)',
  },
  purple: {
    primary: '#9C27B0',
    light: '#f3e5f5',
    dark: '#6a1b9a',
    border: '#7b1fa2',
    text: '#7e22ce',
    gradientTop: '#ba68c8',
    gradientBottom: '#7b1fa2',
    glow: 'rgba(156, 39, 176, 0.4)',
  },
};

export const COLOR_DISPLAY_NAMES: Record<PlayerColor, string> = {
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  blue: 'Blue',
  orange: 'Orange',
  purple: 'Purple',
};

export const SIX_PLAYER_COLORS: PlayerColor[] = [
  'red',
  'green',
  'yellow',
  'blue',
  'orange',
  'purple',
];

// 52-track coordinates (clockwise perimeter)
export const TRACK_CELLS: BoardCellCoord[] = [
  { col: 1, row: 6 }, // 0: Red Start (Safe)
  { col: 2, row: 6 }, // 1
  { col: 3, row: 6 }, // 2
  { col: 4, row: 6 }, // 3
  { col: 5, row: 6 }, // 4
  { col: 6, row: 5 }, // 5
  { col: 6, row: 4 }, // 6
  { col: 6, row: 3 }, // 7
  { col: 6, row: 2 }, // 8: Safe Star
  { col: 6, row: 1 }, // 9
  { col: 6, row: 0 }, // 10
  { col: 7, row: 0 }, // 11
  { col: 8, row: 0 }, // 12
  { col: 8, row: 1 }, // 13: Green Start (Safe)
  { col: 8, row: 2 }, // 14
  { col: 8, row: 3 }, // 15
  { col: 8, row: 4 }, // 16
  { col: 8, row: 5 }, // 17
  { col: 9, row: 6 }, // 18
  { col: 10, row: 6 }, // 19
  { col: 11, row: 6 }, // 20
  { col: 12, row: 6 }, // 21: Safe Star
  { col: 13, row: 6 }, // 22
  { col: 14, row: 6 }, // 23
  { col: 14, row: 7 }, // 24
  { col: 14, row: 8 }, // 25
  { col: 13, row: 8 }, // 26: Yellow Start (Safe)
  { col: 12, row: 8 }, // 27
  { col: 11, row: 8 }, // 28
  { col: 10, row: 8 }, // 29
  { col: 9, row: 8 }, // 30
  { col: 8, row: 9 }, // 31
  { col: 8, row: 10 }, // 32
  { col: 8, row: 11 }, // 33
  { col: 8, row: 12 }, // 34: Safe Star
  { col: 8, row: 13 }, // 35
  { col: 8, row: 14 }, // 36
  { col: 7, row: 14 }, // 37
  { col: 6, row: 14 }, // 38
  { col: 6, row: 13 }, // 39: Blue Start (Safe)
  { col: 6, row: 12 }, // 40
  { col: 6, row: 11 }, // 41
  { col: 6, row: 10 }, // 42
  { col: 6, row: 9 }, // 43
  { col: 5, row: 8 }, // 44
  { col: 4, row: 8 }, // 45
  { col: 3, row: 8 }, // 46
  { col: 2, row: 8 }, // 47: Safe Star
  { col: 1, row: 8 }, // 48
  { col: 0, row: 8 }, // 49
  { col: 0, row: 7 }, // 50
  { col: 0, row: 6 }, // 51
];

export const SAFE_TRACK_INDICES = new Set<number>([0, 8, 13, 21, 26, 34, 39, 47]);

export const COLOR_START_TRACK_INDEX: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
  orange: 0,
  purple: 26,
};

// 5 home stretch cells for each color
export const HOME_STRETCH_CELLS: Record<PlayerColor, BoardCellCoord[]> = {
  red: [
    { col: 1, row: 7 },
    { col: 2, row: 7 },
    { col: 3, row: 7 },
    { col: 4, row: 7 },
    { col: 5, row: 7 },
  ],
  green: [
    { col: 7, row: 1 },
    { col: 7, row: 2 },
    { col: 7, row: 3 },
    { col: 7, row: 4 },
    { col: 7, row: 5 },
  ],
  yellow: [
    { col: 13, row: 7 },
    { col: 12, row: 7 },
    { col: 11, row: 7 },
    { col: 10, row: 7 },
    { col: 9, row: 7 },
  ],
  blue: [
    { col: 7, row: 13 },
    { col: 7, row: 12 },
    { col: 7, row: 11 },
    { col: 7, row: 10 },
    { col: 7, row: 9 },
  ],
  orange: [
    { col: 1, row: 7 },
    { col: 2, row: 7 },
    { col: 3, row: 7 },
    { col: 4, row: 7 },
    { col: 5, row: 7 },
  ],
  purple: [
    { col: 13, row: 7 },
    { col: 12, row: 7 },
    { col: 11, row: 7 },
    { col: 10, row: 7 },
    { col: 9, row: 7 },
  ],
};

// Yard / Base positions for each player's 4 tokens (4-player board)
export const YARD_TOKEN_COORDS: Record<PlayerColor, { x: number; y: number }[]> = {
  red: [
    { x: 200, y: 200 },
    { x: 400, y: 200 },
    { x: 200, y: 400 },
    { x: 400, y: 400 },
  ],
  green: [
    { x: 1100, y: 200 },
    { x: 1300, y: 200 },
    { x: 1100, y: 400 },
    { x: 1300, y: 400 },
  ],
  yellow: [
    { x: 1100, y: 1100 },
    { x: 1300, y: 1100 },
    { x: 1100, y: 1300 },
    { x: 1300, y: 1300 },
  ],
  blue: [
    { x: 200, y: 1100 },
    { x: 400, y: 1100 },
    { x: 200, y: 1300 },
    { x: 400, y: 1300 },
  ],
  orange: [
    { x: 200, y: 750 },
    { x: 350, y: 750 },
    { x: 200, y: 900 },
    { x: 350, y: 900 },
  ],
  purple: [
    { x: 1150, y: 750 },
    { x: 1300, y: 750 },
    { x: 1150, y: 900 },
    { x: 1300, y: 900 },
  ],
};

// Home triangle token offsets when finished (step 56, 4-player board)
export const HOME_GOAL_COORDS: Record<PlayerColor, { x: number; y: number }[]> = {
  red: [
    { x: 635, y: 715 },
    { x: 635, y: 785 },
    { x: 615, y: 750 },
    { x: 660, y: 750 },
  ],
  green: [
    { x: 715, y: 635 },
    { x: 785, y: 635 },
    { x: 750, y: 615 },
    { x: 750, y: 660 },
  ],
  yellow: [
    { x: 865, y: 715 },
    { x: 865, y: 785 },
    { x: 885, y: 750 },
    { x: 840, y: 750 },
  ],
  blue: [
    { x: 715, y: 865 },
    { x: 785, y: 865 },
    { x: 750, y: 885 },
    { x: 750, y: 840 },
  ],
  orange: [
    { x: 635, y: 750 },
    { x: 635, y: 800 },
    { x: 615, y: 775 },
    { x: 660, y: 775 },
  ],
  purple: [
    { x: 865, y: 750 },
    { x: 865, y: 800 },
    { x: 885, y: 775 },
    { x: 840, y: 775 },
  ],
};

// =========================================================================
// 6-PLAYER BOARD GEOMETRY & MATHEMATICAL MODEL
// =========================================================================
export function rotatePoint(x: number, y: number, angleDeg: number, cx = 750, cy = 750): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const nx = cos * (x - cx) - sin * (y - cy) + cx;
  const ny = sin * (x - cx) + cos * (y - cy) + cy;
  return { x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 };
}

export const COLOR_SECTOR_INDEX_6P: Record<PlayerColor, number> = {
  red: 0,
  green: 1,
  yellow: 2,
  blue: 3,
  orange: 4,
  purple: 5,
};

export const COLOR_START_TRACK_INDEX_6P: Record<PlayerColor, number> = {
  red: 0,
  green: 11,
  yellow: 22,
  blue: 33,
  orange: 44,
  purple: 55,
};

export const SAFE_TRACK_INDICES_6P = new Set<number>([0, 10, 11, 21, 22, 32, 33, 43, 44, 54, 55, 65]);

export const MAX_STEPS = 56;
export const MAX_STEPS_6P = 70; // 0..64 on track (65 track steps), 65..69 in home stretch (5 cells), 70 = finish

// Sector 0 (Red) track templates (11 cells)
const SECTOR_0_TRACK_TEMPLATE = [
  { x: 680, y: 685 }, // 0: Start square (Safe Star)
  { x: 680, y: 612 }, // 1
  { x: 680, y: 538 }, // 2
  { x: 680, y: 462 }, // 3
  { x: 680, y: 388 }, // 4
  { x: 715, y: 315 }, // 5: Tip corner transition
  { x: 785, y: 315 }, // 6: Tip corner transition
  { x: 820, y: 388 }, // 7
  { x: 820, y: 462 }, // 8
  { x: 820, y: 538 }, // 9
  { x: 820, y: 612 }, // 10: Return Safe Star
];

// Generate all 66 track cells for 6-player board
export const TRACK_CELLS_6P: { x: number; y: number }[] = [];
for (let s = 0; s < 6; s++) {
  const angle = s * 60;
  for (let i = 0; i < 11; i++) {
    TRACK_CELLS_6P.push(rotatePoint(SECTOR_0_TRACK_TEMPLATE[i].x, SECTOR_0_TRACK_TEMPLATE[i].y, angle));
  }
}

// Sector 0 Home Stretch template (5 cells, from outer toward center)
const SECTOR_0_HOME_TEMPLATE = [
  { x: 750, y: 388 }, // Step 65
  { x: 750, y: 462 }, // Step 66
  { x: 750, y: 538 }, // Step 67
  { x: 750, y: 612 }, // Step 68
  { x: 750, y: 685 }, // Step 69
];

export const HOME_STRETCH_CELLS_6P: Record<PlayerColor, { x: number; y: number }[]> = {
  red: SECTOR_0_HOME_TEMPLATE.map((p) => rotatePoint(p.x, p.y, 0)),
  green: SECTOR_0_HOME_TEMPLATE.map((p) => rotatePoint(p.x, p.y, 60)),
  yellow: SECTOR_0_HOME_TEMPLATE.map((p) => rotatePoint(p.x, p.y, 120)),
  blue: SECTOR_0_HOME_TEMPLATE.map((p) => rotatePoint(p.x, p.y, 180)),
  orange: SECTOR_0_HOME_TEMPLATE.map((p) => rotatePoint(p.x, p.y, 240)),
  purple: SECTOR_0_HOME_TEMPLATE.map((p) => rotatePoint(p.x, p.y, 300)),
};

// Yard token slots for each of the 6 colors (4 tokens each)
export const YARD_TOKEN_COORDS_6P: Record<PlayerColor, { x: number; y: number }[]> = {
  red: [
    rotatePoint(390, 230, 0),
    rotatePoint(490, 230, 0),
    rotatePoint(390, 330, 0),
    rotatePoint(490, 330, 0),
  ],
  green: [
    rotatePoint(390, 230, 60),
    rotatePoint(490, 230, 60),
    rotatePoint(390, 330, 60),
    rotatePoint(490, 330, 60),
  ],
  yellow: [
    rotatePoint(390, 230, 120),
    rotatePoint(490, 230, 120),
    rotatePoint(390, 330, 120),
    rotatePoint(490, 330, 120),
  ],
  blue: [
    rotatePoint(390, 230, 180),
    rotatePoint(490, 230, 180),
    rotatePoint(390, 330, 180),
    rotatePoint(490, 330, 180),
  ],
  orange: [
    rotatePoint(390, 230, 240),
    rotatePoint(490, 230, 240),
    rotatePoint(390, 330, 240),
    rotatePoint(490, 330, 240),
  ],
  purple: [
    rotatePoint(390, 230, 300),
    rotatePoint(490, 230, 300),
    rotatePoint(390, 330, 300),
    rotatePoint(490, 330, 300),
  ],
};

// Base Center coordinate for RoomPlayerBadge in 6-player mode
export const YARD_BASE_CENTERS_6P: Record<PlayerColor, { x: number; y: number }> = {
  red: rotatePoint(440, 280, 0),
  green: rotatePoint(440, 280, 60),
  yellow: rotatePoint(440, 280, 120),
  blue: rotatePoint(440, 280, 180),
  orange: rotatePoint(440, 280, 240),
  purple: rotatePoint(440, 280, 300),
};

// Home Goal Center finish coordinates (step 70)
export const HOME_GOAL_COORDS_6P: Record<PlayerColor, { x: number; y: number }[]> = {
  red: [
    rotatePoint(735, 715, 0),
    rotatePoint(765, 715, 0),
    rotatePoint(735, 730, 0),
    rotatePoint(765, 730, 0),
  ],
  green: [
    rotatePoint(735, 715, 60),
    rotatePoint(765, 715, 60),
    rotatePoint(735, 730, 60),
    rotatePoint(765, 730, 60),
  ],
  yellow: [
    rotatePoint(735, 715, 120),
    rotatePoint(765, 715, 120),
    rotatePoint(735, 730, 120),
    rotatePoint(765, 730, 120),
  ],
  blue: [
    rotatePoint(735, 715, 180),
    rotatePoint(765, 715, 180),
    rotatePoint(735, 730, 180),
    rotatePoint(765, 730, 180),
  ],
  orange: [
    rotatePoint(735, 715, 240),
    rotatePoint(765, 715, 240),
    rotatePoint(735, 730, 240),
    rotatePoint(765, 730, 240),
  ],
  purple: [
    rotatePoint(735, 715, 300),
    rotatePoint(765, 715, 300),
    rotatePoint(735, 730, 300),
    rotatePoint(765, 730, 300),
  ],
};

/**
 * Returns the track index for a token at `step`
 */
export function getTrackIndex(color: PlayerColor, step: number, is6P = false): number | null {
  if (is6P || color === 'orange' || color === 'purple') {
    if (step < 0 || step > 64) return null;
    const start = COLOR_START_TRACK_INDEX_6P[color];
    return (start + step) % 66;
  }
  if (step < 0 || step > 50) return null;
  const start = COLOR_START_TRACK_INDEX[color];
  return (start + step) % 52;
}

/**
 * Checks if a token is in a safe location (safe star track square, home stretch, home base, or finished)
 */
export function isTokenSafe(color: PlayerColor, step: number, is6P = false): boolean {
  if (is6P || color === 'orange' || color === 'purple') {
    if (step < 0 || step >= 65) return true;
    const trackIdx = getTrackIndex(color, step, true);
    if (trackIdx === null) return true;
    return SAFE_TRACK_INDICES_6P.has(trackIdx);
  }
  if (step < 0 || step >= 51) return true;
  const trackIdx = getTrackIndex(color, step, false);
  if (trackIdx === null) return true;
  return SAFE_TRACK_INDICES.has(trackIdx);
}

/**
 * Returns pixel {x, y} coordinate for a token on 4-player or 6-player board
 */
export function getTokenPixelCoord(token: Token, is6P = false): { x: number; y: number } {
  const { color, step, id } = token;

  if (is6P || color === 'orange' || color === 'purple') {
    // 6-Player Board Coordinates
    if (step === -1) {
      return YARD_TOKEN_COORDS_6P[color][id] || { x: 750, y: 750 };
    }
    if (step >= MAX_STEPS_6P) {
      return HOME_GOAL_COORDS_6P[color][id] || { x: 750, y: 750 };
    }
    if (step >= 65 && step <= 69) {
      const stretchIdx = step - 65;
      return HOME_STRETCH_CELLS_6P[color][stretchIdx] || { x: 750, y: 750 };
    }
    const trackIdx = getTrackIndex(color, step, true);
    if (trackIdx !== null && TRACK_CELLS_6P[trackIdx]) {
      return TRACK_CELLS_6P[trackIdx];
    }
    return { x: 750, y: 750 };
  }

  // Classic 4-Player Board Coordinates
  if (step === -1) {
    return YARD_TOKEN_COORDS[color][id];
  }

  if (step >= MAX_STEPS) {
    return HOME_GOAL_COORDS[color][id];
  }

  if (step >= 51 && step <= 55) {
    const stretchIdx = step - 51;
    const cell = HOME_STRETCH_CELLS[color][stretchIdx];
    return {
      x: cell.col * CELL_SIZE + CELL_SIZE / 2,
      y: cell.row * CELL_SIZE + CELL_SIZE / 2,
    };
  }

  const trackIdx = getTrackIndex(color, step, false);
  if (trackIdx !== null) {
    const cell = TRACK_CELLS[trackIdx];
    return {
      x: cell.col * CELL_SIZE + CELL_SIZE / 2,
      y: cell.row * CELL_SIZE + CELL_SIZE / 2,
    };
  }

  return { x: 750, y: 750 };
}

/**
 * Validates whether a token can make a move with the rolled dice value.
 * Standard rules:
 * - If token is in yard (step -1): must roll 6 to exit to step 0.
 * - If token is on track / stretch: step + roll must be <= maxSteps (exact roll needed to enter home).
 * - If token is already home: cannot move.
 */
export function getValidMoveForToken(
  token: Token,
  roll: number,
  allPlayers: Player[]
): MoveOption | null {
  const is6P = allPlayers.length > 4 || token.color === 'orange' || token.color === 'purple';
  const maxSteps = is6P ? MAX_STEPS_6P : MAX_STEPS;

  if (token.step >= maxSteps) return null; // already finished

  // In base
  if (token.step === -1) {
    if (roll === 6) {
      // Exits to step 0 (start square)
      const isCapture = checkWillCapture(token.color, 0, allPlayers);
      return {
        tokenId: token.id,
        fromStep: -1,
        toStep: 0,
        isExit: true,
        isCapture,
        isHome: false,
      };
    }
    return null;
  }

  const targetStep = token.step + roll;
  if (targetStep > maxSteps) {
    // Requires exact roll to reach home finish
    return null;
  }

  const isHome = targetStep === maxSteps;
  const isCapture = !isHome && checkWillCapture(token.color, targetStep, allPlayers);

  return {
    tokenId: token.id,
    fromStep: token.step,
    toStep: targetStep,
    isExit: false,
    isCapture,
    isHome,
  };
}

/**
 * Checks if moving to `targetStep` results in capturing an opponent token.
 */
export function checkWillCapture(
  movingColor: PlayerColor,
  targetStep: number,
  allPlayers: Player[],
  forceIs6P?: boolean
): boolean {
  const is6P =
    forceIs6P !== undefined
      ? forceIs6P
      : allPlayers.length > 4 || movingColor === 'orange' || movingColor === 'purple';
  const maxTrackStep = is6P ? 64 : 50;

  if (targetStep < 0 || targetStep > maxTrackStep) return false;
  const targetTrackIdx = getTrackIndex(movingColor, targetStep, is6P);
  if (targetTrackIdx === null) return false;

  const safeSet = is6P ? SAFE_TRACK_INDICES_6P : SAFE_TRACK_INDICES;
  if (safeSet.has(targetTrackIdx)) return false;

  for (const p of allPlayers) {
    if (p.color === movingColor) continue;
    for (const oppToken of p.tokens) {
      if (oppToken.step >= 0 && oppToken.step <= maxTrackStep) {
        const oppTrackIdx = getTrackIndex(oppToken.color, oppToken.step, is6P);
        if (oppTrackIdx === targetTrackIdx) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Finds all opponent tokens at the given track index that are captured.
 */
export function getCapturedTokens(
  movingColor: PlayerColor,
  targetStep: number,
  allPlayers: Player[],
  forceIs6P?: boolean
): { color: PlayerColor; tokenId: number }[] {
  const is6P =
    forceIs6P !== undefined
      ? forceIs6P
      : allPlayers.length > 4 || movingColor === 'orange' || movingColor === 'purple';
  const maxTrackStep = is6P ? 64 : 50;

  if (targetStep < 0 || targetStep > maxTrackStep) return [];
  const targetTrackIdx = getTrackIndex(movingColor, targetStep, is6P);
  if (targetTrackIdx === null) return [];

  const safeSet = is6P ? SAFE_TRACK_INDICES_6P : SAFE_TRACK_INDICES;
  if (safeSet.has(targetTrackIdx)) return [];

  const captured: { color: PlayerColor; tokenId: number }[] = [];
  for (const p of allPlayers) {
    if (p.color === movingColor) continue;
    for (const oppToken of p.tokens) {
      if (oppToken.step >= 0 && oppToken.step <= maxTrackStep) {
        const oppTrackIdx = getTrackIndex(oppToken.color, oppToken.step, is6P);
        if (oppTrackIdx === targetTrackIdx) {
          captured.push({ color: oppToken.color, tokenId: oppToken.id });
        }
      }
    }
  }
  return captured;
}

/**
 * Returns all valid moves for the active player.
 */
export function getAllValidMoves(player: Player, roll: number, allPlayers: Player[]): MoveOption[] {
  const moves: MoveOption[] = [];
  for (const token of player.tokens) {
    const move = getValidMoveForToken(token, roll, allPlayers);
    if (move) {
      moves.push(move);
    }
  }
  return moves;
}

/**
 * AI Move Selection: Prioritizes moves based on standard Ludo strategy:
 * 1. Capture opponent token (+1000)
 * 2. Enter Home goal (+800)
 * 3. Enter Home stretch (+400)
 * 4. Move to a safe star square (+300)
 * 5. Exit base on rolling 6 (+250)
 * 6. Escape from vulnerability if opponent is 1-6 squares behind (+200)
 * 7. Advance furthest token safely (+step)
 */
export function selectBestAIMove(
  player: Player,
  roll: number,
  allPlayers: Player[]
): MoveOption | null {
  const validMoves = getAllValidMoves(player, roll, allPlayers);
  if (validMoves.length === 0) return null;
  if (validMoves.length === 1) return validMoves[0];

  const is6P = allPlayers.length > 4 || player.color === 'orange' || player.color === 'purple';
  const maxTrackStep = is6P ? 64 : 50;
  const homeStretchStart = is6P ? 65 : 51;
  const trackLen = is6P ? 66 : 52;
  const safeSet = is6P ? SAFE_TRACK_INDICES_6P : SAFE_TRACK_INDICES;

  for (const move of validMoves) {
    let score = 0;

    // 1. Capture!
    if (move.isCapture) {
      score += 1000;
    }

    // 2. Reach home
    if (move.isHome) {
      score += 800;
    }

    // 3. Move into protected home stretch
    if (move.toStep >= homeStretchStart && move.fromStep < homeStretchStart) {
      score += 400;
    }

    // 4. Move to a safe star square
    if (move.toStep <= maxTrackStep) {
      const trackIdx = getTrackIndex(player.color, move.toStep, is6P);
      if (trackIdx !== null && safeSet.has(trackIdx)) {
        score += 300;
      }
    }

    // 5. Exit base on 6
    if (move.isExit) {
      // Prioritize exiting if player has tokens still in base
      const tokensInBase = player.tokens.filter((t) => t.step === -1).length;
      score += 250 + tokensInBase * 20;
    }

    // 6. Escape danger if current square is vulnerable and an opponent is within striking distance
    if (move.fromStep >= 0 && move.fromStep <= maxTrackStep) {
      const currentTrack = getTrackIndex(player.color, move.fromStep, is6P);
      if (currentTrack !== null && !safeSet.has(currentTrack)) {
        let isUnderThreat = false;
        for (const p of allPlayers) {
          if (p.color === player.color) continue;
          for (const opp of p.tokens) {
            if (opp.step >= 0 && opp.step <= maxTrackStep) {
              const oppTrack = getTrackIndex(opp.color, opp.step, is6P);
              if (oppTrack !== null) {
                const dist = (currentTrack - oppTrack + trackLen) % trackLen;
                if (dist >= 1 && dist <= 6) {
                  isUnderThreat = true;
                  break;
                }
              }
            }
          }
          if (isUnderThreat) break;
        }
        if (isUnderThreat) {
          score += 220;
        }
      }
    }

    // 7. Favor moving tokens that are closer to home
    score += move.toStep * 3;

    move.score = score;
  }

  // Sort descending by score
  validMoves.sort((a, b) => (b.score || 0) - (a.score || 0));
  return validMoves[0];
}
