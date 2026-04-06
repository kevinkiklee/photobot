# Photobot Roadmap

Derived from `docs/DESIGN.md`, feature specs in `docs/superpowers/specs/`, and the current state of the codebase. Last updated: 2026-04-06.

---

## Completed

### Bot Features
- [x] Discussion prompts (`/discuss prompt`, `/discuss schedule`, `/discuss list`)
- [x] Curated prompt bank (241 prompts across 2 categories in `discussion-prompts.md`)
- [x] Interval-based auto-scheduler with conversation-aware timing
- [x] Hierarchical Permissions — Channel > Role > Server with "Allow Wins" resolution

### Admin Dashboard
- [x] Feature toggles with hierarchical permissions
- [x] Audit logs with action badges, relative timestamps, sticky header
- [x] Single-server (Photography Lounge) — no server selector needed
- [x] Mobile navigation (bottom tab bar, responsive layout)
- [x] Loading skeletons and error boundaries for all pages
- [x] Toast notification system
- [x] 404 page
- [x] Theme toggle (dark/light)
- [x] SVG favicon

### Prompt Voting Site (`apps/voting`)
- [x] Community upvote/downvote on discussion prompts
- [x] Discord OAuth (NextAuth, `identify email` scope)
- [x] Tag filtering (17 tags), text search, sorting, pagination
- [x] Admin view with voter breakdown
- [x] Prompt submission, editing, deletion
- [x] Duplicate flagging
- [x] Rate limiting (20 votes/min, 20 submissions/min)
- [x] Privacy (submittedBy stripped from non-admin responses)
- [x] Tag vote-for-removal system
- [x] Deployed to `discussion-prompts.pl.iser.io`

### Infrastructure
- [x] Dependency upgrades: Next.js 16, React 19, Prisma 7, TypeScript, Vitest
- [x] Vercel monorepo deployment (voting + dashboard) with Prisma NFT trace patching
- [x] Bot deployment on Railway
- [x] Supabase Postgres (shared database)
- [x] CI workflow (`.github/workflows/ci.yml`)

---

## Not Yet Implemented

### Dashboard: Planned Features
_Specified in `docs/DESIGN.md` §7._

- [ ] **Content Manager** — Batch-upload, edit, or delete discussion prompts from the dashboard
- [ ] **Analytics** — Command usage distribution and peak server activity heatmaps
- [ ] **OG share image** (`public/og.png`) — Static 1200×630 branded image for social sharing (specified in dashboard polish spec, not yet created)

### Dashboard: Schedule Management UI
_Specified in `docs/superpowers/specs/2026-03-29-discussion-prompt-design.md` §Dashboard Integration._

- [ ] **Discussion Schedules card** on settings page — CRUD for auto-post schedules (channel, days, time, category) with audit logging. Currently schedules are only manageable via Discord `/discuss schedule` command.

---

## Future Considerations

These aren't formally specified but are natural extensions based on the architecture:

- **Voting site → bot integration** — Auto-retire low-rated prompts from the bot's curated bank based on voting data
- **Dashboard discussion prompt preview** — View upcoming scheduled prompts and posting history
- **Webhook notifications** — Notify admins via Discord webhook when new prompts are submitted or flagged
