import { isRegisteredItem } from "@/game/constants/items";
import type { InventoryItem, InventoryItemCategory, Rarity } from "@/types";

const INVENTORY_ITEM_CATEGORIES: readonly InventoryItemCategory[] = [
  "resource",
  "tool",
  "decoration",
  "consumable",
  "collectible",
  "quest",
];

const RARITIES: readonly Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInventoryItemCategory(
  value: unknown,
): value is InventoryItemCategory {
  return (
    typeof value === "string" &&
    (INVENTORY_ITEM_CATEGORIES as readonly string[]).includes(value)
  );
}

function isRarity(value: unknown): value is Rarity {
  return (
    typeof value === "string" &&
    (RARITIES as readonly string[]).includes(value)
  );
}

function isMetadataRecord(
  value: unknown,
): value is Record<string, string | number | boolean> {
  if (!isObject(value)) {
    return false;
  }

  return Object.values(value).every(
    (entry) =>
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean",
  );
}

export function isPersistedInventoryItem(
  value: unknown,
): value is InventoryItem {
  if (!isObject(value)) {
    return false;
  }

  if (
    typeof value.id !== "string" ||
    !isRegisteredItem(value.id) ||
    typeof value.definitionId !== "string" ||
    typeof value.name !== "string" ||
    typeof value.description !== "string" ||
    !isInventoryItemCategory(value.category) ||
    !isRarity(value.rarity) ||
    typeof value.quantity !== "number" ||
    !Number.isFinite(value.quantity) ||
    value.quantity < 0 ||
    typeof value.stackLimit !== "number" ||
    !Number.isFinite(value.stackLimit) ||
    value.stackLimit < 1 ||
    !isMetadataRecord(value.metadata)
  ) {
    return false;
  }

  if (value.category === "tool") {
    return (
      typeof value.metadata.toolTypeId === "string" &&
      typeof value.metadata.tier === "number" &&
      Number.isFinite(value.metadata.tier) &&
      value.metadata.tier >= 1
    );
  }

  return true;
}

export function isPersistedInventory(
  value: unknown,
): value is InventoryItem[] {
  return Array.isArray(value) && value.every(isPersistedInventoryItem);
}
