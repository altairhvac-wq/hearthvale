import { getResourceNodeDefinition, isRegisteredResourceNode, RESOURCE_NODE_DEFINITIONS } from "@/game/constants/gathering";
import { getRegionDefinitionName } from "@/game/regions/state";
import type { GameReward, ResourceNodeId } from "@/types";
import type { GatheringEvaluationContext } from "./context";
import {
  applyGatherToNodeInstance,
  buildGatherRewards,
  canGatherFromNode,
  getGatherableResourceForNode,
} from "./progression";
import { reconcileGatheringRespawns } from "./respawn";
import {
  applyGatheringRewards,
  type GatheringRewardCallbacks,
} from "./rewards";

export interface GatherResult {
  nodeId: ResourceNodeId;
  resourceName: string;
  rewards: GameReward[];
  yieldAmount: number;
  skillXp: number;
}

export interface GatheringService {
  refreshGatheringState: () => void;
  gatherFromNode: (nodeId: ResourceNodeId) => GatherResult | null;
}

type GatheringReader = () => import("@/types").GatheringState;
type GatheringWriter = (
  updater: (current: import("@/types").GatheringState) => import("@/types").GatheringState,
) => void;
type ContextReader = () => GatheringEvaluationContext;
type UserIdReader = () => import("@/types").GameUserId;

export function createGatheringService(
  readGathering: GatheringReader,
  writeGathering: GatheringWriter,
  readContext: ContextReader,
  readUserId: UserIdReader,
  rewardCallbacks: GatheringRewardCallbacks,
): GatheringService {
  return {
    refreshGatheringState() {
      writeGathering((current) => reconcileGatheringRespawns(current));
    },

    gatherFromNode(nodeId) {
      if (!isRegisteredResourceNode(nodeId)) {
        return null;
      }

      const definition = getResourceNodeDefinition(nodeId);
      const resource = getGatherableResourceForNode(nodeId);
      const context = readContext();
      const eligibility = canGatherFromNode(nodeId, context);

      if (!definition || !resource || !eligibility.canGather) {
        return null;
      }

      const now = new Date().toISOString();
      const userId = readUserId();
      let gathered = false;
      let rewards: GameReward[] = [];

      writeGathering((current) => {
        const instance = current.nodes[nodeId];
        const freshContext = readContext();
        const freshEligibility = canGatherFromNode(nodeId, freshContext);

        if (!instance || !freshEligibility.canGather) {
          return current;
        }

        gathered = true;
        rewards = buildGatherRewards(
          definition,
          resource,
          freshContext.getSkillLevel,
        );

        return {
          nodes: {
            ...current.nodes,
            [nodeId]: applyGatherToNodeInstance(
              instance,
              definition,
              now,
              userId,
            ),
          },
        };
      });

      if (!gathered) {
        return null;
      }

      applyGatheringRewards(rewards, rewardCallbacks);

      const itemReward = rewards.find(
        (reward): reward is Extract<GameReward, { type: "item" }> =>
          reward.type === "item",
      );

      return {
        nodeId,
        resourceName: resource.name,
        rewards,
        yieldAmount: itemReward?.amount ?? definition.baseYield,
        skillXp: definition.skillXp,
      };
    },
  };
}

export function getRegisteredResourceNodeDefinitions() {
  return RESOURCE_NODE_DEFINITIONS;
}

export function getResourceNodeRegionName(nodeId: ResourceNodeId): string {
  const definition = getResourceNodeDefinition(nodeId);

  if (!definition) {
    return "Unknown region";
  }

  return getRegionDefinitionName(definition.regionId);
}
