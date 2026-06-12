import { buildEventEvaluationContext } from "@/game/events/context";
import {
  createEventService,
  type EventCompletionResult,
  type EventRefreshResult,
} from "@/game/events/service";
import type { EventSchedulingRolls } from "@/game/events/scheduling";
import type { GameStore } from "../game-store";
import { createStoreGameRewardCallbacks } from "./game-reward-callbacks";

export interface EventsSlice {
  refreshEventScheduler: (rolls?: EventSchedulingRolls) => EventRefreshResult;
  activateFeaturedEvent: () => boolean;
  completeFeaturedEvent: () => EventCompletionResult | null;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createEventsSlice(set: SetState, get: GetState): EventsSlice {
  function buildEventContext() {
    const state = get();

    return buildEventEvaluationContext({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      // Seasonal systems plug in here when wired to store state.
      activeSeasonId: null,
    });
  }

  const rewardCallbacks = createStoreGameRewardCallbacks(set, get);

  const eventService = createEventService(
    () => get().events,
    (updater) => {
      set((state) => ({
        events: updater(state.events),
      }));
    },
    buildEventContext,
    rewardCallbacks,
  );

  return {
    refreshEventScheduler(rolls) {
      return eventService.refreshEventScheduler(rolls);
    },

    activateFeaturedEvent() {
      return eventService.activateFeaturedEvent();
    },

    completeFeaturedEvent() {
      const result = eventService.completeFeaturedEvent();

      if (result) {
        eventService.refreshEventScheduler();
      }

      return result;
    },
  };
}
