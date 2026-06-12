import { STARTER_TOOL_ITEM_IDS } from "@/game/constants/items";
import { createInventoryItem } from "@/game/inventory/service";
import type { InventoryItem } from "@/types";

export function createInitialInventoryState(): InventoryItem[] {
  return STARTER_TOOL_ITEM_IDS.flatMap((itemId) => {
    const item = createInventoryItem(itemId, 1);
    return item ? [item] : [];
  });
}

export function mergeInventoryState(
  saved: InventoryItem[] | undefined,
): InventoryItem[] {
  const defaults = createInitialInventoryState();

  if (!Array.isArray(saved)) {
    return defaults;
  }

  if (saved.length === 0) {
    return defaults;
  }

  const merged = [...saved];

  for (const starterItemId of STARTER_TOOL_ITEM_IDS) {
    const hasStarterTool = merged.some(
      (entry) => entry.id === starterItemId && entry.category === "tool",
    );

    if (!hasStarterTool) {
      const item = createInventoryItem(starterItemId, 1);

      if (item) {
        merged.push(item);
      }
    }
  }

  return merged;
}
