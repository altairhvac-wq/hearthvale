import {
  EVENT_DEFINITIONS,
  EVENT_SCHEDULER_DEFAULTS,
} from "@/game/constants/events";
import type { EventId, EventsState } from "@/types";
import {
  getEligibleEventDefinitions,
  pickWeightedEventDefinition,
} from "./availability";
import type { EventEvaluationContext } from "./context";

export interface EventSchedulingRolls {
  /** Roll in [0, 1) — decides whether the cart attempts an arrival. */
  arrivalRoll: number;
  /** Roll in [0, 1) — decides which eligible event is featured. */
  selectionRoll: number;
}

export interface EventSchedulingResult {
  state: EventsState;
  cartArrived: boolean;
  featuredEventId: EventId | null;
}

export function createEventSchedulingRolls(): EventSchedulingRolls {
  return {
    arrivalRoll: Math.random(),
    selectionRoll: Math.random(),
  };
}

function clampRoll(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 0.999999);
}

function hasFeaturedEventInProgress(state: EventsState): boolean {
  if (!state.scheduler.featuredEventId) {
    return false;
  }

  const instance = state.instances[state.scheduler.featuredEventId];

  return (
    instance?.status === "available" || instance?.status === "active"
  );
}

function markEventAvailable(
  state: EventsState,
  eventId: EventId,
  now: string,
): EventsState {
  const current = state.instances[eventId];

  if (!current) {
    return state;
  }

  return {
    ...state,
    instances: {
      ...state.instances,
      [eventId]: {
        ...current,
        status: "available",
        availableAt: now,
      },
    },
    scheduler: {
      ...state.scheduler,
      featuredEventId: eventId,
      lastCartArrivalAt: now,
    },
  };
}

export function evaluateEventScheduler(
  state: EventsState,
  context: EventEvaluationContext,
  now: string,
  rolls: EventSchedulingRolls,
): EventSchedulingResult {
  const arrivalRoll = clampRoll(rolls.arrivalRoll);
  const selectionRoll = clampRoll(rolls.selectionRoll);
  const nextEvaluationCount = state.scheduler.evaluationCount + 1;
  let nextState: EventsState = {
    ...state,
    scheduler: {
      ...state.scheduler,
      evaluationCount: nextEvaluationCount,
      lastEvaluatedAt: now,
      cartCooldownRemaining: Math.max(
        0,
        state.scheduler.cartCooldownRemaining - 1,
      ),
    },
  };

  if (hasFeaturedEventInProgress(nextState)) {
    return {
      state: nextState,
      cartArrived: false,
      featuredEventId: nextState.scheduler.featuredEventId,
    };
  }

  if (nextState.scheduler.cartCooldownRemaining > 0) {
    return {
      state: nextState,
      cartArrived: false,
      featuredEventId: null,
    };
  }

  const eligible = getEligibleEventDefinitions(
    EVENT_DEFINITIONS,
    nextState.instances,
    context,
    nextState.scheduler,
  );

  const isFirstEvaluation = nextState.scheduler.evaluationCount === 1;
  const shouldAttemptArrival =
    isFirstEvaluation ||
    arrivalRoll <= EVENT_SCHEDULER_DEFAULTS.CART_ARRIVAL_CHANCE;

  if (!shouldAttemptArrival || eligible.length === 0) {
    return {
      state: nextState,
      cartArrived: false,
      featuredEventId: null,
    };
  }

  const weightedSelectionRoll = isFirstEvaluation ? 0 : selectionRoll;
  const selected = pickWeightedEventDefinition(eligible, weightedSelectionRoll);

  if (!selected) {
    return {
      state: nextState,
      cartArrived: false,
      featuredEventId: null,
    };
  }

  nextState = markEventAvailable(nextState, selected.id, now);

  return {
    state: nextState,
    cartArrived: true,
    featuredEventId: selected.id,
  };
}

export function beginCartCooldown(state: EventsState): EventsState {
  return {
    ...state,
    scheduler: {
      ...state.scheduler,
      featuredEventId: null,
      cartCooldownRemaining: EVENT_SCHEDULER_DEFAULTS.CART_COOLDOWN_EVALUATIONS,
    },
  };
}
