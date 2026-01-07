export type Theme = 'light' | 'dark' | 'sepia' | 'blue';

export interface ThemeColors {
  background: string;
  surface: string;
  board: string;
  cell: string;
  cellInitial: string;
  cellSelected: string;
  cellHighlighted: string;
  cellError: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryHover: string;
  accent: string;
  gridLines: string;
  gridLinesThick: string;
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    board: '#ffffff',
    cell: '#ffffff',
    cellInitial: '#f1f5f9',
    cellSelected: '#bfdbfe',
    cellHighlighted: '#e0e7ff',
    cellError: '#fecaca',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#cbd5e1',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    accent: '#8b5cf6',
    gridLines: '#cbd5e1',
    gridLinesThick: '#94a3b8',
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    board: '#1e293b',
    cell: '#334155',
    cellInitial: '#475569',
    cellSelected: '#1e40af',
    cellHighlighted: '#312e81',
    cellError: '#991b1b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#475569',
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    accent: '#a78bfa',
    gridLines: '#1e293b',
    gridLinesThick: '#475569',
  },
  sepia: {
    background: '#f4ecd8',
    surface: '#faf8f1',
    board: '#faf8f1',
    cell: '#faf8f1',
    cellInitial: '#f0e6d2',
    cellSelected: '#e8dcc4',
    cellHighlighted: '#dfd4bc',
    cellError: '#e8c4c4',
    text: '#5c4b37',
    textSecondary: '#8b7355',
    border: '#d4c4a8',
    primary: '#8b6914',
    primaryHover: '#6b4e0f',
    accent: '#a67c52',
    gridLines: '#e8dcc4',
    gridLinesThick: '#c4b498',
  },
  blue: {
    background: '#0c4a6e',
    surface: '#075985',
    board: '#075985',
    cell: '#0369a1',
    cellInitial: '#0284c7',
    cellSelected: '#0ea5e9',
    cellHighlighted: '#38bdf8',
    cellError: '#dc2626',
    text: '#f0f9ff',
    textSecondary: '#bae6fd',
    border: '#0284c7',
    primary: '#0ea5e9',
    primaryHover: '#38bdf8',
    accent: '#fbbf24',
    gridLines: '#0284c7',
    gridLinesThick: '#0369a1',
  },
};
