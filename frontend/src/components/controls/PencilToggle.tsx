import { useState } from 'react';
import { useTheme } from '../layout/ThemeProvider';
import { useGameStore } from '../../stores/gameStore';

export function PencilToggle() {
  const { colors } = useTheme();
  const [isPencilMode, setIsPencilMode] = useState(false);
  const { isPaused, isComplete } = useGameStore();

  const togglePencilMode = () => {
    setIsPencilMode(!isPencilMode);
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    backgroundColor: isPencilMode ? colors.primary : colors.surface,
    color: isPencilMode ? 'white' : colors.text,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  return (
    <button
      onClick={togglePencilMode}
      style={buttonStyle}
      disabled={isPaused || isComplete}
      title="Toggle pencil marks mode"
      onMouseEnter={(e) => {
        if (!isPencilMode) {
          e.currentTarget.style.backgroundColor = colors.primaryHover;
          e.currentTarget.style.color = colors.surface;
        }
      }}
      onMouseLeave={(e) => {
        if (!isPencilMode) {
          e.currentTarget.style.backgroundColor = colors.surface;
          e.currentTarget.style.color = colors.text;
        }
      }}
    >
      <span>✏️</span>
      <span>Pencil</span>
      {isPencilMode && <span>(ON)</span>}
    </button>
  );
}
