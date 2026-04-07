import { describe, expect, it } from 'vitest';
import { parsePromptsMarkdown, loadPrompts } from '../data/parse-prompts';

describe('parsePromptsMarkdown', () => {
  it('parses multiple categories with their prompts', () => {
    const md = `## Creative Process
- What inspired your latest shot?
- How do you approach composition?

## Inspiration
- What photographer do you admire most?
`;
    const result = parsePromptsMarkdown(md);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ category: 'creative', text: 'What inspired your latest shot?' });
    expect(result[1]).toEqual({ category: 'creative', text: 'How do you approach composition?' });
    expect(result[2]).toEqual({ category: 'inspiration', text: 'What photographer do you admire most?' });
  });

  it('returns empty array for empty string', () => {
    expect(parsePromptsMarkdown('')).toEqual([]);
  });

  it('returns empty array when there are no category headers', () => {
    const md = `- A prompt with no heading
- Another prompt with no heading`;
    expect(parsePromptsMarkdown(md)).toEqual([]);
  });

  it('skips malformed lines that do not start with "- "', () => {
    const md = `## Creative Process
- Valid prompt
Not a prompt line
  - Indented bullet (invalid)
* Asterisk bullet (invalid)
- Another valid prompt
`;
    const result = parsePromptsMarkdown(md);

    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('Valid prompt');
    expect(result[1].text).toBe('Another valid prompt');
  });

  it('maps "Creative Process" heading to "creative" category key', () => {
    const md = `## Creative Process
- Tell me about your process
`;
    const result = parsePromptsMarkdown(md);

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('creative');
  });

  it('maps "Inspiration" heading to "inspiration" category key', () => {
    const md = `## Inspiration
- What inspires you?
`;
    const result = parsePromptsMarkdown(md);

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('inspiration');
  });

  it('lowercases unknown heading names', () => {
    const md = `## Street Photography
- What draws you to street scenes?
`;
    const result = parsePromptsMarkdown(md);

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('street photography');
  });

  it('returns empty array when heading has no prompts beneath it', () => {
    const md = `## Creative Process
`;
    expect(parsePromptsMarkdown(md)).toEqual([]);
  });

  it('trims whitespace from prompt text', () => {
    const md = `## Creative Process
-   lots of leading spaces
`;
    const result = parsePromptsMarkdown(md);

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('lots of leading spaces');
  });

  it('assigns the correct category to each prompt when multiple headings are present', () => {
    const md = `## Creative Process
- Creative prompt one
- Creative prompt two

## Inspiration
- Inspiration prompt one
`;
    const result = parsePromptsMarkdown(md);

    const creative = result.filter((p) => p.category === 'creative');
    const inspiration = result.filter((p) => p.category === 'inspiration');

    expect(creative).toHaveLength(2);
    expect(inspiration).toHaveLength(1);
  });
});

describe('loadPrompts', () => {
  it('loads prompts from the actual discussion-prompts.md file', () => {
    const prompts = loadPrompts();

    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts[0]).toHaveProperty('category');
    expect(prompts[0]).toHaveProperty('text');
    expect(typeof prompts[0].text).toBe('string');
    expect(prompts[0].text.length).toBeGreaterThan(0);
  });

  it('returns prompts with known categories', () => {
    const prompts = loadPrompts();
    const categories = new Set(prompts.map((p) => p.category));

    expect(categories.has('creative')).toBe(true);
    expect(categories.has('inspiration')).toBe(true);
  });
});
