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

import { ServerSelector } from '../components/server-selector';

const guilds = [
  { id: '111', name: 'Guild One', permissions: '8' },
  { id: '222', name: 'Guild Two', permissions: '8' },
];

describe('ServerSelector (client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders guild options in dropdown', () => {
    render(<ServerSelector guilds={guilds} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[1]).toHaveTextContent('Guild One');
    expect(options[2]).toHaveTextContent('Guild Two');
  });

  it('pushes URL with serverId on selection', () => {
    render(<ServerSelector guilds={guilds} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '111' } });
    expect(mockPush).toHaveBeenCalledWith('/settings?serverId=111');
  });

  it('removes serverId on empty selection', () => {
    render(<ServerSelector guilds={guilds} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
    expect(mockPush).toHaveBeenCalledWith('/settings?');
  });

  it('renders placeholder option', () => {
    render(<ServerSelector guilds={guilds} />);
    expect(screen.getByText('Select a server...')).toBeInTheDocument();
  });
});
