import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AIProvider, AIProviderError } from '../index';
import * as fs from 'fs/promises';
import * as path from 'path';

export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.heic': 'image/heic',
      '.heif': 'image/heif',
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  async analyzeImage(imagePath: string, prompt: string): Promise<string> {
    try {
      const imageData = await fs.readFile(imagePath);
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData.toString('base64'),
            mimeType: this.getMimeType(imagePath),
          },
        },
      ]);
      return result.response.text();
    } catch (error) {
      throw new AIProviderError(`Gemini image analysis failed: ${error instanceof Error ? error.message : String(error)}`, error);
    }
  }

  async analyzeText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      throw new AIProviderError(`Gemini text analysis failed: ${error instanceof Error ? error.message : String(error)}`, error);
    }
  }
}
