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

vi.mock('../lib/discord', () => ({
  getAdminGuilds: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { getAdminGuilds } from '../lib/discord';
import AuditPage from '../app/(dashboard)/audit/page';

describe('Audit Page', () => {
  it('shows prompt to select server when no serverId', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });

    const Page = await AuditPage({ searchParams: {} });
    render(Page);

    expect(screen.getByText(/Select a server from the header/i)).toBeInTheDocument();
  });

  it('shows access denied if user is not admin of server', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (getAdminGuilds as any).mockResolvedValue([]);

    const Page = await AuditPage({ searchParams: { serverId: '123' } });
    render(Page);

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });

  it('renders audit logs with action badges', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (getAdminGuilds as any).mockResolvedValue([{ id: '123', name: 'Test', permissions: '8' }]);
    (prisma.configAuditLog.findMany as any).mockResolvedValue([
      {
        id: '1',
        serverId: '123',
        userId: 'user1',
        action: 'UPDATE',
        targetType: 'SERVER',
        targetId: '123',
        featureKey: 'critique',
        oldValue: { isEnabled: false },
        newValue: { isEnabled: true },
        createdAt: new Date('2024-03-29T10:00:00Z'),
      },
    ]);
    (prisma.configAuditLog.count as any).mockResolvedValue(1);

    const Page = await AuditPage({ searchParams: { serverId: '123' } });
    render(Page);

    expect(screen.getByText(/Audit Log/i)).toBeInTheDocument();
    expect(screen.getByText(/user1/i)).toBeInTheDocument();
    expect(screen.getByText(/critique/i)).toBeInTheDocument();

    const badge = screen.getByText('UPDATE');
    expect(badge.className).toContain('bg-brand-primary/15');
  });
});
