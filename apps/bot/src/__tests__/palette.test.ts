import { vi, describe, it, expect, beforeEach } from 'vitest';
import { execute, data } from '../commands/palette';
import { bouncerService, aiProvider } from '../services/ai';
import { canUseAI } from '../services/ai-access';

vi.mock('../services/ai', () => ({
  bouncerService: {
    moderateImage: vi.fn(),
    checkRateLimit: vi.fn(),
  },
  aiProvider: {
    analyzeImage: vi.fn(),
  },
}));

vi.mock('../services/ai-access', () => ({
  canUseAI: vi.fn().mockResolvedValue(true),
}));

vi.mock('node:fs/promises', () => ({
  mkdtemp: vi.fn().mockResolvedValue('/tmp/photobot-test'),
  writeFile: vi.fn().mockResolvedValue(undefined),
  unlink: vi.fn().mockResolvedValue(undefined),
  rmdir: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('node:path', () => ({
  join: vi.fn().mockImplementation((...args: string[]) => args.join('/')),
}));

vi.mock('node:os', () => ({
  tmpdir: vi.fn().mockReturnValue('/tmp'),
}));

vi.mock('sharp', () => {
  const mockSharp = vi.fn().mockReturnValue({
    png: vi.fn().mockReturnThis(),
    toFile: vi.fn().mockResolvedValue(undefined),
  });
  return { default: mockSharp };
});

vi.mock('discord.js', async () => {
  const actual = await vi.importActual('discord.js');
  return {
    ...actual,
    AttachmentBuilder: vi.fn().mockImplementation((path: string, options: any) => ({
      attachment: path,
      name: options?.name,
    })),
  };
});

describe('Palette Command', () => {
  let interaction: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Re-establish default mock return values after clearAllMocks
    (canUseAI as any).mockResolvedValue(true);
    (bouncerService.moderateImage as any).mockResolvedValue({ allowed: true });
    (bouncerService.checkRateLimit as any).mockResolvedValue({ allowed: true, delay: 0 });

    interaction = {
      guildId: '123456789',
      channelId: 'channel-123',
      user: { id: 'user-123' },
      member: { roles: { cache: new Map() } },
      options: {
        getAttachment: vi.fn(),
      },
      deferReply: vi.fn().mockResolvedValue(undefined),
      editReply: vi.fn().mockResolvedValue(undefined),
      reply: vi.fn().mockResolvedValue(undefined),
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as any);
  });

  it('has the correct command name', () => {
    expect(data.name).toBe('palette');
  });

  it('denies access when user has no AI grant', async () => {
    (canUseAI as any).mockResolvedValue(false);
    interaction.options.getAttachment.mockReturnValue({ url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' });

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('don\'t have access'),
      ephemeral: true,
    }));
    expect(interaction.deferReply).not.toHaveBeenCalled();
  });

  it('fails if no image is attached', async () => {
    interaction.options.getAttachment.mockReturnValue(null);

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: 'Please attach an image to extract a palette from.',
      ephemeral: true,
    }));
  });

  it('fails if image fails moderation', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (bouncerService.moderateImage as any).mockResolvedValue({ allowed: false, reason: 'Inappropriate content.' });

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith('Inappropriate content.');
  });

  it('provides a palette if moderation passes', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (aiProvider.analyzeImage as any).mockResolvedValue('Palette: #000000, #FFFFFF, #FF0000, #00FF00, #0000FF');

    await execute(interaction);

    expect(aiProvider.analyzeImage).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('colors'));
    expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.arrayContaining([expect.objectContaining({ data: expect.objectContaining({ description: expect.stringContaining('#000000') }) })]),
    }));
  });

  it('returns rate limit message when rate limited', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (bouncerService.checkRateLimit as any).mockResolvedValue({ allowed: false, delay: 0 });

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('Rate limit exceeded')
    );
  });

  it('handles fewer than 5 hex codes in AI response', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (aiProvider.analyzeImage as any).mockResolvedValue('Colors: #000000, #FFFFFF, #FF0000');

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('Could not extract')
    );
  });

  it('handles AI provider error', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (aiProvider.analyzeImage as any).mockRejectedValue(new Error('AI failed'));

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('error')
    );
  });

  it('extracts hex codes from verbose AI response with extra text', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (aiProvider.analyzeImage as any).mockResolvedValue(
      'Here are the dominant colors I found:\n1. #1A2B3C (dark blue)\n2. #FFFFFF (white)\n3. #FF5733 (orange)\n4. #2ECC71 (green)\n5. #8E44AD (purple)\nThese represent the main tones.'
    );

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.arrayContaining([expect.objectContaining({
        data: expect.objectContaining({
          description: expect.stringContaining('#1A2B3C'),
        }),
      })]),
    }));
  });

  it('uses only the first 5 hex codes when AI returns more than 5', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (aiProvider.analyzeImage as any).mockResolvedValue('#111111, #222222, #333333, #444444, #555555, #666666, #777777');

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.arrayContaining([expect.objectContaining({
        data: expect.objectContaining({
          description: expect.stringContaining('#555555'),
        }),
      })]),
    }));
    // Should NOT contain the 6th color
    const call = (interaction.editReply as any).mock.calls[0][0];
    expect(call.embeds[0].data.description).not.toContain('#666666');
  });

  it('fails when AI returns no hex codes at all', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (aiProvider.analyzeImage as any).mockResolvedValue('I cannot determine the colors in this image.');

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('Could not extract')
    );
  });

  it('rejects non-image content type', async () => {
    interaction.options.getAttachment.mockReturnValue({
      url: 'http://example.com/file.pdf',
      name: 'file.pdf',
      contentType: 'application/pdf',
    });

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('attach an image'),
      ephemeral: true,
    }));
  });

  it('requires a server context', async () => {
    interaction.guildId = null;

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('only be used in a server'),
      ephemeral: true,
    }));
  });
});
