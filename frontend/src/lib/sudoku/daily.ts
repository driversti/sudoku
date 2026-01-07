import type { Puzzle, Difficulty } from '@/types';

// Simple seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    // Convert string seed to numeric seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    this.seed = Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Get integer between min (inclusive) and max (exclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }
}

// Generate daily seed from date and difficulty
export function generateDailySeed(date: Date, difficulty: Difficulty): string {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${dateStr}-${difficulty}`;
}

// Generate puzzle from seed
export function generateSeededPuzzle(seed: string, difficulty: Difficulty): Puzzle {
  const rng = new SeededRandom(seed);

  // Generate a complete valid solution using seeded random
  const solution: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSeededSudoku(solution, rng);

  // Determine how many cells to remove based on difficulty
  const cellsToRemove = getCellsToRemove(difficulty, rng);

  // Create initial puzzle by removing cells
  const initial = solution.map((row, r) =>
    row.map((cell, c) => {
      if (cellsToRemove.has(`${r}-${c}`)) {
        return 0;
      }
      return cell;
    })
  );

  return {
    initial,
    solution,
    difficulty,
    seed,
  };
}

// Get cells to remove based on difficulty
function getCellsToRemove(difficulty: Difficulty, rng: SeededRandom): Set<string> {
  const totalCells = 81;
  let revealed: number;

  switch (difficulty) {
    case 'EASY':
      revealed = rng.nextInt(36, 41);
      break;
    case 'MEDIUM':
      revealed = rng.nextInt(30, 35);
      break;
    case 'HARD':
      revealed = rng.nextInt(24, 30);
      break;
    case 'EXPERT':
      revealed = rng.nextInt(17, 24);
      break;
    default:
      revealed = 30;
  }

  const toRemove = totalCells - revealed;
  const cells = new Set<string>();

  while (cells.size < toRemove) {
    const row = rng.nextInt(0, 9);
    const col = rng.nextInt(0, 9);
    cells.add(`${row}-${col}`);
  }

  return cells;
}

// Solve Sudoku using seeded random for number selection
function solveSeededSudoku(board: number[][], rng: SeededRandom): boolean {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;

  // Try numbers in random order
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(numbers, rng);

  for (const num of numbers) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;

      if (solveSeededSudoku(board, rng)) {
        return true;
      }

      board[row][col] = 0;
    }
  }

  return false;
}

function findEmptyCell(board: number[][]): [number, number] | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        return [r, c];
      }
    }
  }
  return null;
}

function isValidPlacement(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

function shuffleArray<T>(array: T[], rng: SeededRandom): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Get today's daily challenge
export function getTodaysDailyChallenge(difficulty: Difficulty): Puzzle {
  const seed = generateDailySeed(new Date(), difficulty);
  return generateSeededPuzzle(seed, difficulty);
}

// Get daily challenge for specific date
export function getDailyChallenge(date: Date, difficulty: Difficulty): Puzzle {
  const seed = generateDailySeed(date, difficulty);
  return generateSeededPuzzle(seed, difficulty);
}
