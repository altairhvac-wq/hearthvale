import { createInitialAnimalsState } from "@/game/animals";
import { createInitialDecorationsState } from "@/game/decorations";
import { createInitialEventsState } from "@/game/events";
import { createInitialInventoryState } from "@/game/inventory";
import { createInitialMiniGamesState } from "@/game/minigames";
import { createDefaultPlayer } from "@/game/player";
import { createInitialQuestsState } from "@/game/quests";
import { createInitialRegionsState } from "@/game/regions";
import { createInitialRestorationState } from "@/game/restoration";
import { normalizeSkillsState } from "@/game/skills";
import { REGION_IDS } from "@/game/constants/regions";
import { mergeKeyedRecord, mergePlayer } from "./merge-state";
import type {
  Animal,
  Decoration,
  Event,
  GameSaveData,
  InventoryItem,
  MiniGame,
  Player,
  Quest,
  Region,
  RestorationProject,
  SkillProgress,
} from "@/types";
import { SAVE_VERSION } from "@/types";

export interface GameState {
  player: Player;
  skills: Record<string, SkillProgress>;
  inventory: InventoryItem[];
  regions: Record<string, Region>;
  quests: Record<string, Quest>;
  animals: Record<string, Animal>;
  restoration: Record<string, RestorationProject>;
  events: Record<string, Event>;
  minigames: Record<string, MiniGame>;
  decorations: Record<string, Decoration>;
  isHydrated: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  saveError: string | null;
}

export function createInitialGameState(): Omit<
  GameState,
  "isHydrated" | "isSaving" | "lastSavedAt" | "saveError"
> {
  return {
    player: createDefaultPlayer(),
    skills: normalizeSkillsState(undefined),
    inventory: createInitialInventoryState(),
    regions: createInitialRegionsState(),
    quests: createInitialQuestsState(),
    animals: createInitialAnimalsState(),
    restoration: createInitialRestorationState(),
    events: createInitialEventsState(),
    minigames: createInitialMiniGamesState(),
    decorations: createInitialDecorationsState(),
  };
}

export function toSaveData(state: GameState): GameSaveData {
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
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

function normalizeActiveRegionId(
  player: Player,
  regions: Record<string, Region>,
): Player {
  const activeRegionId = player.activeRegionId;

  if (!activeRegionId || !regions[activeRegionId]) {
    return {
      ...player,
      activeRegionId: REGION_IDS.VALLEY,
    };
  }

  return player;
}

export function fromSaveData(data: GameSaveData): Omit<
  GameState,
  "isHydrated" | "isSaving" | "lastSavedAt" | "saveError"
> {
  const defaults = createInitialGameState();

  const player = normalizeActiveRegionId(
    mergePlayer(defaults.player, data.player),
    mergeKeyedRecord(defaults.regions, data.regions),
  );

  return {
    player,
    skills: normalizeSkillsState(data.skills),
    inventory: Array.isArray(data.inventory) ? data.inventory : defaults.inventory,
    regions: mergeKeyedRecord(defaults.regions, data.regions),
    quests: mergeKeyedRecord(defaults.quests, data.quests),
    animals: mergeKeyedRecord(defaults.animals, data.animals),
    restoration: mergeKeyedRecord(defaults.restoration, data.restoration),
    events: mergeKeyedRecord(defaults.events, data.events),
    minigames: mergeKeyedRecord(defaults.minigames, data.minigames),
    decorations: mergeKeyedRecord(defaults.decorations, data.decorations),
  };
}
