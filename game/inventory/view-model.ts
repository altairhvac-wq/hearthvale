import { getItemDefinition } from "@/game/constants/items";
import type { InventoryItem, InventoryItemCategory, ItemId, Rarity } from "@/types";

export interface InventoryItemViewModel {
  id: ItemId;
  name: string;
  description: string;
  category: InventoryItemCategory;
  rarity: Rarity;
  quantity: number;
  stackLimit: number;
  iconKey: string;
}

export interface InventoryCategoryGroup {
  category: InventoryItemCategory;
  label: string;
  items: InventoryItemViewModel[];
}

export interface InventoryScreenData {
  groups: InventoryCategoryGroup[];
  totalItemCount: number;
  resourceCount: number;
  toolCount: number;
  hasGatheredResources: boolean;
  isEmpty: boolean;
}

const CATEGORY_ORDER: InventoryItemCategory[] = [
  "resource",
  "tool",
  "consumable",
  "decoration",
  "collectible",
  "quest",
];

const CATEGORY_LABELS: Record<InventoryItemCategory, string> = {
  resource: "Gathered resources",
  tool: "Tools",
  consumable: "Consumables",
  decoration: "Decorations",
  collectible: "Collectibles",
  quest: "Quest items",
};

function toInventoryItemViewModel(item: InventoryItem): InventoryItemViewModel {
  const definition = getItemDefinition(item.id);

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    rarity: item.rarity,
    quantity: item.quantity,
    stackLimit: item.stackLimit,
    iconKey: definition?.iconKey ?? item.id,
  };
}

export function buildInventoryScreenData(
  inventory: ReadonlyArray<InventoryItem>,
): InventoryScreenData {
  const items = inventory.map(toInventoryItemViewModel);
  const grouped = new Map<InventoryItemCategory, InventoryItemViewModel[]>();

  for (const item of items) {
    const existing = grouped.get(item.category) ?? [];
    existing.push(item);
    grouped.set(item.category, existing);
  }

  const groups = CATEGORY_ORDER.flatMap((category) => {
    const categoryItems = grouped.get(category);

    if (!categoryItems || categoryItems.length === 0) {
      return [];
    }

    return [
      {
        category,
        label: CATEGORY_LABELS[category],
        items: [...categoryItems].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      },
    ];
  });

  const resourceCount = items
    .filter((item) => item.category === "resource")
    .reduce((total, item) => total + item.quantity, 0);
  const toolCount = items.filter((item) => item.category === "tool").length;

  return {
    groups,
    totalItemCount: items.reduce((total, item) => total + item.quantity, 0),
  resourceCount,
  toolCount,
  hasGatheredResources: resourceCount > 0,
  isEmpty: items.length === 0,
};
}
