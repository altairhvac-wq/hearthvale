import {
  getCustomerRequestDefinition,
} from "@/game/constants/requests";
import { isUnlockRequirementMet } from "@/game/unlock/requirements";
import type {
  CustomerRequestDefinition,
  CustomerRequestId,
  CustomerRequestInstance,
  CustomerRequestStatus,
} from "@/types";
import type { RequestEvaluationContext } from "./context";
import { canFulfillRequestResourcesFromInventory } from "./inventory-fulfillment";

export function canUnlockCustomerRequest(
  definition: CustomerRequestDefinition,
  context: RequestEvaluationContext,
): boolean {
  if (!definition.unlockRequirement) {
    return true;
  }

  return isUnlockRequirementMet(definition.unlockRequirement, context);
}

export function resolveCustomerRequestStatus(
  definition: CustomerRequestDefinition,
  instance: CustomerRequestInstance,
  context: RequestEvaluationContext,
): CustomerRequestStatus {
  if (instance.status === "completed") {
    return "completed";
  }

  if (instance.status === "active") {
    return "active";
  }

  if (!canUnlockCustomerRequest(definition, context)) {
    return "locked";
  }

  return "available";
}

export function canActivateCustomerRequest(
  requestId: CustomerRequestId,
  context: RequestEvaluationContext,
): boolean {
  const definition = getCustomerRequestDefinition(requestId);

  if (!definition) {
    return false;
  }

  const instance = context.requests.instances[requestId];

  if (!instance) {
    return false;
  }

  const status = resolveCustomerRequestStatus(definition, instance, context);

  return status === "available";
}

export function canCompleteCustomerRequest(
  requestId: CustomerRequestId,
  context: RequestEvaluationContext,
): boolean {
  const definition = getCustomerRequestDefinition(requestId);
  const instance = context.requests.instances[requestId];

  if (!definition || !instance || instance.status !== "active") {
    return false;
  }

  return canFulfillRequestResourcesFromInventory(
    context.inventory,
    definition.requiredResources,
  );
}

export function countActiveRequests(
  requests: RequestEvaluationContext["requests"],
): number {
  return Object.values(requests.instances).filter(
    (instance) => instance.status === "active",
  ).length;
}

export const MAX_ACTIVE_REQUESTS = 3;

export function hasActiveRequestCapacity(
  requests: RequestEvaluationContext["requests"],
): boolean {
  return countActiveRequests(requests) < MAX_ACTIVE_REQUESTS;
}
