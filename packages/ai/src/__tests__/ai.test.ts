import { describe, it, expect, vi } from 'vitest';
import { GeminiProvider } from '../providers/gemini';
import { OllamaProvider } from '../providers/ollama';
import { AIProviderError } from '../index';

// We mock the external dependencies
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(function () {
      return {
        models: {
          generateContent: vi.fn().mockResolvedValue({
            text: 'Mock Gemini response',
          }),
        },
      };
    }),
  };
});

vi.mock('ollama', () => {
  const generate = vi.fn().mockResolvedValue({ response: 'Mock Ollama response' });
  const OllamaMock = vi.fn().mockImplementation(function () { return { generate }; });
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
      const mockModels = (provider as any).client.models;
      mockModels.generateContent.mockRejectedValueOnce(new Error('API Error'));

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

  describe('GeminiProvider - HEIC/HEIF support', () => {
    it('maps .heic extension to image/heic MIME type', () => {
      const provider = new GeminiProvider('fake-api-key');
      const getMimeType = (provider as any).getMimeType.bind(provider);
      expect(getMimeType('photo.heic')).toBe('image/heic');
    });

    it('maps .heif extension to image/heif MIME type', () => {
      const provider = new GeminiProvider('fake-api-key');
      const getMimeType = (provider as any).getMimeType.bind(provider);
      expect(getMimeType('photo.heif')).toBe('image/heif');
    });

    it('analyzes a HEIC image successfully', async () => {
      const provider = new GeminiProvider('fake-api-key');
      const response = await provider.analyzeImage('photo.heic', 'Describe this photo');
      expect(response).toBe('Mock Gemini response');
    });

    it('analyzes a HEIF image successfully', async () => {
      const provider = new GeminiProvider('fake-api-key');
      const response = await provider.analyzeImage('photo.heif', 'Describe this photo');
      expect(response).toBe('Mock Gemini response');
    });
  });

  describe('GeminiProvider - unsupported format fallback', () => {
    it('falls back to image/jpeg for .bmp files', () => {
      const provider = new GeminiProvider('fake-api-key');
      const getMimeType = (provider as any).getMimeType.bind(provider);
      expect(getMimeType('photo.bmp')).toBe('image/jpeg');
    });

    it('falls back to image/jpeg for .gif files', () => {
      const provider = new GeminiProvider('fake-api-key');
      const getMimeType = (provider as any).getMimeType.bind(provider);
      expect(getMimeType('animation.gif')).toBe('image/jpeg');
    });

    it('falls back to image/jpeg for unknown extensions', () => {
      const provider = new GeminiProvider('fake-api-key');
      const getMimeType = (provider as any).getMimeType.bind(provider);
      expect(getMimeType('image.tiff')).toBe('image/jpeg');
    });
  });

  describe('OllamaProvider - custom model', () => {
    it('uses the custom model name passed to the constructor', async () => {
      const provider = new OllamaProvider('custom-vision-model');
      expect((provider as any).model).toBe('custom-vision-model');
    });

    it('passes the custom model to generate calls', async () => {
      const provider = new OllamaProvider('my-custom-llava');
      await provider.analyzeText('Hello');

      const ollama = await import('ollama');
      expect(ollama.default.generate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'my-custom-llava' })
      );
    });

    it('defaults to llava when no model is specified', () => {
      const provider = new OllamaProvider();
      expect((provider as any).model).toBe('llava');
    });
  });

  describe('OllamaProvider - custom host', () => {
    it('respects OLLAMA_HOST environment variable', async () => {
      const originalHost = process.env.OLLAMA_HOST;
      process.env.OLLAMA_HOST = 'http://custom-host:11434';

      const provider = new OllamaProvider('llava');
      // Force client creation by calling getClient
      (provider as any).client = null;
      (provider as any).getClient();

      const ollama = await import('ollama');
      expect(ollama.Ollama).toHaveBeenCalledWith({ host: 'http://custom-host:11434' });

      // Restore
      if (originalHost === undefined) {
        delete process.env.OLLAMA_HOST;
      } else {
        process.env.OLLAMA_HOST = originalHost;
      }
    });

    it('falls back to localhost when OLLAMA_HOST is not set', async () => {
      const originalHost = process.env.OLLAMA_HOST;
      delete process.env.OLLAMA_HOST;

      const provider = new OllamaProvider('llava');
      (provider as any).client = null;
      (provider as any).getClient();

      const ollama = await import('ollama');
      expect(ollama.Ollama).toHaveBeenCalledWith({ host: 'http://127.0.0.1:11434' });

      // Restore
      if (originalHost !== undefined) {
        process.env.OLLAMA_HOST = originalHost;
      }
    });
  });

  describe('AIProviderError', () => {
    it('stores the cause when provided', () => {
      const originalError = new Error('original failure');
      const error = new AIProviderError('Something failed', originalError);

      expect(error.message).toBe('Something failed');
      expect(error.cause).toBe(originalError);
      expect(error.name).toBe('AIProviderError');
    });

    it('has undefined cause when not provided', () => {
      const error = new AIProviderError('Something failed');

      expect(error.message).toBe('Something failed');
      expect(error.cause).toBeUndefined();
      expect(error.name).toBe('AIProviderError');
    });

    it('is an instance of Error', () => {
      const error = new AIProviderError('test');
      expect(error).toBeInstanceOf(Error);
    });

    it('accepts non-Error objects as cause', () => {
      const error = new AIProviderError('Something failed', { code: 'NETWORK_ERROR' });
      expect(error.cause).toEqual({ code: 'NETWORK_ERROR' });
    });
  });
});
