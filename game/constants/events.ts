import { createId, type EventDefinition, type EventId } from "@/types";
import { QUEST_IDS } from "./quests";
import { REGION_IDS } from "./regions";
import { RESOURCE_IDS } from "./resources";
import { SKILL_IDS } from "./skills";

export const EVENT_IDS = {
  FESTIVAL_CART_ARRIVAL: createId<"EventId">("festival_cart_arrival"),
  LOST_RABBIT_SIGHTING: createId<"EventId">("lost_rabbit_sighting"),
  CURIOUS_MERCHANT: createId<"EventId">("curious_merchant"),
  STRANGE_LIGHTS: createId<"EventId">("strange_lights"),
} as const;

export type CoreEventId = (typeof EVENT_IDS)[keyof typeof EVENT_IDS];

export const EVENT_SCHEDULER_DEFAULTS = {
  /** Evaluations between Festival Cart appearances after an event is completed. */
  CART_COOLDOWN_EVALUATIONS: 3,
  /** Chance the cart arrives when off cooldown and no event is featured. */
  CART_ARRIVAL_CHANCE: 0.65,
} as const;

const RARITY_WEIGHT_MULTIPLIERS = {
  common: 1,
  uncommon: 0.75,
  rare: 0.5,
  epic: 0.3,
  legendary: 0.15,
  mythic: 0.05,
} as const;

export function getEventRarityWeightMultiplier(
  rarity: EventDefinition["rarity"],
): number {
  return RARITY_WEIGHT_MULTIPLIERS[rarity];
}

export const EVENT_DEFINITIONS = [
  {
    id: EVENT_IDS.FESTIVAL_CART_ARRIVAL,
    title: "Festival Cart Arrival",
    description:
      "A colorful traveling cart has arrived in Hearthvale, bells tinkling and banners fluttering in the breeze.",
    category: "festival",
    rarity: "uncommon",
    regionId: REGION_IDS.VALLEY,
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 75 },
      { type: "resource", resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 1 },
    ],
    bonusRewardDescriptions: [],
    availability: {
      gates: [
        { kind: "quest_completed", questId: QUEST_IDS.WELCOME_TO_HEARTHVALE },
      ],
      cooldownEvaluations: 5,
      selectionWeight: 1.2,
      minEvaluationCount: 1,
      seasonId: null,
    },
    sortOrder: 0,
    metadata: {
      cart_featured: true,
    },
  },
  {
    id: EVENT_IDS.LOST_RABBIT_SIGHTING,
    title: "Lost Rabbit Sighting",
    description:
      "A frightened rabbit was spotted near the forest path, ears twitching at every rustle.",
    category: "animal_encounter",
    rarity: "common",
    regionId: REGION_IDS.FOREST,
    rewards: [
      { type: "skill_xp", skillId: SKILL_IDS.ANIMAL_CARE, amount: 40 },
      { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 3 },
    ],
    bonusRewardDescriptions: [],
    availability: {
      gates: [
        { kind: "quest_completed", questId: QUEST_IDS.MEET_THE_VALLEY },
      ],
      cooldownEvaluations: 4,
      selectionWeight: 1.5,
      minEvaluationCount: 2,
      seasonId: null,
    },
    sortOrder: 1,
    metadata: {
      animal_species: "rabbit",
    },
  },
  {
    id: EVENT_IDS.CURIOUS_MERCHANT,
    title: "Curious Merchant",
    description:
      "A wandering merchant is visiting the valley with trinkets and tales from distant roads.",
    category: "merchant",
    rarity: "uncommon",
    regionId: REGION_IDS.VALLEY,
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 50 },
    ],
    bonusRewardDescriptions: ["Merchant reputation (coming soon)"],
    availability: {
      gates: [
        { kind: "quest_completed", questId: QUEST_IDS.WELCOME_TO_HEARTHVALE },
      ],
      cooldownEvaluations: 6,
      selectionWeight: 1,
      minEvaluationCount: 2,
      seasonId: null,
    },
    sortOrder: 2,
    metadata: {
      merchant_tier: 1,
    },
  },
  {
    id: EVENT_IDS.STRANGE_LIGHTS,
    title: "Strange Lights",
    description:
      "Mysterious lights appeared near the dock last night, dancing above the water like fireflies.",
    category: "discovery",
    rarity: "rare",
    regionId: REGION_IDS.DOCK,
    rewards: [
      { type: "skill_xp", skillId: SKILL_IDS.EXPLORATION, amount: 55 },
    ],
    bonusRewardDescriptions: ["Story progression hook (coming soon)"],
    availability: {
      gates: [
        { kind: "region_state", regionId: REGION_IDS.DOCK, state: "unlocked" },
      ],
      cooldownEvaluations: 8,
      selectionWeight: 0.8,
      minEvaluationCount: 3,
      seasonId: null,
    },
    sortOrder: 3,
    metadata: {
      story_hook: "dock_lights",
    },
  },
] as const satisfies ReadonlyArray<EventDefinition>;

export function isRegisteredEvent(eventId: string): eventId is EventId {
  return EVENT_DEFINITIONS.some((definition) => definition.id === eventId);
}

export function getEventDefinition(eventId: EventId): EventDefinition | null {
  return (
    EVENT_DEFINITIONS.find((definition) => definition.id === eventId) ?? null
  );
}
