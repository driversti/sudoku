import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

/**
 * Keyboard navigation and input hook
 */
export function useKeyboard() {
  const { selectedCell, setCellValue, isPaused, isComplete, selectCell, undo, redo } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle undo/redo even when paused
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (!e.shiftKey) {
          undo();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        redo();
        return;
      }

      if (isPaused || isComplete) return;

      // Number keys (1-9)
      if (e.key >= '1' && e.key <= '9') {
        if (selectedCell) {
          e.preventDefault();
          const num = parseInt(e.key, 10);
          setCellValue(num);
        }
        return;
      }

      // Delete, Backspace, or 0 to clear
      if (e.key === 'Delete' || e.key === 'Backspace' || e.key === '0') {
        if (selectedCell) {
          e.preventDefault();
          setCellValue(null);
        }
        return;
      }

      // Arrow keys for navigation
      if (selectedCell) {
        let newRow = selectedCell.row;
        let newCol = selectedCell.col;

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            newRow = Math.max(0, selectedCell.row - 1);
            break;
          case 'ArrowDown':
            e.preventDefault();
            newRow = Math.min(8, selectedCell.row + 1);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            newCol = Math.max(0, selectedCell.col - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            newCol = Math.min(8, selectedCell.col + 1);
            break;
          default:
            return;
        }

        selectCell({ row: newRow, col: newCol });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, setCellValue, isPaused, isComplete, selectCell, undo, redo]);
}
