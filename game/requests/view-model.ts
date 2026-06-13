import { describeGameReward } from "@/game/rewards";
import { describeUnlockRequirement } from "@/game/unlock/descriptions";
import {
  CUSTOMER_REQUEST_DEFINITIONS,
  getCustomerRequestDefinition,
} from "@/game/constants/requests";
import type {
  CustomerRequestId,
  CustomerRequestStatus,
  RequestCategory,
} from "@/types";
import type { RequestEvaluationContext } from "./context";
import {
  getRequestResourceStock,
  isRequestRequirementResolvable,
} from "./inventory-fulfillment";
import {
  canActivateCustomerRequest,
  canCompleteCustomerRequest,
  resolveCustomerRequestStatus,
} from "./progression";

export interface RequestResourceViewModel {
  placeholderId: string;
  label: string;
  amount: number;
  owned: number;
  missing: number;
  sufficient: boolean;
  resolved: boolean;
}

export interface CustomerRequestViewModel {
  id: CustomerRequestId;
  title: string;
  description: string;
  category: RequestCategory;
  customerName: string;
  status: CustomerRequestStatus;
  unlockDescription: string | null;
  requiredResources: RequestResourceViewModel[];
  rewardDescriptions: string[];
  canActivate: boolean;
  canComplete: boolean;
  hasMissingItems: boolean;
  completionBlockedReason: string | null;
}

function buildCompletionBlockedReason(
  requiredResources: RequestResourceViewModel[],
): string | null {
  const unmapped = requiredResources.filter((resource) => !resource.resolved);

  if (unmapped.length > 0) {
    return "This request is not ready for fulfillment yet.";
  }

  const missing = requiredResources.filter((resource) => resource.missing > 0);

  if (missing.length === 0) {
    return null;
  }

  if (missing.length === 1) {
    const resource = missing[0]!;

    return resource.missing === 1
      ? `Need 1 more ${resource.label}`
      : `Need ${resource.missing} more ${resource.label}`;
  }

  return `Need more: ${missing
    .map((resource) => `${resource.missing}× ${resource.label}`)
    .join(", ")}`;
}

function buildRequestViewModel(
  requestId: CustomerRequestId,
  context: RequestEvaluationContext,
): CustomerRequestViewModel | null {
  const definition = getCustomerRequestDefinition(requestId);

  if (!definition) {
    return null;
  }

  const instance = context.requests.instances[definition.id];

  if (!instance) {
    return null;
  }

  const status = resolveCustomerRequestStatus(definition, instance, context);
  const requiredResources = definition.requiredResources.map((resource) => {
    const resolved = isRequestRequirementResolvable(resource);
    const owned = resolved
      ? getRequestResourceStock(context.inventory, resource)
      : 0;
    const missing = resolved ? Math.max(0, resource.amount - owned) : resource.amount;

    return {
      placeholderId: resource.placeholderId,
      label: resource.label,
      amount: resource.amount,
      owned,
      missing,
      sufficient: resolved && owned >= resource.amount,
      resolved,
    };
  });
  const hasMissingItems = requiredResources.some((resource) => !resource.sufficient);
  const canComplete = canCompleteCustomerRequest(definition.id, context);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    category: definition.category,
    customerName: definition.customerName,
    status,
    unlockDescription: definition.unlockRequirement
      ? describeUnlockRequirement(definition.unlockRequirement)
      : null,
    requiredResources,
    rewardDescriptions: definition.rewards.map(describeGameReward),
    canActivate: canActivateCustomerRequest(definition.id, context),
    canComplete,
    hasMissingItems,
    completionBlockedReason: canComplete
      ? null
      : buildCompletionBlockedReason(requiredResources),
  };
}

export function buildRequestViewModels(context: RequestEvaluationContext) {
  const all = CUSTOMER_REQUEST_DEFINITIONS.flatMap((definition) => {
    const viewModel = buildRequestViewModel(definition.id, context);
    return viewModel ? [viewModel] : [];
  });

  return {
    all,
    active: all.filter((request) => request.status === "active"),
    available: all.filter((request) => request.status === "available"),
    locked: all.filter((request) => request.status === "locked"),
    completed: all.filter((request) => request.status === "completed"),
  };
}
