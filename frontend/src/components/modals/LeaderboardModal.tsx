import { useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/components/layout/ThemeProvider';
import { getLeaderboard } from '@/lib/api/leaderboard';
import type { Difficulty, LeaderboardEntry } from '@/types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const { colors } = useTheme();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('EASY');

  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ['leaderboard', selectedDifficulty],
    queryFn: () => getLeaderboard(selectedDifficulty),
    enabled: isOpen,
  });

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
          maxWidth: '672px',
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: colors.text }}>Leaderboard</h2>

            {/* Difficulty Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {DIFFICULTIES.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: selectedDifficulty === difficulty ? colors.primary : colors.border,
                    color: selectedDifficulty === difficulty ? '#fff' : colors.text,
                  }}
                >
                  {difficulty}
                </button>
              ))}
            </div>

            {/* Leaderboard Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {isLoading && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: colors.text }}>
                  Loading...
                </div>
              )}

              {error && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#ef4444' }}>
                  Failed to load leaderboard
                </div>
              )}

              {leaderboard && (
                <div>
                  {/* Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                    padding: '8px 16px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: colors.text,
                    borderBottom: `1px solid ${colors.border}`,
                  }}>
                    <div>Rank</div>
                    <div>Username</div>
                    <div style={{ textAlign: 'right' }}>Time</div>
                    <div style={{ textAlign: 'right' }}>Moves</div>
                    <div style={{ textAlign: 'right' }}>Hints</div>
                  </div>

                  {/* Entries */}
                  {leaderboard.entries.map((entry: LeaderboardEntry) => (
                    <div
                      key={entry.rank}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        backgroundColor: entry.isCurrentUser ? colors.cellSelected : 'transparent',
                        color: colors.text,
                      }}
                    >
                      <div style={{ fontWeight: '600' }}>#{entry.rank}</div>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.username}</div>
                      <div style={{ textAlign: 'right' }}>{formatTime(entry.timeSeconds)}</div>
                      <div style={{ textAlign: 'right' }}>{entry.moves}</div>
                      <div style={{ textAlign: 'right' }}>{entry.hintsUsed}</div>
                    </div>
                  ))}

                  {leaderboard.entries.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: colors.text }}>
                      No scores yet. Be the first!
                    </div>
                  )}
                </div>
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
