import {
  RESTORATION_DEFINITIONS,
  getRestorationDefinition,
  isRegisteredRestorationProject,
} from "@/game/constants/restoration";
import { SKILL_IDS } from "@/game/constants/skills";
import { sumRequiredResources } from "@/game/player/resources";
import { applyGameRewards } from "@/game/rewards";
import type {
  GameUserId,
  QuestId,
  RestorationProject,
  RestorationProjectDefinition,
  RestorationProjectId,
} from "@/types";
import type { RestorationEvaluationContext } from "./context";
import {
  computeRestorationProgressPercent,
  getCurrentStage,
  hasRemainingStages,
} from "./progress";
import {
  canRestoreCurrentStage,
  canStartRestorationProject,
  resolveNextProjectStatus,
} from "./progression";
import type { GameRewardCallbacks } from "@/game/rewards";

export interface RestorationStageResult {
  projectId: RestorationProjectId;
  stageId: string;
  stageLabel: string;
  progressPercent: number;
  skillXpAwarded: number;
  projectCompleted: boolean;
}

export interface RestorationServiceCallbacks extends GameRewardCallbacks {
  spendResources: (
    required: RestorationProjectDefinition["stages"][number]["requiredResources"],
  ) => boolean;
  updateRegionRestoration: (
    regionId: RestorationProjectDefinition["regionId"],
    progressPercent: number,
    restored: boolean,
  ) => void;
  startLinkedQuest: (questId: QuestId) => void;
  onRestorationChanged: () => void;
}

export interface RestorationService {
  refreshRestorationAvailability: () => void;
  startRestorationProject: (projectId: RestorationProjectId) => boolean;
  restoreCurrentStage: (
    projectId: RestorationProjectId,
  ) => RestorationStageResult | null;
  getProject: (projectId: RestorationProjectId) => RestorationProject | null;
}

type RestorationStoreReader = () => Record<string, RestorationProject>;
type RestorationStoreWriter = (
  projectId: RestorationProjectId,
  updater: (current: RestorationProject) => RestorationProject,
) => void;
type ContextReader = () => RestorationEvaluationContext;

export function createRestorationService(
  readProjects: RestorationStoreReader,
  writeProject: RestorationStoreWriter,
  readContext: ContextReader,
  callbacks: RestorationServiceCallbacks,
  readActorUserId: () => GameUserId,
): RestorationService {
  function getProjectOrNull(
    projectId: RestorationProjectId,
  ): RestorationProject | null {
    return readProjects()[projectId] ?? null;
  }

  function writeProjectIfExists(
    projectId: RestorationProjectId,
    updater: (current: RestorationProject) => RestorationProject,
  ): RestorationProject | null {
    const current = getProjectOrNull(projectId);

    if (!current) {
      return null;
    }

    writeProject(projectId, updater);
    return readProjects()[projectId] ?? null;
  }

  function applyStageRewards(
    definition: RestorationProjectDefinition,
    stageIndex: number,
  ): number {
    const stage = definition.stages[stageIndex];

    if (!stage || stage.completionBonusXp <= 0) {
      return 0;
    }

    callbacks.awardSkillXp(
      stage.skillId ?? SKILL_IDS.RESTORATION,
      stage.completionBonusXp,
    );
    return stage.completionBonusXp;
  }

  function recordContribution(
    project: RestorationProject,
    stageId: string,
    resourcesContributed: number,
  ): RestorationProject["contributions"] {
    const existing = project.contributions.find(
      (entry) => entry.userId === readActorUserId(),
    );

    if (!existing) {
      return [
        ...project.contributions,
        {
          userId: readActorUserId(),
          completedStageIds: [stageId],
          resourcesContributed,
        },
      ];
    }

    return project.contributions.map((entry) =>
      entry.userId === readActorUserId()
        ? {
            ...entry,
            completedStageIds: entry.completedStageIds.includes(stageId)
              ? entry.completedStageIds
              : [...entry.completedStageIds, stageId],
            resourcesContributed:
              entry.resourcesContributed + resourcesContributed,
          }
        : entry,
    );
  }

  return {
    refreshRestorationAvailability() {
      const context = readContext();
      const projects = readProjects();

      for (const definition of RESTORATION_DEFINITIONS) {
        const project = projects[definition.id];

        if (!project) {
          continue;
        }

        const nextStatus = resolveNextProjectStatus(
          definition,
          project,
          context,
        );

        if (nextStatus !== project.status) {
          writeProject(definition.id, (current) => ({
            ...current,
            status: nextStatus,
          }));
        }
      }
    },

    startRestorationProject(projectId) {
      if (!isRegisteredRestorationProject(projectId)) {
        return false;
      }

      const definition = getRestorationDefinition(projectId);
      const project = getProjectOrNull(projectId);

      if (!definition || !project) {
        return false;
      }

      if (!canStartRestorationProject(definition, project, readContext())) {
        return false;
      }

      writeProject(projectId, (current) => ({
        ...current,
        status: "in_progress",
        startedAt: new Date().toISOString(),
      }));

      for (const link of definition.linkedQuestIds ?? []) {
        if (link.startOnProjectStart) {
          callbacks.startLinkedQuest(link.questId);
        }
      }

      callbacks.onRestorationChanged();
      return true;
    },

    restoreCurrentStage(projectId) {
      if (!isRegisteredRestorationProject(projectId)) {
        return null;
      }

      const definition = getRestorationDefinition(projectId);
      const project = getProjectOrNull(projectId);

      if (!definition || !project || project.status !== "in_progress") {
        return null;
      }

      const context = readContext();

      if (!canRestoreCurrentStage(definition, project, context)) {
        return null;
      }

      const stage = getCurrentStage(definition, project);

      if (!stage) {
        return null;
      }

      const spent = callbacks.spendResources(stage.requiredResources);

      if (!spent) {
        return null;
      }

      const resourcesContributed = sumRequiredResources(stage.requiredResources);
      const stageIndex = project.currentStageIndex;
      const skillXpAwarded = applyStageRewards(definition, stageIndex);
      const nextStageIndex = stageIndex + 1;
      const projectCompleted = !hasRemainingStages(definition, {
        ...project,
        currentStageIndex: nextStageIndex,
        completedStageIds: [...project.completedStageIds, stage.id],
      });

      const updated = writeProjectIfExists(projectId, (current) => ({
        ...current,
        currentStageIndex: nextStageIndex,
        completedStageIds: [...current.completedStageIds, stage.id],
        contributions: recordContribution(
          current,
          stage.id,
          resourcesContributed,
        ),
        status: projectCompleted ? "completed" : "in_progress",
        completedAt: projectCompleted ? new Date().toISOString() : null,
      }));

      if (!updated) {
        return null;
      }

      const progressPercent = computeRestorationProgressPercent(
        definition,
        updated,
      );

      callbacks.updateRegionRestoration(
        definition.regionId,
        progressPercent,
        projectCompleted,
      );

      if (projectCompleted) {
        applyGameRewards(definition.completionRewards, callbacks);
      }

      callbacks.onRestorationChanged();

      return {
        projectId,
        stageId: stage.id,
        stageLabel: stage.label,
        progressPercent,
        skillXpAwarded,
        projectCompleted,
      };
    },

    getProject(projectId) {
      return getProjectOrNull(projectId);
    },
  };
}
