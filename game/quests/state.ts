import {
  QUEST_DEFINITIONS,
  QUEST_IDS,
} from "@/game/constants/quests";
import {
  createObjectivesFromDefinition,
  mergeObjectivesWithDefinition,
} from "./objectives";
import type { Quest, QuestDefinition, QuestStatus } from "@/types";

const QUEST_STATUSES: readonly QuestStatus[] = [
  "locked",
  "available",
  "active",
  "completed",
];

function isQuestStatus(value: unknown): value is QuestStatus {
  return (
    typeof value === "string" &&
    (QUEST_STATUSES as readonly string[]).includes(value)
  );
}

function normalizeTimestamp(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function mergeQuestWithDefinition(
  definition: QuestDefinition,
  saved: Quest | undefined,
  defaultQuest: Quest,
): Quest {
  if (!saved || saved.id !== definition.id) {
    return defaultQuest;
  }

  const status = isQuestStatus(saved.status) ? saved.status : defaultQuest.status;

  return {
    id: definition.id,
    status,
    objectives: mergeObjectivesWithDefinition(
      definition,
      saved.objectives,
      defaultQuest.objectives,
    ),
    startedAt: normalizeTimestamp(saved.startedAt),
    completedAt: normalizeTimestamp(saved.completedAt),
  };
}

/** Reconcile persisted quest progress with the current quest registry. */
export function mergeQuestsState(
  saved: Record<string, Quest> | undefined,
): Record<string, Quest> {
  const defaults = createInitialQuestsState();

  if (!saved) {
    return defaults;
  }

  return QUEST_DEFINITIONS.reduce<Record<string, Quest>>((acc, definition) => {
    acc[definition.id] = mergeQuestWithDefinition(
      definition,
      saved[definition.id],
      defaults[definition.id]!,
    );

    return acc;
  }, {});
}

export function createInitialQuestsState(): Record<string, Quest> {
  return QUEST_DEFINITIONS.reduce<Record<string, Quest>>((acc, definition) => {
    acc[definition.id] = {
      id: definition.id,
      status:
        definition.id === QUEST_IDS.WELCOME_TO_HEARTHVALE
          ? "available"
          : "locked",
      objectives: createObjectivesFromDefinition(definition),
      startedAt: null,
      completedAt: null,
    };

    return acc;
  }, {});
}
