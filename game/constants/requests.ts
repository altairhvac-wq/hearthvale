import { RESOURCE_IDS } from "@/game/constants/resources";
import { SKILL_IDS } from "@/game/constants/skills";
import { ITEM_IDS } from "@/game/constants/items";
import { MERCHANT_STAGE_IDS } from "@/game/constants/merchant";
import {
  createId,
  type CustomerRequestDefinition,
  type CustomerRequestId,
} from "@/types";

export const CUSTOMER_REQUEST_IDS = {
  WILDFLOWERS: createId<"CustomerRequestId">("wildflowers"),
  BERRIES: createId<"CustomerRequestId">("berries"),
  FISH: createId<"CustomerRequestId">("fish"),
} as const;

export const REQUEST_PLACEHOLDER_RESOURCES = {
  WILDFLOWERS: "placeholder_wildflowers",
  BERRIES: "placeholder_berries",
  FISH: "placeholder_fish",
} as const;

export type RequestPlaceholderResourceId =
  (typeof REQUEST_PLACEHOLDER_RESOURCES)[keyof typeof REQUEST_PLACEHOLDER_RESOURCES];

export const CUSTOMER_REQUEST_DEFINITIONS = [
  {
    id: CUSTOMER_REQUEST_IDS.WILDFLOWERS,
    title: "Wildflower Bouquet",
    description: "A villager wants fresh wildflowers to brighten their windowsill.",
    category: "foraging",
    customerName: "Elena",
    unlockRequirement: null,
    requiredResources: [
      {
        placeholderId: REQUEST_PLACEHOLDER_RESOURCES.WILDFLOWERS,
        label: "Wildflowers",
        amount: 3,
        itemId: ITEM_IDS.WILDFLOWERS,
      },
    ],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 25 },
      { type: "prosperity", amount: 5 },
    ],
    sortOrder: 1,
  },
  {
    id: CUSTOMER_REQUEST_IDS.BERRIES,
    title: "Berry Basket",
    description: "The baker needs ripe berries for tomorrow's tarts.",
    category: "foraging",
    customerName: "Milo",
    unlockRequirement: {
      kind: "merchant_stage",
      stageId: MERCHANT_STAGE_IDS.MARKET_STAND,
      minLevel: 2,
    },
    requiredResources: [
      {
        placeholderId: REQUEST_PLACEHOLDER_RESOURCES.BERRIES,
        label: "Berries",
        amount: 5,
        itemId: ITEM_IDS.BERRIES,
      },
    ],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 35 },
      { type: "skill_xp", skillId: SKILL_IDS.FORAGING, amount: 20 },
      { type: "reputation", amount: 5 },
    ],
    sortOrder: 2,
  },
  {
    id: CUSTOMER_REQUEST_IDS.FISH,
    title: "Fresh Catch",
    description: "A traveler craves grilled fish before the evening ferry departs.",
    category: "fishing",
    customerName: "Rowan",
    unlockRequirement: {
      kind: "merchant_stage",
      stageId: MERCHANT_STAGE_IDS.MARKET_STAND,
      minLevel: 2,
    },
    requiredResources: [
      {
        placeholderId: REQUEST_PLACEHOLDER_RESOURCES.FISH,
        label: "Fish",
        amount: 2,
        itemId: ITEM_IDS.RIVER_FISH,
      },
    ],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 45 },
      { type: "skill_xp", skillId: SKILL_IDS.FISHING, amount: 25 },
      { type: "reputation", amount: 8 },
      { type: "prosperity", amount: 3 },
    ],
    sortOrder: 3,
  },
] as const satisfies ReadonlyArray<CustomerRequestDefinition>;

export function getCustomerRequestDefinition(
  requestId: CustomerRequestId,
): CustomerRequestDefinition | undefined {
  return CUSTOMER_REQUEST_DEFINITIONS.find((entry) => entry.id === requestId);
}

export function isRegisteredCustomerRequest(
  requestId: string,
): requestId is CustomerRequestId {
  return CUSTOMER_REQUEST_DEFINITIONS.some((entry) => entry.id === requestId);
}
