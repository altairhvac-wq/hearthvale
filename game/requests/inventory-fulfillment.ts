import { ITEM_IDS } from "@/game/constants/items";
import {
  REQUEST_PLACEHOLDER_RESOURCES,
  type RequestPlaceholderResourceId,
} from "@/game/constants/requests";
import {
  getInventoryItemQuantity,
  hasInventoryItems,
  spendInventoryItems,
  type InventorySpendRequirement,
} from "@/game/inventory/service";
import type { InventoryItem, ItemId, RequestResourceRequirement } from "@/types";

/** Maps legacy placeholder ids to inventory item ids when itemId is omitted. */
export const REQUEST_PLACEHOLDER_ITEM_MAP: Record<
  RequestPlaceholderResourceId,
  ItemId
> = {
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

  const placeholderId =
    requirement.placeholderId as RequestPlaceholderResourceId;

  return REQUEST_PLACEHOLDER_ITEM_MAP[placeholderId] ?? null;
}

export function isRequestRequirementResolvable(
  requirement: RequestResourceRequirement,
): boolean {
  return resolveRequestItemId(requirement) !== null;
}

export function toInventorySpendRequirements(
  requiredResources: ReadonlyArray<RequestResourceRequirement>,
): InventorySpendRequirement[] {
  const totals = new Map<ItemId, number>();

  for (const resource of requiredResources) {
    const itemId = resolveRequestItemId(resource);

    if (!itemId) {
      continue;
    }

    totals.set(itemId, (totals.get(itemId) ?? 0) + resource.amount);
  }

  return [...totals.entries()].map(([itemId, amount]) => ({
    itemId,
    amount,
  }));
}

/**
 * Inventory-backed fulfillment check used by request completion.
 */
export function canFulfillRequestResourcesFromInventory(
  inventory: ReadonlyArray<InventoryItem>,
  requiredResources: ReadonlyArray<RequestResourceRequirement>,
): boolean {
  if (requiredResources.length === 0) {
    return false;
  }

  if (
    !requiredResources.every((resource) =>
      isRequestRequirementResolvable(resource),
    )
  ) {
    return false;
  }

  const requirements = toInventorySpendRequirements(requiredResources);

  return hasInventoryItems(inventory, requirements);
}

/**
 * Spend gathered resources for request fulfillment.
 * Returns null when inventory lacks required stock or requirements are unmapped.
 */
export function spendRequestResourcesFromInventory(
  inventory: ReadonlyArray<InventoryItem>,
  requiredResources: ReadonlyArray<RequestResourceRequirement>,
): InventoryItem[] | null {
  if (requiredResources.length === 0) {
    return null;
  }

  if (
    !requiredResources.every((resource) =>
      isRequestRequirementResolvable(resource),
    )
  ) {
    return null;
  }

  const requirements = toInventorySpendRequirements(requiredResources);

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
