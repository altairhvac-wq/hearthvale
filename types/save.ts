import type { Animal } from "./animal";
import type { Decoration } from "./decoration";
import type { Event } from "./event";
import type { Quest } from "./quest";
import type { InventoryItem } from "./inventory";
import type { MiniGame } from "./minigame";
import type { Region } from "./region";
import type { RestorationProject } from "./restoration";
import type { SkillProgress } from "./skill";
import type { Player } from "./player";

export const SAVE_VERSION = 2 as const;

export interface GameSaveData {
  version: typeof SAVE_VERSION;
  savedAt: string;
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
}

export interface SaveMigration {
  fromVersion: number;
  toVersion: number;
  migrate: (data: Record<string, unknown>) => Record<string, unknown>;
}
