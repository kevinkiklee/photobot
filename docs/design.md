# 📸 Photobot: System Design & Architecture Document
**Target Environment:** "Photography Lounge" Discord Server (36k+ Members)
**Version:** 1.0 (MVP Focus)

## 1. Executive Summary
Photobot is a custom Discord bot designed to scale moderation, drive high-tier artistic engagement, and provide instant technical mentorship. It is being rolled out in phases. The P0 MVP focuses entirely on automated community engagement (Prompts & Trivia) to establish bot presence and test database load, before scaling up to complex AI-vision mentorship tools. 

**Core Constraint:** Photobot acts strictly as an analytical and educational assistant. It **does not** use generative AI to create images. 

---

## 2. Feature Roadmap & Phasing

### 🟢 Phase 1: P0 MVP (Launch Features)
*Focus: Low-friction daily engagement and establishing database stability.*
* **Daily Discussion Prompts (`/prompt` & Automated Scheduler):** The bot posts dynamic, non-repeating conversation starters tailored to specific photography genres (Street, Landscape, Studio, Gear Philosophy).
* **Photography Trivia (`/trivia` & Automated Scheduler):** Scheduled daily/weekly technical and historical trivia drops to gamify technical learning (e.g., "Sunny 16" rules, camera history).

### 🟡 Phase 2: Visual Utility (Fast Follows)
*Focus: Useful, non-AI visual tools.*
* **Structured Critique (`/critique`):** Formats user uploads with clear intent tags (e.g., *Technical, Compositional, Gentle, Harsh*).
* **Color Palette Extractor (`/palette`):** Analyzes uploaded images and returns a 5-color hex code graphic.
* **Focal Length Visualizer (`/focal`):** Returns comparative graphics demonstrating lens compression.
* **Lighting Setup Diagrams (`/lighting`):** Delivers top-down 2D studio lighting diagrams.
* **Composition & Grid Analyzer (`/grid`):** Overlays standard compositional guides onto images.

### 🔴 Phase 3: AI-Powered Mentorship (Advanced)
*Focus: High-value, vision-based AI analysis.*
* **The "Reverse Engineer" (`/how-to-edit`):** Uses AI Vision to analyze a reference photo and suggest Lightroom/Capture One adjustments.
* **The Troubleshooter (`/troubleshoot`):** Analyzes EXIF data and the visual image to diagnose missed focus, motion blur, or exposure failures.

---

## 3. System Architecture & Tech Stack
* **Bot Framework:** Discord.js (Node.js) or Pycord (Python). *Note for AI Agent: Python is preferred if Phase 2 visual tools utilize OpenCV/Pillow.*
* **Database:** PostgreSQL.
* **AI Engine (Phase 3):** OpenAI GPT-4o API or Anthropic Claude 3.5 Sonnet API.
* **Web Dashboard Backend:** Express.js or FastAPI.
* **Hosting:** AWS EC2, DigitalOcean Droplet, or Heroku.

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
A secure React/Next.js dashboard accessible via Discord OAuth2 (Admin role required).

* **P0 Dashboard Features:**
    * **Content Manager:** UI to batch-upload, edit, or delete Trivia questions and Prompts in the database.
    * **Schedule Toggle:** Turn the automated daily cron jobs on or off.
* **Phase 2/3 Dashboard Features:**
    * **Module Toggles:** Disable specific heavy commands (e.g., `/troubleshoot`) if API limits are reached.
    * **Analytics:** Track command usage distribution and peak server activity heatmaps.

---
