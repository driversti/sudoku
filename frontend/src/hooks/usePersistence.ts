import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { saveCurrentGame, loadSavedGame, hasSavedGame, deleteSavedGame, updateStats } from '@/lib/storage/gameStorage';
import type { Difficulty } from '@/types';

export function usePersistence() {
  const isLoading = useRef(false);
  const setState = useGameStore.setState;
  const {
    isComplete,
    elapsedTime,
    difficulty,
    hintsUsed,
    history,
  } = useGameStore();

  // Save game whenever state changes
  useEffect(() => {
    const saveGame = async () => {
      if (isLoading.current) return;
      const state = useGameStore.getState();

      // Only save in-progress games
      if (!state.isComplete) {
        await saveCurrentGame(state);
      }
    };

    // Debounce saves
    const timeoutId = setTimeout(saveGame, 1000);
    return () => clearTimeout(timeoutId);
  });

  // Update stats when game is won
  useEffect(() => {
    const updateGameStats = async () => {
      if (isComplete) {
        const moves = history.filter(m => m.value !== null).length;
        const timeMs = elapsedTime;
        await updateStats(difficulty, true, timeMs, moves, hintsUsed);
        await deleteSavedGame();
      }
    };

    updateGameStats();
  }, [isComplete, difficulty, elapsedTime, hintsUsed, history]);

  const restoreGame = useCallback(async () => {
    isLoading.current = true;
    const saved = await loadSavedGame();
    if (saved) {
      setState({
        ...saved,
        difficulty: saved.difficulty as Difficulty,
      });
    }
    isLoading.current = false;
  }, [setState]);

  const checkSavedGame = useCallback(async () => {
    return await hasSavedGame();
  }, []);

  const clearSavedGame = useCallback(async () => {
    await deleteSavedGame();
  }, []);

  return {
    restoreGame,
    hasSavedGame: checkSavedGame,
    clearSavedGame,
  };
}
