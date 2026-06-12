import type { AnimalSpeciesId, ItemId, QuestId, RegionId, ResourceId, SkillId } from "@/types";
import { buildQuestEvaluationContext } from "@/game/quests/context";
import {
  createQuestService,
  createUnlockApplicator,
} from "@/game/quests/service";
import type { QuestCompletionResult } from "@/game/quests/service";
import type { QuestJournalData } from "@/game/quests/view-model";
import { buildQuestJournalData } from "@/game/quests/view-model";
import type { GameStore } from "../game-store";

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

  const applyUnlock = createUnlockApplicator({
    unlockRegion(regionId: RegionId) {
      set((state) => {
        const region = state.regions[regionId];

        if (!region || region.state !== "locked") {
          return state;
        }

        return {
          regions: {
            ...state.regions,
            [regionId]: {
              ...region,
              state: "unlocked",
              unlockedAt: new Date().toISOString(),
            },
          },
        };
      });
    },

    unlockQuest(questId: QuestId) {
      set((state) => {
        const quest = state.quests[questId];

        if (!quest || quest.status !== "locked") {
          return state;
        }

        return {
          quests: {
            ...state.quests,
            [questId]: {
              ...quest,
              status: "available",
            },
          },
        };
      });
    },

    unlockAnimal(speciesId: AnimalSpeciesId) {
      void speciesId;
    },
  });

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
    {
      awardResource(resourceId: ResourceId, amount: number) {
        set((state) => ({
          player: {
            ...state.player,
            resources: {
              ...state.player.resources,
              [resourceId]:
                (state.player.resources[resourceId] ?? 0) + amount,
            },
          },
        }));
      },

      awardSkillXp(skillId: SkillId, amount: number) {
        get().addSkillXp(skillId, amount);
      },

      applyUnlock,

      awardItem(itemId: ItemId, amount: number) {
        void itemId;
        void amount;
      },
    },
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
      return questService.completeQuest(questId);
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
