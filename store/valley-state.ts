import { getEffectivePermissions, hasValleyPermission } from "@/game/valley";
import type {
  Valley,
  ValleyGameplayState,
  ValleyPermission,
  ValleySaveData,
} from "@/types";
import type { GameState } from "./game-state";

/** Valley-scoped slices mirrored at the store root for the active valley. */
export const VALLEY_GAMEPLAY_STATE_KEYS = [
  "activeRegionId",
  "regions",
  "quests",
  "animals",
  "restoration",
  "events",
  "minigames",
  "decorations",
] as const;

export type ValleyGameplayStateKey = (typeof VALLEY_GAMEPLAY_STATE_KEYS)[number];

export type ActiveValleyGameplayState = Pick<
  GameState,
  ValleyGameplayStateKey
>;

export function pickActiveValleyGameplay(state: GameState): ValleyGameplayState {
  return {
    activeRegionId: state.activeRegionId,
    regions: state.regions,
    quests: state.quests,
    animals: state.animals,
    restoration: state.restoration,
    events: state.events,
    minigames: state.minigames,
    decorations: state.decorations,
  };
}

export function extractValleyMetadata(valleySave: ValleySaveData): Valley {
  return {
    id: valleySave.id,
    name: valleySave.name,
    ownerUserId: valleySave.ownerUserId,
    createdAt: valleySave.createdAt,
    updatedAt: valleySave.updatedAt,
  };
}

export function extractValleyGameplay(
  valleySave: ValleySaveData,
): ValleyGameplayState {
  return {
    activeRegionId: valleySave.activeRegionId,
    regions: valleySave.regions,
    quests: valleySave.quests,
    animals: valleySave.animals,
    restoration: valleySave.restoration,
    events: valleySave.events,
    minigames: valleySave.minigames,
    decorations: valleySave.decorations,
  };
}

export function snapshotActiveValley(
  valley: Valley,
  gameplay: ValleyGameplayState,
): ValleySaveData {
  return {
    ...valley,
    ...gameplay,
  };
}

/** Writes the active valley's denormalized gameplay back into the save map. */
export function syncActiveValleyIntoValleys(
  state: GameState,
): Record<string, ValleySaveData> {
  const snapshot = snapshotActiveValley(
    state.valley,
    pickActiveValleyGameplay(state),
  );

  return {
    ...state.valleys,
    [state.activeValleyId]: snapshot,
  };
}

export function selectActiveRegionId(state: GameState) {
  return state.activeRegionId;
}

export function selectActiveValleyId(state: GameState) {
  return state.activeValleyId;
}

export function selectActiveValleyMembership(state: GameState) {
  const key = `${state.activeValleyId}:${state.user.id}`;

  return state.memberships[key];
}

export function selectActiveValleyPermissions(state: GameState) {
  const membership = selectActiveValleyMembership(state);

  if (!membership) {
    return [] as const;
  }

  return getEffectivePermissions(membership);
}

export function hasActiveValleyPermission(
  state: GameState,
  permission: ValleyPermission,
): boolean {
  const membership = selectActiveValleyMembership(state);

  if (!membership) {
    return false;
  }

  return hasValleyPermission(membership, permission);
}
