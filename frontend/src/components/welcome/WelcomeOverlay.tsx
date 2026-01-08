import { motion } from 'framer-motion';
import { useTheme } from '../layout/ThemeProvider';

interface WelcomeOverlayProps {
  onStart: () => void;
}

export function WelcomeOverlay({ onStart }: WelcomeOverlayProps) {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: colors.text,
        margin: 0,
      }}>
        Sudoku
      </h1>
      <p style={{
        fontSize: '1.125rem',
        color: colors.textSecondary,
        margin: 0,
      }}>
        Challenge your mind with the classic logic puzzle
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        style={{
          padding: '16px 48px',
          fontSize: '1.25rem',
          fontWeight: '600',
          borderRadius: '12px',
          backgroundColor: colors.primary,
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
        }}
      >
        Start Game
      </motion.button>
    </motion.div>
  );
}
