import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: '@photobot/bot',
      root: 'apps/bot',
      exclude: ['**/*.integration.test.*', '**/node_modules/**', '**/dist/**'],
    },
  },
  'apps/dashboard/vitest.config.ts',
  'apps/voting/vitest.config.ts',
  {
    test: {
      name: '@photobot/db',
      root: 'packages/db',
      exclude: ['**/*.integration.test.*', '**/node_modules/**', '**/dist/**'],
    },
  },
]);
