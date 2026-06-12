import type {
  QuestId,
  RegionId,
  ResourceId,
  RestorationProjectId,
  SkillId,
} from "./ids";
import type { GameReward } from "./reward";
import type { GameUser } from "./user";
import type { UnlockRequirement } from "./unlock-requirement";

export type RestorationProjectStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

export interface RestorationResourceRequirement {
  resourceId: ResourceId;
  amount: number;
}

export interface RestorationStage {
  id: string;
  label: string;
  description: string;
  requiredResources: RestorationResourceRequirement[];
  completionBonusXp: number;
  /** Defaults to the Restoration skill when omitted. */
  skillId?: SkillId;
}

/** Quests that should start or sync when this project progresses. */
export interface RestorationQuestLink {
  questId: QuestId;
  /** Auto-start the quest when the project begins. */
  startOnProjectStart?: boolean;
}

export interface RestorationProjectDefinition {
  id: RestorationProjectId;
  regionId: RegionId;
  title: string;
  description: string;
  stages: RestorationStage[];
  unlockRequirement: UnlockRequirement | null;
  completionRewards: GameReward[];
  linkedQuestIds?: RestorationQuestLink[];
  sortOrder: number;
}

/** Per-member contribution totals — ready for shared-valley restoration. */
export interface RestorationContribution {
  userId: GameUser["id"];
  completedStageIds: string[];
  resourcesContributed: number;
}

export interface RestorationProject {
  id: RestorationProjectId;
  regionId: RegionId;
  status: RestorationProjectStatus;
  currentStageIndex: number;
  completedStageIds: string[];
  startedAt: string | null;
  completedAt: string | null;
  /** Collaborative restoration ledger — empty until multiplayer ships. */
  contributions: RestorationContribution[];
}
