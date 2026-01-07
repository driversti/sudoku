import type { Board } from '../../types/sudoku';

/**
 * Check if placing a number at a position is valid
 */
export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Find an empty cell (returns null if board is full)
 */
function findEmptyCell(board: Board): [number, number] | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === null) {
        return [r, c];
      }
    }
  }
  return null;
}

/**
 * Solve Sudoku using backtracking algorithm
 * Returns true if solvable, false otherwise
 * Modifies the board in place with the solution
 */
export function solveSudoku(board: Board): boolean {
  const emptyCell = findEmptyCell(board);

  // No empty cell means puzzle is solved
  if (!emptyCell) {
    return true;
  }

  const [row, col] = emptyCell;

  // Try numbers 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;

      if (solveSudoku(board)) {
        return true;
      }

      // Backtrack
      board[row][col] = null;
    }
  }

  return false;
}

/**
 * Create a deep copy of a board
 */
export function copyBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/**
 * Count the number of solutions for a given board
 * (used to verify unique solution)
 */
export function countSolutions(board: Board, limit = 2): number {
  const emptyCell = findEmptyCell(board);

  if (!emptyCell) {
    return 1; // Found a solution
  }

  const [row, col] = emptyCell;
  let count = 0;

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      count += countSolutions(board, limit - count);
      board[row][col] = null;

      if (count >= limit) {
        return count;
      }
    }
  }

  return count;
}
