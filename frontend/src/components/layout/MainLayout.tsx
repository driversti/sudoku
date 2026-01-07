import type { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </div>
    </div>
  );
}
