import { isRegisteredCustomerRequest } from "@/game/constants/requests";
import type { CustomerRequestStatus, RequestsState } from "@/types";

const REQUEST_STATUSES: readonly CustomerRequestStatus[] = [
  "locked",
  "available",
  "active",
  "completed",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRequestStatus(value: unknown): value is CustomerRequestStatus {
  return (
    typeof value === "string" &&
    (REQUEST_STATUSES as readonly string[]).includes(value)
  );
}

export function isPersistedRequestsState(value: unknown): value is RequestsState {
  if (!isObject(value) || !isObject(value.instances)) {
    return false;
  }

  return Object.values(value.instances).every((instance) => {
    if (!isObject(instance)) {
      return false;
    }

    return (
      typeof instance.id === "string" &&
      isRegisteredCustomerRequest(instance.id) &&
      isRequestStatus(instance.status) &&
      (instance.activatedAt === null || typeof instance.activatedAt === "string") &&
      (instance.completedAt === null || typeof instance.completedAt === "string") &&
      typeof instance.completionCount === "number" &&
      Number.isFinite(instance.completionCount) &&
      instance.completionCount >= 0
    );
  });
}
