import { describe, it, expect } from 'vitest';
import { DISCUSSION_PROMPTS, DISCUSSION_CATEGORIES } from '../constants';

describe('Curated Prompt Bank', () => {
  it('has prompts for every category', () => {
    const categories = Object.keys(DISCUSSION_CATEGORIES);
    for (const cat of categories) {
      const prompts = DISCUSSION_PROMPTS.filter(p => p.category === cat);
      expect(prompts.length).toBeGreaterThanOrEqual(10);
    }
  });

  it('every prompt has a non-empty text and 3 reactions', () => {
    for (const prompt of DISCUSSION_PROMPTS) {
      expect(prompt.text.length).toBeGreaterThan(0);
      expect(prompt.reactions).toHaveLength(3);
    }
  });

  it('every prompt category is a valid category key', () => {
    const validCategories = Object.keys(DISCUSSION_CATEGORIES);
    for (const prompt of DISCUSSION_PROMPTS) {
      expect(validCategories).toContain(prompt.category);
    }
  });
});
