import { useTheme } from '../layout/ThemeProvider';
import { useGameStore } from '../../stores/gameStore';
import { Cell } from './Cell';

export function Board() {
  const { colors } = useTheme();
  const { selectCell, difficulty } = useGameStore();

  const handleCellClick = (row: number, col: number) => {
    selectCell({ row, col });
  };

  return (
    <div
      role="grid"
      aria-label={`Sudoku board, ${difficulty.toLowerCase()} difficulty`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gridTemplateRows: 'repeat(9, 1fr)',
        gap: '0',
        backgroundColor: colors.gridLines,
        border: `2px solid ${colors.gridLinesThick}`,
        borderRadius: '4px',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '450px',
        aspectRatio: '1',
      }}
    >
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 9 }).map((_, col) => (
          <Cell
            key={`${row}-${col}`}
            row={row}
            col={col}
            onClick={() => handleCellClick(row, col)}
          />
        ))
      )}
    </div>
  );
}
