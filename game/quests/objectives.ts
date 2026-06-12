import type {
  Quest,
  QuestDefinition,
  QuestObjective,
  QuestObjectiveDefinition,
} from "@/types";
import type { QuestEvaluationContext } from "./context";

export function createObjectivesFromDefinition(
  definition: QuestDefinition,
): QuestObjective[] {
  return definition.objectives.map((objective) =>
    createObjectiveFromDefinition(objective),
  );
}

export function mergeObjectivesWithDefinition(
  definition: QuestDefinition,
  savedObjectives: QuestObjective[],
  defaultObjectives: QuestObjective[],
): QuestObjective[] {
  const savedById = new Map(
    savedObjectives.map((objective) => [objective.id, objective]),
  );
  const defaultsById = new Map(
    defaultObjectives.map((objective) => [objective.id, objective]),
  );

  return definition.objectives.map((objectiveDefinition) => {
    const saved = savedById.get(objectiveDefinition.id);
    const fallback = defaultsById.get(objectiveDefinition.id);

    if (!saved || !fallback) {
      return fallback ?? createObjectiveFromDefinition(objectiveDefinition);
    }

    const current = Math.max(
      0,
      Math.min(
        typeof saved.current === "number" ? saved.current : 0,
        objectiveDefinition.target,
      ),
    );

    return {
      id: objectiveDefinition.id,
      description: objectiveDefinition.description,
      target: objectiveDefinition.target,
      current,
      completed:
        typeof saved.completed === "boolean"
          ? saved.completed || current >= objectiveDefinition.target
          : current >= objectiveDefinition.target,
    };
  });
}

function createObjectiveFromDefinition(
  definition: QuestObjectiveDefinition,
): QuestObjective {
  return {
    id: definition.id,
    description: definition.description,
    target: definition.target,
    current: 0,
    completed: false,
  };
}

export function computeObjectiveProgress(
  definition: QuestObjectiveDefinition,
  context: QuestEvaluationContext,
): number {
  switch (definition.kind) {
    case "manual":
      return 0;
    case "visit_region": {
      const region = context.regions[definition.regionId];
      if (!region || region.state === "locked") {
        return 0;
      }
      return 1;
    }
    case "restore_region": {
      const region = context.regions[definition.regionId];
      if (!region) {
        return 0;
      }
      return Math.min(region.restorationProgress, definition.target);
    }
    case "reach_skill_level":
      return Math.min(
        context.getSkillLevel(definition.skillId),
        definition.target,
      );
    case "collect_resource":
      return Math.min(
        context.playerResources[definition.resourceId] ?? 0,
        definition.target,
      );
  }
}

export function syncQuestObjectivesFromContext(
  quest: Quest,
  definition: QuestDefinition,
  context: QuestEvaluationContext,
): QuestObjective[] {
  return quest.objectives.map((objective, index) => {
    const objectiveDefinition = definition.objectives[index];

    if (!objectiveDefinition || objective.completed) {
      return objective;
    }

    if (objectiveDefinition.kind === "manual") {
      return objective;
    }

    const current = computeObjectiveProgress(objectiveDefinition, context);
    const completed = current >= objective.target;

    return {
      ...objective,
      current,
      completed,
    };
  });
}

export function setObjectiveProgress(
  quest: Quest,
  objectiveId: string,
  current: number,
): QuestObjective[] {
  return quest.objectives.map((objective) => {
    if (objective.id !== objectiveId) {
      return objective;
    }

    const clamped = Math.max(0, Math.min(current, objective.target));

    return {
      ...objective,
      current: clamped,
      completed: clamped >= objective.target,
    };
  });
}

export function incrementObjectiveProgress(
  quest: Quest,
  objectiveId: string,
  delta = 1,
): QuestObjective[] {
  const objective = quest.objectives.find((entry) => entry.id === objectiveId);

  if (!objective) {
    return quest.objectives;
  }

  return setObjectiveProgress(
    quest,
    objectiveId,
    objective.current + delta,
  );
}

export function areAllObjectivesComplete(quest: Quest): boolean {
  if (quest.objectives.length === 0) {
    return true;
  }

  return quest.objectives.every((objective) => objective.completed);
}

export function computeQuestProgressPercent(quest: Quest): number {
  if (quest.status === "completed") {
    return 100;
  }

  if (quest.objectives.length === 0) {
    return quest.status === "active" ? 0 : 0;
  }

  const totalTarget = quest.objectives.reduce(
    (sum, objective) => sum + objective.target,
    0,
  );
  const totalCurrent = quest.objectives.reduce(
    (sum, objective) => sum + objective.current,
    0,
  );

  if (totalTarget <= 0) {
    return 0;
  }

  return Math.round((totalCurrent / totalTarget) * 100);
}
