import type { QuestId, RegionId, ResourceId, SeasonId, SkillId } from "./ids";
import type { GameReward } from "./reward";

export type QuestStatus = "locked" | "available" | "active" | "completed";

/** Storybook-style quest categories for journal grouping and future filtering. */
export type QuestCategory =
  | "story"
  | "exploration"
  | "restoration"
  | "collection"
  | "skill"
  | "boat"
  | "island"
  | "friendship"
  | "seasonal";

/** Controls whether a quest appears in the journal before discovery. */
export type QuestVisibility = "visible" | "hidden";

export type QuestReward = GameReward;

export interface QuestObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

/** Static objective template — copied into runtime quest state on creation. */
export type QuestObjectiveDefinition = {
  id: string;
  description: string;
  target: number;
} & (
  | { kind: "manual" }
  | { kind: "visit_region"; regionId: RegionId }
  | { kind: "restore_region"; regionId: RegionId }
  | { kind: "reach_skill_level"; skillId: SkillId }
  | { kind: "collect_resource"; resourceId: ResourceId }
);

export interface QuestDefinition {
  id: QuestId;
  title: string;
  description: string;
  category: QuestCategory;
  visibility: QuestVisibility;
  regionId: RegionId | null;
  /** Minimum restoration skill level — extend with union as more gates are needed. */
  requiredRestorationLevel: number;
  prerequisiteQuestIds: QuestId[];
  objectives: QuestObjectiveDefinition[];
  rewards: QuestReward[];
  sortOrder: number;
  /** Seasonal quest support — undefined means always available. */
  seasonId?: SeasonId;
}

/** Valley-scoped runtime quest progress — shared by all members of a valley. */
export interface Quest {
  id: QuestId;
  status: QuestStatus;
  objectives: QuestObjective[];
  startedAt: string | null;
  completedAt: string | null;
}
