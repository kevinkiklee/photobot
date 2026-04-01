// Provider-agnostic AI interface. The bot picks Gemini (prod) or Ollama (local dev)
// at startup based on the AI_PROVIDER env var. Both implement the same two methods
// so commands don't need to know which backend is active.

export class AIProviderError extends Error {
  constructor(message: string, public cause?: any) {
    super(message);
    this.name = 'AIProviderError';
  }
}

export interface AIProvider {
  analyzeImage(imagePath: string, prompt: string): Promise<string>;
  analyzeText(prompt: string): Promise<string>;
}

export * from './providers/gemini';
export * from './providers/ollama';
