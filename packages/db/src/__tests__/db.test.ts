import { describe, expect, it } from 'vitest';
import { prisma, TargetType } from '../index';

describe('Prisma Client', () => {
  it('should be initialized and exported', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe('function');
  });

  it('returns the same singleton instance', async () => {
    const { prisma: prisma2 } = await import('../index');
    expect(prisma).toBe(prisma2);
  });

  it('re-exports Prisma enums', () => {
    expect(TargetType).toBeDefined();
    expect(TargetType.SERVER).toBe('SERVER');
    expect(TargetType.ROLE).toBe('ROLE');
    expect(TargetType.CHANNEL).toBe('CHANNEL');
  });
});
