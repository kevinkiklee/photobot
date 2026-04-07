import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toaster, ToastProvider, useToast } from '../components/Toast';

function TestComponent() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast({ variant: 'success', message: 'It worked!' })}>Show Success</button>
      <button onClick={() => toast({ variant: 'error', message: 'It failed!' })}>Show Error</button>
    </div>
  );
}

function renderWithToast() {
  return render(
    <ToastProvider>
      <TestComponent />
      <Toaster />
    </ToastProvider>,
  );
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a success toast when triggered', () => {
    renderWithToast();
    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('It worked!')).toBeInTheDocument();
  });

  it('shows an error toast when triggered', () => {
    renderWithToast();
    fireEvent.click(screen.getByText('Show Error'));
    expect(screen.getByText('It failed!')).toBeInTheDocument();
  });

  it('auto-dismisses after 4 seconds', () => {
    renderWithToast();
    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('It worked!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.queryByText('It worked!')).not.toBeInTheDocument();
  });

  it('limits visible toasts to 3', () => {
    renderWithToast();
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText('Show Success'));
    }
    const toasts = screen.getAllByText('It worked!');
    expect(toasts.length).toBeLessThanOrEqual(3);
  });
});
