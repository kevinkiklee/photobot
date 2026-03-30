import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorCard } from '../components/ErrorCard';

describe('ErrorCard', () => {
  it('renders default title when none provided', () => {
    render(<ErrorCard message="Something broke" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<ErrorCard title="Oops!" message="Custom error" />);
    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorCard message="Error" onRetry={onRetry} />);
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides retry button when onRetry is not provided', () => {
    render(<ErrorCard message="Error" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
