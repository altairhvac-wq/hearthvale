import { RESOURCE_NODE_DEFINITIONS, isRegisteredResourceNode } from "@/game/constants/gathering";
import { RESOURCE_NODE_STATUSES } from "@/types";
import type { GatheringState, ResourceNodeInstance } from "@/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isResourceNodeStatus(value: unknown): value is ResourceNodeInstance["status"] {
  return (
    typeof value === "string" &&
    (RESOURCE_NODE_STATUSES as readonly string[]).includes(value)
  );
}

function isResourceNodeInstance(value: unknown): value is ResourceNodeInstance {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isResourceNodeStatus(value.status) &&
    typeof value.gathersThisCycle === "number" &&
    Number.isFinite(value.gathersThisCycle) &&
    value.gathersThisCycle >= 0
  );
}

export function isPersistedGatheringState(value: unknown): value is GatheringState {
  if (!isObject(value) || !isObject(value.nodes)) {
    return false;
  }

  for (const [nodeId, node] of Object.entries(value.nodes)) {
    if (!isRegisteredResourceNode(nodeId)) {
      return false;
    }

    if (!isResourceNodeInstance(node)) {
      return false;
    }

    if (node.id !== nodeId) {
      return false;
    }
  }

  const registeredNodeCount = RESOURCE_NODE_DEFINITIONS.length;

  if (Object.keys(value.nodes).length > registeredNodeCount) {
    return false;
  }

  return true;
}
