import {
  RESTORATION_DEFINITIONS,
} from "@/game/constants/restoration";
import { canAffordResources } from "@/game/player/resources";
import { isUnlockRequirementMet } from "@/game/unlock/requirements";
import type {
  RestorationProject,
  RestorationProjectDefinition,
  RestorationProjectStatus,
} from "@/types";
import type { RestorationEvaluationContext } from "./context";

export function shouldProjectBeAvailable(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
  context: RestorationEvaluationContext,
): boolean {
  if (project.status === "completed" || project.status === "in_progress") {
    return false;
  }

  if (
    definition.unlockRequirement &&
    !isUnlockRequirementMet(definition.unlockRequirement, context)
  ) {
    return false;
  }

  return true;
}

export function resolveNextProjectStatus(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
  context: RestorationEvaluationContext,
): RestorationProjectStatus {
  if (project.status === "completed" || project.status === "in_progress") {
    return project.status;
  }

  if (shouldProjectBeAvailable(definition, project, context)) {
    return "available";
  }

  return "locked";
}

export function canStartRestorationProject(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
  context: RestorationEvaluationContext,
): boolean {
  if (project.status !== "available") {
    return false;
  }

  if (
    definition.unlockRequirement &&
    !isUnlockRequirementMet(definition.unlockRequirement, context)
  ) {
    return false;
  }

  return true;
}

export function canRestoreCurrentStage(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
  context: RestorationEvaluationContext,
): boolean {
  if (project.status !== "in_progress") {
    return false;
  }

  const stage = definition.stages[project.currentStageIndex];

  if (!stage) {
    return false;
  }

  return canAffordResources(context.playerResources, stage.requiredResources);
}
