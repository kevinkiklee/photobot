# Photobot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a photography-focused Discord bot with a hierarchical permission system, security-first AI analysis, and an admin dashboard.

**Architecture:** A monorepo containing a Discord.js bot (Railway), a Next.js dashboard (Vercel), and a shared database layer (Supabase). It uses a "Bouncer" AI architecture for secure, tiered analysis using Gemini.

**Tech Stack:** Node.js, TypeScript, Discord.js, Next.js, Supabase (Postgres), Gemini API, Ollama (local dev).

---

## Phase 1: Foundation & Shared Packages

### Task 1: Monorepo Scaffolding
**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`
- Create: `apps/bot/package.json`, `apps/dashboard/package.json`
- Create: `packages/db/package.json`, `packages/ai/package.json`, `packages/ui/package.json`

- [ ] **Step 1: Initialize root and workspace**
- [ ] **Step 2: Initialize apps and packages**
- [ ] **Step 3: Commit**

### Task 2: Shared Database Layer (Supabase/Prisma)
**Files:**
- Create: `packages/db/prisma/schema.prisma`
- Create: `packages/db/src/index.ts`

- [ ] **Step 1: Define schema for feature_configs, config_audit_logs, and user_usage_metrics**
- [ ] **Step 2: Initialize Prisma client**
- [ ] **Step 3: Commit**

### Task 3: Provider-Agnostic AI Wrapper
**Files:**
- Create: `packages/ai/src/index.ts`
- Create: `packages/ai/src/providers/gemini.ts`
- Create: `packages/ai/src/providers/ollama.ts`

- [ ] **Step 1: Define AIProvider interface**
- [ ] **Step 2: Implement Gemini provider**
- [ ] **Step 3: Implement Ollama (local) provider**
- [ ] **Step 4: Commit**

---

## Phase 2: Core Bot & Permission System

### Task 4: Bot Scaffolding & Command Handler
**Files:**
- Create: `apps/bot/src/index.ts`
- Create: `apps/bot/src/commands/settings.ts`

- [ ] **Step 1: Setup Discord.js client**
- [ ] **Step 2: Implement /settings command for feature toggles**
- [ ] **Step 3: Commit**

### Task 5: Hierarchical Permission Middleware
**Files:**
- Create: `apps/bot/src/middleware/permissions.ts`

- [ ] **Step 1: Implement "Specificity Ladder" logic**
- [ ] **Step 2: Implement "Allow Wins" conflict resolution**
- [ ] **Step 3: Commit**

---

## Phase 3: Security & AI Features

### Task 6: The "Bouncer" Security Pipeline
**Files:**
- Create: `apps/bot/src/services/bouncer.ts`

- [ ] **Step 1: Implement Layer 1 (Gemini 1.5 Flash) moderation check**
- [ ] **Step 2: Implement EXIF stripping service**
- [ ] **Step 3: Implement Shadow Rate Limiting**
- [ ] **Step 4: Commit**

### Task 7: Technical Analysis Commands
**Files:**
- Create: `apps/bot/src/commands/critique.ts`
- Create: `apps/bot/src/commands/palette.ts`

- [ ] **Step 1: Implement /palette (Vision-only)**
- [ ] **Step 2: Implement /critique (Layer 2 analysis)**
- [ ] **Step 3: Commit**

---

## Phase 4: Admin Dashboard & Audit Logs

### Task 8: Dashboard Scaffolding & Auth
**Files:**
- Create: `apps/dashboard/src/app/page.tsx`
- Create: `apps/dashboard/src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Setup Next.js with Tailwind (Refined Brand Colors)**
- [ ] **Step 2: Implement Discord OAuth2 with Supabase**
- [ ] **Step 3: Commit**

### Task 9: Feature Management & Audit View
**Files:**
- Create: `apps/dashboard/src/app/settings/page.tsx`
- Create: `apps/dashboard/src/app/audit/page.tsx`

- [ ] **Step 1: Build Feature Toggle Grid**
- [ ] **Step 2: Build Audit Log viewer**
- [ ] **Step 3: Commit**

---

## Phase 5: Local Development & CI/CD

### Task 10: "One-Command" Dev Environment
**Files:**
- Create: `scripts/dev.sh`
- Create: `docker-compose.yml`

- [ ] **Step 1: Setup Docker for Supabase Local & Ollama**
- [ ] **Step 2: Setup ngrok tunnel script**
- [ ] **Step 3: Commit**
