# Photobot: System Design & Architecture Document
**Target Environment:** Photography Lounge Discord Server (single-server deployment)
**Version:** 2.0

## 1. Executive Summary
Photobot is a custom Discord bot that drives community engagement in Photography Lounge through curated discussion prompts and an admin dashboard. It operates exclusively in one server — auto-leaving any other server it's added to.

**Core Constraint:** Photobot acts strictly as a community engagement tool. It **does not** use generative AI or process images.

---

## 2. Features

### Discussion Prompts — Implemented
* **Discussion Prompts (`/discuss` & Automated Scheduler):** 400 curated prompts across 2 categories (Creative Process, Inspiration) stored in markdown. Interval-based scheduler posts every 6 hours with conversation-aware timing (waits for a quiet period before posting).

### Admin Dashboard — Implemented
* **Feature Toggles:** Enable/disable bot features with hierarchical permissions (Channel > Role > Server).
* **Discussion Schedule Management:** Configure automated discussion prompts per channel.
* **Audit Logs:** Full history of config changes with user, timestamp, old/new values, and action badges.

### Community Voting — Implemented
* **Prompt Voting Site:** Community members upvote/downvote discussion prompts, submit new prompts, flag duplicates. Admin oversight with role-based access control.

---

## 3. System Architecture & Tech Stack

```
                    ┌──────────────┐
                    │   Supabase   │
                    │  (Postgres)  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │                         │
     ┌────────▼───┐          ┌─────────▼──────────┐
     │  Railway   │          │      Vercel        │
     │   (Bot)    │          │ Dashboard + Voting │
     └────────────┘          └────────────────────┘
```

* **Bot Framework:** Discord.js 14 (Node.js) with interval-based scheduler.
* **Database:** Prisma 7 on Supabase PostgreSQL.
* **Web Dashboard:** Next.js 16 (App Router), NextAuth 4 (Discord OAuth), Tailwind CSS.
* **Voting Site:** Next.js 16 (App Router), NextAuth 4, Tailwind CSS.
* **Hosting:** Railway (bot), Vercel (dashboard + voting), Supabase (managed Postgres).
* **Testing:** Vitest across all workspaces.

---

## 4. Bot Commands

| Command | Description | Access |
|---------|-------------|--------|
| `/discuss prompt [category]` | Post a discussion prompt | Admin |
| `/discuss schedule` | Set up automatic discussion prompts | Admin |
| `/discuss list` | List discussion schedules | Admin |
| `/settings` | View feature toggles | Admin |

---

## 5. Database Schema

### Prisma Models (Implemented)

**FeatureConfig** — Feature toggles with hierarchical permissions.
```
feature_configs (target_type [SERVER|ROLE|CHANNEL], target_id, feature_key, is_enabled)
  UNIQUE(target_type, target_id, feature_key)
```

**ConfigAuditLog** — Full history of config changes.
```
config_audit_logs (user_id, action, target_type, target_id, feature_key, old_value, new_value, created_at)
```

**DiscussionSchedule** — Automated prompt posting configuration.
```
discussion_schedules (channel_id, category_filter, is_active, created_by)
  UNIQUE(channel_id)
```

**DiscussionPromptLog** — Tracks posted prompts for non-repeat logic.
```
discussion_prompt_logs (channel_id, prompt_text, category, posted_at)
  INDEX(posted_at)
```

**Prompt, PromptTag, PromptVote, PromptDuplicateFlag, PromptTagSuggestion** — Community voting models (global, not server-scoped).

**NextAuth Models** — Standard Account, Session, User, VerificationToken tables for Discord OAuth.

---

## 6. Security & Privacy Protocols
* **Single-Server Guard:** Bot auto-leaves any server that isn't Photography Lounge and ignores commands from non-PL guilds.
* **Hierarchical Permissions:** `canUseFeature()` implements Channel > Role > Server specificity with "Allow Wins" conflict resolution for role-level configs.
* **Dashboard Authorization:** Discord OAuth verifies the user is an admin of Photography Lounge before granting dashboard access.

---

## 7. Web Admin Dashboard
A Next.js 16 dashboard accessible via NextAuth + Discord OAuth2 (PL Admin role required). Deployed on Vercel.

### Implemented
* **Feature Toggles:** Enable/disable bot features with hierarchical permissions (Channel > Role > Server).
* **Discussion Schedule Management:** Configure automated discussion prompts per channel.
* **Audit Logs:** Full history of config changes with user, timestamp, old/new values, and action badges.
* **UI Polish:** Toast notifications, loading skeletons, error boundaries, mobile navigation, 404 page.

---

## 8. Deployment

| Component | Platform | Details |
|-----------|----------|---------|
| Bot | Railway | Persistent Node.js process, Discord.js websocket |
| Dashboard | Vercel | Next.js serverless, auto-deploys on push to main |
| Voting Site | Vercel | Next.js serverless, auto-deploys on push to main |
| Database | Supabase | Managed Postgres, shared by all apps |

See [docs/DEPLOYMENT.md](DEPLOYMENT.md) for the full deployment and release process guide.
