import { GoogleGenAI } from '@google/genai';
import { AIProvider, AIProviderError } from '../index';
import * as fs from 'fs/promises';
import * as path from 'path';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
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
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: imageData.toString('base64'),
                  mimeType: this.getMimeType(imagePath),
                },
              },
            ],
          },
        ],
      });
      return response.text ?? '';
    } catch (error) {
      throw new AIProviderError(`Gemini image analysis failed: ${error instanceof Error ? error.message : String(error)}`, error);
    }
  }

  async analyzeText(prompt: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      return response.text ?? '';
    } catch (error) {
      throw new AIProviderError(`Gemini text analysis failed: ${error instanceof Error ? error.message : String(error)}`, error);
    }
  }
}
