import {
  CUSTOMER_REQUEST_DEFINITIONS,
  getCustomerRequestDefinition,
  isRegisteredCustomerRequest,
} from "@/game/constants/requests";
import { applyGameRewards, type GameRewardCallbacks } from "@/game/rewards";
import type {
  CustomerRequestId,
  RequestsState,
} from "@/types";
import type { RequestEvaluationContext } from "./context";
import {
  canActivateCustomerRequest,
  canCompleteCustomerRequest,
  hasActiveRequestCapacity,
  resolveCustomerRequestStatus,
} from "./progression";

export interface RequestCompletionResult {
  requestId: CustomerRequestId;
  title: string;
}

export interface RequestServiceCallbacks extends GameRewardCallbacks {
  onRequestsChanged: () => void;
}

export interface RequestService {
  refreshRequestAvailability: () => void;
  activateRequest: (requestId: CustomerRequestId) => boolean;
  completeRequest: (requestId: CustomerRequestId) => RequestCompletionResult | null;
}

type RequestsReader = () => RequestsState;
type RequestWriter = (
  requestId: CustomerRequestId,
  updater: (
    current: RequestsState["instances"][CustomerRequestId],
  ) => RequestsState["instances"][CustomerRequestId],
) => void;
type ContextReader = () => RequestEvaluationContext;

export function createRequestService(
  readRequests: RequestsReader,
  writeRequest: RequestWriter,
  readContext: ContextReader,
  callbacks: RequestServiceCallbacks,
): RequestService {
  return {
    refreshRequestAvailability() {
      const context = readContext();

      for (const definition of CUSTOMER_REQUEST_DEFINITIONS) {
        const instance = readRequests().instances[definition.id];

        if (!instance || instance.status === "active" || instance.status === "completed") {
          continue;
        }

        const nextStatus = resolveCustomerRequestStatus(
          definition,
          instance,
          context,
        );

        if (nextStatus !== instance.status) {
          writeRequest(definition.id, (current) => ({
            ...current,
            status: nextStatus,
          }));
        }
      }
    },

    activateRequest(requestId) {
      if (!isRegisteredCustomerRequest(requestId)) {
        return false;
      }

      const context = readContext();

      if (!canActivateCustomerRequest(requestId, context)) {
        return false;
      }

      if (!hasActiveRequestCapacity(readRequests())) {
        return false;
      }

      let activated = false;

      writeRequest(requestId, (current) => {
        if (current.status !== "available") {
          return current;
        }

        activated = true;

        return {
          ...current,
          status: "active",
          activatedAt: new Date().toISOString(),
        };
      });

      if (!activated) {
        return false;
      }

      callbacks.onRequestsChanged();
      return true;
    },

    completeRequest(requestId) {
      if (!isRegisteredCustomerRequest(requestId)) {
        return null;
      }

      const definition = getCustomerRequestDefinition(requestId);

      if (!definition) {
        return null;
      }

      if (!canCompleteCustomerRequest(requestId, readContext())) {
        return null;
      }

      const now = new Date().toISOString();
      let completed = false;

      writeRequest(requestId, (current) => {
        if (current.status !== "active") {
          return current;
        }

        completed = true;

        return {
          ...current,
          status: "completed",
          completedAt: now,
          completionCount: current.completionCount + 1,
        };
      });

      if (!completed) {
        return null;
      }

      applyGameRewards(definition.rewards, callbacks);
      callbacks.onRequestsChanged();

      return {
        requestId,
        title: definition.title,
      };
    },
  };
}
