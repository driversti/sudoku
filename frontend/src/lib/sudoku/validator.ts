import type { Board, Position } from '../../types/sudoku';
import { isValidPlacement } from './solver';
import { checkSolution, isBoardComplete } from './generator';

/**
 * Conflict types for validation
 */
export type ConflictType = 'row' | 'column' | 'box' | 'none';

/**
 * Result of validation
 */
export interface ValidationResult {
  hasConflict: boolean;
  conflictType: ConflictType;
  conflictingCells: Position[];
}

/**
 * Check if a value has conflicts in the current board
 * (excluding the cell at the position being checked)
 */
export function findConflicts(
  board: Board,
  row: number,
  col: number,
  value: number
): ValidationResult {
  const conflicts: Position[] = [];
  let conflictType: ConflictType = 'none';

  // Check row for conflicts
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) {
      conflicts.push({ row, col: c });
      conflictType = 'row';
    }
  }

  // Check column for conflicts
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) {
      conflicts.push({ row: r, col });
      conflictType = conflictType === 'none' ? 'column' : conflictType;
    }
  }

  // Check 3x3 box for conflicts
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        conflicts.push({ row: r, col: c });
        conflictType = conflictType === 'none' ? 'box' : conflictType;
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflictType,
    conflictingCells: conflicts,
  };
}

/**
 * Get all cells with conflicts on the board
 */
export function getAllConflicts(board: Board): Set<string> {
  const conflicts = new Set<string>();

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = board[r][c];
      if (value === null) continue;

      const result = findConflicts(board, r, c, value);
      if (result.hasConflict) {
        conflicts.add(`${r},${c}`);
        result.conflictingCells.forEach((pos) => {
          conflicts.add(`${pos.row},${pos.col}`);
        });
      }
    }
  }

  return conflicts;
}

/**
 * Check if a move is valid (no conflicts)
 */
export function isValidMove(
  board: Board,
  row: number,
  col: number,
  value: number
): boolean {
  // Temporarily remove the value at the position
  const originalValue = board[row][col];
  board[row][col] = null;

  const valid = isValidPlacement(board, row, col, value);

  // Restore the original value
  board[row][col] = originalValue;

  return valid;
}

/**
 * Check if the game is won
 */
export function checkWin(board: Board, solution: Board): boolean {
  return isBoardComplete(board) && checkSolution(board, solution);
}

/**
 * Check if a pencil mark is valid for a cell
 */
export function isValidPencilMark(
  board: Board,
  row: number,
  col: number,
  value: number
): boolean {
  return isValidPlacement(board, row, col, value);
}

/**
 * Get all related cells (same row, column, or box)
 * Used for highlighting
 */
export function getRelatedCells(row: number, col: number): Position[] {
  const related = new Set<string>();

  // Add all cells in the same row
  for (let c = 0; c < 9; c++) {
    related.add(`${row},${c}`);
  }

  // Add all cells in the same column
  for (let r = 0; r < 9; r++) {
    related.add(`${r},${col}`);
  }

  // Add all cells in the same 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      related.add(`${r},${c}`);
    }
  }

  return Array.from(related).map((pos) => {
    const [r, c] = pos.split(',').map(Number);
    return { row: r, col: c };
  });
}

/**
 * Get all cells with a specific number
 * Used for highlighting same numbers
 */
export function getCelsWithNumber(board: Board, number: number): Position[] {
  const cells: Position[] = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === number) {
        cells.push({ row: r, col: c });
      }
    }
  }

  return cells;
}
