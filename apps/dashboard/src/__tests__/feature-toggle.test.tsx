import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../lib/actions', () => ({
  updateFeatureAction: vi.fn(),
}));

import { updateFeatureAction } from '../lib/actions';
import { FeatureToggle } from '../components/feature-toggle';

describe('FeatureToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (updateFeatureAction as any).mockResolvedValue({});
  });

  it('renders enabled state', () => {
    render(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button.className).toContain('bg-green-500');
  });

  it('renders disabled state', () => {
    render(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button.className).toContain('bg-gray-300');
  });

  it('calls updateFeatureAction on click', async () => {
    render(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(updateFeatureAction).toHaveBeenCalledWith('s1', 'critique', true);
    });
  });

  it('rolls back state on action error', async () => {
    (updateFeatureAction as any).mockRejectedValue(new Error('fail'));
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('has correct aria-label', () => {
    render(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={true} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Toggle critique');
  });
});
