import {
  EVENT_DEFINITIONS,
  getEventDefinition,
  isRegisteredEvent,
} from "@/game/constants/events";
import type { EventId, EventsState, GameReward } from "@/types";
import type { EventEvaluationContext } from "./context";
import { evaluateEventScheduler, type EventSchedulingRolls, createEventSchedulingRolls } from "./scheduling";
import {
  activateEventInstance,
  completeEventInstance,
  expireCompletedFeaturedEvent,
  resetExpiredEventToLocked,
} from "./progression";
import { beginCartCooldown } from "./scheduling";
import {
  applyEventRewards,
  type EventRewardApplicationResult,
  type EventRewardCallbacks,
} from "./rewards";

export interface EventCompletionResult {
  eventId: EventId;
  rewards: GameReward[];
  rewardResult: EventRewardApplicationResult;
}

export interface EventRefreshResult {
  cartArrived: boolean;
  featuredEventId: EventId | null;
}

export interface EventService {
  refreshEventScheduler(rolls?: EventSchedulingRolls): EventRefreshResult;
  activateFeaturedEvent(): boolean;
  completeFeaturedEvent(): EventCompletionResult | null;
  getEventsState(): EventsState;
}

type EventsStoreReader = () => EventsState;
type EventsStoreWriter = (updater: (current: EventsState) => EventsState) => void;
type ContextReader = () => EventEvaluationContext;

export function createEventService(
  readEvents: EventsStoreReader,
  writeEvents: EventsStoreWriter,
  readContext: ContextReader,
  rewardCallbacks: EventRewardCallbacks,
): EventService {
  function updateEvents(updater: (current: EventsState) => EventsState): void {
    writeEvents(updater);
  }

  function finalizeCompletedFeaturedEvent(
    state: EventsState,
    eventId: EventId,
    now: string,
  ): EventsState {
    let next = expireCompletedFeaturedEvent(state, eventId, now);
    next = beginCartCooldown(next);
    next = resetExpiredEventToLocked(next, eventId);
    return next;
  }

  return {
    refreshEventScheduler(rolls = createEventSchedulingRolls()) {
      const now = new Date().toISOString();
      let cartArrived = false;
      let featuredEventId: EventId | null = null;

      updateEvents((current) => {
        const previousFeaturedId = current.scheduler.featuredEventId;

        if (previousFeaturedId) {
          const previousInstance = current.instances[previousFeaturedId];

          if (previousInstance?.status === "completed") {
            const cleaned = finalizeCompletedFeaturedEvent(
              current,
              previousFeaturedId,
              now,
            );

            featuredEventId = cleaned.scheduler.featuredEventId;
            return cleaned;
          }
        }

        const result = evaluateEventScheduler(
          current,
          readContext(),
          now,
          rolls,
        );

        cartArrived = result.cartArrived;
        featuredEventId = result.featuredEventId;

        return result.state;
      });

      return { cartArrived, featuredEventId };
    },

    activateFeaturedEvent() {
      const state = readEvents();
      const featuredEventId = state.scheduler.featuredEventId;

      if (!featuredEventId || !isRegisteredEvent(featuredEventId)) {
        return false;
      }

      const now = new Date().toISOString();
      let activated = false;

      updateEvents((current) => {
        const next = activateEventInstance(current, featuredEventId, now);

        if (!next) {
          return current;
        }

        activated = true;
        return next;
      });

      return activated;
    },

    completeFeaturedEvent() {
      const state = readEvents();
      const featuredEventId = state.scheduler.featuredEventId;

      if (!featuredEventId || !isRegisteredEvent(featuredEventId)) {
        return null;
      }

      const definition = getEventDefinition(featuredEventId);

      if (!definition) {
        return null;
      }

      const instance = state.instances[featuredEventId];

      if (!instance || instance.status !== "active") {
        return null;
      }

      const now = new Date().toISOString();
      let result: EventCompletionResult | null = null;

      updateEvents((current) => {
        const completed = completeEventInstance(current, featuredEventId, now);

        if (!completed) {
          return current;
        }

        const rewardResult = applyEventRewards(
          definition.rewards,
          rewardCallbacks,
        );

        result = {
          eventId: featuredEventId,
          rewards: definition.rewards,
          rewardResult,
        };

        return completed;
      });

      return result;
    },

    getEventsState() {
      return readEvents();
    },
  };
}

export function getRegisteredEventDefinitions() {
  return EVENT_DEFINITIONS;
}
