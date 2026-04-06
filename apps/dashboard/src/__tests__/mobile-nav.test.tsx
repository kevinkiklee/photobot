import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/settings',
}));

import { MobileNav } from '../components/MobileNav';

describe('MobileNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders two tab buttons', () => {
    render(<MobileNav />);
    expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Audit Log')).toBeInTheDocument();
  });

  it('navigates to settings', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByLabelText('Settings'));
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });

  it('navigates to audit', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByLabelText('Audit Log'));
    expect(mockPush).toHaveBeenCalledWith('/audit');
  });

  it('highlights active tab based on pathname', () => {
    render(<MobileNav />);
    const settingsBtn = screen.getByLabelText('Settings');
    expect(settingsBtn.className).toContain('text-brand-primary');
  });
});
