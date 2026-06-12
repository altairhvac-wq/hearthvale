# Hearthvale Architecture

Hearthvale is a cozy progression-based world restoration game. The core loop is **not** farming — it is:

> **Restore → Discover → Unlock → Collect → Personalize**

This document describes the foundation architecture designed to support years of feature growth without rewrites.

---

## Core Gameplay Loop

```mermaid
flowchart LR
  Restore[Restore places] --> Discover[Discover secrets]
  Discover --> Unlock[Unlock systems]
  Unlock --> Collect[Collect resources & friends]
  Collect --> Personalize[Personalize your valley]
  Personalize --> Restore
```

Each loop iteration should feel relaxing, surprising, and rewarding. Progression is driven by **skills**, **regions**, **restoration projects**, **quests**, and **relationships** — not crop timers.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict, no `any`) |
| Styling | Tailwind CSS (mobile-first) |
| State | Zustand |
| Persistence | localStorage (versioned, migration-ready) |
| Future | Supabase multiplayer / cloud saves |

---

## Folder Responsibilities

```
app/                  Next.js routes, layouts, global shell
components/           Shared, presentational UI (no domain logic)
features/             Feature-vertical modules (UI + hooks per gameplay area)
game/                 Pure domain logic — no React, no Zustand
  constants/          Static IDs, definitions, catalogs
  skills/             XP curve, progression, centralized XP service
  player/             Player defaults and helpers
  valley/             Valley defaults, roles, permissions
  regions/            Region state factories
  animals/            Animal definitions
  quests/             Quest state factories
  inventory/          Inventory state factories
  restoration/        Restoration state factories
  events/             Event state factories (future)
  resources/          Resource catalog re-exports
store/                Zustand store, persistence, migrations, slices
types/                Domain interfaces and branded ID types
```

### Separation of Concerns

| Layer | Responsibility |
|-------|----------------|
| `types/` | **What** exists — interfaces, enums, branded IDs |
| `game/constants/` | **Catalog data** — definitions keyed by ID |
| `game/*/` | **Domain rules** — factories, calculators, services |
| `store/` | **Runtime state** — mutable player progress |
| `features/` | **Player-facing modules** — screens, panels, flows |
| `components/` | **Reusable UI** — buttons, layout, providers |

Domain logic never imports from React or Zustand. The store orchestrates; `game/` computes.

---

## State Flow

```mermaid
sequenceDiagram
  participant UI as Feature UI
  participant Store as Zustand Store
  participant Service as Skill XP Service
  participant Persist as localStorage

  UI->>Store: hydrate() on app mount
  Persist-->>Store: loadGameSave()
  Store-->>UI: isHydrated = true

  UI->>Store: addSkillXp(skillId, amount)
  Store->>Service: awardXp()
  Service->>Service: applySkillXp(), detect unlocks
  Service-->>Store: updated SkillProgress
  Store-->>UI: re-render

  Store->>Persist: auto-save (debounced)
```

### Store Shape

The global `useGameStore` holds:

**Account layer**

- **user** — local account stub (`GameUser`)
- **player** — resources, preferences, linked to `user` via `userId`
- **skills** — `Record<SkillId, SkillProgress>` (total XP is source of truth)
- **inventory** — collected items

**Active valley layer** (mirrors `valleys[activeValleyId]` on save)

- **valley** — active valley metadata (name, owner)
- **activeValleyId** — which valley is loaded
- **activeRegionId** — current region within the active valley
- **regions** — unlock / discovery / restoration progress per region
- **quests** — quest status and objectives
- **animals** — owned animals and bond state
- **restoration** — active restoration projects
- **events** — runtime event state (empty until event systems ship)
- **minigames** — per-game progress (empty until mini-games ship)
- **decorations** — placed decor state (empty until decor systems ship)

**Social scaffolding** (persisted, no UI yet)

- **memberships** — valley roles for future shared valleys
- **pendingInvites** — async invite records
- **visitSessions** — visit windows with permission grants

Derived values (skill level, XP to next level, unlock lists) are **computed on read**, not stored.

---

## Skill Progression Philosophy

Skills are RuneScape-*inspired* but cozy — familiar exponential curves with gentle milestone rewards.

### Registered Skills

Gardening · Foraging · Animal Care · Crafting · Cooking · Fishing · Exploration · Charm · Friendship · Restoration

### Architecture Principles

1. **Total XP is persisted; level is derived** — avoids desync bugs.
2. **Definitions live in `game/constants/skills.ts`** — add a skill by registering an ID + definition; no store refactor.
3. **XP flows through one service** — `createSkillXpService()` / `addSkillXp()`. Gameplay systems must not mutate `skills` directly.
4. **Unlocks are milestone-based** — each skill defines `SkillUnlock[]` at specific levels with future `SkillPerk` slots.
5. **Max level 99** — XP caps at the curve ceiling; perks and gates hook into unlock records.

### Store API

```typescript
addSkillXp(skillId, amount)   // Award XP; returns newly unlocked milestones
getSkillLevel(skillId)        // Derived current level
getSkillUnlocks(skillId)      // All unlocks at or below current level
getSkillLevelInfo(skillId)    // Full progress snapshot for UI
```

### Adding a New Skill

1. Add ID to `SKILL_IDS` in `game/constants/skills.ts`
2. Add `SkillDefinition` with unlock milestones
3. `ALL_SKILL_IDS` auto-includes it via `Object.values(SKILL_IDS)`
4. `createInitialSkillsState()` initializes at level 1 (0 XP)
5. Award XP through `addSkillXp()` from quests, restoration, mini-games, etc.

---

## Persistence

| Concern | Implementation |
|---------|----------------|
| Storage key | `hearthvale:save` |
| Format version | `SAVE_VERSION` in `types/save.ts` |
| Auto-load | `GameProvider` → `hydrate()` on mount |
| Auto-save | `subscribeToAutoSave()` — debounced 500ms; flushes on unmount |
| Hydration gate | `useIsGameHydrated()` / `useHydratedGameStore()` — SSR-safe |
| Validation | `store/save-validation.ts` — rejects corrupt/unsupported saves |
| Restore merge | `store/merge-state.ts` — deep-merge player resources/preferences |
| Persistable keys | `store/persistable-state.ts` — single list of saved slices |
| Migrations | `store/migrations.ts` — chain `SaveMigration` records (v1 → v2 → v3 wraps flat save into valley-scoped v3) |

Save payload mirrors store slices plus `version` and `savedAt`. When bumping `SAVE_VERSION`, add a migration and merge new defaults in `fromSaveData()`.

Future Supabase sync can reuse `GameSaveData` as the wire format — swap the persistence adapter without touching domain code.

---

## Multiplayer Philosophy

Hearthvale multiplayer is **cozy, safe, and asynchronous-first**. Players should be able to invite friends, visit each other's valleys, help with small tasks, and send gifts — without requiring real-time co-presence or competitive pressure.

| Principle | What it means in practice |
|-----------|---------------------------|
| Async-first | Visits, gifts, and help arrive as gentle notifications — not live sessions |
| Permission-gated | Every action checks `ValleyPermission` derived from role + overrides |
| Valley-scoped progress | Regions, quests, animals, restoration, and decor belong to a **valley**, not a global blob |
| Local-first V1 | Single-player flow stays on device; cloud sync is an adapter swap later |
| No fake auth | `GameUser` is a local stub until real accounts ship |

### Domain Models (`types/user.ts`, `types/valley.ts`)

| Model | Purpose |
|-------|---------|
| `GameUser` | Account identity (local stub today, cloud-backed later) |
| `Player` | Gameplay profile — resources, preferences, linked via `userId` |
| `Valley` | Named container with an owner |
| `ValleyMember` | Role + optional permission overrides for shared valleys |
| `ValleyRole` | `owner` · `member` · `visitor` |
| `ValleyPermission` | `view_valley` · `collect_gifts` · `help_tasks` · `decorate` · `manage_invites` · `manage_valley` |
| `ValleyInvite` | Async invite record (pending/accepted/declined/expired/revoked) |
| `VisitSession` | A cozy visit window with explicit permission grants |

Role defaults live in `game/valley/permissions.ts`. Use `getEffectivePermissions()` and `hasValleyPermission()` — never hard-code role checks in UI.

### Valley-Scoped State

Runtime state splits into three layers:

```mermaid
flowchart TB
  subgraph account [Account layer]
    User[GameUser]
    Player[Player profile]
    Skills[Skills]
    Inventory[Inventory]
  end

  subgraph valley [Active valley layer]
    ValleyMeta[Valley metadata]
    Regions[Regions]
    Quests[Quests]
    Animals[Animals]
    Restoration[Restoration]
    ActiveRegion[activeRegionId]
  end

  subgraph social [Social scaffolding — empty in V1]
    Memberships[memberships]
    Invites[pendingInvites]
    Visits[visitSessions]
  end

  account --> valley
  valley --> social
```

**Player-global (follows the account):** `user`, `player`, `skills`, `inventory`

**Valley-local (per valley, denormalized at store root for the active valley):** `activeRegionId`, `regions`, `quests`, `animals`, `restoration`, `events`, `minigames`, `decorations`

**Social scaffolding (persisted, unused in V1 UI):** `memberships`, `pendingInvites`, `visitSessions`

The Valley Map reads the same flat keys as before (`activeRegionId`, `regions`, …). `store/valley-state.ts` provides selectors (`pickActiveValleyGameplay`, `selectActiveRegionId`) for future valley-switching without rewriting features.

### Save Format v3

```typescript
{
  version: 3,
  user, player, skills, inventory,     // account layer
  activeValleyId,
  valleys: { [valleyId]: ValleySaveData },  // per-valley gameplay blobs
  memberships, pendingInvites, visitSessions // social scaffolding
}
```

v2 flat saves migrate automatically: gameplay wraps into `valleys.valley_home`, `player.activeRegionId` moves to valley scope, and a local `GameUser` is seeded from the legacy player record.

### Future Supabase Tables (conceptual)

| Table | Maps to |
|-------|---------|
| `users` | `GameUser` + auth provider IDs |
| `players` | `Player` profile row per user |
| `valleys` | `Valley` metadata |
| `valley_saves` | `ValleySaveData` JSON blob or normalized columns |
| `valley_members` | `ValleyMember` |
| `valley_invites` | `ValleyInvite` |
| `visit_sessions` | `VisitSession` |

Sync strategy: push/pull **valley blobs** independently from account progress. Conflict resolution stays per-valley — not global save overwrite.

### Why V1 Remains Local-First

- No auth or network dependency for the core loop
- Valley Map and persistence keep working offline
- Social records exist as typed empty scaffolding — ready for Supabase without rewiring the store
- Real-time features (live co-presence, sockets) are explicitly out of scope until async visits feel great

---

## Starter Data

### Regions

Valley (unlocked) · Sanctuary · Dock · Forest

### Animals (species catalog)

Rabbit · Duck · Fox

### Resources

Coins · Hearts · Valley Charm

All skills initialize at **level 1** (0 total XP).

---

## Expansion Strategy

When building a new gameplay system:

1. **Define types** in `types/`
2. **Add constants/definitions** in `game/constants/` or `game/<domain>/`
3. **Add state factory** in `game/<domain>/state.ts`
4. **Extend store** via a slice in `store/slices/`
5. **Build UI** in `features/<name>/`
6. **Award progression** through services (`addSkillXp`, future reward service)

Avoid cross-feature imports. Features talk to the store; the store talks to domain services.

---

## Future Systems Roadmap

Planned major systems — architecture is ready, implementation is not:

| System | Domain Touchpoints |
|--------|-------------------|
| **Animal Sanctuary** | `game/animals`, bond XP, Animal Care skill |
| **Festival Cart** | `game/events`, seasonal inventory, Charm skill |
| **Random Events** | `game/events`, region triggers, surprise rewards |
| **Mini-games** | `types/minigame.ts`, skill high scores, XP awards |
| **Boat System** | Dock region, Exploration, island discovery |
| **Fishing** | Dock + islands, Fishing skill, catch catalog |
| **Islands** | New `RegionId`s, boat-gated unlocks |
| **Train Station** | New region, resource transport, quest hub |
| **Mine** | Resource nodes, Crafting/Restoration materials |
| **Observatory** | Discovery events, Exploration milestones |
| **Air Balloon** | Travel unlock, seasonal island access |
| **Seasonal Events** | `game/events`, limited quests & decor |
| **Multiplayer / Cloud** | Supabase adapter; valley blob sync; `GameUser` auth |

---

## Quality Standards

- Strict TypeScript — branded IDs prevent cross-domain mistakes
- No `any` — use `unknown` + guards at persistence boundaries
- Pure domain functions — testable without React
- Mobile-first UI — desktop enhances, never required
- Versioned saves — never strand players on old data

---

*This foundation is intentionally gameplay-free. Every future feature should feel like plugging into a well-labeled socket — not rewiring the house.*
