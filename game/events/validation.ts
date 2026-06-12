import { isRegisteredEvent } from "@/game/constants/events";
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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEventStatus(value: unknown): value is EventStatus {
  return (
    typeof value === "string" &&
    (EVENT_STATUSES as readonly string[]).includes(value)
  );
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNonNegativeInteger(value: unknown): boolean {
  return (
    typeof value === "number" && Number.isFinite(value) && value >= 0
  );
}

function isNullableEvaluationCount(value: unknown): boolean {
  return value === null || isNonNegativeInteger(value);
}

export function isEventInstance(value: unknown): value is EventInstance {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isRegisteredEvent(value.id) &&
    isEventStatus(value.status) &&
    isNullableString(value.availableAt) &&
    isNullableString(value.activatedAt) &&
    isNullableString(value.completedAt) &&
    isNullableString(value.expiredAt) &&
    isNonNegativeInteger(value.completionCount) &&
    isNullableEvaluationCount(value.lastCompletedEvaluation)
  );
}

export function isEventSchedulerState(
  value: unknown,
): value is EventSchedulerState {
  if (!isObject(value)) {
    return false;
  }

  const featuredEventId = value.featuredEventId;

  return (
    isNonNegativeInteger(value.evaluationCount) &&
    isNullableString(value.lastEvaluatedAt) &&
    isNonNegativeInteger(value.cartCooldownRemaining) &&
    (featuredEventId === null ||
      (typeof featuredEventId === "string" && isRegisteredEvent(featuredEventId))) &&
    isNullableString(value.lastCartArrivalAt)
  );
}

function isLooseEventInstance(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return typeof value.id === "string" && isEventStatus(value.status);
}

function isLooseEventSchedulerState(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  const featuredEventId = value.featuredEventId;

  return (
    isNonNegativeInteger(value.evaluationCount) &&
    isNullableString(value.lastEvaluatedAt) &&
    isNonNegativeInteger(value.cartCooldownRemaining) &&
    (featuredEventId === null || typeof featuredEventId === "string") &&
    isNullableString(value.lastCartArrivalAt)
  );
}

/** Structural check for persisted event blobs — normalization happens in mergeEventsState. */
export function isPersistedEventsState(value: unknown): value is EventsState {
  if (!isObject(value)) {
    return false;
  }

  const hasStructuredShape = "instances" in value || "scheduler" in value;

  if (!hasStructuredShape) {
    // Legacy v2 flat records are rebuilt during mergeEventsState.
    return true;
  }

  if (!isObject(value.instances) || !isLooseEventSchedulerState(value.scheduler)) {
    return false;
  }

  return Object.values(value.instances).every(isLooseEventInstance);
}
