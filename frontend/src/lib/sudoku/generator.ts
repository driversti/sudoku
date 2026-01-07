import type { Board, Puzzle, Difficulty } from '../../types/sudoku';
import { solveSudoku, copyBoard, countSolutions, isValidPlacement } from './solver';

/**
 * Create an empty 9x9 board
 */
function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(null));
}

/**
 * Fill a board with a valid complete Sudoku solution
 */
function generateCompleteSolution(): Board {
  const board = createEmptyBoard();

  // Fill diagonal 3x3 boxes first (independent of each other)
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box);
  }

  // Solve the rest
  solveSudoku(board);

  return board;
}

/**
 * Fill a 3x3 box with random numbers 1-9
 */
function fillBox(board: Board, startRow: number, startCol: number): void {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(nums);

  let index = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      board[startRow + r][startCol + c] = nums[index++];
    }
  }
}

/**
 * Shuffle array in place
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Get number of cells to reveal based on difficulty
 */
function getCellsToReveal(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'EASY':
      return randomBetween(36, 40); // 36-40 revealed
    case 'MEDIUM':
      return randomBetween(30, 34); // 30-34 revealed
    case 'HARD':
      return randomBetween(24, 29); // 24-29 revealed
    case 'EXPERT':
      return randomBetween(17, 23); // 17-23 revealed
    default:
      return 30;
  }
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a puzzle by removing cells from a complete solution
 * Ensures the puzzle has a unique solution
 */
function createPuzzleFromSolution(solution: Board, cellsToKeep: number): Board {
  const puzzle = copyBoard(solution);
  const totalCells = 81;
  const cellsToRemove = totalCells - cellsToKeep;

  // Get all cell positions and shuffle them
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  shuffleArray(positions);

  // Remove cells while ensuring unique solution
  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) {
      break;
    }

    const backup = puzzle[row][col];
    puzzle[row][col] = null;

    // Check if puzzle still has unique solution
    const testBoard = copyBoard(puzzle);
    if (countSolutions(testBoard, 2) === 1) {
      removed++;
    } else {
      // Revert the removal
      puzzle[row][col] = backup;
    }
  }

  return puzzle;
}

/**
 * Generate a new Sudoku puzzle
 */
export function generatePuzzle(difficulty: Difficulty, seed?: string): Puzzle {
  // If seed is provided, use it for random (simple implementation)
  // In production, you'd use a proper seeded RNG
  if (seed) {
    // Simple seed-based random (not cryptographically secure)
    let seedNum = 0;
    for (let i = 0; i < seed.length; i++) {
      seedNum += seed.charCodeAt(i);
    }
    Math.random = () => {
      seedNum = (seedNum * 9301 + 49297) % 233280;
      return seedNum / 233280;
    };
  }

  const solution = generateCompleteSolution();
  const cellsToKeep = getCellsToReveal(difficulty);
  const initial = createPuzzleFromSolution(solution, cellsToKeep);

  return {
    initial,
    solution,
    difficulty,
    seed,
  };
}

/**
 * Check if a board is completely filled and valid
 */
export function isBoardComplete(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if the current board matches the solution
 */
export function checkSolution(board: Board, solution: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Get all pencil mark candidates for a cell
 */
export function getCandidates(board: Board, row: number, col: number): number[] {
  if (board[row][col] !== null) {
    return [];
  }

  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
}
