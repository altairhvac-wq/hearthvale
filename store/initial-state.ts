import { DEFAULT_VALLEY_ID } from "@/game/constants/valley";
import { createInitialInventoryState } from "@/game/inventory";
import { createDefaultPlayer } from "@/game/player";
import { normalizeSkillsState } from "@/game/skills";
import {
  createDefaultGameUser,
  createDefaultValley,
  createDefaultValleySaveData,
  createInitialInvitesState,
  createInitialMembershipsState,
  createInitialValleyGameplayState,
  createInitialVisitSessionsState,
} from "@/game/valley";
import { REGION_IDS } from "@/game/constants/regions";
import { mergeQuestsState } from "@/game/quests/state";
import { mergeRestorationState, syncRegionsWithRestorationState } from "@/game/restoration/state";
import {
  mergeKeyedRecord,
  mergePlainRecord,
  mergePlayer,
} from "./merge-state";
import {
  extractValleyGameplay,
  extractValleyMetadata,
  pickActiveValleyGameplay,
  syncActiveValleyIntoValleys,
} from "./valley-state";
import type { GameState } from "./game-state";
import type {
  Animal,
  Decoration,
  Event,
  GameSaveData,
  GameUser,
  InventoryItem,
  MiniGame,
  Player,
  Quest,
  Region,
  RegionId,
  RestorationProject,
  ValleyId,
  ValleySaveData,
} from "@/types";
import { SAVE_VERSION } from "@/types";

export type { GameState } from "./game-state";

function applyValleyGameplayToState(
  gameplay: ReturnType<typeof pickActiveValleyGameplay>,
): Pick<
  GameState,
  | "activeRegionId"
  | "regions"
  | "quests"
  | "animals"
  | "restoration"
  | "events"
  | "minigames"
  | "decorations"
> {
  return {
    activeRegionId: gameplay.activeRegionId,
    regions: gameplay.regions,
    quests: gameplay.quests,
    animals: gameplay.animals,
    restoration: gameplay.restoration,
    events: gameplay.events,
    minigames: gameplay.minigames,
    decorations: gameplay.decorations,
  };
}

function normalizeActiveRegionId(
  activeRegionId: RegionId | null,
  regions: Record<string, Region>,
): RegionId | null {
  if (!activeRegionId || !regions[activeRegionId]) {
    return REGION_IDS.VALLEY;
  }

  return activeRegionId;
}

function mergeValleySaveData(
  defaults: ValleySaveData,
  saved: ValleySaveData | undefined,
): ValleySaveData {
  if (!saved) {
    return defaults;
  }

  const regions = mergeKeyedRecord(defaults.regions, saved.regions);
  const activeRegionId = normalizeActiveRegionId(saved.activeRegionId, regions);
  const restoration = mergeRestorationState(saved.restoration);

  return {
    ...defaults,
    ...saved,
    activeRegionId,
    regions: syncRegionsWithRestorationState(regions, restoration),
    quests: mergeQuestsState(saved.quests),
    animals: mergeKeyedRecord(defaults.animals, saved.animals),
    restoration,
    events: mergeKeyedRecord(defaults.events, saved.events),
    minigames: mergeKeyedRecord(defaults.minigames, saved.minigames),
    decorations: mergeKeyedRecord(defaults.decorations, saved.decorations),
  };
}

function mergeAllValleySaveData(
  savedValleys: Record<string, ValleySaveData> | undefined,
): Record<string, ValleySaveData> {
  const defaults = createDefaultValleySaveData();
  const merged: Record<string, ValleySaveData> = {};

  for (const [valleyId, savedValley] of Object.entries(savedValleys ?? {})) {
    merged[valleyId] = mergeValleySaveData(defaults, savedValley);
  }

  return merged;
}

export function createInitialGameState(): Omit<
  GameState,
  "isHydrated" | "isSaving" | "lastSavedAt" | "saveError"
> {
  const user = createDefaultGameUser();
  const player = createDefaultPlayer();
  const valley = createDefaultValley();
  const valleyGameplay = createInitialValleyGameplayState();
  const defaultValleySave = createDefaultValleySaveData();

  return {
    user,
    player,
    activeValleyId: DEFAULT_VALLEY_ID,
    valleys: {
      [DEFAULT_VALLEY_ID]: defaultValleySave,
    },
    valley,
    memberships: createInitialMembershipsState(),
    pendingInvites: createInitialInvitesState(),
    visitSessions: createInitialVisitSessionsState(),
    skills: normalizeSkillsState(undefined),
    inventory: createInitialInventoryState(),
    ...applyValleyGameplayToState(valleyGameplay),
  };
}

export function buildStateForValleySwitch(
  state: GameState,
  valleyId: ValleyId,
): Pick<
  GameState,
  | "activeValleyId"
  | "valleys"
  | "valley"
  | "activeRegionId"
  | "regions"
  | "quests"
  | "animals"
  | "restoration"
  | "events"
  | "minigames"
  | "decorations"
> | null {
  const valleys = syncActiveValleyIntoValleys(state);
  const savedValley = valleys[valleyId];

  if (!savedValley) {
    return null;
  }

  const mergedValleySave = mergeValleySaveData(
    createDefaultValleySaveData(),
    savedValley,
  );

  return {
    activeValleyId: valleyId,
    valleys,
    valley: extractValleyMetadata(mergedValleySave),
    ...applyValleyGameplayToState(extractValleyGameplay(mergedValleySave)),
  };
}

export function toSaveData(state: GameState): GameSaveData {
  const valleys = syncActiveValleyIntoValleys(state);

  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    user: state.user,
    player: state.player,
    skills: state.skills,
    inventory: state.inventory,
    activeValleyId: state.activeValleyId,
    valleys,
    memberships: state.memberships,
    pendingInvites: state.pendingInvites,
    visitSessions: state.visitSessions,
  };
}

export function fromSaveData(data: GameSaveData): Omit<
  GameState,
  "isHydrated" | "isSaving" | "lastSavedAt" | "saveError"
> {
  const defaults = createInitialGameState();
  const activeValleyId = data.activeValleyId ?? defaults.activeValleyId;
  const mergedValleys = mergeAllValleySaveData(data.valleys);

  if (!mergedValleys[activeValleyId]) {
    mergedValleys[activeValleyId] = createDefaultValleySaveData();
  }

  const mergedValleySave = mergedValleys[activeValleyId];

  const player = mergePlayer(defaults.player, data.player);
  const user = data.user
    ? {
        ...defaults.user,
        ...data.user,
        displayName:
          data.user.displayName ||
          data.player.displayName ||
          defaults.user.displayName,
      }
    : {
        ...defaults.user,
        displayName: data.player.displayName || defaults.user.displayName,
      };

  return {
    user,
    player: {
      ...player,
      userId: player.userId ?? defaults.player.userId,
    },
    activeValleyId,
    valleys: mergedValleys,
    valley: extractValleyMetadata(mergedValleySave),
    memberships: mergePlainRecord(defaults.memberships, data.memberships),
    pendingInvites: mergePlainRecord(defaults.pendingInvites, data.pendingInvites),
    visitSessions: mergePlainRecord(defaults.visitSessions, data.visitSessions),
    skills: normalizeSkillsState(data.skills),
    inventory: Array.isArray(data.inventory) ? data.inventory : defaults.inventory,
    ...applyValleyGameplayToState(extractValleyGameplay(mergedValleySave)),
  };
}

/** @internal Used by save migration to seed v3 valley records from v2 flat saves. */
export function createValleySaveFromLegacyFlatSave(data: {
  player: Player & { activeRegionId?: RegionId | null };
  regions: Record<string, Region>;
  quests: Record<string, Quest>;
  animals: Record<string, Animal>;
  restoration: Record<string, RestorationProject>;
  events: Record<string, Event>;
  minigames: Record<string, MiniGame>;
  decorations: Record<string, Decoration>;
}): ValleySaveData {
  const defaults = createDefaultValleySaveData();
  const regions = mergeKeyedRecord(defaults.regions, data.regions);
  const activeRegionId = normalizeActiveRegionId(
    data.player.activeRegionId ?? defaults.activeRegionId,
    regions,
  );

  return {
    ...defaults,
    activeRegionId,
    regions,
    quests: mergeQuestsState(data.quests),
    animals: mergeKeyedRecord(defaults.animals, data.animals),
    restoration: mergeRestorationState(data.restoration),
    events: mergeKeyedRecord(defaults.events, data.events),
    minigames: mergeKeyedRecord(defaults.minigames, data.minigames),
    decorations: mergeKeyedRecord(defaults.decorations, data.decorations),
  };
}

/** @internal Used by save migration to strip legacy player location fields. */
export function stripLegacyPlayerLocation(player: Player & {
  activeRegionId?: RegionId | null;
}): Player {
  const { activeRegionId: _legacyActiveRegionId, ...rest } = player;

  return rest;
}

/** @internal Used by save migration when v2 saves lack account metadata. */
export function createUserFromLegacyPlayer(
  player: Player & { activeRegionId?: RegionId | null },
): GameUser {
  const defaultUser = createDefaultGameUser();

  return {
    id: player.userId ?? defaultUser.id,
    displayName: player.displayName,
    createdAt: player.createdAt,
    lastSeenAt: player.lastPlayedAt,
  };
}
