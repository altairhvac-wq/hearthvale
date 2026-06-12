import { RESOURCE_NODE_DEFINITIONS } from "@/game/constants/gathering";
import {
  RESOURCE_NODE_STATUSES,
  type GatheringState,
  type ResourceNodeDefinition,
  type ResourceNodeId,
  type ResourceNodeInstance,
  type ResourceNodeStatus,
} from "@/types";

function isResourceNodeStatus(value: unknown): value is ResourceNodeStatus {
  return (
    typeof value === "string" &&
    (RESOURCE_NODE_STATUSES as readonly string[]).includes(value)
  );
}

function normalizeTimestamp(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeUserId(value: unknown): ResourceNodeInstance["lastGatheredByUserId"] {
  return typeof value === "string" ? (value as ResourceNodeInstance["lastGatheredByUserId"]) : null;
}

export function createDefaultResourceNodeInstance(
  definition: ResourceNodeDefinition,
): ResourceNodeInstance {
  return {
    id: definition.id,
    status: "available",
    gathersThisCycle: 0,
    depletedAt: null,
    respawnAt: null,
    lastGatheredAt: null,
    lastGatheredByUserId: null,
  };
}

export function mergeResourceNodeWithDefinition(
  definition: ResourceNodeDefinition,
  saved: ResourceNodeInstance | undefined,
  defaultNode: ResourceNodeInstance,
): ResourceNodeInstance {
  if (!saved || saved.id !== definition.id) {
    return defaultNode;
  }

  return {
    id: definition.id,
    status: isResourceNodeStatus(saved.status) ? saved.status : defaultNode.status,
    gathersThisCycle:
      typeof saved.gathersThisCycle === "number" && saved.gathersThisCycle >= 0
        ? Math.floor(saved.gathersThisCycle)
        : defaultNode.gathersThisCycle,
    depletedAt: normalizeTimestamp(saved.depletedAt),
    respawnAt: normalizeTimestamp(saved.respawnAt),
    lastGatheredAt: normalizeTimestamp(saved.lastGatheredAt),
    lastGatheredByUserId: normalizeUserId(saved.lastGatheredByUserId),
  };
}

export function createInitialGatheringState(): GatheringState {
  const nodes = RESOURCE_NODE_DEFINITIONS.reduce<
    Record<ResourceNodeId, ResourceNodeInstance>
  >((acc, definition) => {
    acc[definition.id] = createDefaultResourceNodeInstance(definition);
    return acc;
  }, {} as Record<ResourceNodeId, ResourceNodeInstance>);

  return { nodes };
}

export function mergeGatheringState(
  saved: GatheringState | undefined,
): GatheringState {
  const defaults = createInitialGatheringState();

  if (!saved?.nodes) {
    return defaults;
  }

  const nodes = RESOURCE_NODE_DEFINITIONS.reduce<
    Record<ResourceNodeId, ResourceNodeInstance>
  >((acc, definition) => {
    acc[definition.id] = mergeResourceNodeWithDefinition(
      definition,
      saved.nodes[definition.id],
      defaults.nodes[definition.id]!,
    );
    return acc;
  }, {} as Record<ResourceNodeId, ResourceNodeInstance>);

  return { nodes };
}
