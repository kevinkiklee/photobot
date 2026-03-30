export const BRAND_COLOR = 0x74D7EC;

export interface DiscussionPrompt {
  category: string;
  text: string;
  reactions: string[];
}

export const DISCUSSION_CATEGORIES: Record<string, { label: string; description: string }> = {
  technique: { label: 'Technique', description: 'Composition, exposure, lighting, post-processing' },
  gear: { label: 'Gear', description: 'Lenses, cameras, accessories, workflow tools' },
  creative: { label: 'Creative Process', description: 'Inspiration, artistic voice, creative blocks' },
  challenge: { label: 'Challenge', description: 'Photo assignments and creative constraints' },
  inspiration: { label: 'Inspiration', description: 'Other art forms, artists, cross-discipline ideas' },
};

export const DISCUSSION_PROMPTS: DiscussionPrompt[] = [
  // --- technique (12) ---
  { category: 'technique', text: "What's a composition rule you intentionally break, and what made you start?", reactions: ['📐', '🎯', '💡'] },
  { category: 'technique', text: 'How do you decide between shooting wide open vs. stopped down for a portrait?', reactions: ['📸', '🔍', '🤔'] },
  { category: 'technique', text: 'What is your go-to approach for handling harsh midday light?', reactions: ['☀️', '🌤️', '💡'] },
  { category: 'technique', text: "Share a photo where you nailed the exposure in a tricky situation — what was your metering strategy?", reactions: ['🎯', '📊', '🔥'] },
  { category: 'technique', text: 'Do you prefer to get it right in camera or fix it in post? Where do you draw the line?', reactions: ['📷', '🖥️', '⚖️'] },
  { category: 'technique', text: 'What is the most underrated post-processing technique you use regularly?', reactions: ['🖥️', '✨', '💎'] },
  { category: 'technique', text: "How do you approach focus stacking for landscape shots? Any tips for beginners?", reactions: ['🏔️', '🔍', '📚'] },
  { category: 'technique', text: "What's the biggest mistake you see beginners make with white balance?", reactions: ['🎨', '🌡️', '📝'] },
  { category: 'technique', text: 'When do you choose black and white over color, and what drives that decision?', reactions: ['⬛', '⬜', '🎭'] },
  { category: 'technique', text: 'How has your editing style evolved over the past year?', reactions: ['📈', '🖌️', '🔄'] },
  { category: 'technique', text: "What's one technique you struggled with but finally mastered? How did it click?", reactions: ['💪', '💡', '🎉'] },
  { category: 'technique', text: 'Do you shoot bracketed exposures often? When is it worth the effort?', reactions: ['📊', '🌅', '🤷'] },

  // --- gear (11) ---
  { category: 'gear', text: "What's the one piece of gear (besides your camera) you never leave home without?", reactions: ['🎒', '⭐', '📸'] },
  { category: 'gear', text: 'If you could only shoot with one focal length for a year, what would you choose and why?', reactions: ['🔭', '📏', '🤔'] },
  { category: 'gear', text: "What's the best budget photography accessory you've ever bought?", reactions: ['💰', '🏆', '🛒'] },
  { category: 'gear', text: 'Tripod or no tripod — when do you insist on using one?', reactions: ['📐', '🖐️', '⚖️'] },
  { category: 'gear', text: "What software or app has most improved your workflow this year?", reactions: ['💻', '📱', '🚀'] },
  { category: 'gear', text: 'Do you use filters (ND, polarizer, etc.) regularly? Which ones and when?', reactions: ['🔲', '🌊', '🏔️'] },
  { category: 'gear', text: "What's a piece of gear you bought that turned out to be a waste of money?", reactions: ['💸', '😅', '🗑️'] },
  { category: 'gear', text: 'Prime vs. zoom — what is your philosophy and has it changed over time?', reactions: ['🔍', '🔭', '🔄'] },
  { category: 'gear', text: "How do you organize and back up your photo library?", reactions: ['💾', '📂', '☁️'] },
  { category: 'gear', text: "What camera bag setup are you currently using and what would you change?", reactions: ['🎒', '📦', '✏️'] },
  { category: 'gear', text: 'Have you tried any AI-powered editing tools? What do you think of them?', reactions: ['🤖', '🖌️', '👍'] },

  // --- creative (11) ---
  { category: 'creative', text: 'How do you push through a creative rut when nothing feels inspiring?', reactions: ['🧠', '💪', '🌟'] },
  { category: 'creative', text: "What other art form influences your photography the most?", reactions: ['🎨', '🎵', '📖'] },
  { category: 'creative', text: "How do you find your personal style and keep it evolving?", reactions: ['🔍', '🎭', '📈'] },
  { category: 'creative', text: 'Do you plan your shoots in advance or prefer spontaneous discovery?', reactions: ['📋', '🎲', '⚖️'] },
  { category: 'creative', text: "What's a project or series you've been wanting to start but haven't yet? What's holding you back?", reactions: ['💭', '🚧', '🚀'] },
  { category: 'creative', text: 'How do you balance shooting for yourself vs. shooting what gets engagement?', reactions: ['❤️', '📊', '🤔'] },
  { category: 'creative', text: "What's the most meaningful feedback you've ever received on your work?", reactions: ['💬', '💡', '🙏'] },
  { category: 'creative', text: 'Do you keep a photography journal or sketchbook? How does it help your process?', reactions: ['📓', '✏️', '💡'] },
  { category: 'creative', text: "What emotion or feeling do you most want your photos to evoke?", reactions: ['😊', '😢', '😮'] },
  { category: 'creative', text: 'How do you decide when a photo is "done" in post-processing?', reactions: ['✅', '🖥️', '🤔'] },
  { category: 'creative', text: "Has your 'why' for photography changed since you started?", reactions: ['💭', '🔄', '❤️'] },

  // --- challenge (10) ---
  { category: 'challenge', text: 'Challenge: shoot 10 photos using only natural window light this week. Share your favorite!', reactions: ['🪟', '☀️', '📸'] },
  { category: 'challenge', text: 'Challenge: capture a compelling photo where the main subject takes up less than 10% of the frame.', reactions: ['🔍', '🖼️', '🎯'] },
  { category: 'challenge', text: 'Challenge: take a photo that tells a complete story without showing any faces.', reactions: ['📖', '🎭', '📷'] },
  { category: 'challenge', text: "Challenge: photograph something mundane and make it look extraordinary.", reactions: ['🥄', '✨', '🏆'] },
  { category: 'challenge', text: 'Challenge: shoot a series of 3 photos that work together to convey a mood.', reactions: ['🎭', '3️⃣', '🌙'] },
  { category: 'challenge', text: 'Challenge: use only your phone camera for a day and share the best result.', reactions: ['📱', '🏆', '👀'] },
  { category: 'challenge', text: 'Challenge: find and photograph an interesting shadow. Bonus if it tells a story.', reactions: ['🌑', '📸', '⭐'] },
  { category: 'challenge', text: 'Challenge: take a self-portrait without showing your face.', reactions: ['🤳', '🎭', '🔥'] },
  { category: 'challenge', text: 'Challenge: photograph the same subject from 5 different angles. Which works best?', reactions: ['🔄', '5️⃣', '👁️'] },
  { category: 'challenge', text: 'Challenge: capture motion blur intentionally to create an abstract image.', reactions: ['💨', '🎨', '📸'] },

  // --- inspiration (10) ---
  { category: 'inspiration', text: "What photographer's work has had the biggest impact on how you see the world?", reactions: ['👁️', '🌍', '📚'] },
  { category: 'inspiration', text: 'Has a painting, film, or piece of music ever directly inspired a photo you took?', reactions: ['🎨', '🎬', '🎵'] },
  { category: 'inspiration', text: "What's a photography book or documentary you'd recommend to everyone here?", reactions: ['📖', '🎬', '⭐'] },
  { category: 'inspiration', text: 'How does the place you live shape the kind of photos you take?', reactions: ['🏙️', '🌲', '📸'] },
  { category: 'inspiration', text: "What non-photography skill has unexpectedly improved your photos?", reactions: ['🧩', '💡', '📈'] },
  { category: 'inspiration', text: 'Do you look at other photographers\' work for inspiration, or do you avoid it to stay original?', reactions: ['👀', '🚫', '⚖️'] },
  { category: 'inspiration', text: "What's a genre of photography you've never tried but are curious about?", reactions: ['🆕', '🤔', '🎯'] },
  { category: 'inspiration', text: 'If you could photograph any event, place, or person — past or present — what would it be?', reactions: ['🌍', '⏳', '✨'] },
  { category: 'inspiration', text: "How do you use social media as inspiration without falling into comparison?", reactions: ['📱', '⚖️', '💪'] },
  { category: 'inspiration', text: 'What everyday moment recently caught your eye and made you wish you had your camera?', reactions: ['👁️', '📷', '💭'] },
];
