import { createId } from "@/types";

export const RESOURCE_IDS = {
  COINS: createId<"ResourceId">("coins"),
  HEARTS: createId<"ResourceId">("hearts"),
  VALLEY_CHARM: createId<"ResourceId">("valley_charm"),
} as const;

export type CoreResourceId =
  (typeof RESOURCE_IDS)[keyof typeof RESOURCE_IDS];

export const RESOURCE_DEFINITIONS = [
  {
    id: RESOURCE_IDS.COINS,
    name: "Coins",
    description: "Soft currency earned through restoration and daily activities.",
    iconKey: "coin",
    rarity: "common" as const,
    isPremium: false,
  },
  {
    id: RESOURCE_IDS.HEARTS,
    name: "Hearts",
    description: "A measure of warmth and connection across the valley.",
    iconKey: "heart",
    rarity: "uncommon" as const,
    isPremium: false,
  },
  {
    id: RESOURCE_IDS.VALLEY_CHARM,
    name: "Valley Charm",
    description: "Rare essence gathered from restored places and special discoveries.",
    iconKey: "charm",
    rarity: "rare" as const,
    isPremium: false,
  },
] as const;

export const STARTER_RESOURCES = {
  [RESOURCE_IDS.COINS]: 100,
  [RESOURCE_IDS.HEARTS]: 5,
  [RESOURCE_IDS.VALLEY_CHARM]: 0,
} as const satisfies Record<CoreResourceId, number>;
