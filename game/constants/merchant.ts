import { RESOURCE_IDS } from "@/game/constants/resources";
import { SKILL_IDS } from "@/game/constants/skills";
import { createId, type MerchantStageDefinition, type MerchantStageId, type MerchantVisualState } from "@/types";

export const MERCHANT_STAGE_IDS = {
  MARKET_STAND: createId<"MerchantStageId">("market_stand"),
  VILLAGE_SHOP: createId<"MerchantStageId">("village_shop"),
  GENERAL_STORE: createId<"MerchantStageId">("general_store"),
} as const;

export const MERCHANT_STAGE_DEFINITIONS = [
  {
    id: MERCHANT_STAGE_IDS.MARKET_STAND,
    title: "Market Stand",
    description:
      "A humble wooden stall at the edge of the village square. Your first step toward bringing trade back to Hearthvale.",
    maxLevel: 3,
    sortOrder: 1,
    unlockRequirement: null,
    iconEmoji: "🧺",
    upgradeRequirements: [
      { level: 2, requiredResources: [{ resourceId: RESOURCE_IDS.COINS, amount: 40 }] },
      { level: 3, requiredResources: [{ resourceId: RESOURCE_IDS.COINS, amount: 80 }] },
    ],
    levelRewards: [
      {
        level: 2,
        rewards: [
          { type: "prosperity", amount: 5 },
          { type: "reputation", amount: 3 },
        ],
      },
      {
        level: 3,
        rewards: [
          { type: "prosperity", amount: 5 },
          { type: "reputation", amount: 3 },
        ],
      },
    ],
    visualStatesByLevel: {
      1: "humble_stall",
      2: "woven_awning",
      3: "lantern_stall",
    },
  },
  {
    id: MERCHANT_STAGE_IDS.VILLAGE_SHOP,
    title: "Village Shop",
    description:
      "A cozy corner shop with a proper awning and shelves. Villagers begin to trust your wares.",
    maxLevel: 5,
    sortOrder: 2,
    unlockRequirement: {
      kind: "merchant_stage",
      stageId: MERCHANT_STAGE_IDS.MARKET_STAND,
      minLevel: 3,
    },
    iconEmoji: "🏪",
    upgradeRequirements: [
      {
        level: 2,
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 120 },
          { resourceId: RESOURCE_IDS.HEARTS, amount: 2 },
        ],
      },
      {
        level: 3,
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 180 },
          { resourceId: RESOURCE_IDS.HEARTS, amount: 3 },
        ],
      },
      {
        level: 4,
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 240 },
          { resourceId: RESOURCE_IDS.HEARTS, amount: 4 },
        ],
      },
      {
        level: 5,
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 320 },
          { resourceId: RESOURCE_IDS.HEARTS, amount: 5 },
        ],
      },
    ],
    levelRewards: [
      {
        level: 2,
        rewards: [
          { type: "prosperity", amount: 10 },
          { type: "reputation", amount: 5 },
          { type: "skill_xp", skillId: SKILL_IDS.CHARM, amount: 15 },
        ],
      },
      {
        level: 3,
        rewards: [
          { type: "prosperity", amount: 10 },
          { type: "reputation", amount: 5 },
          { type: "skill_xp", skillId: SKILL_IDS.CHARM, amount: 15 },
        ],
      },
      {
        level: 4,
        rewards: [
          { type: "prosperity", amount: 10 },
          { type: "reputation", amount: 5 },
          { type: "skill_xp", skillId: SKILL_IDS.CHARM, amount: 15 },
        ],
      },
      {
        level: 5,
        rewards: [
          { type: "prosperity", amount: 10 },
          { type: "reputation", amount: 5 },
          { type: "skill_xp", skillId: SKILL_IDS.CHARM, amount: 15 },
        ],
      },
    ],
    visualStatesByLevel: {
      1: "cozy_shopfront",
      2: "flower_boxes",
      3: "village_corner",
      4: "wide_storefront",
      5: "river_sign",
    },
  },
  {
    id: MERCHANT_STAGE_IDS.GENERAL_STORE,
    title: "General Store",
    description:
      "The valley's trusted general store — a beacon of prosperity and a gathering place for travelers.",
    maxLevel: 5,
    sortOrder: 3,
    unlockRequirement: {
      kind: "merchant_stage",
      stageId: MERCHANT_STAGE_IDS.VILLAGE_SHOP,
      minLevel: 3,
    },
    iconEmoji: "🏬",
    upgradeRequirements: [
      {
        level: 2,
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 400 },
          { resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 1 },
        ],
      },
      {
        level: 3,
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 500 },
          { resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 2 },
        ],
      },
      {
        level: 4,
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 650 },
          { resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 3 },
        ],
      },
      {
        level: 5,
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 800 },
          { resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 4 },
        ],
      },
    ],
    levelRewards: [
      {
        level: 2,
        rewards: [
          { type: "prosperity", amount: 15 },
          { type: "reputation", amount: 10 },
          { type: "skill_xp", skillId: SKILL_IDS.CHARM, amount: 25 },
        ],
      },
      {
        level: 3,
        rewards: [
          { type: "prosperity", amount: 15 },
          { type: "reputation", amount: 10 },
          { type: "skill_xp", skillId: SKILL_IDS.CHARM, amount: 25 },
        ],
      },
      {
        level: 4,
        rewards: [
          { type: "prosperity", amount: 15 },
          { type: "reputation", amount: 10 },
          { type: "skill_xp", skillId: SKILL_IDS.CHARM, amount: 25 },
        ],
      },
      {
        level: 5,
        rewards: [
          { type: "prosperity", amount: 15 },
          { type: "reputation", amount: 10 },
          { type: "skill_xp", skillId: SKILL_IDS.CHARM, amount: 25 },
        ],
      },
    ],
    visualStatesByLevel: {
      1: "general_store",
      2: "general_store",
      3: "general_store",
      4: "general_store",
      5: "general_store",
    },
  },
] as const satisfies ReadonlyArray<MerchantStageDefinition>;

export function getMerchantStageDefinition(
  stageId: MerchantStageId,
): MerchantStageDefinition | undefined {
  return MERCHANT_STAGE_DEFINITIONS.find((entry) => entry.id === stageId);
}

export function isRegisteredMerchantStage(
  stageId: string,
): stageId is MerchantStageId {
  return MERCHANT_STAGE_DEFINITIONS.some((entry) => entry.id === stageId);
}

export function getMerchantStageVisualLabel(visualState: MerchantVisualState): string {
  const labels: Record<MerchantVisualState, string> = {
    humble_stall: "Humble Stall",
    woven_awning: "Woven Awning",
    lantern_stall: "Lantern Stall",
    cozy_shopfront: "Cozy Shopfront",
    flower_boxes: "Flower Boxes",
    village_corner: "Village Corner",
    wide_storefront: "Wide Storefront",
    river_sign: "River Sign",
    general_store: "General Store",
  };

  return labels[visualState];
}
