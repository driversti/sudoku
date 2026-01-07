import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../layout/ThemeProvider';
import { useGameStore } from '../../stores/gameStore';

interface CellProps {
  row: number;
  col: number;
  onClick: () => void;
}

export function Cell({ row, col, onClick }: CellProps) {
  const { colors } = useTheme();
  const { board, initialCells, selectedCell, pencilMarks, highlightedNumber } = useGameStore();

  const value = board[row][col];
  const isInitial = initialCells[row][col];
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const marks = pencilMarks[row][col];

  // Check if this cell is related to the selected cell (same row, col, or box)
  const isRelated = selectedCell && (
    selectedCell.row === row ||
    selectedCell.col === col ||
    (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
     Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
  );

  // Check if this cell has the same number as the highlighted number
  const isSameNumber = highlightedNumber !== null && value === highlightedNumber;

  // Generate ARIA label
  const getAriaLabel = (): string => {
    const rowLabel = row + 1;
    const colLabel = col + 1;
    if (value) {
      return `Row ${rowLabel}, Column ${colLabel}, ${value}. ${isInitial ? 'Initial' : 'Filled'}`;
    }
    if (marks.size > 0) {
      return `Row ${rowLabel}, Column ${colLabel}, Empty. Pencil marks: ${Array.from(marks).join(', ')}`;
    }
    return `Row ${rowLabel}, Column ${colLabel}, Empty`;
  };

  // Determine cell styling
  const getCellStyle = () => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: value ? '1.5rem' : '0.75rem',
      fontWeight: value ? '600' : '400',
      cursor: isInitial ? 'default' : 'pointer',
      userSelect: 'none',
      transition: 'all 0.15s ease',
      position: 'relative',
    };

    // Background color (priority: selected > same number > related > initial > default)
    if (isSelected) {
      baseStyle.backgroundColor = colors.cellSelected;
    } else if (isSameNumber) {
      baseStyle.backgroundColor = colors.cellHighlighted;
    } else if (isRelated) {
      baseStyle.backgroundColor = colors.cellHighlighted;
    } else if (isInitial) {
      baseStyle.backgroundColor = colors.cellInitial;
    } else {
      baseStyle.backgroundColor = colors.cell;
    }

    // Border
    const borderRight = (col + 1) % 3 === 0 && col < 8;
    const borderBottom = (row + 1) % 3 === 0 && row < 8;

    baseStyle.borderRight = borderRight ? `2px solid ${colors.gridLinesThick}` : `1px solid ${colors.gridLines}`;
    baseStyle.borderBottom = borderBottom ? `2px solid ${colors.gridLinesThick}` : `1px solid ${colors.gridLines}`;
    baseStyle.borderLeft = `1px solid ${colors.gridLines}`;
    baseStyle.borderTop = `1px solid ${colors.gridLines}`;

    // Focus style
    baseStyle.outline = 'none';

    // Text color
    baseStyle.color = isInitial ? colors.text : colors.primary;

    // Add subtle animation for same number highlight
    if (isSameNumber && !isSelected) {
      baseStyle.boxShadow = `inset 0 0 0 2px ${colors.primary}`;
    }

    return baseStyle;
  };

  // Render pencil marks (small numbers)
  const renderPencilMarks = (): ReactNode => {
    if (value || marks.size === 0) return null;

    const cells: (number | null)[] = Array(9).fill(null);

    marks.forEach((num) => {
      cells[num - 1] = num;
    });

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: '100%',
          height: '100%',
          gap: '1px',
        }}
        aria-hidden="true"
      >
        {cells.map((num, index) => (
          <span
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.5rem',
              color: colors.textSecondary,
            }}
          >
            {num || ''}
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      role="gridcell"
      aria-label={getAriaLabel()}
      aria-selected={isSelected}
      aria-readonly={isInitial}
      tabIndex={isInitial ? -1 : 0}
      style={getCellStyle()}
      onClick={() => !isInitial && onClick()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isInitial) onClick();
        }
      }}
      whileHover={isInitial ? {} : { scale: 1.05 }}
      whileTap={isInitial ? {} : { scale: 0.95 }}
      animate={{
        backgroundColor: isSelected ? colors.cellSelected : isSameNumber ? colors.cellHighlighted : isRelated ? colors.cellHighlighted : isInitial ? colors.cellInitial : colors.cell,
      }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        key={value || 'empty'}
        aria-hidden="true"
      >
        {value || renderPencilMarks()}
      </motion.div>
    </motion.div>
  );
}
