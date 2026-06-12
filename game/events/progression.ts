import type { EventId, EventInstance, EventsState } from "@/types";

export function activateEventInstance(
  state: EventsState,
  eventId: EventId,
  now: string,
): EventsState | null {
  const instance = state.instances[eventId];

  if (!instance || instance.status !== "available") {
    return null;
  }

  if (state.scheduler.featuredEventId !== eventId) {
    return null;
  }

  return {
    ...state,
    instances: {
      ...state.instances,
      [eventId]: {
        ...instance,
        status: "active",
        activatedAt: now,
      },
    },
  };
}

export function completeEventInstance(
  state: EventsState,
  eventId: EventId,
  now: string,
): EventsState | null {
  const instance = state.instances[eventId];

  if (!instance || instance.status !== "active") {
    return null;
  }

  const completed: EventInstance = {
    ...instance,
    status: "completed",
    completedAt: now,
    completionCount: instance.completionCount + 1,
    lastCompletedEvaluation: state.scheduler.evaluationCount,
  };

  return {
    ...state,
    instances: {
      ...state.instances,
      [eventId]: completed,
    },
  };
}

export function expireCompletedFeaturedEvent(
  state: EventsState,
  eventId: EventId,
  now: string,
): EventsState {
  const instance = state.instances[eventId];

  if (!instance || instance.status !== "completed") {
    return state;
  }

  return {
    ...state,
    instances: {
      ...state.instances,
      [eventId]: {
        ...instance,
        status: "expired",
        expiredAt: now,
      },
    },
  };
}

export function resetExpiredEventToLocked(
  state: EventsState,
  eventId: EventId,
): EventsState {
  const instance = state.instances[eventId];

  if (!instance || instance.status !== "expired") {
    return state;
  }

  return {
    ...state,
    instances: {
      ...state.instances,
      [eventId]: {
        ...instance,
        status: "locked",
        availableAt: null,
        activatedAt: null,
        completedAt: null,
        expiredAt: null,
      },
    },
  };
}
