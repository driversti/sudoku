import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useTheme } from '@/components/layout/ThemeProvider';
import type { Theme } from '@/lib/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES: { key: Theme; name: string; description: string }[] = [
  { key: 'light', name: 'Light', description: 'Clean and bright' },
  { key: 'dark', name: 'Dark', description: 'Easy on the eyes' },
  { key: 'sepia', name: 'Sepia', description: 'Classic warm tones' },
  { key: 'blue', name: 'Blue', description: 'High contrast blue' },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme, colors } = useTheme();

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
          maxWidth: '448px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Settings</h2>

            {/* Theme Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Theme</h3>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTheme(t.key)}
                    className="p-4 rounded-lg border-2 transition-all text-left"
                    style={{
                      backgroundColor: theme === t.key ? colors.primary : colors.background,
                      borderColor: theme === t.key ? colors.primary : colors.border,
                      color: theme === t.key ? '#fff' : colors.text,
                    }}
                  >
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs opacity-75">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Game Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Game</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg"
                     style={{ backgroundColor: colors.background }}>
                  <span style={{ color: colors.text }}>Auto-save games</span>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg"
                     style={{ backgroundColor: colors.background }}>
                  <span style={{ color: colors.text }}>Error highlighting</span>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>Coming soon</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg"
                     style={{ backgroundColor: colors.background }}>
                  <span style={{ color: colors.text }}>Sound effects</span>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>Coming soon</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
              <h3 className="text-sm font-semibold mb-1" style={{ color: colors.text }}>About</h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Sudoku Web - A modern, full-featured Sudoku game with daily challenges, leaderboards, and multiple themes.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
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
              Close
            </button>
          </motion.div>
        </div>,
    document.body
  );
}
