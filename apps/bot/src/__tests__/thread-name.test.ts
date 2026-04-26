import { describe, expect, it } from 'vitest';
import { buildThreadName } from '../utils/thread-name';

describe('buildThreadName', () => {
  it('returns short text unchanged', () => {
    expect(buildThreadName('Short prompt?')).toBe('Short prompt?');
  });

  it('returns text exactly 100 chars unchanged', () => {
    const text = 'a'.repeat(100);
    expect(buildThreadName(text)).toBe(text);
  });

  it('truncates at last space before 100 chars and appends ellipsis', () => {
    // 131 chars with spaces
    const text =
      'What does negative space mean to you in your photography practice and how do you use it on a daily basis to make compelling images?';
    const result = buildThreadName(text);
    expect(result.length).toBeLessThanOrEqual(101); // <=100 + ellipsis
    expect(result.endsWith('…')).toBe(true);
    expect(result).not.toContain(' …'); // no trailing space before ellipsis
  });

  it('hard-cuts at 100 chars when no space exists', () => {
    const text = 'a'.repeat(150);
    const result = buildThreadName(text);
    expect(result).toBe(`${'a'.repeat(100)}…`);
  });

  it('handles empty string', () => {
    expect(buildThreadName('')).toBe('');
  });
});
