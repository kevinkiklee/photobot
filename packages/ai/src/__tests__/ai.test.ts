import { describe, it, expect, vi } from 'vitest';
import { GeminiProvider } from '../providers/gemini';
import { OllamaProvider } from '../providers/ollama';

// We mock the external dependencies
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => 'Mock Gemini response',
            },
          }),
        }),
      };
    }),
  };
});

vi.mock('ollama', () => {
  const generate = vi.fn().mockResolvedValue({ response: 'Mock Ollama response' });
  const OllamaMock = vi.fn().mockImplementation(() => ({ generate }));
  return {
    default: { generate },
    Ollama: OllamaMock,
  };
});

vi.mock('fs/promises', () => {
  return {
    readFile: vi.fn().mockResolvedValue(Buffer.from('fake image')),
  };
});

describe('AI Providers', () => {
  describe('GeminiProvider', () => {
    it('should be able to analyze text', async () => {
      const provider = new GeminiProvider('fake-api-key');
      const response = await provider.analyzeText('Hello');
      expect(response).toBe('Mock Gemini response');
    });

    it('should be able to analyze image', async () => {
      const provider = new GeminiProvider('fake-api-key');
      const response = await provider.analyzeImage('fake-path.jpg', 'What is this?');
      expect(response).toBe('Mock Gemini response');
    });

    it('should throw AIProviderError on failure', async () => {
      const provider = new GeminiProvider('fake-api-key');
      const mockModel = (provider as any).model;
      mockModel.generateContent.mockRejectedValueOnce(new Error('API Error'));

      await expect(provider.analyzeText('Hello')).rejects.toThrow('Gemini text analysis failed: API Error');
    });

    it('maps file extensions to correct MIME types', () => {
      const provider = new GeminiProvider('fake-api-key');
      const getMimeType = (provider as any).getMimeType.bind(provider);
      expect(getMimeType('photo.png')).toBe('image/png');
      expect(getMimeType('photo.jpg')).toBe('image/jpeg');
      expect(getMimeType('photo.jpeg')).toBe('image/jpeg');
      expect(getMimeType('photo.webp')).toBe('image/webp');
      expect(getMimeType('photo.heic')).toBe('image/heic');
      expect(getMimeType('photo.bmp')).toBe('image/jpeg');
    });

    it('throws AIProviderError when image file is missing', async () => {
      const fs = await import('fs/promises');
      (fs.readFile as any).mockRejectedValueOnce(new Error('ENOENT: no such file'));

      const provider = new GeminiProvider('fake-api-key');
      await expect(provider.analyzeImage('nonexistent.jpg', 'test'))
        .rejects.toThrow('Gemini image analysis failed');
    });
  });

  describe('OllamaProvider', () => {
    it('should be able to analyze text', async () => {
      const provider = new OllamaProvider('llama2');
      const response = await provider.analyzeText('Hello');
      expect(response).toBe('Mock Ollama response');
    });

    it('should be able to analyze image', async () => {
      const provider = new OllamaProvider('llava');
      const response = await provider.analyzeImage('fake-path.jpg', 'What is this?');
      expect(response).toBe('Mock Ollama response');
    });

    it('should throw AIProviderError on failure', async () => {
      const provider = new OllamaProvider('llava');
      const ollama = await import('ollama');
      (ollama.default.generate as any).mockRejectedValueOnce(new Error('Connection Error'));

      await expect(provider.analyzeText('Hello')).rejects.toThrow('Ollama text analysis failed: Connection Error');
    });

    it('reuses client instance on second call', () => {
      const provider = new OllamaProvider('llava');
      const client1 = (provider as any).getClient();
      const client2 = (provider as any).getClient();
      expect(client1).toBe(client2);
    });

    it('throws AIProviderError on connection refused', async () => {
      const provider = new OllamaProvider('llava');
      const ollama = await import('ollama');
      (ollama.default.generate as any).mockRejectedValueOnce(new Error('connect ECONNREFUSED'));

      await expect(provider.analyzeText('Hello'))
        .rejects.toThrow('Ollama text analysis failed');
    });
  });
});
