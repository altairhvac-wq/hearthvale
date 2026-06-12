import { ITEM_IDS } from "@/game/constants/items";
import { REQUEST_PLACEHOLDER_RESOURCES } from "@/game/constants/requests";
import {
  getInventoryItemQuantity,
  hasInventoryItems,
  spendInventoryItems,
  type InventorySpendRequirement,
} from "@/game/inventory/service";
import type { InventoryItem, ItemId, RequestResourceRequirement } from "@/types";

/** Maps placeholder ids to inventory item ids for future fulfillment wiring. */
export const REQUEST_PLACEHOLDER_ITEM_MAP: Record<string, ItemId> = {
  [REQUEST_PLACEHOLDER_RESOURCES.WILDFLOWERS]: ITEM_IDS.WILDFLOWERS,
  [REQUEST_PLACEHOLDER_RESOURCES.BERRIES]: ITEM_IDS.BERRIES,
  [REQUEST_PLACEHOLDER_RESOURCES.FISH]: ITEM_IDS.RIVER_FISH,
};

export function resolveRequestItemId(
  requirement: RequestResourceRequirement,
): ItemId | null {
  if (requirement.itemId) {
    return requirement.itemId;
  }

  return REQUEST_PLACEHOLDER_ITEM_MAP[requirement.placeholderId] ?? null;
}

export function toInventorySpendRequirements(
  requiredResources: ReadonlyArray<RequestResourceRequirement>,
): InventorySpendRequirement[] {
  const requirements: InventorySpendRequirement[] = [];

  for (const resource of requiredResources) {
    const itemId = resolveRequestItemId(resource);

    if (!itemId) {
      continue;
    }

    requirements.push({
      itemId,
      amount: resource.amount,
    });
  }

  return requirements;
}

/**
 * Inventory-backed fulfillment check.
 * Not wired into V1 request completion — use when replacing placeholders.
 */
export function canFulfillRequestResourcesFromInventory(
  inventory: ReadonlyArray<InventoryItem>,
  requiredResources: ReadonlyArray<RequestResourceRequirement>,
): boolean {
  const requirements = toInventorySpendRequirements(requiredResources);

  if (requirements.length === 0) {
    return false;
  }

  return hasInventoryItems(inventory, requirements);
}

/**
 * Spend gathered resources for request fulfillment.
 * Returns null when inventory lacks required stock.
 */
export function spendRequestResourcesFromInventory(
  inventory: ReadonlyArray<InventoryItem>,
  requiredResources: ReadonlyArray<RequestResourceRequirement>,
): InventoryItem[] | null {
  const requirements = toInventorySpendRequirements(requiredResources);

  if (requirements.length === 0) {
    return null;
  }

  return spendInventoryItems(inventory, requirements);
}

export function getRequestResourceStock(
  inventory: ReadonlyArray<InventoryItem>,
  requirement: RequestResourceRequirement,
): number {
  const itemId = resolveRequestItemId(requirement);

  if (!itemId) {
    return 0;
  }

  return getInventoryItemQuantity(inventory, itemId);
}
