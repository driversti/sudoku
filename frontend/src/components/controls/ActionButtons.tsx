import { useTheme } from '../layout/ThemeProvider';
import { useGameStore } from '../../stores/gameStore';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  title: string;
}

function ActionButton({ onClick, disabled, children, title }: ActionButtonProps) {
  const { colors } = useTheme();

  const baseStyle: React.CSSProperties = {
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    backgroundColor: colors.surface,
    color: colors.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      title={title}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.primaryHover;
          e.currentTarget.style.color = colors.surface;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.surface;
        e.currentTarget.style.color = colors.text;
      }}
    >
      {children}
    </button>
  );
}

export function ActionButtons() {
  const { undo, redo, getHint, clearCell, history, historyIndex, selectedCell, isPaused, isComplete } = useGameStore();

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;
  const canClear = selectedCell !== null;
  const canGetHint = !isComplete;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <ActionButton
        onClick={undo}
        disabled={!canUndo || isPaused}
        title="Undo (Ctrl+Z)"
      >
        <span>↶</span>
        <span>Undo</span>
      </ActionButton>

      <ActionButton
        onClick={redo}
        disabled={!canRedo || isPaused}
        title="Redo (Ctrl+Y)"
      >
        <span>↷</span>
        <span>Redo</span>
      </ActionButton>

      <ActionButton
        onClick={clearCell}
        disabled={!canClear || isPaused || isComplete}
        title="Erase cell (Delete/Backspace)"
      >
        <span>⌫</span>
        <span>Erase</span>
      </ActionButton>

      <ActionButton
        onClick={getHint}
        disabled={!canGetHint || isPaused}
        title="Get a hint"
      >
        <span>💡</span>
        <span>Hint</span>
      </ActionButton>
    </div>
  );
}
