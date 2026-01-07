import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../layout/ThemeProvider';
import { useGameStore } from '../../stores/gameStore';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { submitScore } from '@/lib/api/leaderboard';
import type { SubmitScoreRequest } from '@/types';

export function GameWon() {
  const { colors } = useTheme();
  const { isComplete, elapsedTime, difficulty, newGame, history, hintsUsed } = useGameStore();
  const { isAuthenticated, user } = useAuth();
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const submitScoreMutation = useMutation({
    mutationFn: (data: SubmitScoreRequest) => submitScore(data),
    onSuccess: () => setScoreSubmitted(true),
  });

  useEffect(() => {
    if (isComplete && isAuthenticated && user && !scoreSubmitted) {
      const timeSeconds = Math.floor(elapsedTime / 1000);
      const moves = history.filter((move) => move.value !== null).length;

      submitScoreMutation.mutate({
        difficulty,
        timeSeconds,
        moves,
        hintsUsed,
      });
    }
  }, [isComplete, isAuthenticated, user, scoreSubmitted]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const handleNewGame = () => {
    newGame(difficulty);
  };

  const moves = history.filter((move) => move.value !== null).length;

  if (!isComplete) return null;

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
        onClick={() => {}}
      />

      <motion.div
        style={{
          position: 'relative',
          backgroundColor: colors.surface,
          borderRadius: '16px',
          padding: '32px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
              color: colors.text,
            }}
          >
            Congratulations!
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: colors.textSecondary,
              margin: '0 0 24px 0',
            }}
          >
            You completed the puzzle!
          </p>

          <div
            style={{
              backgroundColor: colors.background,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ color: colors.textSecondary }}>Difficulty</span>
              <span style={{ fontWeight: '600', color: colors.text }}>
                {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ color: colors.textSecondary }}>Time</span>
              <span style={{ fontWeight: '600', color: colors.text }}>
                {formatTime(elapsedTime)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ color: colors.textSecondary }}>Moves</span>
              <span style={{ fontWeight: '600', color: colors.text }}>{moves}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ color: colors.textSecondary }}>Hints Used</span>
              <span style={{ fontWeight: '600', color: colors.text }}>{hintsUsed}</span>
            </div>
          </div>

          {isAuthenticated && scoreSubmitted && (
            <div
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              Score submitted to leaderboard!
            </div>
          )}

          {!isAuthenticated && (
            <div
              style={{
                backgroundColor: colors.border,
                color: colors.text,
                padding: '8px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              Login to save your score to the leaderboard
            </div>
          )}

          <button
            onClick={handleNewGame}
            style={{
              width: '100%',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: colors.primary,
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
            }}
          >
            New Game
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
