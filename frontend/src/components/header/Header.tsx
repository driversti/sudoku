import { useGameStore } from '../../stores/gameStore';
import { useTimer } from '../../hooks/useTimer';
import { useTheme } from '../layout/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onLoginClick: () => void;
  onLeaderboardClick: () => void;
  onSettingsClick: () => void;
  onStatsClick: () => void;
  onHelpClick: () => void;
}

export function Header({ onLoginClick, onLeaderboardClick, onSettingsClick, onStatsClick, onHelpClick }: HeaderProps) {
  const { elapsedTime, isPaused, isComplete, updateElapsedTime } = useGameStore();
  const { formatTime } = useTimer({ isPaused, isComplete, onTick: updateElapsedTime });
  const { colors, theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: colors.text }}>Sudoku</h1>
        <button
          onClick={onHelpClick}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: colors.background,
            color: colors.textSecondary,
            cursor: 'pointer',
            fontSize: '1.25rem',
            lineHeight: 1,
          }}
          title="How to Play"
        >
          ?
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            fontFamily: 'monospace',
            padding: '8px 16px',
            backgroundColor: colors.background,
            borderRadius: '8px',
            color: colors.text,
          }}
        >
          {formatTime(elapsedTime)}
        </div>

        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: colors.background,
            color: colors.text,
            cursor: 'pointer',
            fontSize: '1.25rem',
            transition: 'transform 0.2s',
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button
          onClick={onStatsClick}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: colors.background,
            color: colors.text,
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          title="Statistics"
        >
          📊
        </button>

        <button
          onClick={onLeaderboardClick}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: colors.background,
            color: colors.text,
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          🏆 Leaderboard
        </button>

        <button
          onClick={onSettingsClick}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: colors.background,
            color: colors.text,
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          title="Settings"
        >
          ⚙️
        </button>

        {isAuthenticated && user ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.875rem',
                color: colors.text,
              }}
            >
              {user.username}
            </span>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: colors.border,
                color: colors.text,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: colors.primary,
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
