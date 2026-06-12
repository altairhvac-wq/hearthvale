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
  canActivateCustomerRequest,
  canCompleteCustomerRequest,
  resolveCustomerRequestStatus,
} from "./progression";

export interface CustomerRequestViewModel {
  id: CustomerRequestId;
  title: string;
  description: string;
  category: RequestCategory;
  customerName: string;
  status: CustomerRequestStatus;
  unlockDescription: string | null;
  requiredResources: Array<{ label: string; amount: number }>;
  rewardDescriptions: string[];
  canActivate: boolean;
  canComplete: boolean;
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
    requiredResources: definition.requiredResources.map((resource) => ({
      label: resource.label,
      amount: resource.amount,
    })),
    rewardDescriptions: definition.rewards.map(describeGameReward),
    canActivate: canActivateCustomerRequest(definition.id, context),
    canComplete: canCompleteCustomerRequest(definition.id, context),
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
