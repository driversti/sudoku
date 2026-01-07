import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameActions } from '../types/game';
import type { CellValue, Position, Move, Difficulty } from '../types/sudoku';
import { generatePuzzle, checkSolution, isBoardComplete } from '../lib/sudoku/generator';

type GameStore = GameState & GameActions;

const initialState: Omit<GameState, 'puzzle' | 'solution' | 'board' | 'pencilMarks' | 'initialCells' | 'difficulty'> = {
  selectedCell: null,
  highlightedNumber: null,
  isPaused: false,
  isComplete: false,
  hintsUsed: 0,
  history: [],
  historyIndex: -1,
  startTime: Date.now(),
  elapsedTime: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Initialize with empty board
      puzzle: Array.from({ length: 9 }, () => Array(9).fill(null)),
      solution: Array.from({ length: 9 }, () => Array(9).fill(null)),
      board: Array.from({ length: 9 }, () => Array(9).fill(null)),
      pencilMarks: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Set<number>())
      ),
      initialCells: Array.from({ length: 9 }, () => Array(9).fill(false)),
      difficulty: 'MEDIUM',

  newGame: (difficulty: Difficulty) => {
    const puzzle = generatePuzzle(difficulty);

    const initialCells: boolean[][] = Array.from({ length: 9 }, () =>
      Array(9).fill(false)
    );

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        initialCells[r][c] = puzzle.initial[r][c] !== null;
      }
    }

    set({
      puzzle: puzzle.initial,
      solution: puzzle.solution,
      board: puzzle.initial.map((row) => [...row]),
      pencilMarks: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Set<number>())
      ),
      initialCells,
      difficulty: puzzle.difficulty,
      selectedCell: null,
      highlightedNumber: null,
      isPaused: false,
      isComplete: false,
      hintsUsed: 0,
      history: [],
      historyIndex: -1,
      startTime: Date.now(),
      elapsedTime: 0,
    });
  },

  pauseGame: () => {
    set({ isPaused: true });
  },

  resumeGame: () => {
    set({ isPaused: false });
  },

  resetGame: () => {
    const { puzzle } = get();

    set({
      board: puzzle.map((row) => [...row]),
      pencilMarks: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Set<number>())
      ),
      selectedCell: null,
      highlightedNumber: null,
      isPaused: false,
      isComplete: false,
      history: [],
      historyIndex: -1,
      startTime: Date.now(),
      elapsedTime: 0,
    });
  },

  selectCell: (position: Position) => {
    const { board } = get();
    const { row, col } = position;

    // Check if cell is selectable (not an initial cell or game is complete)
    if (get().isComplete) {
      set({ selectedCell: position });
      return;
    }

    set({ selectedCell: position });

    // Update highlighted number if cell has a value
    const cellValue = board[row][col];
    if (cellValue !== null) {
      set({ highlightedNumber: cellValue });
    } else {
      set({ highlightedNumber: null });
    }
  },

  setCellValue: (value: CellValue) => {
    const { selectedCell, board, initialCells, history, historyIndex, isPaused, isComplete } = get();

    if (!selectedCell || isPaused || isComplete) return;

    const { row, col } = selectedCell;

    // Can't modify initial cells
    if (initialCells[row][col]) return;

    const previousValue = board[row][col];

    // Same value, no change
    if (previousValue === value) return;

    // Clear pencil marks for this cell when setting a value
    const newPencilMarks = get().pencilMarks.map((pencilRow, r) =>
      pencilRow.map((marks, c) => (r === row && c === col ? new Set<number>() : marks))
    );

    // Create new move
    const move: Move = {
      position: { row, col },
      value,
      previousValue,
      timestamp: Date.now(),
    };

    // Update board
    const newBoard = board.map((boardRow, r) =>
      boardRow.map((cell, c) => (r === row && c === col ? value : cell))
    );

    // Check for win
    const hasWon = isBoardComplete(newBoard) && checkSolution(newBoard, get().solution);

    // Trim history if we're not at the end
    const newHistory = historyIndex < history.length - 1
      ? history.slice(0, historyIndex + 1)
      : history;

    set({
      board: newBoard,
      pencilMarks: newPencilMarks,
      history: [...newHistory, move],
      historyIndex: newHistory.length,
      highlightedNumber: value ?? null,
      isComplete: hasWon,
    });
  },

  setPencilMark: (value: number) => {
    const { selectedCell, board, pencilMarks, isPaused, isComplete } = get();

    if (!selectedCell || isPaused || isComplete) return;

    const { row, col } = selectedCell;

    // Can't add pencil marks to cells with values
    if (board[row][col] !== null) return;

    const currentMarks = pencilMarks[row][col];
    const newMarks = new Set(currentMarks);

    if (newMarks.has(value)) {
      newMarks.delete(value);
    } else {
      newMarks.add(value);
    }

    const newPencilMarks = pencilMarks.map((pencilRow, r) =>
      pencilRow.map((marks, c) => (r === row && c === col ? newMarks : marks))
    );

    set({ pencilMarks: newPencilMarks });
  },

  clearCell: () => {
    const { selectedCell, initialCells, isPaused, isComplete } = get();

    if (!selectedCell || isPaused || isComplete) return;

    const { row, col } = selectedCell;

    // Can't clear initial cells
    if (initialCells[row][col]) return;

    get().setCellValue(null);
  },

  undo: () => {
    const { history, historyIndex, board } = get();

    if (historyIndex < 0) return;

    const move = history[historyIndex];
    const { position, previousValue } = move;

    const newBoard = board.map((boardRow, r) =>
      boardRow.map((cell, c) => (r === position.row && c === position.col ? previousValue : cell))
    );

    set({
      board: newBoard,
      historyIndex: historyIndex - 1,
    });
  },

  redo: () => {
    const { history, historyIndex, board } = get();

    if (historyIndex >= history.length - 1) return;

    const move = history[historyIndex + 1];
    const { position, value } = move;

    const newBoard = board.map((boardRow, r) =>
      boardRow.map((cell, c) => (r === position.row && c === position.col ? value : cell))
    );

    set({
      board: newBoard,
      historyIndex: historyIndex + 1,
    });
  },

  getHint: () => {
    const { board, solution, initialCells, isPaused, isComplete, hintsUsed } = get();

    if (isPaused || isComplete) return;

    // Find an empty cell and fill it with the solution
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === null && !initialCells[r][c]) {
          const hintValue = solution[r][c];

          // Create a move for the hint
          const move: Move = {
            position: { row: r, col: c },
            value: hintValue,
            previousValue: null,
            timestamp: Date.now(),
          };

          const newBoard = board.map((boardRow, row) =>
            boardRow.map((cell, col) => (row === r && col === c ? hintValue : cell))
          );

          const { history, historyIndex } = get();
          const newHistory = historyIndex < history.length - 1
            ? history.slice(0, historyIndex + 1)
            : history;

          set({
            board: newBoard,
            history: [...newHistory, move],
            historyIndex: newHistory.length,
            selectedCell: { row: r, col: c },
            highlightedNumber: hintValue,
            hintsUsed: hintsUsed + 1,
          });

          return;
        }
      }
    }
  },

  updateElapsedTime: (time: number) => {
    set({ elapsedTime: time });
  },
}),
    {
      name: 'sudoku-game-storage',
      // Only persist the fields we need
      partialize: (state) => ({
        puzzle: state.puzzle,
        solution: state.solution,
        board: state.board,
        // Convert Sets to Arrays for serialization
        pencilMarks: state.pencilMarks.map((row) =>
          row.map((cell) => Array.from(cell))
        ),
        initialCells: state.initialCells,
        difficulty: state.difficulty,
        selectedCell: state.selectedCell,
        highlightedNumber: state.highlightedNumber,
        isPaused: state.isPaused,
        isComplete: state.isComplete,
        hintsUsed: state.hintsUsed,
        history: state.history,
        historyIndex: state.historyIndex,
        startTime: state.startTime,
        elapsedTime: state.elapsedTime,
      }),
      // Convert Arrays back to Sets when hydrating
      onRehydrateStorage: () => (state) => {
        if (state && state.pencilMarks) {
          state.pencilMarks = state.pencilMarks.map((row: any) =>
            row.map((cell: number[]) => new Set(cell))
          );
        }
      },
    }
  )
);
