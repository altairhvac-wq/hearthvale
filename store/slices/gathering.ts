import type { ResourceNodeId } from "@/types";
import {
  trackGatherSuppliesProgress,
  trackWelcomeProgress,
} from "@/game/onboarding/first-session";
import { buildGatheringEvaluationContext } from "@/game/gathering/context";
import {
  createGatheringService,
  type GatherResult,
} from "@/game/gathering/service";
import { buildGatheringScreenData, type GatheringScreenData } from "@/game/gathering/view-model";
import type { GameStore } from "../game-store";
import { createStoreGameRewardCallbacks } from "./game-reward-callbacks";

export interface GatheringSlice {
  refreshGatheringState: () => void;
  gatherFromNode: (nodeId: ResourceNodeId) => GatherResult | null;
  getGatheringScreenData: () => GatheringScreenData;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createGatheringSlice(set: SetState, get: GetState): GatheringSlice {
  function buildGatheringContext() {
    const state = get();

    return buildGatheringEvaluationContext({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      gathering: state.gathering,
      inventory: state.inventory,
      activeRegionId: state.activeRegionId,
    });
  }

  const rewardCallbacks = createStoreGameRewardCallbacks(set, get);

  const gatheringService = createGatheringService(
    () => get().gathering,
    (updater) => {
      set((state) => ({
        gathering: updater(state.gathering),
      }));
    },
    buildGatheringContext,
    () => get().user.id,
    rewardCallbacks,
  );

  return {
    refreshGatheringState() {
      gatheringService.refreshGatheringState();
    },

    gatherFromNode(nodeId) {
      const result = gatheringService.gatherFromNode(nodeId);

      if (result) {
        trackWelcomeProgress(get);
        trackGatherSuppliesProgress(get);
        get().syncActiveQuestObjectives();
      }

      return result;
    },

    getGatheringScreenData() {
      return buildGatheringScreenData(buildGatheringContext());
    },
  };
}
