import { motion } from 'framer-motion';
import { useTheme } from '@/components/layout/ThemeProvider';
import { createPortal } from 'react-dom';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  const { colors } = useTheme();

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
      />

      <motion.div
        style={{
          position: 'relative',
          backgroundColor: colors.surface,
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '512px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: colors.text }}>
          How to Play Sudoku
        </h2>

        <div style={{ flex: 1, overflow: 'auto', color: colors.text }}>
          <section style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px', color: colors.primary }}>
              Objective
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.625', color: colors.textSecondary }}>
              Fill the 9×9 grid so that each row, column, and 3×3 box contains all digits from 1 to 9.
              No digit can repeat in any row, column, or box.
            </p>
          </section>

          <section style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px', color: colors.primary }}>
              Controls
            </h3>
            <ul style={{ fontSize: '0.875rem', color: colors.textSecondary, listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><strong>Mouse/Touch:</strong> Click a cell to select it, then click a number or use the keyboard.</li>
              <li style={{ marginBottom: '8px' }}><strong>Arrow Keys:</strong> Navigate between cells</li>
              <li style={{ marginBottom: '8px' }}><strong>Number Keys (1-9):</strong> Fill the selected cell with a number</li>
              <li style={{ marginBottom: '8px' }}><strong>Delete/Backspace:</strong> Clear the selected cell</li>
              <li style={{ marginBottom: '8px' }}><strong>Ctrl+Z:</strong> Undo last move</li>
              <li><strong>Ctrl+Y:</strong> Redo last move</li>
            </ul>
          </section>

          <section style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px', color: colors.primary }}>
              Features
            </h3>
            <ul style={{ fontSize: '0.875rem', color: colors.textSecondary, listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><strong>Pencil Marks:</strong> Toggle pencil mode to add small candidate numbers in empty cells</li>
              <li style={{ marginBottom: '8px' }}><strong>Hints:</strong> Use the hint button to reveal one correct cell</li>
              <li style={{ marginBottom: '8px' }}><strong>Undo/Redo:</strong> Navigate through your move history</li>
              <li style={{ marginBottom: '8px' }}><strong>Timer:</strong> Track your solving time</li>
              <li><strong>Auto-save:</strong> Your progress is saved automatically</li>
            </ul>
          </section>

          <section style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px', color: colors.primary }}>
              Difficulty Levels
            </h3>
            <ul style={{ fontSize: '0.875rem', color: colors.textSecondary, listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '4px' }}><strong>Easy:</strong> More cells revealed, great for beginners</li>
              <li style={{ marginBottom: '4px' }}><strong>Medium:</strong> Balanced challenge for casual players</li>
              <li style={{ marginBottom: '4px' }}><strong>Hard:</strong> Fewer cells revealed, requires logical thinking</li>
              <li><strong>Expert:</strong> Maximum challenge with minimal clues</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px', color: colors.primary }}>
              Tips
            </h3>
            <ul style={{ fontSize: '0.875rem', color: colors.textSecondary, listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>• Look for rows, columns, or boxes with only a few empty cells</li>
              <li style={{ marginBottom: '8px' }}>• Use pencil marks to note down possible candidates</li>
              <li style={{ marginBottom: '8px' }}>• Check for "naked singles" - cells that can only be one number</li>
              <li style={{ marginBottom: '8px' }}>• Look for "hidden singles" - numbers that can only go in one cell in a row/column/box</li>
              <li>• Use the highlighting feature to see all instances of a number</li>
            </ul>
          </section>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '16px',
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: colors.primary,
            color: 'white',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Got it!
        </button>
      </motion.div>
    </div>,
    document.body
  );
}
