import type { RegionId, ResourceId, RestorationProjectId } from "./ids";
import type { UnlockRequirement } from "./unlock-requirement";

export type RestorationProjectStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

export interface RestorationStage {
  id: string;
  label: string;
  description: string;
  requiredResources: Array<{ resourceId: ResourceId; amount: number }>;
  completionBonusXp: number;
}

export interface RestorationProjectDefinition {
  id: RestorationProjectId;
  regionId: RegionId;
  title: string;
  description: string;
  stages: RestorationStage[];
  unlockRequirement: UnlockRequirement | null;
}

export interface RestorationProject {
  id: RestorationProjectId;
  regionId: RegionId;
  status: RestorationProjectStatus;
  currentStageIndex: number;
  completedStageIds: string[];
  startedAt: string | null;
  completedAt: string | null;
}
