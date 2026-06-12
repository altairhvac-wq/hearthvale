import {
  RESTORATION_DEFINITIONS,
} from "@/game/constants/restoration";
import { RESOURCE_DEFINITIONS } from "@/game/constants/resources";
import { describeUnlockRequirement } from "@/game/unlock/descriptions";
import { describeGameReward } from "@/game/rewards";
import { getResourceAmount } from "@/game/player/resources";
import type { RegionId, RestorationProject, RestorationProjectDefinition, RestorationProjectStatus, RestorationResourceRequirement } from "@/types";
import type { RestorationEvaluationContext } from "./context";
import { computeRestorationProgressPercent, getCurrentStage } from "./progress";
import {
  canRestoreCurrentStage,
  canStartRestorationProject,
} from "./progression";

export interface RestorationRequirementViewModel {
  resourceId: RestorationResourceRequirement["resourceId"];
  name: string;
  required: number;
  owned: number;
  isMet: boolean;
}

export interface RestorationProjectViewModel {
  id: RestorationProjectDefinition["id"];
  regionId: RestorationProjectDefinition["regionId"];
  title: string;
  description: string;
  status: RestorationProjectStatus;
  displayStatus: string;
  progressPercent: number;
  currentStageLabel: string | null;
  currentStageDescription: string | null;
  requirements: RestorationRequirementViewModel[];
  canStart: boolean;
  canRestore: boolean;
  showRequirements: boolean;
  showRestoreAction: boolean;
  unlockRequirementDescription: string | null;
  completionRewardDescriptions: string[];
  totalStages: number;
  completedStages: number;
}

export function getRestorationStatusLabel(
  status: RestorationProjectStatus,
): string {
  switch (status) {
    case "locked":
      return "Locked";
    case "available":
      return "Available";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Restored";
  }
}

function buildRequirementViewModels(
  required: RestorationResourceRequirement[],
  playerResources: RestorationEvaluationContext["playerResources"],
): RestorationRequirementViewModel[] {
  return required.map((entry) => {
    const definition = RESOURCE_DEFINITIONS.find(
      (resource) => resource.id === entry.resourceId,
    );
    const owned = getResourceAmount(playerResources, entry.resourceId);

    return {
      resourceId: entry.resourceId,
      name: definition?.name ?? "Resource",
      required: entry.amount,
      owned,
      isMet: owned >= entry.amount,
    };
  });
}

export function buildRestorationProjectViewModel(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
  context: RestorationEvaluationContext,
): RestorationProjectViewModel {
  const currentStage =
    project.status === "available" || project.status === "in_progress"
      ? getCurrentStage(definition, project)
      : null;
  const requirements = currentStage
    ? buildRequirementViewModels(
        currentStage.requiredResources,
        context.playerResources,
      )
    : [];

  const unlockRequirementDescription = definition.unlockRequirement
    ? describeUnlockRequirement(definition.unlockRequirement)
    : null;

  const canStart = canStartRestorationProject(definition, project, context);
  const canRestore = canRestoreCurrentStage(definition, project, context);

  return {
    id: definition.id,
    regionId: definition.regionId,
    title: definition.title,
    description: definition.description,
    status: project.status,
    displayStatus: getRestorationStatusLabel(project.status),
    progressPercent: computeRestorationProgressPercent(definition, project),
    currentStageLabel: currentStage?.label ?? null,
    currentStageDescription: currentStage?.description ?? null,
    requirements,
    canStart,
    canRestore,
    showRequirements:
      project.status === "available" || project.status === "in_progress",
    showRestoreAction:
      project.status === "available" || project.status === "in_progress",
    unlockRequirementDescription,
    completionRewardDescriptions: definition.completionRewards.map(
      describeGameReward,
    ),
    totalStages: definition.stages.length,
    completedStages: project.completedStageIds.length,
  };
}

export function buildRegionRestorationViewModels(
  regionId: RegionId,
  projects: Record<string, RestorationProject>,
  context: RestorationEvaluationContext,
): RestorationProjectViewModel[] {
  return RESTORATION_DEFINITIONS.filter((definition) => definition.regionId === regionId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .flatMap((definition) => {
      const project = projects[definition.id];

      if (!project) {
        return [];
      }

      return [buildRestorationProjectViewModel(definition, project, context)];
    });
}

export function buildAllRestorationViewModels(
  projects: Record<string, RestorationProject>,
  context: RestorationEvaluationContext,
): RestorationProjectViewModel[] {
  return [...RESTORATION_DEFINITIONS]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .flatMap((definition) => {
      const project = projects[definition.id];

      if (!project) {
        return [];
      }

      return [buildRestorationProjectViewModel(definition, project, context)];
    });
}
