import type { EventId, MiniGameDifficulty, MiniGameId } from "@/types";
import { buildMiniGameEvaluationContext } from "@/game/minigames/context";
import {
  createMiniGameService,
  type MiniGameActivationResult,
  type MiniGameCompletionResult,
} from "@/game/minigames/service";
import type { MiniGameJournalData } from "@/game/minigames/view-model";
import { buildMiniGameJournalData } from "@/game/minigames/view-model";
import type { GameStore } from "../game-store";
import { createStoreGameRewardCallbacks } from "./game-reward-callbacks";

export interface MiniGamesSlice {
  refreshMiniGameAvailability: () => void;
  activateMiniGame: (
    miniGameId: MiniGameId,
    difficulty?: MiniGameDifficulty,
  ) => MiniGameActivationResult | null;
  completeMiniGame: (
    miniGameId: MiniGameId,
    score: number,
  ) => MiniGameCompletionResult | null;
  failMiniGame: (miniGameId: MiniGameId) => boolean;
  activateMiniGameFromEvent: (
    eventId: EventId,
  ) => MiniGameActivationResult | null;
  getMiniGameJournalData: () => MiniGameJournalData;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createMiniGamesSlice(set: SetState, get: GetState): MiniGamesSlice {
  function buildMiniGameContext() {
    const state = get();

    return buildMiniGameEvaluationContext({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      minigames: state.minigames,
      events: state.events,
      activeRegionId: state.activeRegionId,
      // Seasonal systems plug in here when wired to store state.
      activeSeasonId: null,
    });
  }

  const rewardCallbacks = createStoreGameRewardCallbacks(set, get);

  const miniGameService = createMiniGameService(
    () => get().minigames,
    (miniGameId, updater) => {
      set((state) => {
        const current = state.minigames[miniGameId];

        if (!current) {
          return state;
        }

        return {
          minigames: {
            ...state.minigames,
            [miniGameId]: updater(current),
          },
        };
      });
    },
    buildMiniGameContext,
    rewardCallbacks,
  );

  return {
    refreshMiniGameAvailability() {
      miniGameService.refreshAvailability();
    },

    activateMiniGame(miniGameId, difficulty) {
      return miniGameService.activateMiniGame(miniGameId, difficulty);
    },

    completeMiniGame(miniGameId, score) {
      return miniGameService.completeMiniGame(miniGameId, score);
    },

    failMiniGame(miniGameId) {
      return miniGameService.failMiniGame(miniGameId);
    },

    activateMiniGameFromEvent(eventId) {
      return miniGameService.activateMiniGameFromEvent(eventId);
    },

    getMiniGameJournalData() {
      return buildMiniGameJournalData(get().minigames, buildMiniGameContext());
    },
  };
}
