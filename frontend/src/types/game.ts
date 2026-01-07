import type { Board, CellValue, Difficulty, Move, Position } from './sudoku';

export interface GameState {
  // Puzzle data
  puzzle: Board; // Initial puzzle (0 = empty)
  solution: Board; // Complete solution
  board: Board; // Current board state
  pencilMarks: Set<number>[][]; // Pencil marks per cell
  initialCells: boolean[][]; // Which cells were pre-filled

  // Selection & UI
  selectedCell: Position | null;
  highlightedNumber: number | null;

  // Game status
  isPaused: boolean;
  isComplete: boolean;
  difficulty: Difficulty;
  hintsUsed: number;

  // History
  history: Move[];
  historyIndex: number;

  // Timer
  startTime: number;
  elapsedTime: number;
}

export interface GameActions {
  // Game management
  newGame: (difficulty: Difficulty) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;

  // Cell operations
  selectCell: (position: Position) => void;
  setCellValue: (value: CellValue) => void;
  setPencilMark: (value: number) => void;
  clearCell: () => void;

  // History
  undo: () => void;
  redo: () => void;

  // Hints
  getHint: () => void;

  // Timer
  updateElapsedTime: (time: number) => void;
}
