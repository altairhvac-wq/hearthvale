import {
  CUSTOMER_REQUEST_DEFINITIONS,
  isRegisteredCustomerRequest,
} from "@/game/constants/requests";
import type {
  CustomerRequestId,
  CustomerRequestInstance,
  CustomerRequestStatus,
  RequestsState,
} from "@/types";

const REQUEST_STATUSES: readonly CustomerRequestStatus[] = [
  "locked",
  "available",
  "active",
  "completed",
];

function isRequestStatus(value: unknown): value is CustomerRequestStatus {
  return (
    typeof value === "string" &&
    (REQUEST_STATUSES as readonly string[]).includes(value)
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

function createDefaultRequestInstance(
  requestId: CustomerRequestId,
): CustomerRequestInstance {
  return {
    id: requestId,
    status: "locked",
    activatedAt: null,
    completedAt: null,
    completionCount: 0,
  };
}

export function createInitialRequestsState(): RequestsState {
  return {
    instances: CUSTOMER_REQUEST_DEFINITIONS.reduce<
      Record<CustomerRequestId, CustomerRequestInstance>
    >((acc, definition) => {
      acc[definition.id] = createDefaultRequestInstance(definition.id);
      return acc;
    }, {} as Record<CustomerRequestId, CustomerRequestInstance>),
  };
}

function mergeRequestInstance(
  requestId: CustomerRequestId,
  saved: CustomerRequestInstance | undefined,
  fallback: CustomerRequestInstance,
): CustomerRequestInstance {
  if (!saved || saved.id !== requestId) {
    return fallback;
  }

  return {
    id: requestId,
    status: isRequestStatus(saved.status) ? saved.status : fallback.status,
    activatedAt: normalizeTimestamp(saved.activatedAt),
    completedAt: normalizeTimestamp(saved.completedAt),
    completionCount: normalizeCount(saved.completionCount),
  };
}

export function mergeRequestsState(saved: RequestsState | undefined): RequestsState {
  const defaults = createInitialRequestsState();

  if (!saved) {
    return defaults;
  }

  const instances = CUSTOMER_REQUEST_DEFINITIONS.reduce<
    Record<CustomerRequestId, CustomerRequestInstance>
  >((acc, definition) => {
    acc[definition.id] = mergeRequestInstance(
      definition.id,
      saved.instances?.[definition.id],
      defaults.instances[definition.id]!,
    );
    return acc;
  }, {} as Record<CustomerRequestId, CustomerRequestInstance>);

  return { instances };
}

export function getActiveRequests(
  state: RequestsState,
): CustomerRequestInstance[] {
  return Object.values(state.instances).filter(
    (instance) => instance.status === "active",
  );
}

export function isRegisteredRequestId(
  requestId: string,
): requestId is CustomerRequestId {
  return isRegisteredCustomerRequest(requestId);
}
