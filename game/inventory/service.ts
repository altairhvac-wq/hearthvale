import { getItemDefinition, isRegisteredItem } from "@/game/constants/items";
import type { InventoryItem, ItemId, ToolTypeId } from "@/types";

export interface InventorySpendRequirement {
  itemId: ItemId;
  amount: number;
}

export function createInventoryItem(
  itemId: ItemId,
  quantity: number,
): InventoryItem | null {
  const definition = getItemDefinition(itemId);

  if (!definition || quantity <= 0) {
    return null;
  }

  return {
    id: itemId,
    definitionId: itemId,
    name: definition.name,
    description: definition.description,
    category: definition.category,
    rarity: definition.rarity,
    quantity,
    stackLimit: definition.stackLimit,
    metadata: { ...definition.metadata },
  };
}

export function getInventoryItemQuantity(
  inventory: ReadonlyArray<InventoryItem>,
  itemId: ItemId,
): number {
  return inventory
    .filter((entry) => entry.id === itemId)
    .reduce((total, entry) => total + entry.quantity, 0);
}

export function hasInventoryItems(
  inventory: ReadonlyArray<InventoryItem>,
  requirements: ReadonlyArray<InventorySpendRequirement>,
): boolean {
  return requirements.every(
    (requirement) =>
      getInventoryItemQuantity(inventory, requirement.itemId) >= requirement.amount,
  );
}

export function addItemsToInventory(
  inventory: ReadonlyArray<InventoryItem>,
  itemId: ItemId,
  amount: number,
): InventoryItem[] {
  if (!isRegisteredItem(itemId) || amount <= 0) {
    return [...inventory];
  }

  const definition = getItemDefinition(itemId);

  if (!definition) {
    return [...inventory];
  }

  const nextInventory = [...inventory];
  const existingIndex = nextInventory.findIndex((entry) => entry.id === itemId);

  if (existingIndex >= 0) {
    const existing = nextInventory[existingIndex]!;

    if (existing.category === "tool") {
      return nextInventory;
    }

    const nextQuantity = Math.min(
      existing.stackLimit,
      existing.quantity + amount,
    );

    nextInventory[existingIndex] = {
      ...existing,
      quantity: nextQuantity,
    };

    return nextInventory;
  }

  const created = createInventoryItem(itemId, Math.min(definition.stackLimit, amount));

  if (!created) {
    return nextInventory;
  }

  nextInventory.push(created);
  return nextInventory;
}

export function spendInventoryItems(
  inventory: ReadonlyArray<InventoryItem>,
  requirements: ReadonlyArray<InventorySpendRequirement>,
): InventoryItem[] | null {
  if (!hasInventoryItems(inventory, requirements)) {
    return null;
  }

  const nextInventory = [...inventory];

  for (const requirement of requirements) {
    let remaining = requirement.amount;

    for (let index = 0; index < nextInventory.length && remaining > 0; index += 1) {
      const entry = nextInventory[index]!;

      if (entry.id !== requirement.itemId) {
        continue;
      }

      if (entry.quantity <= remaining) {
        remaining -= entry.quantity;
        nextInventory.splice(index, 1);
        index -= 1;
        continue;
      }

      nextInventory[index] = {
        ...entry,
        quantity: entry.quantity - remaining,
      };
      remaining = 0;
    }
  }

  return nextInventory;
}

export function getHighestToolTier(
  inventory: ReadonlyArray<InventoryItem>,
  toolTypeId: ToolTypeId,
): number {
  let highestTier = 0;

  for (const entry of inventory) {
    if (entry.category !== "tool") {
      continue;
    }

    const entryToolTypeId = entry.metadata.toolTypeId;

    if (entryToolTypeId !== toolTypeId) {
      continue;
    }

    const tier =
      typeof entry.metadata.tier === "number" ? entry.metadata.tier : 0;

    highestTier = Math.max(highestTier, tier);
  }

  return highestTier;
}

export function hasRequiredTool(
  inventory: ReadonlyArray<InventoryItem>,
  toolTypeId: ToolTypeId,
  minimumTier: number,
): boolean {
  return getHighestToolTier(inventory, toolTypeId) >= minimumTier;
}
