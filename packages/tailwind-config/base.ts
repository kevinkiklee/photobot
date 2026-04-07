import type { Config } from 'tailwindcss';

const baseConfig: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          primary: '#74D7EC',
          accent: '#FF85C8',
          secondary: '#A8EDEA',
          highlight: '#FFF176',
          dark: '#1E3A5F',
        },
        page: 'var(--bg-page)',
        card: 'var(--bg-card)',
        header: 'var(--bg-header)',
        elevated: 'var(--surface-elevated)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
      },
      borderColor: {
        DEFAULT: 'var(--border-default)',
        subtle: 'var(--border-subtle)',
      },
    },
  },
};

export default baseConfig;
