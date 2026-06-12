import { createId, type ItemDefinition, type ItemId } from "@/types";
import { TOOL_TYPE_IDS } from "@/game/constants/tools";

export const ITEM_IDS = {
  WILDFLOWERS: createId<"ItemId">("wildflowers"),
  BERRIES: createId<"ItemId">("berries"),
  PINE_LOGS: createId<"ItemId">("pine_logs"),
  STONE: createId<"ItemId">("stone"),
  COPPER_ORE: createId<"ItemId">("copper_ore"),
  RIVER_FISH: createId<"ItemId">("river_fish"),
  STARTER_BASKET: createId<"ItemId">("starter_basket"),
  STARTER_AXE: createId<"ItemId">("starter_axe"),
  STARTER_PICKAXE: createId<"ItemId">("starter_pickaxe"),
  STARTER_FISHING_ROD: createId<"ItemId">("starter_fishing_rod"),
} as const;

export type CoreItemId = (typeof ITEM_IDS)[keyof typeof ITEM_IDS];

export const ITEM_DEFINITIONS = [
  {
    id: ITEM_IDS.WILDFLOWERS,
    name: "Wildflowers",
    description: "Colorful blooms gathered from meadow paths.",
    category: "resource",
    rarity: "common",
    stackLimit: 99,
    iconKey: "wildflowers",
    metadata: {},
  },
  {
    id: ITEM_IDS.BERRIES,
    name: "Berries",
    description: "Sweet forest berries, perfect for tarts and gifts.",
    category: "resource",
    rarity: "common",
    stackLimit: 99,
    iconKey: "berries",
    metadata: {},
  },
  {
    id: ITEM_IDS.PINE_LOGS,
    name: "Pine Logs",
    description: "Sturdy timber from the forest path pines.",
    category: "resource",
    rarity: "common",
    stackLimit: 50,
    iconKey: "pine_logs",
    metadata: {},
  },
  {
    id: ITEM_IDS.STONE,
    name: "Stone",
    description: "Rough stone useful for building and restoration.",
    category: "resource",
    rarity: "common",
    stackLimit: 99,
    iconKey: "stone",
    metadata: {},
  },
  {
    id: ITEM_IDS.COPPER_ORE,
    name: "Copper Ore",
    description: "Raw copper waiting to be smelted — a rare find.",
    category: "resource",
    rarity: "uncommon",
    stackLimit: 50,
    iconKey: "copper_ore",
    metadata: {},
  },
  {
    id: ITEM_IDS.RIVER_FISH,
    name: "River Fish",
    description: "Fresh catch from the dock waters.",
    category: "resource",
    rarity: "common",
    stackLimit: 50,
    iconKey: "river_fish",
    metadata: {},
  },
  {
    id: ITEM_IDS.STARTER_BASKET,
    name: "Woven Basket",
    description: "A simple basket for foraging wild plants.",
    category: "tool",
    rarity: "common",
    stackLimit: 1,
    iconKey: "basket",
    metadata: {
      toolTypeId: TOOL_TYPE_IDS.BASKET,
      tier: 1,
    },
  },
  {
    id: ITEM_IDS.STARTER_AXE,
    name: "Hand Axe",
    description: "A sturdy axe for felling small pines.",
    category: "tool",
    rarity: "common",
    stackLimit: 1,
    iconKey: "axe",
    metadata: {
      toolTypeId: TOOL_TYPE_IDS.AXE,
      tier: 1,
    },
  },
  {
    id: ITEM_IDS.STARTER_PICKAXE,
    name: "Stone Pickaxe",
    description: "Breaks stone along the shore and quarry paths.",
    category: "tool",
    rarity: "common",
    stackLimit: 1,
    iconKey: "pickaxe",
    metadata: {
      toolTypeId: TOOL_TYPE_IDS.PICKAXE,
      tier: 1,
    },
  },
  {
    id: ITEM_IDS.STARTER_FISHING_ROD,
    name: "Simple Rod",
    description: "A basic rod for patient dockside fishing.",
    category: "tool",
    rarity: "common",
    stackLimit: 1,
    iconKey: "fishing_rod",
    metadata: {
      toolTypeId: TOOL_TYPE_IDS.FISHING_ROD,
      tier: 1,
    },
  },
] as const satisfies ReadonlyArray<ItemDefinition>;

export const STARTER_TOOL_ITEM_IDS = [
  ITEM_IDS.STARTER_BASKET,
  ITEM_IDS.STARTER_AXE,
  ITEM_IDS.STARTER_PICKAXE,
  ITEM_IDS.STARTER_FISHING_ROD,
] as const;

export function getItemDefinition(itemId: ItemId): ItemDefinition | undefined {
  return ITEM_DEFINITIONS.find((entry) => entry.id === itemId);
}

export function isRegisteredItem(itemId: string): itemId is ItemId {
  return ITEM_DEFINITIONS.some((entry) => entry.id === itemId);
}

export function getItemDefinitionName(itemId: ItemId): string {
  return getItemDefinition(itemId)?.name ?? "Unknown item";
}
