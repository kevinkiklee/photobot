// Lazy-initialized AI provider and bouncer. Uses Proxy so the provider isn't
// created until the first method call — this lets the module be imported in
// tests without requiring real API keys at import time.

import { GeminiProvider, OllamaProvider, AIProvider } from '@photobot/ai';
import { BouncerService } from './bouncer';

let _aiProvider: AIProvider | null = null;
let _bouncerService: BouncerService | null = null;

function getAIProvider(): AIProvider {
  if (!_aiProvider) {
    _aiProvider = process.env.AI_PROVIDER === 'ollama'
      ? new OllamaProvider(process.env.OLLAMA_MODEL || 'llava')
      : new GeminiProvider(process.env.GEMINI_API_KEY || '');
  }
  return _aiProvider;
}

export const aiProvider: AIProvider = new Proxy({} as AIProvider, {
  get(_, prop) {
    return (getAIProvider() as any)[prop];
  },
});

export const bouncerService = new Proxy({} as BouncerService, {
  get(_, prop) {
    if (!_bouncerService) {
      _bouncerService = new BouncerService(getAIProvider());
    }
    return (_bouncerService as any)[prop];
  },
});
