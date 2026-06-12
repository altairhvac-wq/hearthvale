import type { ItemId, QuestId, RegionId, ResourceId, SkillId } from "./ids";
import type { UnlockReference } from "./unlock-requirement";

export type QuestStatus = "locked" | "available" | "active" | "completed";

export type QuestReward =
  | { type: "resource"; resourceId: ResourceId; amount: number }
  | { type: "skill_xp"; skillId: SkillId; amount: number }
  | { type: "unlock"; unlock: UnlockReference }
  | { type: "item"; itemId: ItemId; amount: number };

export interface QuestObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface QuestDefinition {
  id: QuestId;
  title: string;
  description: string;
  regionId: RegionId | null;
  /** Minimum restoration skill level — extend with union as more gates are needed. */
  requiredRestorationLevel: number;
  prerequisiteQuestIds: QuestId[];
  rewards: QuestReward[];
}

export interface Quest {
  id: QuestId;
  status: QuestStatus;
  objectives: QuestObjective[];
  startedAt: string | null;
  completedAt: string | null;
}
