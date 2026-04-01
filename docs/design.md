# Photobot: System Design & Architecture Document
**Target Environment:** "Photography Lounge" Discord Server (36k+ Members)
**Version:** 1.0

## 1. Executive Summary
Photobot is a custom Discord bot designed to scale moderation, drive high-tier artistic engagement, and provide instant technical mentorship. It is being rolled out in phases. Phase 1 (discussion prompts) and Phase 2 (AI critique + palette) are implemented. Phase 3 (advanced AI mentorship) is planned.

**Core Constraint:** Photobot acts strictly as an analytical and educational assistant. It **does not** use generative AI to create images.

---

## 2. Feature Roadmap & Phasing

### Phase 1: Community Engagement — Implemented
*Focus: Low-friction daily engagement and establishing database stability.*
* **Discussion Prompts (`/discuss` & Automated Scheduler):** 241 curated prompts across 2 categories (Creative Process, Inspiration) stored in markdown. Interval-based scheduler posts every 6 hours with conversation-aware timing (waits for a quiet period before posting). Optional AI prompt generation via Gemini/Ollama with curated fallback.

### Phase 2: Visual Utility — Implemented
*Focus: AI-powered image analysis tools with access control.*
* **AI Critique (`/critique`):** AI-powered technical feedback on photographs (composition, lighting, focus) via Gemini/Ollama. Requires AI access grant.
* **Color Palette Extractor (`/palette`):** AI extracts 5 dominant colors, rendered as a branded hex-code swatch using Sharp. Requires AI access grant.
* **AI Access Control (`/ai`):** Allowlist model — admins grant AI command access to specific roles (e.g., Moderator, Specialist) or individual users. Commands are hidden from members without access via Discord's `defaultMemberPermissions(0n)`.
* **Bouncer Pipeline:** Two-layer security for all image commands:
  * Layer 1: AI moderation (CLEAN/NSFW/INJECTION/VIOLENCE classification)
  * Layer 2: Shadow rate limiting (5 req/min threshold, incremental delay)
  * EXIF metadata stripping via Sharp

### Phase 2: Not Yet Implemented
* **Focal Length Visualizer (`/focal`):** Comparative graphics demonstrating lens compression.
* **Lighting Setup Diagrams (`/lighting`):** Top-down 2D studio lighting diagrams.
* **Composition & Grid Analyzer (`/grid`):** Overlay compositional guides onto images.

### Phase 3: AI-Powered Mentorship — Not Started
*Focus: High-value, vision-based AI analysis.*
* **The "Reverse Engineer" (`/how-to-edit`):** Uses AI Vision to analyze a reference photo and suggest Lightroom/Capture One adjustments.
* **The Troubleshooter (`/troubleshoot`):** Analyzes EXIF data and the visual image to diagnose missed focus, motion blur, or exposure failures.

---

## 3. System Architecture & Tech Stack

```
                    ┌──────────────┐
                    │   Supabase   │
                    │  (Postgres)  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
     ┌────────▼───┐  ┌────▼─────┐  ┌──▼───────────┐
     │  Railway   │  │  Vercel  │  │  Gemini API  │
     │   (Bot)    │  │(Dashboard│  │  (AI Vision) │
     └────────────┘  └──────────┘  └──────────────┘
```

* **Bot Framework:** Discord.js 14 (Node.js) with interval-based scheduler.
* **Image Processing:** Sharp (Node.js) for palette rendering, EXIF stripping.
* **Database:** Prisma 5 on Supabase PostgreSQL.
* **AI Engine:** Google Gemini (`@google/generative-ai`) in production, Ollama (`llava` model) for local dev. Provider-agnostic wrapper in `packages/ai`.
* **Web Dashboard:** Next.js 14 (App Router), NextAuth 4 (Discord OAuth), Tailwind CSS.
* **Hosting:** Railway (bot), Vercel (dashboard), Supabase (managed Postgres).
* **Testing:** Vitest across all workspaces (176 unit tests, integration tests for DB operations).

---

## 4. Bot Commands

| Command | Description | Access |
|---------|-------------|--------|
| `/critique <image>` | Technical feedback on a photograph | AI grant |
| `/palette <image>` | Extract a 5-color hex palette | AI grant |
| `/discuss prompt [category]` | Post a discussion prompt | Admin |
| `/discuss schedule` | Set up automatic discussion prompts | Admin |
| `/discuss list` | List discussion schedules | Admin |
| `/settings list` | List feature toggles | Admin |
| `/settings toggle <feature> <enabled>` | Enable/disable a feature | Admin |
| `/ai grant-role <role>` | Grant AI access to a role | Admin |
| `/ai revoke-role <role>` | Revoke AI access from a role | Admin |
| `/ai grant-user <user>` | Grant AI access to a user | Admin |
| `/ai revoke-user <user>` | Revoke AI access from a user | Admin |
| `/ai list` | List all AI access grants | Admin |

---

## 5. Database Schema

### Prisma Models (Implemented)

**FeatureConfig** — Per-server feature toggles with hierarchical permissions.
```
feature_configs (server_id, target_type [SERVER|ROLE|CHANNEL], target_id, feature_key, is_enabled)
  UNIQUE(server_id, target_type, target_id, feature_key)
```

**ConfigAuditLog** — Full history of config changes.
```
config_audit_logs (server_id, user_id, action, target_type, target_id, feature_key, old_value, new_value, created_at)
```

**AIAccessGrant** — Allowlist for AI command access.
```
ai_access_grants (server_id, grant_type [ROLE|USER], target_id, granted_by, created_at)
  UNIQUE(server_id, grant_type, target_id)
```

**DiscussionSchedule** — Automated prompt posting configuration.
```
discussion_schedules (server_id, channel_id, days, time_utc, timezone, category_filter, use_ai, is_active, created_by)
  UNIQUE(server_id, channel_id)
```

**DiscussionPromptLog** — Tracks posted prompts for non-repeat logic.
```
discussion_prompt_logs (server_id, channel_id, prompt_text, category, source [curated|ai], thread_id, posted_at)
  INDEX(server_id, posted_at)
```

**UserUsageMetric** — Command usage and rate limit tracking.
```
user_usage_metrics (user_id, last_active, total_commands, rate_limit_hits, security_flags)
```

**NextAuth Models** — Standard Account, Session, User, VerificationToken tables for Discord OAuth.

---

## 6. Security & Privacy Protocols
* **Zero-Retention Image Policy:** Images are processed in temp directories and deleted immediately after processing (`finally` block cleanup).
* **AI Moderation:** All image commands pass through the Bouncer pipeline before AI analysis.
* **Shadow Rate Limiting:** In-memory per-user request counting with incremental response delays (1s per request over threshold).
* **AI Access Control:** Allowlist model — AI commands are restricted by default. Admins explicitly grant access to roles or individual users.
* **Hierarchical Permissions:** `canUseFeature()` implements Channel > Role > Server specificity with "Allow Wins" conflict resolution for role-level configs.

---

## 7. Web Admin Dashboard
A Next.js 14 dashboard accessible via NextAuth + Discord OAuth2 (Admin role required). Deployed on Vercel.

### Implemented
* **Feature Toggles:** Enable/disable bot features per server with hierarchical permissions (Channel > Role > Server).
* **Discussion Schedule Management:** Configure automated discussion prompts per channel.
* **Audit Logs:** Full history of config changes with user, timestamp, old/new values, and action badges.
* **Server Selector:** Switch between Discord servers where the user has admin privileges.
* **UI Polish:** Toast notifications, loading skeletons, error boundaries, mobile navigation, 404 page.

### Planned
* **AI Access Management:** UI to manage AI access grants (currently Discord-only via `/ai` command).
* **Content Manager:** UI to batch-upload, edit, or delete discussion prompts.
* **Analytics:** Track command usage distribution and peak server activity heatmaps.

---

## 8. Deployment

| Component | Platform | Details |
|-----------|----------|---------|
| Bot | Railway | Persistent Node.js process, Discord.js websocket |
| Dashboard | Vercel | Next.js serverless, auto-deploys on push to main |
| Database | Supabase | Managed Postgres, shared by bot and dashboard |
| AI (prod) | Google Gemini API | `gemini-1.5-flash` model |
| AI (local) | Ollama (Docker) | `llava` model, port 11434 |

See [docs/DEPLOYMENT.md](DEPLOYMENT.md) for the full deployment and release process guide.
