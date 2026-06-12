import { ITEM_IDS } from "@/game/constants/items";
import { REGION_IDS } from "@/game/constants/regions";
import { SKILL_IDS } from "@/game/constants/skills";
import { TOOL_TYPE_IDS } from "@/game/constants/tools";
import {
  createId,
  type GatherableResourceDefinition,
  type GatherableResourceId,
  type ResourceNodeDefinition,
  type ResourceNodeId,
} from "@/types";

export const GATHERABLE_RESOURCE_IDS = {
  WILDFLOWERS: createId<"GatherableResourceId">("wildflowers"),
  BERRIES: createId<"GatherableResourceId">("berries"),
  PINE_LOGS: createId<"GatherableResourceId">("pine_logs"),
  STONE: createId<"GatherableResourceId">("stone"),
  COPPER_ORE: createId<"GatherableResourceId">("copper_ore"),
  RIVER_FISH: createId<"GatherableResourceId">("river_fish"),
} as const;

export const RESOURCE_NODE_IDS = {
  VALLEY_WILDFLOWERS: createId<"ResourceNodeId">("valley_wildflowers"),
  VALLEY_BERRIES: createId<"ResourceNodeId">("valley_berries"),
  FOREST_PINE_TREES: createId<"ResourceNodeId">("forest_pine_trees"),
  SANCTUARY_WILDFLOWERS: createId<"ResourceNodeId">("sanctuary_wildflowers"),
  DOCK_FISHING_SPOT: createId<"ResourceNodeId">("dock_fishing_spot"),
  DOCK_STONE_DEPOSIT: createId<"ResourceNodeId">("dock_stone_deposit"),
} as const;

export const GATHERABLE_RESOURCE_DEFINITIONS = [
  {
    id: GATHERABLE_RESOURCE_IDS.WILDFLOWERS,
    name: "Wildflowers",
    description: "Colorful blooms scattered across meadow paths.",
    category: "foraging",
    skillId: SKILL_IDS.FORAGING,
    itemId: ITEM_IDS.WILDFLOWERS,
    iconKey: "wildflowers",
    rarity: "common",
    stackLimit: 99,
  },
  {
    id: GATHERABLE_RESOURCE_IDS.BERRIES,
    name: "Berries",
    description: "Sweet berries ripening in sunny clearings.",
    category: "foraging",
    skillId: SKILL_IDS.FORAGING,
    itemId: ITEM_IDS.BERRIES,
    iconKey: "berries",
    rarity: "common",
    stackLimit: 99,
  },
  {
    id: GATHERABLE_RESOURCE_IDS.PINE_LOGS,
    name: "Pine Logs",
    description: "Timber from towering pines along the forest path.",
    category: "woodcutting",
    skillId: SKILL_IDS.WOODCUTTING,
    itemId: ITEM_IDS.PINE_LOGS,
    iconKey: "pine_logs",
    rarity: "common",
    stackLimit: 50,
  },
  {
    id: GATHERABLE_RESOURCE_IDS.STONE,
    name: "Stone",
    description: "Rough stone deposits near the water's edge.",
    category: "mining",
    skillId: SKILL_IDS.MINING,
    itemId: ITEM_IDS.STONE,
    iconKey: "stone",
    rarity: "common",
    stackLimit: 99,
  },
  {
    id: GATHERABLE_RESOURCE_IDS.COPPER_ORE,
    name: "Copper Ore",
    description: "Glittering copper veins — rare and valuable.",
    category: "mining",
    skillId: SKILL_IDS.MINING,
    itemId: ITEM_IDS.COPPER_ORE,
    iconKey: "copper_ore",
    rarity: "uncommon",
    stackLimit: 50,
  },
  {
    id: GATHERABLE_RESOURCE_IDS.RIVER_FISH,
    name: "River Fish",
    description: "Quick silver fish darting beneath the dock.",
    category: "fishing",
    skillId: SKILL_IDS.FISHING,
    itemId: ITEM_IDS.RIVER_FISH,
    iconKey: "river_fish",
    rarity: "common",
    stackLimit: 50,
  },
] as const satisfies ReadonlyArray<GatherableResourceDefinition>;

export const RESOURCE_NODE_DEFINITIONS = [
  {
    id: RESOURCE_NODE_IDS.VALLEY_WILDFLOWERS,
    name: "Wildflower Patch",
    description: "A sunlit patch of meadow blooms.",
    regionId: REGION_IDS.VALLEY,
    resourceId: GATHERABLE_RESOURCE_IDS.WILDFLOWERS,
    category: "foraging",
    skillId: SKILL_IDS.FORAGING,
    minimumSkillLevel: 1,
    toolRequirement: {
      toolTypeId: TOOL_TYPE_IDS.BASKET,
      minimumTier: 1,
    },
    baseYield: 1,
    skillXp: 15,
    respawnRule: {
      maxGathersPerCycle: 1,
      respawnMode: "on_refresh",
    },
    sortOrder: 1,
    unlockRequirement: null,
  },
  {
    id: RESOURCE_NODE_IDS.VALLEY_BERRIES,
    name: "Berry Bush",
    description: "Plump berries clinging to low branches.",
    regionId: REGION_IDS.VALLEY,
    resourceId: GATHERABLE_RESOURCE_IDS.BERRIES,
    category: "foraging",
    skillId: SKILL_IDS.FORAGING,
    minimumSkillLevel: 1,
    toolRequirement: {
      toolTypeId: TOOL_TYPE_IDS.BASKET,
      minimumTier: 1,
    },
    baseYield: 1,
    skillXp: 18,
    respawnRule: {
      maxGathersPerCycle: 1,
      respawnMode: "on_refresh",
    },
    sortOrder: 2,
    unlockRequirement: null,
  },
  {
    id: RESOURCE_NODE_IDS.FOREST_PINE_TREES,
    name: "Pine Trees",
    description: "Tall pines with bark scented of resin and rain.",
    regionId: REGION_IDS.FOREST,
    resourceId: GATHERABLE_RESOURCE_IDS.PINE_LOGS,
    category: "woodcutting",
    skillId: SKILL_IDS.WOODCUTTING,
    minimumSkillLevel: 1,
    toolRequirement: {
      toolTypeId: TOOL_TYPE_IDS.AXE,
      minimumTier: 1,
    },
    baseYield: 1,
    skillXp: 25,
    respawnRule: {
      maxGathersPerCycle: 1,
      respawnMode: "on_refresh",
    },
    sortOrder: 1,
    unlockRequirement: null,
  },
  {
    id: RESOURCE_NODE_IDS.SANCTUARY_WILDFLOWERS,
    name: "Sanctuary Wildflowers",
    description: "Quiet blooms at the edge of the animal refuge.",
    regionId: REGION_IDS.SANCTUARY,
    resourceId: GATHERABLE_RESOURCE_IDS.WILDFLOWERS,
    category: "foraging",
    skillId: SKILL_IDS.FORAGING,
    minimumSkillLevel: 1,
    toolRequirement: {
      toolTypeId: TOOL_TYPE_IDS.BASKET,
      minimumTier: 1,
    },
    baseYield: 1,
    skillXp: 12,
    respawnRule: {
      maxGathersPerCycle: 1,
      respawnMode: "on_refresh",
    },
    sortOrder: 1,
    unlockRequirement: null,
  },
  {
    id: RESOURCE_NODE_IDS.DOCK_FISHING_SPOT,
    name: "Fishing Spot",
    description: "Calm waters where fish gather near the pilings.",
    regionId: REGION_IDS.DOCK,
    resourceId: GATHERABLE_RESOURCE_IDS.RIVER_FISH,
    category: "fishing",
    skillId: SKILL_IDS.FISHING,
    minimumSkillLevel: 1,
    toolRequirement: {
      toolTypeId: TOOL_TYPE_IDS.FISHING_ROD,
      minimumTier: 1,
    },
    baseYield: 1,
    skillXp: 20,
    respawnRule: {
      maxGathersPerCycle: 1,
      respawnMode: "on_refresh",
    },
    sortOrder: 1,
    unlockRequirement: null,
  },
  {
    id: RESOURCE_NODE_IDS.DOCK_STONE_DEPOSIT,
    name: "Stone Deposit",
    description: "Loose stone along the dock's rocky shore.",
    regionId: REGION_IDS.DOCK,
    resourceId: GATHERABLE_RESOURCE_IDS.STONE,
    category: "mining",
    skillId: SKILL_IDS.MINING,
    minimumSkillLevel: 1,
    toolRequirement: {
      toolTypeId: TOOL_TYPE_IDS.PICKAXE,
      minimumTier: 1,
    },
    baseYield: 1,
    skillXp: 15,
    respawnRule: {
      maxGathersPerCycle: 1,
      respawnMode: "on_refresh",
    },
    sortOrder: 2,
    unlockRequirement: null,
  },
] as const satisfies ReadonlyArray<ResourceNodeDefinition>;

export function getGatherableResourceDefinition(
  resourceId: GatherableResourceId,
): GatherableResourceDefinition | undefined {
  return GATHERABLE_RESOURCE_DEFINITIONS.find((entry) => entry.id === resourceId);
}

export function getResourceNodeDefinition(
  nodeId: ResourceNodeId,
): ResourceNodeDefinition | undefined {
  return RESOURCE_NODE_DEFINITIONS.find((entry) => entry.id === nodeId);
}

export function isRegisteredGatherableResource(
  resourceId: string,
): resourceId is GatherableResourceId {
  return GATHERABLE_RESOURCE_DEFINITIONS.some((entry) => entry.id === resourceId);
}

export function isRegisteredResourceNode(
  nodeId: string,
): nodeId is ResourceNodeId {
  return RESOURCE_NODE_DEFINITIONS.some((entry) => entry.id === nodeId);
}

export function getResourceNodesForRegion(regionId: string) {
  return RESOURCE_NODE_DEFINITIONS.filter((entry) => entry.regionId === regionId);
}
