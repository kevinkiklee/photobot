# 📸 PhotoBot: Feature Toggle & Permission System Design
**Date:** Sunday, March 29, 2026
**Status:** Draft

## 1. Overview
This spec outlines a hierarchical permission and feature toggle system for PhotoBot. It allows server administrators to control feature availability at three levels: Server (Global), Channel (Specific), and Role (User-level).

## 2. Hierarchical Inheritance Model
The system uses a "Specificity Ladder" to resolve conflicts and determine if a user can execute a command.

### 2.1 The Specificity Ladder (Priority)
1.  **Channel Override (Highest):** If a feature is explicitly disabled in a channel, it is blocked for all users in that channel, regardless of role.
2.  **Role Allowance:** If a feature is enabled for specific roles, a user must have at least **one** of those roles to use it. (The "Allow Wins" rule applies here).
3.  **Server Default (Lowest):** The global ON/OFF state for the feature in the current server.

### 2.2 Conflict Resolution: The "Allow Wins" Rule
If a user has multiple roles (e.g., both `@Pro` and `@Newbie`), and `@Pro` is an allowed role for `/critique` while `@Newbie` is not, the user **is allowed** to use the feature. This prevents legacy or auxiliary roles from accidentally locking out active contributors.

## 3. Interface Design

### 3.1 Discord Commands (Admin Only)
*   `/settings feature:<name> state:<enable|disable>` — Sets the server-wide default.
*   `/settings feature:<name> channel:<#channel> state:<enable|disable>` — Creates a channel override.
*   `/settings feature:<name> role:<@role> state:<allow|disallow>` — Manages role-based access.
*   `/settings list` — Displays a formatted summary of all active overrides and global states.

### 3.2 Web Dashboard (Phase 2)
The dashboard will provide a "Conflict Visualizer" for admins to test permissions for specific users and a "Feature Grid" for bulk updates.

## 4. Database Schema Updates
To support these toggles, the following table will be added:

```sql
CREATE TABLE feature_configs (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    feature_name VARCHAR(50) NOT NULL,
    scope VARCHAR(20) NOT NULL, -- 'server', 'channel', or 'role'
    scope_id VARCHAR(255), -- NULL for 'server', channel_id or role_id otherwise
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(guild_id, feature_name, scope, scope_id)
);
CREATE INDEX idx_guild_feature ON feature_configs(guild_id, feature_name);
```

## 5. Implementation Roadmap
1.  **DB Migration:** Create the `feature_configs` table.
2.  **Permission Middleware:** Implement a decorator or middleware to check permissions before command execution.
3.  **Core Commands:** Build the `/settings` suite and the `/settings list` summary.
4.  **Dashboard Integration:** Add feature toggles to the React/Next.js admin panel.

---
