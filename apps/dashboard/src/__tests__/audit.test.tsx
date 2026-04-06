import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@photobot/db', () => ({
  prisma: {
    configAuditLog: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('../lib/auth', () => ({
  authOptions: {},
}));

import { prisma } from '@photobot/db';
import AuditPage from '../app/(dashboard)/audit/page';

describe('Audit Page', () => {
  it('shows empty state when no logs', async () => {
    (prisma.configAuditLog.findMany as any).mockResolvedValue([]);
    (prisma.configAuditLog.count as any).mockResolvedValue(0);

    const Page = await AuditPage({ searchParams: Promise.resolve({}) });
    render(Page);

    expect(screen.getByText(/No Entries/i)).toBeInTheDocument();
  });

  it('renders audit logs with action badges', async () => {
    (prisma.configAuditLog.findMany as any).mockResolvedValue([
      {
        id: '1',
        userId: 'user1',
        action: 'UPDATE',
        targetType: 'SERVER',
        targetId: 'pl-guild-id',
        featureKey: 'discuss',
        oldValue: { isEnabled: false },
        newValue: { isEnabled: true },
        createdAt: new Date('2024-03-29T10:00:00Z'),
      },
    ]);
    (prisma.configAuditLog.count as any).mockResolvedValue(1);

    const Page = await AuditPage({ searchParams: Promise.resolve({}) });
    render(Page);

    expect(screen.getByText(/Audit Log/i)).toBeInTheDocument();
    expect(screen.getByText(/user1/i)).toBeInTheDocument();
    expect(screen.getByText(/discuss/i)).toBeInTheDocument();

    const badge = screen.getByText('UPDATE');
    expect(badge.className).toContain('bg-brand-primary/15');
  });
});
