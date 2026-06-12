import {
  EVENT_DEFINITIONS,
  EVENT_SCHEDULER_DEFAULTS,
  isRegisteredEvent,
} from "@/game/constants/events";
import type {
  EventInstance,
  EventSchedulerState,
  EventsState,
  EventStatus,
} from "@/types";

const EVENT_STATUSES: readonly EventStatus[] = [
  "locked",
  "available",
  "active",
  "completed",
  "expired",
];

function isEventStatus(value: unknown): value is EventStatus {
  return (
    typeof value === "string" &&
    (EVENT_STATUSES as readonly string[]).includes(value)
  );
}

function normalizeTimestamp(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

export function createDefaultEventSchedulerState(): EventSchedulerState {
  return {
    evaluationCount: 0,
    lastEvaluatedAt: null,
    cartCooldownRemaining: 0,
    featuredEventId: null,
    lastCartArrivalAt: null,
  };
}

function createDefaultEventInstance(
  definitionId: EventInstance["id"],
): EventInstance {
  return {
    id: definitionId,
    status: "locked",
    availableAt: null,
    activatedAt: null,
    completedAt: null,
    expiredAt: null,
    completionCount: 0,
    lastCompletedEvaluation: null,
  };
}

export function createInitialEventsState(): EventsState {
  return {
    instances: EVENT_DEFINITIONS.reduce<Record<string, EventInstance>>(
      (acc, definition) => {
        acc[definition.id] = createDefaultEventInstance(definition.id);
        return acc;
      },
      {},
    ),
    scheduler: createDefaultEventSchedulerState(),
  };
}

function isLegacyEventsRecord(
  saved: unknown,
): saved is Record<string, unknown> {
  return (
    typeof saved === "object" &&
    saved !== null &&
    !Array.isArray(saved) &&
    !("instances" in saved) &&
    !("scheduler" in saved)
  );
}

function mergeEventInstance(
  definitionId: EventInstance["id"],
  saved: EventInstance | undefined,
  fallback: EventInstance,
): EventInstance {
  if (!saved || saved.id !== definitionId) {
    return fallback;
  }

  return {
    id: definitionId,
    status: isEventStatus(saved.status) ? saved.status : fallback.status,
    availableAt: normalizeTimestamp(saved.availableAt),
    activatedAt: normalizeTimestamp(saved.activatedAt),
    completedAt: normalizeTimestamp(saved.completedAt),
    expiredAt: normalizeTimestamp(saved.expiredAt),
    completionCount: normalizeCount(saved.completionCount),
    lastCompletedEvaluation:
      typeof saved.lastCompletedEvaluation === "number"
        ? saved.lastCompletedEvaluation
        : null,
  };
}

function mergeSchedulerState(
  saved: EventSchedulerState | undefined,
): EventSchedulerState {
  const defaults = createDefaultEventSchedulerState();

  if (!saved) {
    return defaults;
  }

  const featuredEventId =
    typeof saved.featuredEventId === "string" &&
    isRegisteredEvent(saved.featuredEventId)
      ? saved.featuredEventId
      : null;

  return {
    evaluationCount: normalizeCount(saved.evaluationCount),
    lastEvaluatedAt: normalizeTimestamp(saved.lastEvaluatedAt),
    cartCooldownRemaining: normalizeCount(saved.cartCooldownRemaining),
    featuredEventId,
    lastCartArrivalAt: normalizeTimestamp(saved.lastCartArrivalAt),
  };
}

function resetInstanceToLocked(instance: EventInstance): EventInstance {
  return {
    ...instance,
    status: "locked",
    availableAt: null,
    activatedAt: null,
    completedAt: null,
    expiredAt: null,
  };
}

function isFeaturedStatus(status: EventStatus): boolean {
  return status === "available" || status === "active" || status === "completed";
}

/**
 * Normalize inconsistent runtime state after hydration or registry changes.
 * Prevents duplicate featured events and orphaned active/available instances.
 */
export function reconcileEventsState(state: EventsState): EventsState {
  let scheduler = state.scheduler;
  const instances = { ...state.instances };

  if (
    scheduler.featuredEventId &&
    !instances[scheduler.featuredEventId]
  ) {
    scheduler = {
      ...scheduler,
      featuredEventId: null,
    };
  }

  for (const definition of EVENT_DEFINITIONS) {
    const instance = instances[definition.id];

    if (!instance) {
      continue;
    }

    if (instance.status === "expired") {
      instances[definition.id] = resetInstanceToLocked(instance);
      continue;
    }

    const isFeatured = scheduler.featuredEventId === definition.id;

    if (
      (instance.status === "available" || instance.status === "active") &&
      !isFeatured
    ) {
      instances[definition.id] = resetInstanceToLocked(instance);
      continue;
    }

    if (
      isFeatured &&
      !isFeaturedStatus(instance.status)
    ) {
      scheduler = {
        ...scheduler,
        featuredEventId: null,
      };
    }
  }

  if (scheduler.featuredEventId) {
    const featured = instances[scheduler.featuredEventId];

    if (!featured || !isFeaturedStatus(featured.status)) {
      scheduler = {
        ...scheduler,
        featuredEventId: null,
      };
    }
  }

  return {
    instances,
    scheduler,
  };
}

/** Reconcile persisted event progress with the current event registry. */
export function mergeEventsState(saved: unknown): EventsState {
  if (isLegacyEventsRecord(saved)) {
    return createInitialEventsState();
  }

  const record = saved as Partial<EventsState> | undefined;
  const defaults = createInitialEventsState();

  if (!record) {
    return defaults;
  }

  const instances = EVENT_DEFINITIONS.reduce<Record<string, EventInstance>>(
    (acc, definition) => {
      acc[definition.id] = mergeEventInstance(
        definition.id,
        record.instances?.[definition.id],
        defaults.instances[definition.id]!,
      );
      return acc;
    },
    {},
  );

  return reconcileEventsState({
    instances,
    scheduler: mergeSchedulerState(record.scheduler),
  });
}

export { EVENT_SCHEDULER_DEFAULTS };
