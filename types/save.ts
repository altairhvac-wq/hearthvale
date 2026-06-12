import type { Animal } from "./animal";
import type { Decoration } from "./decoration";
import type { Quest } from "./quest";
import type { InventoryItem } from "./inventory";
import type { MiniGame } from "./minigame";
import type { Region } from "./region";
import type { RestorationProject } from "./restoration";
import type { SkillProgress } from "./skill";
import type { Player } from "./player";
import type { GameUser } from "./user";
import type { ValleyId } from "./ids";
import type {
  ValleyInvite,
  ValleyMember,
  ValleySaveData,
  VisitSession,
} from "./valley";

export const SAVE_VERSION = 4 as const;

/** @deprecated v2 flat shape — migrated automatically to v3. */
export interface LegacyGameSaveDataV2 {
  version: 2;
  savedAt: string;
  player: Player & { activeRegionId?: string | null };
  skills: Record<string, SkillProgress>;
  inventory: InventoryItem[];
  regions: Record<string, Region>;
  quests: Record<string, Quest>;
  animals: Record<string, Animal>;
  restoration: Record<string, RestorationProject>;
  events: Record<string, unknown>;
  minigames: Record<string, MiniGame>;
  decorations: Record<string, Decoration>;
}

export interface GameSaveData {
  version: typeof SAVE_VERSION;
  savedAt: string;
  user: GameUser;
  player: Player;
  skills: Record<string, SkillProgress>;
  inventory: InventoryItem[];
  activeValleyId: ValleyId;
  valleys: Record<string, ValleySaveData>;
  memberships: Record<string, ValleyMember>;
  pendingInvites: Record<string, ValleyInvite>;
  visitSessions: Record<string, VisitSession>;
}

export interface SaveMigration {
  fromVersion: number;
  toVersion: number;
  migrate: (data: Record<string, unknown>) => Record<string, unknown>;
}
