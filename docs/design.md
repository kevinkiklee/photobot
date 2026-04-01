# 📸 Photobot: System Design & Architecture Document
**Target Environment:** "Photography Lounge" Discord Server (36k+ Members)
**Version:** 1.0 (MVP Focus)

## 1. Executive Summary
Photobot is a custom Discord bot designed to scale moderation, drive high-tier artistic engagement, and provide instant technical mentorship. It is being rolled out in phases. The P0 MVP focuses entirely on automated community engagement (Prompts & Trivia) to establish bot presence and test database load, before scaling up to complex AI-vision mentorship tools. 

**Core Constraint:** Photobot acts strictly as an analytical and educational assistant. It **does not** use generative AI to create images. 

---

## 2. Feature Roadmap & Phasing

### 🟢 Phase 1: P0 MVP (Launch Features) — ✅ Implemented
*Focus: Low-friction daily engagement and establishing database stability.*
* **Daily Discussion Prompts (`/discuss` & Automated Scheduler):** The bot posts dynamic, non-repeating conversation starters across 5 categories (Technique, Gear, Creative, Challenge, Inspiration). 270 curated prompts included, with optional AI generation. Automated scheduling via node-cron with DB persistence (`DiscussionSchedule` model).
* **Photography Trivia (`/trivia` & Automated Scheduler):** Scheduled daily/weekly technical and historical trivia drops to gamify technical learning (e.g., "Sunny 16" rules, camera history).

### 🟡 Phase 2: Visual Utility (Fast Follows) — ✅ Partially Implemented
*Focus: Useful, non-AI visual tools.*
* **AI Critique (`/critique`):** ✅ AI-powered technical feedback on photographs (composition, lighting, focus) via Gemini/Ollama.
* **Color Palette Extractor (`/palette`):** ✅ Analyzes uploaded images and returns a 5-color hex code graphic using Sharp.
* **Focal Length Visualizer (`/focal`):** Returns comparative graphics demonstrating lens compression.
* **Lighting Setup Diagrams (`/lighting`):** Delivers top-down 2D studio lighting diagrams.
* **Composition & Grid Analyzer (`/grid`):** Overlays standard compositional guides onto images.

### 🔴 Phase 3: AI-Powered Mentorship (Advanced) — Not Started
*Focus: High-value, vision-based AI analysis.*
* **The "Reverse Engineer" (`/how-to-edit`):** Uses AI Vision to analyze a reference photo and suggest Lightroom/Capture One adjustments.
* **The Troubleshooter (`/troubleshoot`):** Analyzes EXIF data and the visual image to diagnose missed focus, motion blur, or exposure failures.

---

## 3. System Architecture & Tech Stack
* **Bot Framework:** Discord.js 14 (Node.js) with node-cron for scheduling.
* **Image Processing:** Sharp (Node.js) for palette extraction, EXIF stripping.
* **Database:** Prisma 5 on Supabase PostgreSQL.
* **AI Engine:** Google Gemini (`@google/generative-ai`) in production, Ollama (`llava` model) for local dev. Provider-agnostic wrapper in `packages/ai`.
* **Web Dashboard:** Next.js 14 (App Router), NextAuth 4 (Discord OAuth), Tailwind CSS.
* **Hosting:** Railway (bot), Vercel (dashboard), Supabase (managed Postgres).

---

## 4. Database Schema (P0 & Core Tables)

### Table 1: MVP Engagement (Prompts & Trivia Bank)
```sql
CREATE TABLE content_bank (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL, -- 'prompt' or 'trivia'
    category VARCHAR(50) NOT NULL, -- e.g., 'gear', 'history', 'technique'
    question_text TEXT NOT NULL,
    options JSONB, -- For multiple choice trivia
    correct_answer VARCHAR(255), -- Null if it's just a discussion prompt
    has_been_used BOOLEAN DEFAULT FALSE,
    date_used TIMESTAMP WITH TIME ZONE
);
```

### Table 2: Structured Critique Tracker (Phase 2 Prep)
```sql
CREATE TABLE structured_critiques (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    message_id VARCHAR(255) UNIQUE NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    critique_type VARCHAR(50) NOT NULL,
    gear_used VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active', 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_critiques ON structured_critiques(user_id);
```

### Table 3: API Protection & Cooldowns (Phase 3 Prep)
```sql
CREATE TABLE user_cooldowns (
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    last_troubleshoot TIMESTAMP WITH TIME ZONE,
    last_reverse_engineer TIMESTAMP WITH TIME ZONE,
    troubleshoot_daily_uses INT DEFAULT 0,
    reverse_engineer_daily_uses INT DEFAULT 0,
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Security & Privacy Protocols
* **Zero-Retention Image Policy:** Images uploaded for Phase 2/3 commands must be processed entirely in volatile memory (RAM) or deleted within 5 seconds of processing.
* **No Model Training:** API endpoints must utilize "zero data retention" enterprise agreements. User copyright must be protected.
* **Role-Based Permissions:** The bot will strictly listen to commands in designated channels (e.g., `#bot-commands`, `#critique`) and ignore general chat.

---

## 6. Web Admin & Analytics Dashboard (Admin Panel)
A Next.js 14 dashboard accessible via NextAuth + Discord OAuth2 (Admin role required). Deployed on Vercel.

* **Implemented Dashboard Features:**
    * **Feature Toggles:** Enable/disable bot features per server with hierarchical permissions (Channel > Role > Server).
    * **Discussion Schedule Management:** Configure automated daily/weekly discussion prompts per channel.
    * **Audit Logs:** Full history of config changes with user, timestamp, and old/new values.
    * **Server Selector:** Switch between Discord servers where the user has admin privileges.
    * **UI Polish:** Toast notifications, loading skeletons, error boundaries, mobile navigation, 404 page.
* **Planned Dashboard Features:**
    * **Content Manager:** UI to batch-upload, edit, or delete Trivia questions and Prompts in the database.
    * **Analytics:** Track command usage distribution and peak server activity heatmaps.

---
