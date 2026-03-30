import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/settings',
  useSearchParams: () => new URLSearchParams('serverId=111'),
}));

vi.mock('../lib/discord', () => ({
  DiscordGuild: {},
}));

import { MobileNav } from '../components/MobileNav';

const guilds = [
  { id: '111', name: 'Photo Guild', permissions: '8' },
];

describe('MobileNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders three tab buttons', () => {
    render(<MobileNav guilds={guilds} />);
    expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Audit Log')).toBeInTheDocument();
    expect(screen.getByLabelText('Servers')).toBeInTheDocument();
  });

  it('navigates to settings preserving serverId', () => {
    render(<MobileNav guilds={guilds} />);
    fireEvent.click(screen.getByLabelText('Settings'));
    expect(mockPush).toHaveBeenCalledWith('/settings?serverId=111');
  });

  it('navigates to audit preserving serverId', () => {
    render(<MobileNav guilds={guilds} />);
    fireEvent.click(screen.getByLabelText('Audit Log'));
    expect(mockPush).toHaveBeenCalledWith('/audit?serverId=111');
  });

  it('highlights active tab based on pathname', () => {
    render(<MobileNav guilds={guilds} />);
    const settingsBtn = screen.getByLabelText('Settings');
    expect(settingsBtn.className).toContain('text-brand-primary');
  });
});
