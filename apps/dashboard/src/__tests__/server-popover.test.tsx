import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/settings',
  useSearchParams: () => new URLSearchParams(''),
}));

import { ServerPopover } from '../components/ServerPopover';

const guilds = [
  { id: '111', name: 'Photo Guild', permissions: '8', icon: null },
  { id: '222', name: 'Snap Community', permissions: '8', icon: null },
  { id: '333', name: 'Camera Club', permissions: '8', icon: null },
];

describe('ServerPopover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger with placeholder when no server selected', () => {
    render(<ServerPopover guilds={guilds} />);
    expect(screen.getByText('Select server...')).toBeInTheDocument();
  });

  it('opens popover on trigger click', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    expect(screen.getByText('Photo Guild')).toBeInTheDocument();
    expect(screen.getByText('Snap Community')).toBeInTheDocument();
  });

  it('navigates on server selection', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    fireEvent.click(screen.getByText('Photo Guild'));
    expect(mockPush).toHaveBeenCalledWith('/settings?serverId=111');
  });

  it('closes on Escape key', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    expect(screen.getByText('Photo Guild')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Photo Guild')).not.toBeInTheDocument();
  });
});
