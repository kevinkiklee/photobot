import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('../lib/auth', () => ({
  authOptions: {},
}));

vi.mock('../lib/discord', () => ({
  getAdminGuilds: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`NEXT_REDIRECT:${url}`); }),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/settings',
  useSearchParams: () => new URLSearchParams(''),
}));

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { getAdminGuilds } from '../lib/discord';
import DashboardLayout from '../app/(dashboard)/layout';

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects when session is null', async () => {
    (getServerSession as any).mockResolvedValue(null);
    await expect(DashboardLayout({ children: <div>child</div> })).rejects.toThrow('NEXT_REDIRECT:/');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('redirects when session has no accessToken', async () => {
    (getServerSession as any).mockResolvedValue({ user: { name: 'Test' } });
    await expect(DashboardLayout({ children: <div>child</div> })).rejects.toThrow('NEXT_REDIRECT:/');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('renders nav and children with valid session', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (getAdminGuilds as any).mockResolvedValue([{ id: '1', name: 'Guild', permissions: '8' }]);

    const Page = await DashboardLayout({ children: <div>test-child</div> });
    render(Page);

    expect(screen.getByText('Photobot')).toBeInTheDocument();
    expect(screen.getAllByText('Settings').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Audit Log').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('test-child')).toBeInTheDocument();
  });
});
