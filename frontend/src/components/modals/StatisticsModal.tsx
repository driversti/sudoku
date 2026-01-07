import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/layout/ThemeProvider';
import { getStats } from '@/lib/storage/gameStorage';
import type { Difficulty } from '@/types';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatTime(ms: number): string {
  if (ms === 0) return '--:--';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

export function StatisticsModal({ isOpen, onClose }: StatisticsModalProps) {
  const { colors } = useTheme();
  const [stats, setStats] = useState<Record<Difficulty, any>>({
    EASY: { gamesPlayed: 0, gamesWon: 0, bestTime: 0, winRate: 0 },
    MEDIUM: { gamesPlayed: 0, gamesWon: 0, bestTime: 0, winRate: 0 },
    HARD: { gamesPlayed: 0, gamesWon: 0, bestTime: 0, winRate: 0 },
    EXPERT: { gamesPlayed: 0, gamesWon: 0, bestTime: 0, winRate: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getStats().then(setStats).finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  // Calculate overall stats
  const totalGames = Object.values(stats).reduce((sum, s) => sum + s.gamesPlayed, 0);
  const totalWins = Object.values(stats).reduce((sum, s) => sum + s.gamesWon, 0);
  const overallWinRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

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
          Statistics
        </h2>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: colors.textSecondary }}>
              Loading statistics...
            </div>
          ) : (
            <>
              {/* Overall Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px',
              }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  backgroundColor: colors.background,
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary }}>
                    {totalGames}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Games Played</div>
                </div>
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  backgroundColor: colors.background,
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary }}>
                    {totalWins}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Games Won</div>
                </div>
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  backgroundColor: colors.background,
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary }}>
                    {overallWinRate}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>Win Rate</div>
                </div>
              </div>

              {/* Per-Difficulty Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {DIFFICULTIES.map((difficulty) => {
                  const stat = stats[difficulty];
                  return (
                    <div
                      key={difficulty}
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        backgroundColor: colors.background,
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}>
                        <span style={{ fontWeight: '600', color: colors.text }}>
                          {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                          {stat.gamesWon} / {stat.gamesPlayed} won
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        fontSize: '0.875rem',
                      }}>
                        <div>
                          <span style={{ color: colors.textSecondary }}>Win Rate: </span>
                          <span style={{ fontWeight: '600', color: colors.text }}>
                            {stat.winRate}%
                          </span>
                        </div>
                        <div>
                          <span style={{ color: colors.textSecondary }}>Best Time: </span>
                          <span style={{ fontWeight: '600', color: colors.text }}>
                            {formatTime(stat.bestTime)}
                          </span>
                        </div>
                      </div>

                      {/* Win Rate Bar */}
                      <div style={{
                        marginTop: '8px',
                        height: '8px',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        backgroundColor: colors.border,
                      }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${stat.winRate}%`,
                            backgroundColor: colors.primary,
                            transition: 'all 500ms',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Close Button */}
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
          Close
        </button>
      </motion.div>
    </div>,
    document.body
  );
}
