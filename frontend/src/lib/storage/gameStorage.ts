import { db, type SavedGame } from './db';
import type { GameState, Difficulty, CellValue, Move } from '@/types';

// Type for loaded game with proper types
export interface LoadedGame extends Omit<SavedGame, 'board' | 'solution' | 'puzzle' | 'pencilMarks' | 'history'> {
  board: CellValue[][];
  solution: CellValue[][];
  puzzle: CellValue[][];
  pencilMarks: Set<number>[][];
  history: Move[];
}

// Serialize Move array to string
function serializeHistory(history: Move[]): string {
  return JSON.stringify(history);
}

// Deserialize Move array
function deserializeHistory(historyStr: string): Move[] {
  return JSON.parse(historyStr);
}

// Serialize Set<number>[][] to string[][]
function serializePencilMarks(pencilMarks: Set<number>[][]): string[][] {
  return pencilMarks.map(row =>
    row.map(cell => JSON.stringify(Array.from(cell)))
  );
}

// Deserialize string[][] to Set<number>[][]
function deserializePencilMarks(pencilMarksStr: string[][]): Set<number>[][] {
  return pencilMarksStr.map(row =>
    row.map(cell => new Set(JSON.parse(cell)))
  );
}

// Convert Board (CellValue[][]) to number[][] for storage
function convertBoardToStorage(board: CellValue[][]): number[][] {
  return board.map(row => row.map(cell => cell === null ? 0 : cell));
}

// Convert number[][] to Board (CellValue[][]) for use
function convertBoardFromStorage(board: number[][]): CellValue[][] {
  return board.map(row => row.map(cell => cell === 0 ? null : cell));
}

export async function saveCurrentGame(state: GameState): Promise<number> {
  const savedGame: SavedGame = {
    board: convertBoardToStorage(state.board),
    solution: convertBoardToStorage(state.solution),
    puzzle: convertBoardToStorage(state.puzzle),
    pencilMarks: serializePencilMarks(state.pencilMarks),
    initialCells: state.initialCells,
    difficulty: state.difficulty,
    selectedCell: state.selectedCell,
    highlightedNumber: state.highlightedNumber,
    isPaused: state.isPaused,
    isComplete: state.isComplete,
    hintsUsed: state.hintsUsed,
    history: serializeHistory(state.history),
    historyIndex: state.historyIndex,
    startTime: state.startTime,
    elapsedTime: state.elapsedTime,
    savedAt: Date.now(),
  };

  // Delete any existing saved game and add new one
  await db.savedGames.where('isComplete').equals(0).delete();
  return await db.savedGames.add(savedGame);
}

export async function loadSavedGame(): Promise<LoadedGame | undefined> {
  const games = await db.savedGames.where('isComplete').equals(0).reverse().sortBy('savedAt');
  if (games.length > 0) {
    const game = games[0];
    return {
      ...game,
      board: convertBoardFromStorage(game.board),
      solution: convertBoardFromStorage(game.solution),
      puzzle: convertBoardFromStorage(game.puzzle),
      pencilMarks: deserializePencilMarks(game.pencilMarks),
      history: deserializeHistory(game.history),
    };
  }
  return undefined;
}

export async function deleteSavedGame(): Promise<void> {
  await db.savedGames.where('isComplete').equals(0).delete();
}

export async function hasSavedGame(): Promise<boolean> {
  const count = await db.savedGames.where('isComplete').equals(0).count();
  return count > 0;
}

// Stats functions
export async function updateStats(
  difficulty: Difficulty,
  won: boolean,
  timeMs: number,
  moves: number,
  hints: number
): Promise<void> {
  const existing = await db.gameStats.where('difficulty').equals(difficulty).first();

  if (existing) {
    await db.gameStats.update(existing.id!, {
      gamesPlayed: existing.gamesPlayed + 1,
      gamesWon: won ? existing.gamesWon + 1 : existing.gamesWon,
      bestTime: won && (existing.bestTime === 0 || timeMs < existing.bestTime) ? timeMs : existing.bestTime,
      totalMoves: existing.totalMoves + moves,
      totalHints: existing.totalHints + hints,
      lastPlayedAt: Date.now(),
    });
  } else {
    await db.gameStats.add({
      difficulty,
      gamesPlayed: 1,
      gamesWon: won ? 1 : 0,
      bestTime: won ? timeMs : 0,
      totalMoves: moves,
      totalHints: hints,
      lastPlayedAt: Date.now(),
    });
  }
}

export async function getStats(): Promise<Record<Difficulty, any>> {
  const allStats = await db.gameStats.toArray();
  const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
  const stats: any = {};

  for (const diff of difficulties) {
    const stat = allStats.find(s => s.difficulty === diff);
    stats[diff] = stat || {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTime: 0,
      totalMoves: 0,
      totalHints: 0,
      winRate: 0,
    };
    // Calculate win rate
    if (stats[diff].gamesPlayed > 0) {
      stats[diff].winRate = Math.round((stats[diff].gamesWon / stats[diff].gamesPlayed) * 100);
    }
  }

  return stats;
}
