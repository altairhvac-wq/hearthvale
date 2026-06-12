import {
  getGatherableResourceDefinition,
  getResourceNodeDefinition,
  RESOURCE_NODE_DEFINITIONS,
} from "@/game/constants/gathering";
import { REGION_DEFINITIONS } from "@/game/constants/regions";
import { getToolTypeDefinition } from "@/game/constants/tools";
import { tryGetSkillDefinition } from "@/game/skills";
import type { GatheringCategory, RegionId, ResourceNodeId } from "@/types";
import type { GatheringEvaluationContext } from "./context";
import { isRegionAccessibleForGathering } from "./context";
import {
  canGatherFromNode,
  calculateGatherYield,
  describeGatherBlockReason,
  type GatherBlockReason,
} from "./progression";

export interface GatherNodeViewModel {
  id: ResourceNodeId;
  name: string;
  description: string;
  category: GatheringCategory;
  status: "available" | "depleted" | "respawning";
  resourceName: string;
  resourceIconKey: string;
  yieldAmount: number;
  skillXp: number;
  skillName: string;
  minimumSkillLevel: number;
  playerSkillLevel: number;
  toolLabel: string | null;
  canGather: boolean;
  blockReason: GatherBlockReason | null;
  blockMessage: string | null;
  rewardLabels: string[];
}

export interface GatherRegionViewModel {
  id: RegionId;
  name: string;
  description: string;
  theme: string;
  isAccessible: boolean;
  isActive: boolean;
  nodes: GatherNodeViewModel[];
  availableCount: number;
}

export interface GatheringScreenData {
  regions: GatherRegionViewModel[];
  totalAvailableNodes: number;
  activeRegionId: RegionId | null;
}

function buildRewardLabels(yieldAmount: number, skillXp: number, skillName: string): string[] {
  return [`+${yieldAmount} items`, `+${skillXp} ${skillName} XP`];
}

function buildToolLabel(
  toolTypeId: import("@/types").ToolTypeId | undefined,
  minimumTier: number,
): string | null {
  if (!toolTypeId) {
    return null;
  }

  const tool = getToolTypeDefinition(toolTypeId);

  if (!tool) {
    return `Tier ${minimumTier} tool`;
  }

  return `${tool.name} (tier ${minimumTier}+)`;
}

export function buildGatherNodeViewModel(
  nodeId: ResourceNodeId,
  context: GatheringEvaluationContext,
): GatherNodeViewModel | null {
  const definition = getResourceNodeDefinition(nodeId);
  const instance = context.gathering.nodes[nodeId];

  if (!definition || !instance) {
    return null;
  }

  const resource = getGatherableResourceDefinition(definition.resourceId);
  const skill = tryGetSkillDefinition(definition.skillId);
  const eligibility = canGatherFromNode(nodeId, context);
  const skillName = skill?.name ?? "Skill";
  const playerSkillLevel = context.getSkillLevel(definition.skillId);
  const yieldAmount = calculateGatherYield(
    definition.baseYield,
    definition.skillId,
    context.getSkillLevel,
  );

  return {
    id: nodeId,
    name: definition.name,
    description: definition.description,
    category: definition.category,
    status: instance.status,
    resourceName: resource?.name ?? "Resource",
    resourceIconKey: resource?.iconKey ?? "resource",
    yieldAmount,
    skillXp: definition.skillXp,
    skillName,
    minimumSkillLevel: definition.minimumSkillLevel,
    playerSkillLevel,
    toolLabel: definition.toolRequirement
      ? buildToolLabel(
          definition.toolRequirement.toolTypeId,
          definition.toolRequirement.minimumTier,
        )
      : null,
    canGather: eligibility.canGather,
    blockReason: eligibility.reason,
    blockMessage: eligibility.reason
      ? describeGatherBlockReason(eligibility.reason)
      : null,
    rewardLabels: buildRewardLabels(yieldAmount, definition.skillXp, skillName),
  };
}

export function buildGatheringScreenData(
  context: GatheringEvaluationContext,
): GatheringScreenData {
  const regionMap = new Map<RegionId, GatherRegionViewModel>();

  for (const definition of RESOURCE_NODE_DEFINITIONS) {
    const regionDefinition = REGION_DEFINITIONS.find(
      (entry) => entry.id === definition.regionId,
    );

    if (!regionDefinition) {
      continue;
    }

    const node = buildGatherNodeViewModel(definition.id, context);

    if (!node) {
      continue;
    }

    const existing = regionMap.get(definition.regionId);

    if (existing) {
      existing.nodes.push(node);
      existing.availableCount += node.status === "available" ? 1 : 0;
      continue;
    }

    regionMap.set(definition.regionId, {
      id: definition.regionId,
      name: regionDefinition.name,
      description: regionDefinition.description,
      theme: regionDefinition.theme,
      isAccessible: isRegionAccessibleForGathering(
        definition.regionId,
        context.regions,
      ),
      isActive: context.activeRegionId === definition.regionId,
      nodes: [node],
      availableCount: node.status === "available" ? 1 : 0,
    });
  }

  const regions = [...regionMap.values()]
    .map((region) => ({
      ...region,
      nodes: [...region.nodes].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    regions,
    totalAvailableNodes: regions.reduce(
      (total, region) => total + region.availableCount,
      0,
    ),
    activeRegionId: context.activeRegionId,
  };
}
