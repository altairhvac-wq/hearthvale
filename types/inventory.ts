import type { ItemId, ToolTypeId } from "./ids";
import type { Rarity } from "./rarity";

export type InventoryItemCategory =
  | "resource"
  | "tool"
  | "decoration"
  | "consumable"
  | "collectible"
  | "quest";

export interface InventoryItem {
  id: ItemId;
  definitionId: string;
  name: string;
  description: string;
  category: InventoryItemCategory;
  rarity: Rarity;
  quantity: number;
  stackLimit: number;
  metadata: Record<string, string | number | boolean>;
}

/** Static catalog entry for inventory items. */
export interface ItemDefinition {
  id: ItemId;
  name: string;
  description: string;
  category: InventoryItemCategory;
  rarity: Rarity;
  stackLimit: number;
  iconKey: string;
  metadata: Record<string, string | number | boolean>;
}

/** Tool metadata keys stored on tool inventory items. */
export interface ToolItemMetadata {
  toolTypeId: ToolTypeId;
  tier: number;
}

export type { Resource } from "./resource";
