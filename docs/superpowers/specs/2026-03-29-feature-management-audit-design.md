# Design Spec: Photography Bot Dashboard Feature Management & Audit View

## 1. Overview
Enhance the photography bot dashboard with robust authorization for specific Discord servers, interactive feature toggles with persistence and audit logging, and a server selection UI for administrators.

## 2. Architecture & Components

### 2.1 Authorization (`lib/discord.ts`)
- **`getAdminGuilds(accessToken: string)`**: Fetch the user's guilds from the Discord API and filter for those where the user has the `ADMINISTRATOR` permission (bitfield `0x8`).
- **`verifyServerAccess(serverId: string, accessToken: string)`**: Verify if the user has admin access to a specific server.

### 2.2 Shared Layout (`app/(dashboard)/layout.tsx`)
- Centralized server-side session and permission checking.
- Fetches the user's admin guilds once and makes them available for navigation and selection.
- Provides a common header with:
  - **Navigation**: Links to Settings and Audit Log.
  - **ServerSelector**: A dropdown or list of admin-accessible servers.

### 2.3 Interactive Toggles (`components/FeatureToggleCard.tsx`)
- A Client Component for each feature configuration.
- **State**: Uses optimistic UI updates to provide immediate feedback.
- **Action**: Triggers a Server Action to update the database.

### 2.4 Server Actions (`lib/actions.ts`)
- **`updateFeatureAction(serverId: string, targetType: string, targetId: string, featureKey: string, isEnabled: boolean)`**:
  - Re-verifies user session and admin permission for the `serverId`.
  - Updates the `FeatureConfig` in Prisma.
  - Logs the change in `ConfigAuditLog` with old and new values.
  - Calls `revalidatePath` to refresh the UI.

### 2.5 Audit View (`app/(dashboard)/audit/page.tsx`)
- **Requirement**: `serverId` parameter is mandatory.
- **Validation**: If `serverId` is missing or invalid, redirects to a server selection view.
- Displays logs specifically for the selected server.

## 3. Data Flow

1. **User Login**: User logs in via Discord; `accessToken` and `guilds` scope are obtained.
2. **Page Load**:
   - `DashboardLayout` fetches session and admin guilds.
   - If `serverId` is in URL, verifies access.
   - If `serverId` is missing, prompts user to select a server.
3. **Feature Toggle**:
   - User clicks toggle.
   - `FeatureToggleCard` sends optimistic update to UI and calls `updateFeatureAction`.
   - `updateFeatureAction` performs DB update and audit logging.
   - UI revalidates and reflects the actual state.

## 4. Testing Strategy (TDD)
- **Unit Tests**:
  - `lib/discord.ts`: Test permission bitfield logic and filtering.
  - `lib/actions.ts`: Test `updateFeatureAction` for both success and unauthorized attempts.
- **Integration Tests**:
  - `SettingsPage`: Verify it renders toggles when authorized and picker when not.
  - `AuditPage`: Verify it requires `serverId` and filters correctly.
- **Component Tests**:
  - `FeatureToggleCard`: Verify interaction and state updates.

## 5. Success Criteria
1. Users cannot view/manage settings or audit logs for servers they don't have `ADMINISTRATOR` permissions for.
2. `AuditPage` does not expose logs for all servers simultaneously.
3. Feature toggles successfully update the DB and create audit entries.
4. Admins can easily switch between servers they manage.
