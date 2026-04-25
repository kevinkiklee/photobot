const MAX_THREAD_NAME_LENGTH = 100;

export function buildThreadName(promptText: string): string {
  if (promptText.length <= MAX_THREAD_NAME_LENGTH) return promptText;
  const sliced = promptText.slice(0, MAX_THREAD_NAME_LENGTH);
  const lastSpace = sliced.lastIndexOf(' ');
  const cut = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut}…`;
}
