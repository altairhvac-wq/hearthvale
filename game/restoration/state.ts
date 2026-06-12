import {
  RESTORATION_DEFINITIONS,
} from "@/game/constants/restoration";
import type {
  Region,
  RestorationProject,
  RestorationProjectDefinition,
  RestorationProjectStatus,
} from "@/types";
import type { GameUserId } from "@/types";
import { computeRestorationProgressPercent } from "./progress";

const RESTORATION_STATUSES: readonly RestorationProjectStatus[] = [
  "locked",
  "available",
  "in_progress",
  "completed",
];

function isRestorationStatus(
  value: unknown,
): value is RestorationProjectStatus {
  return (
    typeof value === "string" &&
    (RESTORATION_STATUSES as readonly string[]).includes(value)
  );
}

function normalizeTimestamp(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function normalizeContributions(
  value: unknown,
): RestorationProject["contributions"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const record = entry as Record<string, unknown>;

    if (typeof record.userId !== "string") {
      return [];
    }

    return [
      {
        userId: record.userId as GameUserId,
        completedStageIds: normalizeStringArray(record.completedStageIds),
        resourcesContributed:
          typeof record.resourcesContributed === "number"
            ? record.resourcesContributed
            : 0,
      },
    ];
  });
}

function filterValidCompletedStagePrefix(
  definition: RestorationProjectDefinition,
  completedStageIds: string[],
): string[] {
  const prefix: string[] = [];

  for (const stage of definition.stages) {
    if (completedStageIds.includes(stage.id)) {
      prefix.push(stage.id);
    } else {
      break;
    }
  }

  return prefix;
}

function reconcileRestorationProjectProgress(
  definition: RestorationProjectDefinition,
  project: RestorationProject,
): Pick<
  RestorationProject,
  | "status"
  | "currentStageIndex"
  | "completedStageIds"
  | "startedAt"
  | "completedAt"
> {
  const stageCount = definition.stages.length;
  const validCompleted = filterValidCompletedStagePrefix(
    definition,
    project.completedStageIds,
  );

  let currentStageIndex = Math.min(
    Math.max(0, project.currentStageIndex),
    stageCount,
  );

  if (validCompleted.length > currentStageIndex) {
    currentStageIndex = validCompleted.length;
  }

  const completedStageIds = definition.stages
    .slice(0, currentStageIndex)
    .map((stage) => stage.id);

  let status = project.status;
  const allStagesComplete = stageCount > 0 && currentStageIndex >= stageCount;

  if (allStagesComplete) {
    status = "completed";
    currentStageIndex = stageCount;
  } else if (status === "completed") {
    status = currentStageIndex > 0 ? "in_progress" : "available";
  } else if (
    (status === "locked" || status === "available") &&
    currentStageIndex > 0
  ) {
    status = "in_progress";
  } else if (
    status === "in_progress" &&
    currentStageIndex === 0 &&
    !project.startedAt
  ) {
    status = "available";
  }

  const startedAt =
    currentStageIndex > 0 || status === "in_progress" || status === "completed"
      ? project.startedAt
      : null;

  const completedAt = status === "completed" ? project.completedAt : null;

  return {
    status,
    currentStageIndex,
    completedStageIds,
    startedAt,
    completedAt,
  };
}

export function mergeRestorationProjectWithDefinition(
  definition: (typeof RESTORATION_DEFINITIONS)[number],
  saved: RestorationProject | undefined,
  defaultProject: RestorationProject,
): RestorationProject {
  if (!saved || saved.id !== definition.id) {
    return defaultProject;
  }

  const status = isRestorationStatus(saved.status)
    ? saved.status
    : defaultProject.status;

  const merged: RestorationProject = {
    id: definition.id,
    regionId: definition.regionId,
    status,
    currentStageIndex:
      typeof saved.currentStageIndex === "number"
        ? Math.min(
            Math.max(0, saved.currentStageIndex),
            definition.stages.length,
          )
        : defaultProject.currentStageIndex,
    completedStageIds: normalizeStringArray(saved.completedStageIds),
    startedAt: normalizeTimestamp(saved.startedAt),
    completedAt: normalizeTimestamp(saved.completedAt),
    contributions: normalizeContributions(saved.contributions),
  };

  return {
    ...merged,
    ...reconcileRestorationProjectProgress(definition, merged),
  };
}

/** Reconcile persisted restoration progress with the current project registry. */
export function mergeRestorationState(
  saved: Record<string, RestorationProject> | undefined,
): Record<string, RestorationProject> {
  const defaults = createInitialRestorationState();

  if (!saved) {
    return defaults;
  }

  return RESTORATION_DEFINITIONS.reduce<Record<string, RestorationProject>>(
    (acc, definition) => {
      acc[definition.id] = mergeRestorationProjectWithDefinition(
        definition,
        saved[definition.id],
        defaults[definition.id]!,
      );

      return acc;
    },
    {},
  );
}

/** Align region progress fields with merged restoration project state. */
export function syncRegionsWithRestorationState(
  regions: Record<string, Region>,
  restoration: Record<string, RestorationProject>,
): Record<string, Region> {
  const next = { ...regions };
  const definitionsByRegion = new Map<
    Region["id"],
    Array<(typeof RESTORATION_DEFINITIONS)[number]>
  >();

  for (const definition of RESTORATION_DEFINITIONS) {
    const existing = definitionsByRegion.get(definition.regionId) ?? [];
    existing.push(definition);
    definitionsByRegion.set(definition.regionId, existing);
  }

  for (const [regionId, definitions] of definitionsByRegion) {
    const region = next[regionId];

    if (!region) {
      continue;
    }

    let progressPercent = 0;
    let isRestored = false;

    for (const definition of definitions) {
      const project = restoration[definition.id];

      if (!project) {
        continue;
      }

      progressPercent = Math.max(
        progressPercent,
        computeRestorationProgressPercent(definition, project),
      );

      if (project.status === "completed") {
        isRestored = true;
      }
    }

    if (progressPercent === 0 && !isRestored) {
      continue;
    }

    next[regionId] = {
      ...region,
      restorationProgress: progressPercent,
      state: isRestored ? "restored" : region.state,
      restoredAt: region.restoredAt,
    };
  }

  return next;
}

export function createInitialRestorationState(): Record<
  string,
  RestorationProject
> {
  return RESTORATION_DEFINITIONS.reduce<Record<string, RestorationProject>>(
    (acc, definition) => {
      acc[definition.id] = {
        id: definition.id,
        regionId: definition.regionId,
        status: "locked",
        currentStageIndex: 0,
        completedStageIds: [],
        startedAt: null,
        completedAt: null,
        contributions: [],
      };

      return acc;
    },
    {},
  );
}
