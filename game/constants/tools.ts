import { createId, type ToolTypeId } from "@/types";

export const TOOL_TYPE_IDS = {
  BASKET: createId<"ToolTypeId">("basket"),
  AXE: createId<"ToolTypeId">("axe"),
  PICKAXE: createId<"ToolTypeId">("pickaxe"),
  FISHING_ROD: createId<"ToolTypeId">("fishing_rod"),
} as const;

export type CoreToolTypeId = (typeof TOOL_TYPE_IDS)[keyof typeof TOOL_TYPE_IDS];

export interface ToolTypeDefinition {
  id: ToolTypeId;
  name: string;
  description: string;
  category: "foraging" | "woodcutting" | "mining" | "fishing";
  iconKey: string;
}

export const TOOL_TYPE_DEFINITIONS = [
  {
    id: TOOL_TYPE_IDS.BASKET,
    name: "Basket",
    description: "Carry foraged herbs, flowers, and berries.",
    category: "foraging",
    iconKey: "basket",
  },
  {
    id: TOOL_TYPE_IDS.AXE,
    name: "Axe",
    description: "Fell trees and gather timber from the forest.",
    category: "woodcutting",
    iconKey: "axe",
  },
  {
    id: TOOL_TYPE_IDS.PICKAXE,
    name: "Pickaxe",
    description: "Break stone and uncover ore deposits.",
    category: "mining",
    iconKey: "pickaxe",
  },
  {
    id: TOOL_TYPE_IDS.FISHING_ROD,
    name: "Fishing Rod",
    description: "Cast lines into calm waters for fresh catches.",
    category: "fishing",
    iconKey: "fishing_rod",
  },
] as const satisfies ReadonlyArray<ToolTypeDefinition>;

export function getToolTypeDefinition(
  toolTypeId: ToolTypeId,
): ToolTypeDefinition | undefined {
  return TOOL_TYPE_DEFINITIONS.find((entry) => entry.id === toolTypeId);
}

export function isRegisteredToolType(
  toolTypeId: string,
): toolTypeId is ToolTypeId {
  return TOOL_TYPE_DEFINITIONS.some((entry) => entry.id === toolTypeId);
}
