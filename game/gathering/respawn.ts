import { RESOURCE_NODE_DEFINITIONS } from "@/game/constants/gathering";
import type {
  GatheringState,
  ResourceNodeDefinition,
  ResourceNodeInstance,
} from "@/types";

function reconcileTimedRespawn(
  node: ResourceNodeInstance,
  definition: ResourceNodeDefinition,
  now: string,
): ResourceNodeInstance {
  if (node.status === "depleted" && definition.respawnRule.respawnMode === "timed") {
    if (node.respawnAt && now >= node.respawnAt) {
      return {
        ...node,
        status: "available",
        depletedAt: null,
        respawnAt: null,
      };
    }

    return {
      ...node,
      status: "respawning",
    };
  }

  if (node.status === "respawning" && definition.respawnRule.respawnMode === "timed") {
    if (node.respawnAt && now >= node.respawnAt) {
      return {
        ...node,
        status: "available",
        depletedAt: null,
        respawnAt: null,
      };
    }

    return node;
  }

  return node;
}

function reconcileRefreshRespawn(
  node: ResourceNodeInstance,
  definition: ResourceNodeDefinition,
): ResourceNodeInstance {
  if (definition.respawnRule.respawnMode !== "on_refresh") {
    return node;
  }

  if (node.status === "depleted") {
    return {
      ...node,
      status: "respawning",
      gathersThisCycle: 0,
    };
  }

  if (node.status === "respawning") {
    return {
      ...node,
      status: "available",
      depletedAt: null,
      respawnAt: null,
      gathersThisCycle: 0,
    };
  }

  return node;
}

function hasRespawnStateChanged(
  before: ResourceNodeInstance,
  after: ResourceNodeInstance,
): boolean {
  return (
    before.status !== after.status ||
    before.gathersThisCycle !== after.gathersThisCycle ||
    before.depletedAt !== after.depletedAt ||
    before.respawnAt !== after.respawnAt
  );
}

export function reconcileResourceNodeRespawn(
  node: ResourceNodeInstance,
  definition: ResourceNodeDefinition,
  now: string,
): ResourceNodeInstance {
  let current = node;
  const maxPasses = 4;

  for (let pass = 0; pass < maxPasses; pass += 1) {
    const afterTimed = reconcileTimedRespawn(current, definition, now);
    const afterRefresh = reconcileRefreshRespawn(afterTimed, definition);

    if (!hasRespawnStateChanged(current, afterRefresh)) {
      return afterRefresh;
    }

    current = afterRefresh;
  }

  return current;
}

export function reconcileGatheringRespawns(
  state: GatheringState,
  now: string = new Date().toISOString(),
): GatheringState {
  const nodes = { ...state.nodes };

  for (const definition of RESOURCE_NODE_DEFINITIONS) {
    const node = nodes[definition.id];

    if (!node) {
      continue;
    }

    nodes[definition.id] = reconcileResourceNodeRespawn(node, definition, now);
  }

  return { nodes };
}
