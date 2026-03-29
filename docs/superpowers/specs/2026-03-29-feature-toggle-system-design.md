# 📸 PhotoBot: Comprehensive System Design & Architecture
**Date:** Sunday, March 29, 2026
**Status:** Approved

## 1. Overview
This spec outlines the end-to-end architecture for PhotoBot, a photography-focused Discord bot. It covers the hierarchical permission system, security frameworks, production deployment on a hybrid cloud stack, and a robust local development environment.

## 2. Hierarchical Inheritance Model (Permissions)
The system uses a "Specificity Ladder" to resolve configuration and determine command execution.

### 2.1 The Specificity Ladder (Priority)
1.  **Channel Override (Highest):** Explicitly disables features in specific channels.
2.  **Role Allowance:** Grants access to specific features based on internal PhotoBot role settings.
3.  **Server Default (Lowest):** The global ON/OFF state for the feature in the current server.

### 2.2 Conflict Resolution: The "Allow Wins" Rule
If a user has multiple roles (e.g., both `@Pro` and `@Newbie`), and `@Pro` is allowed while `@Newbie` is not, the user **is allowed** to use the feature.

### 2.3 PhotoBot-First Management
PhotoBot's internal `/settings` system is the **Single Source of Truth**. Discord's native permissions are used only for broad visibility (hiding commands in the UI), while PhotoBot handles all execution logic.

## 3. Security & Privacy "Fortress" Model
### 3.1 Zero-Retention & Volatile Processing
*   **Buffer-Only Processing:** Images are processed in RAM and never written to physical disk.
*   **EXIF Stripping:** All metadata is purged before AI analysis to protect privacy and prevent steganographic injections.
*   **Zero-Training:** AI APIs are configured to ensure data is not used for model training.

### 3.2 Deep AI Defenses (The "Bouncer")
*   **Layer 1 (Moderator):** Fast model (Gemini 1.5 Flash) scans for injection, NSFW, and malicious metadata.
*   **Layer 2 (Analyzer):** High-tier model (Gemini 1.5 Pro) performs technical photography analysis.
*   **Shadow Rate Limiting:** If the Moderator Model detects borderline malicious intent (e.g., subtle injection attempts), the bot will silently inject 10-20 seconds of latency and return a simplified response to hinder automated attacks without alerting the attacker.
*   **Output Validation:** Blocks responses containing suspicious keywords or system bypasses.

## 4. Community Engagement & Progression
### 4.1 Dynamic Discovery (/help 2.0)
The bot generates a customized `/help` list for each user by filtering commands based on their active channel and roles. This ensures users only see tools they can actually use.

### 4.2 Automated Progression (Gamification)
Admins can link bot engagement metrics (e.g., trivia success, critique count) to Discord role rewards.
*   **Milestones:** Achieving a threshold in a specific category (e.g., 50 correct trivia answers) can trigger an automated promotion to a higher role (e.g., `@Technical-Pro`).
*   **Tiered Access:** New roles unlock advanced bot features, creating a clear "Path to Pro" for the community.

## 5. Brand Identity & Visual Design
*   **Primary:** Electric Blue (`#3B82F6`)
*   **Secondary:** Deep Navy (`#0F172A`)
*   **Accent:** Neon Cyan (`#06B6D4`)
*   **Neutral:** Cool Gray (`#CBD5E1`)
*   **Themes:** Professional, refined aesthetic with support for both **Light** and **Dark** modes.

## 6. Production Architecture (Hybrid Stack)
*   **Railway:** Hosts the persistent Bot process (Node.js).
*   **Vercel:** Hosts the Admin Dashboard (Next.js) and Serverless API Routes (The Backend).
*   **Supabase:** Provides the Postgres database, Auth (Discord OAuth2), and Realtime updates.
*   **Gemini:** Main AI provider, used in a provider-agnostic wrapper for easy switching.

## 7. Monorepo Package Structure
```text
/photography-bot
├── apps/
│   ├── bot/                # Railway: Discord.js bot logic
│   └── dashboard/          # Vercel: Next.js frontend + Serverless APIs
├── packages/
│   ├── db/                 # Shared database client & schema (Supabase)
│   ├── ui/                 # Shared brand components & CSS
│   └── ai/                 # Unified AI provider wrapper (Gemini/Ollama)
```

## 8. Local Development Strategy
### 8.1 "Private Sandbox" Workflow
*   Develop against a **Beta Bot** in a private test server.
*   Use a tunnel (**ngrok**) to route Discord events to your local machine.
*   Zero risk to the 36k member production environment.

### 8.2 The "One-Command" Setup
A single `npm run dev` initializes the entire local stack:
*   **Supabase Local (Docker):** Full database environment.
*   **Ollama (Local AI):** Run `llava` or `moondream` locally for $0 AI testing.
*   **Mock Providers:** Fast unit testing with static AI responses.

## 9. Database Schema (Core Tables)
*   `feature_configs`: Stores server/channel/role overrides.
*   `config_audit_logs`: Append-only history of configuration changes.
*   `user_usage_metrics`: Tracks rate limits and security flags.

---
