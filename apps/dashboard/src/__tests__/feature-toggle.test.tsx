import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../components/Toast';

vi.mock('../lib/actions', () => ({
  updateFeatureAction: vi.fn(),
}));

import { updateFeatureAction } from '../lib/actions';
import { FeatureToggle } from '../components/feature-toggle';

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('FeatureToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (updateFeatureAction as any).mockResolvedValue({});
  });

  it('renders enabled state', () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="discuss" initialEnabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button.className).toContain('bg-brand-primary');
  });

  it('renders disabled state', () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="discuss" initialEnabled={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button.className).toContain('bg-[var(--toggle-off)]');
  });

  it('calls updateFeatureAction on click', async () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="discuss" initialEnabled={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(updateFeatureAction).toHaveBeenCalledWith('s1', 'discuss', true);
    });
  });

  it('shows success toast after toggling', async () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="discuss" initialEnabled={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/discuss enabled/i)).toBeInTheDocument();
    });
  });

  it('rolls back state and shows error toast on failure', async () => {
    (updateFeatureAction as any).mockRejectedValue(new Error('fail'));

    renderWithToast(<FeatureToggle serverId="s1" featureKey="discuss" initialEnabled={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByText(/failed to update/i)).toBeInTheDocument();
    });
  });

  it('has correct aria-label', () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="discuss" initialEnabled={true} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Toggle discuss');
  });
});
