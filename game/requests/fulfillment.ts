import type { RequestResourceRequirement } from "@/types";

/**
 * V1 fulfillment gate for placeholder request resources.
 * Inventory integration replaces this with real stock checks and spending.
 * See `inventory-fulfillment.ts` for inventory-backed fulfillment helpers.
 */
export function canFulfillRequestResources(
  requiredResources: ReadonlyArray<RequestResourceRequirement>,
): boolean {
  if (requiredResources.length === 0) {
    return true;
  }

  return requiredResources.every(
    (resource) =>
      typeof resource.placeholderId === "string" &&
      resource.placeholderId.length > 0 &&
      typeof resource.amount === "number" &&
      Number.isFinite(resource.amount) &&
      resource.amount > 0,
  );
}
