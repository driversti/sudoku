import Dexie, { type Table } from 'dexie';

export interface SavedGame {
  id?: number;
  board: number[][];
  solution: number[][];
  puzzle: number[][];
  pencilMarks: string[][]; // Serialized Set<number>[]
  initialCells: boolean[][];
  difficulty: string;
  selectedCell: { row: number; col: number } | null;
  highlightedNumber: number | null;
  isPaused: boolean;
  isComplete: boolean;
  hintsUsed: number;
  history: string; // Serialized Move[]
  historyIndex: number;
  startTime: number;
  elapsedTime: number;
  savedAt: number;
}

export interface GameStatsRecord {
  id?: number;
  difficulty: string;
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number; // in milliseconds
  totalMoves: number;
  totalHints: number;
  lastPlayedAt: number;
}

export class SudokuDatabase extends Dexie {
  savedGames!: Table<SavedGame>;
  gameStats!: Table<GameStatsRecord>;

  constructor() {
    super('SudokuDB');

    this.version(1).stores({
      savedGames: '++id, savedAt, difficulty',
      gameStats: '++id, difficulty, lastPlayedAt',
    });
  }
}

export const db = new SudokuDatabase();
