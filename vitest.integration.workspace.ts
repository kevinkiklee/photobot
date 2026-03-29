import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: '@photobot/db-integration',
      root: 'packages/db',
      include: ['**/*.integration.test.ts'],
      testTimeout: 15000,
    },
  },
  {
    test: {
      name: '@photobot/bot-integration',
      root: 'apps/bot',
      include: ['**/*.integration.test.ts'],
      testTimeout: 15000,
    },
  },
])
