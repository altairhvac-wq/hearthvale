import { QUEST_DEFINITIONS, QUEST_IDS } from "@/game/constants/quests";
import type { Quest } from "@/types";

export function createInitialQuestsState(): Record<string, Quest> {
  return QUEST_DEFINITIONS.reduce<Record<string, Quest>>((acc, definition) => {
    acc[definition.id] = {
      id: definition.id,
      status:
        definition.id === QUEST_IDS.WELCOME_TO_VALLEY ? "available" : "locked",
      objectives: [],
      startedAt: null,
      completedAt: null,
    };

    return acc;
  }, {});
}
