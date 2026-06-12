import type { ItemId } from "./ids";
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

export type { Resource } from "./resource";
