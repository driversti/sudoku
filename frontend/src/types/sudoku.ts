export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export type CellValue = number | null;

export type Board = CellValue[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  position: Position;
  value: CellValue;
  previousValue: CellValue;
  isPencilMark?: boolean;
  timestamp: number;
}

export interface Puzzle {
  initial: Board;
  solution: Board;
  difficulty: Difficulty;
  seed?: string;
}
