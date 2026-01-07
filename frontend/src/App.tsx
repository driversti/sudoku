import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { MainLayout } from './components/layout/MainLayout';
import { Header } from './components/header/Header';
import { Board } from './components/board/Board';
import { NumberPad } from './components/controls/NumberPad';
import { DifficultySelect } from './components/controls/DifficultySelect';
import { ActionButtons } from './components/controls/ActionButtons';
import { PencilToggle } from './components/controls/PencilToggle';
import { GameWon } from './components/modals/GameWon';
import { LoginModal } from './components/modals/LoginModal';
import { RegisterModal } from './components/modals/RegisterModal';
import { LeaderboardModal } from './components/modals/LeaderboardModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { StatisticsModal } from './components/modals/StatisticsModal';
import { HowToPlayModal } from './components/modals/HowToPlayModal';
import { AuthProvider } from './contexts/AuthContext';
import { useGameStore } from './stores/gameStore';
import { useKeyboard } from './hooks/useKeyboard';
import { usePersistence } from './hooks/usePersistence';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface GameProps {
  onLoginClick: () => void;
  onLeaderboardClick: () => void;
  onSettingsClick: () => void;
  onStatsClick: () => void;
  onHelpClick: () => void;
}

function Game({ onLoginClick, onLeaderboardClick, onSettingsClick, onStatsClick, onHelpClick }: GameProps) {
  const { newGame } = useGameStore();
  useKeyboard();
  usePersistence();

  useEffect(() => {
    // Start a new game on mount
    newGame('MEDIUM');
  }, [newGame]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <Header
        onLoginClick={onLoginClick}
        onLeaderboardClick={onLeaderboardClick}
        onSettingsClick={onSettingsClick}
        onStatsClick={onStatsClick}
        onHelpClick={onHelpClick}
      />
      <DifficultySelect />
      <Board />
      <ActionButtons />
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <PencilToggle />
      </div>
      <NumberPad />
      <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)', fontSize: '0.875rem' }}>
        Arrow keys to navigate • Numbers 1-9 to fill • Delete/Backspace to clear • Ctrl+Z/Y to undo/redo
      </div>
      <GameWon />
    </div>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <MainLayout>
            <Game
              onLoginClick={() => setShowLogin(true)}
              onLeaderboardClick={() => setShowLeaderboard(true)}
              onSettingsClick={() => setShowSettings(true)}
              onStatsClick={() => setShowStats(true)}
              onHelpClick={() => setShowHelp(true)}
            />
          </MainLayout>

          <LoginModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />

          <RegisterModal
            isOpen={showRegister}
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />

          <LeaderboardModal
            isOpen={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
          />

          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />

          <StatisticsModal
            isOpen={showStats}
            onClose={() => setShowStats(false)}
          />

          <HowToPlayModal
            isOpen={showHelp}
            onClose={() => setShowHelp(false)}
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
