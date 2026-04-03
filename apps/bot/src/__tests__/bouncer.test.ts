import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BouncerService } from '../services/bouncer';
import { GeminiProvider } from '@photobot/ai';
import sharp from 'sharp';

vi.mock('@photobot/ai', () => ({
  GeminiProvider: vi.fn().mockImplementation(function () {
    return { analyzeImage: vi.fn() };
  }),
}));

vi.mock('sharp', () => ({
  default: vi.fn(function () {
    return {
      toFile: vi.fn().mockResolvedValue({}),
    };
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

    it('denies images with graphic violence', async () => {
      mockGemini.analyzeImage.mockResolvedValue('VIOLENCE');
      const result = await bouncer.moderateImage('path/to/violent.jpg');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Image contains graphic violence.');
    });

    it('defaults to allowed for unrecognized response', async () => {
      mockGemini.analyzeImage.mockResolvedValue('SOMETHING_UNKNOWN');
      const result = await bouncer.moderateImage('path/to/weird.jpg');
      expect(result.allowed).toBe(true);
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

    it('isolates rate limits between different users', async () => {
      for (let i = 0; i < 6; i++) {
        await bouncer.checkRateLimit('user-a');
      }
      const result = await bouncer.checkRateLimit('user-b');
      expect(result.delay).toBe(0);
    });

    it('resets rate limit count after one minute boundary', async () => {
      vi.useFakeTimers();
      try {
        // First 5 requests are within threshold (no delay, no blocking)
        for (let i = 0; i < 5; i++) {
          await bouncer.checkRateLimit('reset-user');
        }

        // 6th call exceeds threshold -> will setTimeout; start it without awaiting
        const sixthCall = bouncer.checkRateLimit('reset-user');
        // Advance past the shadow delay so the internal setTimeout resolves
        await vi.advanceTimersByTimeAsync(2000);
        const beforeReset = await sixthCall;
        expect(beforeReset.delay).toBeGreaterThan(0);

        // Advance time past the 1-minute window
        await vi.advanceTimersByTimeAsync(61 * 1000);

        // After reset, count restarts — first request in new window has no delay
        const afterReset = await bouncer.checkRateLimit('reset-user');
        expect(afterReset.delay).toBe(0);
        expect(afterReset.allowed).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('increases delay linearly for each request over threshold', async () => {
      vi.useFakeTimers();
      try {
        // First 5 requests are within threshold (no delay)
        for (let i = 0; i < 5; i++) {
          const result = await bouncer.checkRateLimit('linear-user');
          expect(result.delay).toBe(0);
        }

        // 6th request: excess=1 -> delay=1000ms
        const p1 = bouncer.checkRateLimit('linear-user');
        await vi.advanceTimersByTimeAsync(1000);
        const r1 = await p1;
        expect(r1.delay).toBe(1000);

        // 7th request: excess=2 -> delay=2000ms
        const p2 = bouncer.checkRateLimit('linear-user');
        await vi.advanceTimersByTimeAsync(2000);
        const r2 = await p2;
        expect(r2.delay).toBe(2000);

        // 8th request: excess=3 -> delay=3000ms
        const p3 = bouncer.checkRateLimit('linear-user');
        await vi.advanceTimersByTimeAsync(3000);
        const r3 = await p3;
        expect(r3.delay).toBe(3000);
      } finally {
        vi.useRealTimers();
      }
    });

    it('does not let one user rate limit affect another user', async () => {
      vi.useFakeTimers();
      try {
        // Push user-x well past threshold — need to resolve each delayed call
        for (let i = 0; i < 5; i++) {
          await bouncer.checkRateLimit('user-x');
        }
        for (let i = 0; i < 5; i++) {
          const p = bouncer.checkRateLimit('user-x');
          await vi.advanceTimersByTimeAsync(10000);
          await p;
        }
        const pX = bouncer.checkRateLimit('user-x');
        await vi.advanceTimersByTimeAsync(10000);
        const userXResult = await pX;
        expect(userXResult.delay).toBeGreaterThan(0);

        // user-y and user-z should be completely unaffected
        const userYResult = await bouncer.checkRateLimit('user-y');
        expect(userYResult.allowed).toBe(true);
        expect(userYResult.delay).toBe(0);

        const userZResult = await bouncer.checkRateLimit('user-z');
        expect(userZResult.allowed).toBe(true);
        expect(userZResult.delay).toBe(0);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('stripMetadata - output verification', () => {
    it('calls sharp with input path and toFile with output path', async () => {
      const mockToFile = vi.fn().mockResolvedValue({});
      (sharp as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
        return { toFile: mockToFile };
      });

      await bouncer.stripMetadata('photo.jpg', 'stripped.jpg');

      expect(sharp).toHaveBeenCalledWith('photo.jpg');
      expect(mockToFile).toHaveBeenCalledWith('stripped.jpg');
    });
  });
});
