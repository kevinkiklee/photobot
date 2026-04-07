import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

// The root Vite server in workspace mode processes ALL module transforms
// across all projects. React TSX files need the JSX transform at this level.
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  test: {
    projects: [
      {
        test: {
          name: '@photobot/bot',
          root: 'apps/bot',
          exclude: ['**/*.integration.test.*', '**/node_modules/**', '**/dist/**'],
        },
      },
      {
        plugins: [react({ jsxRuntime: 'automatic' })],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, 'apps/dashboard/src'),
          },
        },
        test: {
          name: '@photobot/dashboard',
          root: 'apps/dashboard',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./src/__tests__/setup.ts'],
        },
      },
      {
        plugins: [react({ jsxRuntime: 'automatic' })],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, 'apps/voting/src'),
          },
        },
        test: {
          name: '@photobot/voting',
          root: 'apps/voting',
          environment: 'jsdom',
          globals: true,
        },
      },
      {
        test: {
          name: '@photobot/db',
          root: 'packages/db',
          exclude: ['**/*.integration.test.*', '**/node_modules/**', '**/dist/**'],
        },
      },
    ],
  },
});
