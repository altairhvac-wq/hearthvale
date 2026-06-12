import type { GameState } from "./game-state";

/** Single source of truth for persisted slices — update here when adding domains. */
export const PERSISTABLE_STATE_KEYS = [
  "user",
  "player",
  "activeValleyId",
  "valleys",
  "valley",
  "memberships",
  "pendingInvites",
  "visitSessions",
  "skills",
  "inventory",
  "activeRegionId",
  "regions",
  "quests",
  "animals",
  "animalSpecies",
  "restoration",
  "events",
  "minigames",
  "decorations",
] as const;

export type PersistableStateKey = (typeof PERSISTABLE_STATE_KEYS)[number];

export type PersistableState = Pick<GameState, PersistableStateKey>;

export function pickPersistableState(state: GameState): PersistableState {
  return {
    user: state.user,
    player: state.player,
    activeValleyId: state.activeValleyId,
    valleys: state.valleys,
    valley: state.valley,
    memberships: state.memberships,
    pendingInvites: state.pendingInvites,
    visitSessions: state.visitSessions,
    skills: state.skills,
    inventory: state.inventory,
    activeRegionId: state.activeRegionId,
    regions: state.regions,
    quests: state.quests,
    animals: state.animals,
    animalSpecies: state.animalSpecies,
    restoration: state.restoration,
    events: state.events,
    minigames: state.minigames,
    decorations: state.decorations,
  };
}

let lastPersistableSnapshot = "";

export function hasPersistableStateChanged(state: GameState): boolean {
  const next = JSON.stringify(pickPersistableState(state));

  if (next === lastPersistableSnapshot) {
    return false;
  }

  lastPersistableSnapshot = next;
  return true;
}

export function resetPersistableSnapshot(state: GameState): void {
  lastPersistableSnapshot = JSON.stringify(pickPersistableState(state));
}
