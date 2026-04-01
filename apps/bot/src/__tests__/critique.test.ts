import { vi, describe, it, expect, beforeEach } from 'vitest';
import { execute, data } from '../commands/critique';
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

describe('Critique Command', () => {
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
    expect(data.name).toBe('critique');
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
      content: 'Please attach an image to critique.',
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

  it('provides a critique if moderation passes', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (aiProvider.analyzeImage as any).mockResolvedValue('The composition is excellent, but the lighting is a bit flat.');

    await execute(interaction);

    expect(aiProvider.analyzeImage).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('critique'));
    expect(interaction.editReply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.arrayContaining([expect.objectContaining({ data: expect.objectContaining({ description: expect.stringContaining('The composition is excellent') }) })]),
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

  it('handles image download failure', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (global.fetch as any).mockResolvedValue({ ok: false });

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('error')
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

  it('passes role IDs from member cache to canUseAI', async () => {
    interaction.member.roles.cache = new Map([
      ['role-mod', { id: 'role-mod' }],
      ['role-vip', { id: 'role-vip' }],
    ]);
    interaction.options.getAttachment.mockReturnValue({
      url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg',
    });
    (aiProvider.analyzeImage as any).mockResolvedValue('Good composition.');

    await execute(interaction);

    expect(canUseAI).toHaveBeenCalledWith('123456789', 'user-123', ['role-mod', 'role-vip']);
  });

  it('handles fetch network error gracefully', async () => {
    const mockAttachment = { url: 'http://example.com/image.jpg', name: 'image.jpg', contentType: 'image/jpeg' };
    interaction.options.getAttachment.mockReturnValue(mockAttachment);
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    await execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('error')
    );
  });
});
