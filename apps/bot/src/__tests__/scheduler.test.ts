import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn().mockReturnValue({ stop: vi.fn() }),
  },
  schedule: vi.fn().mockReturnValue({ stop: vi.fn() }),
}));

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionSchedule: {
      findMany: vi.fn(),
    },
    discussionPromptLog: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('../middleware/permissions', () => ({
  canUseFeature: vi.fn(),
}));

vi.mock('../services/prompts', () => ({
  selectPrompt: vi.fn(),
}));

import cron from 'node-cron';
import { prisma } from '@photobot/db';
import { canUseFeature } from '../middleware/permissions';
import { selectPrompt } from '../services/prompts';
import { buildCronExpression, startScheduler, stopScheduler } from '../services/scheduler';

describe('Scheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([]);
    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({
      text: 'Test prompt', category: 'technique', source: 'curated', reactions: ['📸', '💬', '💡'],
    });
    (prisma.discussionPromptLog.create as any).mockResolvedValue({});
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);
  });

  afterEach(() => {
    stopScheduler();
    vi.useRealTimers();
  });

  describe('buildCronExpression', () => {
    it('converts days and time to cron format', () => {
      expect(buildCronExpression([1, 3, 5], '14:00')).toBe('0 14 * * 1,3,5');
    });

    it('handles single day', () => {
      expect(buildCronExpression([0], '09:30')).toBe('30 9 * * 0');
    });

    it('handles daily', () => {
      expect(buildCronExpression([0, 1, 2, 3, 4, 5, 6], '08:00')).toBe('0 8 * * 0,1,2,3,4,5,6');
    });
  });

  describe('startScheduler', () => {
    it('loads active schedules and registers cron jobs', async () => {
      (prisma.discussionSchedule.findMany as any).mockResolvedValue([
        { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', days: [1, 3, 5], timeUtc: '09:00', useAi: false, categoryFilter: null, isActive: true },
      ]);

      const mockClient = { channels: { fetch: vi.fn() } } as any;
      await startScheduler(mockClient);

      expect(cron.schedule).toHaveBeenCalledWith(
        '0 9 * * 1,3,5',
        expect.any(Function),
        expect.objectContaining({ timezone: 'UTC' }),
      );
    });

    it('does not register jobs for inactive schedules', async () => {
      (prisma.discussionSchedule.findMany as any).mockResolvedValue([
        { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', days: [1], timeUtc: '09:00', useAi: false, categoryFilter: null, isActive: false },
      ]);

      const mockClient = { channels: { fetch: vi.fn() } } as any;
      await startScheduler(mockClient);

      expect(cron.schedule).not.toHaveBeenCalled();
    });
  });
});
