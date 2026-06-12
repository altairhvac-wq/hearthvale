import type { QuestId } from "@/types";
import { buildQuestEvaluationContext } from "@/game/quests/context";
import {
  createQuestService,
} from "@/game/quests/service";
import type { QuestCompletionResult } from "@/game/quests/service";
import type { QuestJournalData } from "@/game/quests/view-model";
import { buildQuestJournalData } from "@/game/quests/view-model";
import type { GameStore } from "../game-store";
import { createStoreGameRewardCallbacks } from "./game-reward-callbacks";

export interface QuestsSlice {
  startQuest: (questId: QuestId) => boolean;
  completeQuest: (questId: QuestId) => QuestCompletionResult | null;
  updateQuestObjective: (
    questId: QuestId,
    objectiveId: string,
    current: number,
  ) => boolean;
  incrementQuestObjective: (
    questId: QuestId,
    objectiveId: string,
    delta?: number,
  ) => boolean;
  refreshQuestAvailability: () => void;
  syncActiveQuestObjectives: () => void;
  getQuestJournalData: () => QuestJournalData;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createQuestsSlice(set: SetState, get: GetState): QuestsSlice {
  function buildQuestContext() {
    const state = get();

    return buildQuestEvaluationContext({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      playerResources: state.player.resources,
    });
  }

  const rewardCallbacks = createStoreGameRewardCallbacks(set, get);

  const questService = createQuestService(
    () => get().quests,
    (questId, updater) => {
      set((state) => {
        const current = state.quests[questId];

        if (!current) {
          return state;
        }

        return {
          quests: {
            ...state.quests,
            [questId]: updater(current),
          },
        };
      });
    },
    buildQuestContext,
    rewardCallbacks,
  );

  return {
    startQuest(questId) {
      const started = questService.startQuest(questId);

      if (started) {
        questService.syncActiveQuestObjectives();
      }

      return started;
    },

    completeQuest(questId) {
      const result = questService.completeQuest(questId);

      if (result) {
        get().refreshMiniGameAvailability();
      }

      return result;
    },

    updateQuestObjective(questId, objectiveId, current) {
      return questService.updateObjectiveProgress(
        questId,
        objectiveId,
        current,
      );
    },

    incrementQuestObjective(questId, objectiveId, delta) {
      return questService.incrementObjective(questId, objectiveId, delta);
    },

    refreshQuestAvailability() {
      questService.refreshQuestAvailability();
    },

    syncActiveQuestObjectives() {
      questService.syncActiveQuestObjectives();
    },

    getQuestJournalData() {
      return buildQuestJournalData(get().quests, buildQuestContext());
    },
  };
}
