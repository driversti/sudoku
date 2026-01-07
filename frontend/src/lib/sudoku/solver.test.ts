import { describe, it, expect } from 'vitest';
import { solveSudoku, isValidPlacement } from '@/lib/sudoku/solver';
import type { Board } from '@/types';

describe('Sudoku Solver', () => {
  const createEmptyBoard = (): Board =>
    Array.from({ length: 9 }, () => Array(9).fill(null));

  describe('isValidPlacement', () => {
    it('should return true for a valid placement', () => {
      const board = createEmptyBoard();
      expect(isValidPlacement(board, 0, 0, 5)).toBe(true);
    });

    it('should return false if number exists in row', () => {
      const board = createEmptyBoard();
      board[0][0] = 5;
      expect(isValidPlacement(board, 0, 1, 5)).toBe(false);
    });

    it('should return false if number exists in column', () => {
      const board = createEmptyBoard();
      board[0][0] = 5;
      expect(isValidPlacement(board, 1, 0, 5)).toBe(false);
    });

    it('should return false if number exists in 3x3 box', () => {
      const board = createEmptyBoard();
      board[0][0] = 5;
      expect(isValidPlacement(board, 1, 1, 5)).toBe(false);
    });

    it('should return true for number in different row, column, and box', () => {
      const board = createEmptyBoard();
      board[0][0] = 5;
      expect(isValidPlacement(board, 4, 4, 5)).toBe(true);
    });
  });

  describe('solveSudoku', () => {
    it('should solve an empty board', () => {
      const board = createEmptyBoard();
      expect(solveSudoku(board)).toBe(true);

      // Verify the board is complete and valid
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(board[row][col]).not.toBeNull();
          expect(board[row][col]).toBeGreaterThanOrEqual(1);
          expect(board[row][col]).toBeLessThanOrEqual(9);
        }
      }
    });

    it('should solve a partially filled board', () => {
      const board = createEmptyBoard();
      board[0][0] = 1;
      board[0][1] = 2;
      board[0][2] = 3;
      board[1][0] = 4;
      board[1][1] = 5;
      board[1][2] = 6;
      board[2][0] = 7;
      board[2][1] = 8;
      board[2][2] = 9;

      expect(solveSudoku(board)).toBe(true);

      // Verify initial cells are unchanged
      expect(board[0][0]).toBe(1);
      expect(board[0][1]).toBe(2);
      expect(board[2][2]).toBe(9);
    });

    it('should return false for an invalid board', () => {
      const board = createEmptyBoard();
      board[0][0] = 1;
      board[0][1] = 1; // Duplicate in row

      expect(solveSudoku(board)).toBe(false);
    });
  });
});
