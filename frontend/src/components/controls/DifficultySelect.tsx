import type { Difficulty } from '../../types/sudoku';
import { useTheme } from '../layout/ThemeProvider';
import { useGameStore } from '../../stores/gameStore';

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
  { value: 'EXPERT', label: 'Expert' },
];

export function DifficultySelect() {
  const { colors } = useTheme();
  const { difficulty, newGame } = useGameStore();

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as Difficulty;
    newGame(newDifficulty);
  };

  const handleNewGame = () => {
    newGame(difficulty);
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '1rem',
    fontWeight: '500',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    backgroundColor: colors.surface,
    color: colors.text,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '1rem',
    fontWeight: '500',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    backgroundColor: colors.primary,
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <select
        value={difficulty}
        onChange={handleDifficultyChange}
        style={selectStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.border;
        }}
      >
        {DIFFICULTIES.map((diff) => (
          <option key={diff.value} value={diff.value}>
            {diff.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleNewGame}
        style={buttonStyle}
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
  );
}
