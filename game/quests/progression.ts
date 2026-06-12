import { SKILL_IDS } from "@/game/constants/skills";
import { getQuestDefinition } from "@/game/constants/quests";
import type { Quest, QuestDefinition } from "@/types";
import type { QuestEvaluationContext } from "./context";

export function arePrerequisitesMet(
  definition: QuestDefinition,
  quests: Record<string, Quest>,
): boolean {
  return definition.prerequisiteQuestIds.every((questId) => {
    const prerequisite = quests[questId];
    return prerequisite?.status === "completed";
  });
}

export function isQuestSeasonActive(
  definition: QuestDefinition,
  context: QuestEvaluationContext,
): boolean {
  if (!definition.seasonId) {
    return true;
  }

  return context.activeSeasonId === definition.seasonId;
}

export function canStartQuest(
  definition: QuestDefinition,
  quest: Quest,
  context: QuestEvaluationContext,
): boolean {
  if (quest.status !== "available") {
    return false;
  }

  if (!arePrerequisitesMet(definition, context.quests)) {
    return false;
  }

  if (!isQuestSeasonActive(definition, context)) {
    return false;
  }

  return (
    context.getSkillLevel(SKILL_IDS.RESTORATION) >=
    definition.requiredRestorationLevel
  );
}

export function shouldQuestBeAvailable(
  definition: QuestDefinition,
  quest: Quest,
  context: QuestEvaluationContext,
): boolean {
  if (quest.status === "completed" || quest.status === "active") {
    return false;
  }

  if (!arePrerequisitesMet(definition, context.quests)) {
    return false;
  }

  if (!isQuestSeasonActive(definition, context)) {
    return false;
  }

  return (
    context.getSkillLevel(SKILL_IDS.RESTORATION) >=
    definition.requiredRestorationLevel
  );
}

export function resolveNextQuestStatus(
  definition: QuestDefinition,
  quest: Quest,
  context: QuestEvaluationContext,
): Quest["status"] {
  if (quest.status === "completed" || quest.status === "active") {
    return quest.status;
  }

  if (shouldQuestBeAvailable(definition, quest, context)) {
    return "available";
  }

  return "locked";
}

export function isQuestVisibleInJournal(
  definition: QuestDefinition,
  quest: Quest,
): boolean {
  if (definition.visibility === "visible") {
    return (
      quest.status !== "locked" ||
      definition.prerequisiteQuestIds.length === 0
    );
  }

  return (
    quest.status === "available" ||
    quest.status === "active" ||
    quest.status === "completed"
  );
}

export function getPrerequisiteTitles(definition: QuestDefinition): string[] {
  return definition.prerequisiteQuestIds.flatMap((questId) => {
    const title = getQuestDefinition(questId)?.title;
    return title ? [title] : [];
  });
}
