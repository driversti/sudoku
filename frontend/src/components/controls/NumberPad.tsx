import { useTheme } from '../layout/ThemeProvider';
import { useGameStore } from '../../stores/gameStore';

export function NumberPad() {
  const { colors } = useTheme();
  const { setCellValue, selectedCell, isPaused, isComplete } = useGameStore();

  const handleNumberClick = (num: number) => {
    if (!selectedCell || isPaused || isComplete) return;
    setCellValue(num);
  };

  const handleClear = () => {
    if (!selectedCell || isPaused || isComplete) return;
    setCellValue(null);
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minHeight: '45px',
    fontSize: '1.25rem',
    fontWeight: '600',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    backgroundColor: colors.surface,
    color: colors.text,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  };

  const disabledStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  return (
    <div
      role="toolbar"
      aria-label="Number pad for inputting values"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        width: '100%',
        maxWidth: '450px',
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          type="button"
          role="button"
          aria-label={`Number ${num}`}
          style={selectedCell && !isPaused && !isComplete ? buttonStyle : disabledStyle}
          onClick={() => handleNumberClick(num)}
          disabled={!selectedCell || isPaused || isComplete}
          onMouseEnter={(e) => {
            if (selectedCell && !isPaused && !isComplete) {
              e.currentTarget.style.backgroundColor = colors.primaryHover;
              e.currentTarget.style.color = colors.surface;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.surface;
            e.currentTarget.style.color = colors.text;
          }}
        >
          {num}
        </button>
      ))}
      <button
        type="button"
        role="button"
        aria-label="Clear cell"
        style={selectedCell && !isPaused && !isComplete ? buttonStyle : disabledStyle}
        onClick={handleClear}
        disabled={!selectedCell || isPaused || isComplete}
        onMouseEnter={(e) => {
          if (selectedCell && !isPaused && !isComplete) {
            e.currentTarget.style.backgroundColor = colors.cellError;
            e.currentTarget.style.color = colors.surface;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.surface;
          e.currentTarget.style.color = colors.text;
        }}
      >
        ✕
      </button>
    </div>
  );
}
