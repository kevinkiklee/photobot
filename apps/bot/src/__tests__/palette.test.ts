import { vi, describe, it, expect, beforeEach } from 'vitest';
import { execute, data } from '../commands/palette';
import { bouncerService, aiProvider } from '../services/ai';

vi.mock('../services/ai', () => ({
  bouncerService: {
    moderateImage: vi.fn(),
    checkRateLimit: vi.fn(),
  },
  aiProvider: {
    analyzeImage: vi.fn(),
  },
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
});
