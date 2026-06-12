import {
  createRestorationService,
  type RestorationStageResult,
} from "@/game/restoration/service";
import type { RestorationEvaluationContext } from "@/game/restoration/context";
import type { QuestId, RegionId, RestorationProjectId } from "@/types";
import type { GameStore } from "../game-store";
import {
  createStoreGameRewardCallbacks,
  createStoreSpendResources,
} from "./game-reward-callbacks";

export interface RestorationSlice {
  refreshRestorationAvailability: () => void;
  startRestorationProject: (projectId: RestorationProjectId) => boolean;
  restoreCurrentStage: (
    projectId: RestorationProjectId,
  ) => RestorationStageResult | null;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createRestorationSlice(
  set: SetState,
  get: GetState,
): RestorationSlice {
  function buildRestorationContext(): RestorationEvaluationContext {
    const state = get();

    return {
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      playerResources: state.player.resources,
    };
  }

  const rewardCallbacks = createStoreGameRewardCallbacks(set, get);
  const spendResources = createStoreSpendResources(set);

  const restorationService = createRestorationService(
    () => get().restoration,
    (projectId, updater) => {
      set((state) => {
        const current = state.restoration[projectId];

        if (!current) {
          return state;
        }

        return {
          restoration: {
            ...state.restoration,
            [projectId]: updater(current),
          },
        };
      });
    },
    buildRestorationContext,
    {
      ...rewardCallbacks,

      spendResources,

      updateRegionRestoration(regionId, progressPercent, restored) {
        set((state) => {
          const region = state.regions[regionId];

          if (!region) {
            return state;
          }

          return {
            regions: {
              ...state.regions,
              [regionId]: {
                ...region,
                restorationProgress: progressPercent,
                state: restored ? "restored" : region.state,
                restoredAt: restored
                  ? (region.restoredAt ?? new Date().toISOString())
                  : region.restoredAt,
              },
            },
          };
        });
      },

      startLinkedQuest(questId: QuestId) {
        get().startQuest(questId);
      },

      onRestorationChanged() {
        get().syncActiveQuestObjectives();
        get().refreshQuestAvailability();
        restorationService.refreshRestorationAvailability();
      },
    },
    () => get().user.id,
  );

  return {
    refreshRestorationAvailability() {
      restorationService.refreshRestorationAvailability();
    },

    startRestorationProject(projectId) {
      return restorationService.startRestorationProject(projectId);
    },

    restoreCurrentStage(projectId) {
      return restorationService.restoreCurrentStage(projectId);
    },
  };
}
