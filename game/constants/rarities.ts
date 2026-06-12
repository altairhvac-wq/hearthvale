import type { RarityDefinition } from "@/types";

export const RARITY_DEFINITIONS: Record<
  RarityDefinition["id"],
  RarityDefinition
> = {
  common: {
    id: "common",
    label: "Common",
    sortOrder: 0,
  },
  uncommon: {
    id: "uncommon",
    label: "Uncommon",
    sortOrder: 1,
  },
  rare: {
    id: "rare",
    label: "Rare",
    sortOrder: 2,
  },
  epic: {
    id: "epic",
    label: "Epic",
    sortOrder: 3,
  },
  legendary: {
    id: "legendary",
    label: "Legendary",
    sortOrder: 4,
  },
  mythic: {
    id: "mythic",
    label: "Mythic",
    sortOrder: 5,
  },
};

export const RARITY_ORDER = Object.values(RARITY_DEFINITIONS).sort(
  (a, b) => a.sortOrder - b.sortOrder,
);
