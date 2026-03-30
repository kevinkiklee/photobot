import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/settings',
  useSearchParams: () => new URLSearchParams(''),
}));

vi.mock('../lib/discord', () => ({
  DiscordGuild: {},
}));

import { ServerPopover } from '../components/ServerPopover';

const guilds = [
  { id: '111', name: 'Guild One', permissions: '8' },
  { id: '222', name: 'Guild Two', permissions: '8' },
];

describe('ServerPopover (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows placeholder when no server is selected', () => {
    render(<ServerPopover guilds={guilds} />);
    expect(screen.getByText('Select server...')).toBeInTheDocument();
  });

  it('shows guild list on trigger click', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    expect(screen.getByText('Guild One')).toBeInTheDocument();
    expect(screen.getByText('Guild Two')).toBeInTheDocument();
  });

  it('navigates with serverId on selection', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    fireEvent.click(screen.getByText('Guild One'));
    expect(mockPush).toHaveBeenCalledWith('/settings?serverId=111');
  });

  it('closes popover on Escape', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    expect(screen.getByText('Guild One')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Guild One')).not.toBeInTheDocument();
  });
});
