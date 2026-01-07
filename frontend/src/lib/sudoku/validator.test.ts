import { describe, it, expect } from 'vitest';
import { findConflicts, getRelatedCells, getCelsWithNumber } from '@/lib/sudoku/validator';
import type { Board } from '@/types';

describe('Sudoku Validator', () => {
  const createBoard = (): Board => [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8],
  ];

  describe('findConflicts', () => {
    it('should return empty array when no conflicts', () => {
      const conflicts = findConflicts(createBoard(), 0, 0, 1);
      expect(conflicts).toEqual([]);
    });

    it('should return conflicts in row', () => {
      const board = createBoard();
      board[0][3] = 1; // Duplicate 1 in row

      const conflicts = findConflicts(board, 0, 3, 1);
      expect(conflicts).toContainEqual({ row: 0, col: 0 });
      expect(conflicts).toContainEqual({ row: 0, col: 3 });
    });

    it('should return conflicts in column', () => {
      const board = createBoard();
      board[3][0] = 1; // Duplicate 1 in column

      const conflicts = findConflicts(board, 3, 0, 1);
      expect(conflicts).toContainEqual({ row: 0, col: 0 });
      expect(conflicts).toContainEqual({ row: 3, col: 0 });
    });

    it('should return conflicts in 3x3 box', () => {
      const board = createBoard();
      board[1][1] = 1; // Duplicate 1 in top-left box

      const conflicts = findConflicts(board, 1, 1, 1);
      expect(conflicts).toContainEqual({ row: 0, col: 0 });
      expect(conflicts).toContainEqual({ row: 1, col: 1 });
    });
  });

  describe('getRelatedCells', () => {
    it('should return all cells in the same row', () => {
      const cells = getRelatedCells(0, 0);
      const row0Cells = cells.filter(c => c.row === 0);
      expect(row0Cells).toHaveLength(9);
    });

    it('should return all cells in the same column', () => {
      const cells = getRelatedCells(0, 0);
      const col0Cells = cells.filter(c => c.col === 0);
      expect(col0Cells).toHaveLength(9);
    });

    it('should return all cells in the same 3x3 box', () => {
      const cells = getRelatedCells(0, 0);
      const topLeftBoxCells = cells.filter(c => c.row < 3 && c.col < 3);

      // Should have 9 cells in the box, minus the center cell counted twice
      expect(topLeftBoxCells.length).toBeGreaterThanOrEqual(9);
    });

    it('should not include the cell itself', () => {
      const cells = getRelatedCells(0, 0);
      expect(cells).not.toContainEqual({ row: 0, col: 0 });
    });
  });

  describe('getCelsWithNumber', () => {
    it('should return all cells containing a specific number', () => {
      const board = createBoard();
      const cells = getCelsWithNumber(board, 5);

      expect(cells).toHaveLength(9);
      cells.forEach((cell) => {
        expect(board[cell.row][cell.col]).toBe(5);
      });
    });

    it('should return empty array for number not on board', () => {
      const board = createBoard();
      const cells = getCelsWithNumber(board, 0); // 0 means empty in this case

      expect(cells).toHaveLength(0);
    });
  });
});
