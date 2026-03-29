import { Ollama } from 'ollama';
import { AIProvider, AIProviderError } from '../index';
import * as fs from 'fs/promises';

export class OllamaProvider implements AIProvider {
  private model: string;
  private client: Ollama | null = null;

  constructor(model: string = 'llava') {
    this.model = model;
  }

  private getClient(): Ollama {
    if (!this.client) {
      this.client = new Ollama({ host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434' });
    }
    return this.client;
  }

  async analyzeImage(imagePath: string, prompt: string): Promise<string> {
    try {
      const imageData = await fs.readFile(imagePath);
      const response = await this.getClient().generate({
        model: this.model,
        prompt: prompt,
        images: [imageData],
      });
      return response.response;
    } catch (error) {
      throw new AIProviderError(`Ollama image analysis failed: ${error instanceof Error ? error.message : String(error)}`, error);
    }
  }

  async analyzeText(prompt: string): Promise<string> {
    try {
      const response = await this.getClient().generate({
        model: this.model,
        prompt: prompt,
      });
      return response.response;
    } catch (error) {
      throw new AIProviderError(`Ollama text analysis failed: ${error instanceof Error ? error.message : String(error)}`, error);
    }
  }
}
