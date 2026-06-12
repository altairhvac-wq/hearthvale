import {
  getGatherableResourceDefinition,
  getResourceNodeDefinition,
} from "@/game/constants/gathering";
import { hasRequiredTool } from "@/game/inventory/service";
import { getUnlocksForSkillAtLevel } from "@/game/skills/progression";
import { isUnlockRequirementMet } from "@/game/unlock/requirements";
import type {
  GameReward,
  GatherableResourceDefinition,
  ResourceNodeDefinition,
  ResourceNodeId,
  ResourceNodeInstance,
  SkillId,
} from "@/types";
import type { GatheringEvaluationContext } from "./context";

export type GatherBlockReason =
  | "unknown_node"
  | "region_locked"
  | "region_not_active"
  | "node_unavailable"
  | "skill_too_low"
  | "missing_tool"
  | "unlock_not_met";

export interface GatherEligibility {
  canGather: boolean;
  reason: GatherBlockReason | null;
}

export function canGatherFromNode(
  nodeId: ResourceNodeId,
  context: GatheringEvaluationContext,
): GatherEligibility {
  const definition = getResourceNodeDefinition(nodeId);
  const instance = context.gathering.nodes[nodeId];

  if (!definition || !instance) {
    return { canGather: false, reason: "unknown_node" };
  }

  const region = context.regions[definition.regionId];

  if (
    !region ||
    (region.state !== "unlocked" && region.state !== "restored")
  ) {
    return { canGather: false, reason: "region_locked" };
  }

  if (context.activeRegionId !== definition.regionId) {
    return { canGather: false, reason: "region_not_active" };
  }

  if (instance.status !== "available") {
    return { canGather: false, reason: "node_unavailable" };
  }

  if (definition.unlockRequirement) {
    if (!isUnlockRequirementMet(definition.unlockRequirement, context)) {
      return { canGather: false, reason: "unlock_not_met" };
    }
  }

  if (context.getSkillLevel(definition.skillId) < definition.minimumSkillLevel) {
    return { canGather: false, reason: "skill_too_low" };
  }

  if (definition.toolRequirement) {
    const hasTool = hasRequiredTool(
      context.inventory,
      definition.toolRequirement.toolTypeId,
      definition.toolRequirement.minimumTier,
    );

    if (!hasTool) {
      return { canGather: false, reason: "missing_tool" };
    }
  }

  return { canGather: true, reason: null };
}

export function getGatheringYieldMultiplier(
  skillId: SkillId,
  getSkillLevel: (skillId: SkillId) => number,
): number {
  const unlocks = getUnlocksForSkillAtLevel(skillId, getSkillLevel(skillId));
  const yieldPerk = unlocks
    .flatMap((unlock) => unlock.perks)
    .find((perk) => perk.type === "yield_bonus");

  return yieldPerk ? 1 + yieldPerk.value : 1;
}

export function calculateGatherYield(
  baseYield: number,
  skillId: SkillId,
  getSkillLevel: (skillId: SkillId) => number,
): number {
  const multiplier = getGatheringYieldMultiplier(skillId, getSkillLevel);

  return Math.max(1, Math.round(baseYield * multiplier));
}

export function buildGatherRewards(
  definition: ResourceNodeDefinition,
  resource: GatherableResourceDefinition,
  getSkillLevel: (skillId: SkillId) => number,
): GameReward[] {
  const yieldAmount = calculateGatherYield(
    definition.baseYield,
    definition.skillId,
    getSkillLevel,
  );

  return [
    { type: "item", itemId: resource.itemId, amount: yieldAmount },
    { type: "skill_xp", skillId: definition.skillId, amount: definition.skillXp },
  ];
}

export function applyGatherToNodeInstance(
  instance: ResourceNodeInstance,
  definition: ResourceNodeDefinition,
  now: string,
  gatheredByUserId: ResourceNodeInstance["lastGatheredByUserId"],
): ResourceNodeInstance {
  const nextGathers = instance.gathersThisCycle + 1;

  if (nextGathers >= definition.respawnRule.maxGathersPerCycle) {
    return {
      ...instance,
      status: "depleted",
      gathersThisCycle: 0,
      depletedAt: now,
      respawnAt:
        definition.respawnRule.respawnMode === "timed"
          ? new Date(
              Date.parse(now) + (definition.respawnRule.respawnDurationMs ?? 0),
            ).toISOString()
          : null,
      lastGatheredAt: now,
      lastGatheredByUserId: gatheredByUserId,
    };
  }

  return {
    ...instance,
    gathersThisCycle: nextGathers,
    lastGatheredAt: now,
    lastGatheredByUserId: gatheredByUserId,
  };
}

export function describeGatherBlockReason(
  reason: GatherBlockReason,
): string {
  switch (reason) {
    case "unknown_node":
      return "This gathering spot could not be found.";
    case "region_locked":
      return "Explore and unlock this region first.";
    case "region_not_active":
      return "Travel to this region before gathering here.";
    case "node_unavailable":
      return "This spot needs time to recover.";
    case "skill_too_low":
      return "Your skill level is too low.";
    case "missing_tool":
      return "You need the right tool for this.";
    case "unlock_not_met":
      return "This spot is not available yet.";
  }
}

export function getGatherableResourceForNode(
  nodeId: ResourceNodeId,
): GatherableResourceDefinition | undefined {
  const definition = getResourceNodeDefinition(nodeId);

  if (!definition) {
    return undefined;
  }

  return getGatherableResourceDefinition(definition.resourceId);
}
