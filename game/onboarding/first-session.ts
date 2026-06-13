import { QUEST_IDS } from "@/game/constants/quests";
import type { Quest, QuestId } from "@/types";

export function isWelcomeQuestComplete(
  quests: Record<string, Quest>,
): boolean {
  const welcome = quests[QUEST_IDS.WELCOME_TO_HEARTHVALE];
  return welcome?.status === "completed";
}

export function isFirstSession(
  quests: Record<string, Quest>,
  totalXp: number,
): boolean {
  return !isWelcomeQuestComplete(quests) && totalXp === 0;
}

export interface FirstSessionStoreActions {
  startQuest: (questId: typeof QUEST_IDS.WELCOME_TO_HEARTHVALE) => boolean;
  incrementQuestObjective: (
    questId: typeof QUEST_IDS.WELCOME_TO_HEARTHVALE,
    objectiveId: string,
    delta?: number,
  ) => boolean;
  quests: Record<string, Quest>;
}

/** Advance the welcome quest when the player takes a meaningful first action. */
export function trackWelcomeProgress(
  get: () => FirstSessionStoreActions,
): void {
  const welcomeId = QUEST_IDS.WELCOME_TO_HEARTHVALE;
  let actions = get();
  let quest = actions.quests[welcomeId];

  if (!quest || quest.status === "completed" || quest.status === "locked") {
    return;
  }

  if (quest.status === "available") {
    actions.startQuest(welcomeId);
    actions = get();
    quest = actions.quests[welcomeId];
  }

  if (quest?.status !== "active") {
    return;
  }

  const objective = quest.objectives.find((entry) => entry.id === "begin_journey");

  if (!objective || objective.completed) {
    return;
  }

  actions.incrementQuestObjective(welcomeId, "begin_journey", 1);
}

export function trackGatherSuppliesProgress(
  get: () => {
    incrementQuestObjective: (
      questId: typeof QUEST_IDS.GATHER_SUPPLIES,
      objectiveId: string,
      delta?: number,
    ) => boolean;
    quests: Record<string, Quest>;
  },
): void {
  const actions = get();
  const questId = QUEST_IDS.GATHER_SUPPLIES;
  const quest = actions.quests[questId];

  if (!quest || quest.status !== "active") {
    return;
  }

  actions.incrementQuestObjective(questId, "gather_resources", 1);
}

export function autoStartWelcomeQuest(actions: {
  startQuest: (questId: typeof QUEST_IDS.WELCOME_TO_HEARTHVALE) => boolean;
  quests: Record<string, Quest>;
}): void {
  const welcome = actions.quests[QUEST_IDS.WELCOME_TO_HEARTHVALE];

  if (welcome?.status === "available") {
    actions.startQuest(QUEST_IDS.WELCOME_TO_HEARTHVALE);
  }
}

export function autoStartPostWelcomeQuests(actions: {
  startQuest: (questId: QuestId) => boolean;
  refreshQuestAvailability: () => void;
  syncActiveQuestObjectives: () => void;
}): void {
  actions.refreshQuestAvailability();
  actions.startQuest(QUEST_IDS.MEET_THE_VALLEY);
  actions.startQuest(QUEST_IDS.GATHER_SUPPLIES);
  actions.syncActiveQuestObjectives();
}
