import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the prisma client from @photobot/db
vi.mock('@photobot/db', () => ({
  prisma: {
    featureConfig: {
      findMany: vi.fn(),
    },
  },
}));

// Mock next-auth/next
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
import SettingsPage from '../app/(dashboard)/settings/page';

describe('Settings Page', () => {
  it('shows prompt to select server when no serverId', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });

    const Page = await SettingsPage({ searchParams: {} });
    render(Page);

    expect(screen.getByText(/Please select a server/i)).toBeInTheDocument();
  });

  it('shows access denied if user is not admin of server', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (getAdminGuilds as any).mockResolvedValue([]);

    const Page = await SettingsPage({ searchParams: { serverId: '123' } });
    render(Page);

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });

  it('renders feature toggle cards for a specific server', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (getAdminGuilds as any).mockResolvedValue([{ id: '123', name: 'Test', permissions: '8' }]);
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { id: '1', featureKey: 'critique', isEnabled: true, serverId: '123', targetType: 'SERVER', targetId: '123' },
    ]);

    const Page = await SettingsPage({ searchParams: { serverId: '123' } });
    render(Page);

    expect(screen.getByRole('heading', { level: 1, name: /Settings/i })).toBeInTheDocument();
    expect(screen.getByText(/critique/i)).toBeInTheDocument();
    expect(screen.getByText(/palette/i)).toBeInTheDocument();
  });
});
