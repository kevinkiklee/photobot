import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../components/Skeleton';

describe('Skeleton', () => {
  it('renders a div with shimmer animation', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('animate-shimmer');
  });

  it('applies additional classNames', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('h-4');
    expect(el.className).toContain('w-32');
  });

  it('renders as rounded by default', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded-md');
  });
});
