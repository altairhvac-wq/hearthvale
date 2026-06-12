import { QUEST_DEFINITIONS, getQuestDefinition, isRegisteredQuest } from "@/game/constants/quests";
import type {
  AnimalSpeciesId,
  Quest,
  QuestId,
  QuestReward,
  RegionId,
  UnlockReference,
} from "@/types";
import type { QuestEvaluationContext } from "./context";
import {
  areAllObjectivesComplete,
  incrementObjectiveProgress,
  setObjectiveProgress,
  syncQuestObjectivesFromContext,
} from "./objectives";
import {
  canStartQuest,
  resolveNextQuestStatus,
} from "./progression";
import {
  applyQuestRewards,
  type QuestRewardApplicationResult,
  type QuestRewardCallbacks,
} from "./rewards";

export interface QuestCompletionResult {
  questId: QuestId;
  rewards: QuestReward[];
  rewardResult: QuestRewardApplicationResult;
}

export interface QuestService {
  startQuest(questId: QuestId): boolean;
  completeQuest(questId: QuestId): QuestCompletionResult | null;
  updateObjectiveProgress(
    questId: QuestId,
    objectiveId: string,
    current: number,
  ): boolean;
  incrementObjective(
    questId: QuestId,
    objectiveId: string,
    delta?: number,
  ): boolean;
  refreshQuestAvailability(): void;
  syncActiveQuestObjectives(): void;
  getQuest(questId: QuestId): Quest | null;
}

type QuestStoreReader = () => Record<string, Quest>;
type QuestStoreWriter = (
  questId: QuestId,
  updater: (current: Quest) => Quest,
) => void;
type ContextReader = () => QuestEvaluationContext;

export function createQuestService(
  readQuests: QuestStoreReader,
  writeQuest: QuestStoreWriter,
  readContext: ContextReader,
  rewardCallbacks: QuestRewardCallbacks,
): QuestService {
  function getQuestOrNull(questId: QuestId): Quest | null {
    return readQuests()[questId] ?? null;
  }

  function writeQuestIfExists(
    questId: QuestId,
    updater: (current: Quest) => Quest,
  ): Quest | null {
    const current = getQuestOrNull(questId);

    if (!current) {
      return null;
    }

    writeQuest(questId, updater);
    return readQuests()[questId] ?? null;
  }

  return {
    startQuest(questId) {
      if (!isRegisteredQuest(questId)) {
        return false;
      }

      const definition = getQuestDefinition(questId);
      const quest = getQuestOrNull(questId);

      if (!definition || !quest) {
        return false;
      }

      if (!canStartQuest(definition, quest, readContext())) {
        return false;
      }

      writeQuest(questId, (current) => ({
        ...current,
        status: "active",
        startedAt: new Date().toISOString(),
      }));

      return true;
    },

    completeQuest(questId) {
      if (!isRegisteredQuest(questId)) {
        return null;
      }

      const definition = getQuestDefinition(questId);
      const quest = getQuestOrNull(questId);

      if (!definition || !quest || quest.status !== "active") {
        return null;
      }

      if (!areAllObjectivesComplete(quest)) {
        return null;
      }

      const rewardResult = applyQuestRewards(
        definition.rewards,
        rewardCallbacks,
      );

      writeQuest(questId, (current) => ({
        ...current,
        status: "completed",
        completedAt: new Date().toISOString(),
      }));

      this.refreshQuestAvailability();

      return {
        questId,
        rewards: definition.rewards,
        rewardResult,
      };
    },

    updateObjectiveProgress(questId, objectiveId, current) {
      const quest = getQuestOrNull(questId);

      if (!quest || quest.status !== "active") {
        return false;
      }

      const updated = writeQuestIfExists(questId, (entry) => ({
        ...entry,
        objectives: setObjectiveProgress(entry, objectiveId, current),
      }));

      if (!updated) {
        return false;
      }

      if (areAllObjectivesComplete(updated)) {
        this.completeQuest(questId);
      }

      return true;
    },

    incrementObjective(questId, objectiveId, delta = 1) {
      const quest = getQuestOrNull(questId);

      if (!quest || quest.status !== "active") {
        return false;
      }

      const updated = writeQuestIfExists(questId, (entry) => ({
        ...entry,
        objectives: incrementObjectiveProgress(entry, objectiveId, delta),
      }));

      if (!updated) {
        return false;
      }

      if (areAllObjectivesComplete(updated)) {
        this.completeQuest(questId);
      }

      return true;
    },

    refreshQuestAvailability() {
      const context = readContext();
      const quests = readQuests();

      for (const definition of QUEST_DEFINITIONS) {
        const quest = quests[definition.id];

        if (!quest) {
          continue;
        }

        const nextStatus = resolveNextQuestStatus(definition, quest, context);

        if (nextStatus !== quest.status) {
          writeQuest(definition.id, (current) => ({
            ...current,
            status: nextStatus,
          }));
        }
      }
    },

    syncActiveQuestObjectives() {
      const context = readContext();
      const quests = readQuests();

      for (const definition of QUEST_DEFINITIONS) {
        const quest = quests[definition.id];

        if (!quest || quest.status !== "active") {
          continue;
        }

        const syncedObjectives = syncQuestObjectivesFromContext(
          quest,
          definition,
          context,
        );

        const objectivesChanged = syncedObjectives.some(
          (objective, index) =>
            objective.current !== quest.objectives[index]?.current ||
            objective.completed !== quest.objectives[index]?.completed,
        );

        if (!objectivesChanged) {
          continue;
        }

        writeQuest(definition.id, (current) => ({
          ...current,
          objectives: syncedObjectives,
        }));

        const updated = readQuests()[definition.id];

        if (updated && areAllObjectivesComplete(updated)) {
          this.completeQuest(definition.id);
        }
      }
    },

    getQuest(questId) {
      return getQuestOrNull(questId);
    },
  };
}

export function createUnlockApplicator(callbacks: {
  unlockRegion: (regionId: RegionId) => void;
  unlockQuest: (questId: QuestId) => void;
  unlockAnimal: (speciesId: AnimalSpeciesId) => void;
}): (unlock: UnlockReference) => void {
  return (unlock) => {
    switch (unlock.kind) {
      case "region":
        callbacks.unlockRegion(unlock.regionId);
        break;
      case "quest":
        callbacks.unlockQuest(unlock.questId);
        break;
      case "animal":
        callbacks.unlockAnimal(unlock.speciesId);
        break;
    }
  };
}
