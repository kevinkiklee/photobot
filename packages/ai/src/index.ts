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
