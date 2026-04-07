import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '../components/Toast';

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

import { prisma } from '@photobot/db';
import SettingsPage from '../app/(dashboard)/settings/page';

describe('Settings Page', () => {
  it('renders feature toggle cards', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { id: '1', featureKey: 'settings', isEnabled: true, targetType: 'SERVER', targetId: 'pl-guild-id' },
    ]);

    const Page = await SettingsPage();
    render(<ToastProvider>{Page}</ToastProvider>);

    expect(screen.getByRole('heading', { level: 1, name: /Settings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /discuss/i })).toBeInTheDocument();
  });

  it('shows Photography Lounge in description', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([]);

    const Page = await SettingsPage();
    render(<ToastProvider>{Page}</ToastProvider>);

    expect(screen.getByText(/Photography Lounge/i)).toBeInTheDocument();
  });
});
