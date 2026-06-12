import type { GameState } from "./initial-state";

/** Single source of truth for persisted slices — update here when adding domains. */
export const PERSISTABLE_STATE_KEYS = [
  "player",
  "skills",
  "inventory",
  "regions",
  "quests",
  "animals",
  "restoration",
  "events",
  "minigames",
  "decorations",
] as const;

export type PersistableStateKey = (typeof PERSISTABLE_STATE_KEYS)[number];

export type PersistableState = Pick<GameState, PersistableStateKey>;

export function pickPersistableState(state: GameState): PersistableState {
  return {
    player: state.player,
    skills: state.skills,
    inventory: state.inventory,
    regions: state.regions,
    quests: state.quests,
    animals: state.animals,
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
