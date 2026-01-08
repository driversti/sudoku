import type { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { colors } = useTheme();

  return (
    <div
      className="flex flex-col transition-colors duration-300"
      style={{ height: '100%', backgroundColor: colors.background, color: colors.text }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        {children}
      </div>
      <footer style={{
        borderTop: `1px solid ${colors.border}`,
        padding: '16px',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: colors.textSecondary
      }}>
        Created by{' '}
        <a
          href="https://claude.com/product/claude-code"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primary, textDecoration: 'none' }}
        >
          Claude Code
        </a>
        {' '}(<a
          href="https://z.ai/blog/glm-4.7"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primary, textDecoration: 'none' }}
        >
          GLM-4.7
        </a>
        ) under the sensitive guidance of{' '}
        <a
          href="https://www.erepublik.com/en/citizen/profile/4690052"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primary, textDecoration: 'none' }}
        >
          driversti
        </a>
      </footer>
    </div>
  );
}
