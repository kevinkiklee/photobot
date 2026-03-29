import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BouncerService } from '../services/bouncer';
import { GeminiProvider } from '@photobot/ai';
import sharp from 'sharp';

vi.mock('@photobot/ai', () => ({
  GeminiProvider: vi.fn().mockImplementation(() => ({
    analyzeImage: vi.fn(),
  })),
}));

vi.mock('sharp', () => ({
  default: vi.fn().mockReturnValue({
    toFile: vi.fn().mockResolvedValue({}),
  }),
}));

describe('BouncerService', () => {
  let bouncer: BouncerService;
  let mockGemini: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGemini = new GeminiProvider('fake-api-key');
    bouncer = new BouncerService(mockGemini);
  });

  describe('moderateImage', () => {
    it('allows clean images', async () => {
      mockGemini.analyzeImage.mockResolvedValue('CLEAN');
      const result = await bouncer.moderateImage('path/to/image.jpg');
      expect(result.allowed).toBe(true);
    });

    it('denies NSFW images', async () => {
      mockGemini.analyzeImage.mockResolvedValue('NSFW');
      const result = await bouncer.moderateImage('path/to/nsfw.jpg');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Image contains inappropriate content.');
    });

    it('denies injection attempts', async () => {
      mockGemini.analyzeImage.mockResolvedValue('INJECTION');
      const result = await bouncer.moderateImage('path/to/injection.jpg');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Security threat detected.');
    });
  });

  describe('stripMetadata', () => {
    it('calls sharp to strip metadata', async () => {
      await bouncer.stripMetadata('input.jpg', 'output.jpg');
      expect(sharp).toHaveBeenCalledWith('input.jpg');
      // sharp().toFile() is called
    });
  });

  describe('shadowRateLimit', () => {
    it('allows normal usage', async () => {
      const result = await bouncer.checkRateLimit('user-1');
      expect(result.allowed).toBe(true);
      expect(result.delay).toBe(0);
    });

    it('implements shadow rate limiting for high frequency', async () => {
      // Simulate high frequency
      for (let i = 0; i < 5; i++) {
        await bouncer.checkRateLimit('spammer');
      }
      const result = await bouncer.checkRateLimit('spammer');
      expect(result.delay).toBeGreaterThan(0);
    });
  });
});
