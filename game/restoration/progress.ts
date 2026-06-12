import type { RestorationProject, RestorationProjectDefinition } from "@/types";

export function computeRestorationProgressPercent(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
): number {
  if (definition.stages.length === 0) {
    return project.status === "completed" ? 100 : 0;
  }

  if (project.status === "completed") {
    return 100;
  }

  const completedCount = project.completedStageIds.length;
  return Math.round((completedCount / definition.stages.length) * 100);
}

export function getCurrentStage(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
) {
  return definition.stages[project.currentStageIndex] ?? null;
}

export function isProjectFullyRestored(project: RestorationProject): boolean {
  return project.status === "completed";
}

export function hasRemainingStages(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
): boolean {
  return project.currentStageIndex < definition.stages.length;
}
