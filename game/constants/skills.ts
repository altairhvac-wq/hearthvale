import { createId, type SkillDefinition } from "@/types";

export const SKILL_IDS = {
  GARDENING: createId<"SkillId">("gardening"),
  FORAGING: createId<"SkillId">("foraging"),
  ANIMAL_CARE: createId<"SkillId">("animal_care"),
  CRAFTING: createId<"SkillId">("crafting"),
  COOKING: createId<"SkillId">("cooking"),
  FISHING: createId<"SkillId">("fishing"),
  EXPLORATION: createId<"SkillId">("exploration"),
  CHARM: createId<"SkillId">("charm"),
  FRIENDSHIP: createId<"SkillId">("friendship"),
  RESTORATION: createId<"SkillId">("restoration"),
} as const;

export type CoreSkillId = (typeof SKILL_IDS)[keyof typeof SKILL_IDS];

export const MAX_SKILL_LEVEL = 99;

export const SKILL_DEFINITIONS = {
  [SKILL_IDS.GARDENING]: {
    id: SKILL_IDS.GARDENING,
    name: "Gardening",
    description: "Tend plots, nurture growth, and coax life back into the soil.",
    iconKey: "gardening",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("gardening_lv5_seed_pouch"),
        skillId: SKILL_IDS.GARDENING,
        level: 5,
        title: "Seed Pouch",
        description: "Carry more seed varieties while exploring.",
        perks: [
          {
            id: "gardening_yield_5",
            type: "yield_bonus",
            value: 0.05,
            description: "+5% harvest yield.",
          },
        ],
      },
      {
        id: createId<"UnlockId">("gardening_lv15_greenhouse"),
        skillId: SKILL_IDS.GARDENING,
        level: 15,
        title: "Greenhouse Access",
        description: "Unlock greenhouse restoration projects.",
        perks: [
          {
            id: "gardening_speed_15",
            type: "speed_bonus",
            value: 0.1,
            description: "10% faster plot growth.",
          },
        ],
      },
    ],
  },
  [SKILL_IDS.FORAGING]: {
    id: SKILL_IDS.FORAGING,
    name: "Foraging",
    description: "Find hidden herbs, berries, and forest treasures.",
    iconKey: "foraging",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("foraging_lv5_basket"),
        skillId: SKILL_IDS.FORAGING,
        level: 5,
        title: "Woven Basket",
        description: "Gather one extra forage item per trip.",
        perks: [
          {
            id: "foraging_yield_5",
            type: "yield_bonus",
            value: 0.05,
            description: "+5% forage finds.",
          },
        ],
      },
    ],
  },
  [SKILL_IDS.ANIMAL_CARE]: {
    id: SKILL_IDS.ANIMAL_CARE,
    name: "Animal Care",
    description: "Build trust with creatures and care for the sanctuary.",
    iconKey: "animal_care",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("animal_care_lv5_bond_boost"),
        skillId: SKILL_IDS.ANIMAL_CARE,
        level: 5,
        title: "Gentle Touch",
        description: "Bond with animals slightly faster.",
        perks: [
          {
            id: "animal_bond_5",
            type: "bond_bonus",
            value: 0.1,
            description: "+10% bond XP from interactions.",
          },
        ],
      },
    ],
  },
  [SKILL_IDS.CRAFTING]: {
    id: SKILL_IDS.CRAFTING,
    name: "Crafting",
    description: "Shape materials into tools, decor, and restoration pieces.",
    iconKey: "crafting",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("crafting_lv10_workbench"),
        skillId: SKILL_IDS.CRAFTING,
        level: 10,
        title: "Workbench Recipes",
        description: "Access intermediate crafting recipes.",
        perks: [
          {
            id: "crafting_efficiency_10",
            type: "craft_efficiency",
            value: 0.05,
            description: "5% fewer materials per craft.",
          },
        ],
      },
    ],
  },
  [SKILL_IDS.COOKING]: {
    id: SKILL_IDS.COOKING,
    name: "Cooking",
    description: "Prepare cozy meals that warm hearts and boost morale.",
    iconKey: "cooking",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("cooking_lv8_recipes"),
        skillId: SKILL_IDS.COOKING,
        level: 8,
        title: "Hearty Recipes",
        description: "Unlock comfort food recipes.",
        perks: [],
      },
    ],
  },
  [SKILL_IDS.FISHING]: {
    id: SKILL_IDS.FISHING,
    name: "Fishing",
    description: "Patient casts and quiet waters reveal hidden catches.",
    iconKey: "fishing",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("fishing_lv5_rod"),
        skillId: SKILL_IDS.FISHING,
        level: 5,
        title: "Sturdy Rod",
        description: "Improved catch rates at the dock.",
        perks: [
          {
            id: "fishing_yield_5",
            type: "yield_bonus",
            value: 0.05,
            description: "+5% rare catch chance.",
          },
        ],
      },
    ],
  },
  [SKILL_IDS.EXPLORATION]: {
    id: SKILL_IDS.EXPLORATION,
    name: "Exploration",
    description: "Venture beyond familiar paths and uncover the world's secrets.",
    iconKey: "exploration",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("exploration_lv5_trail_map"),
        skillId: SKILL_IDS.EXPLORATION,
        level: 5,
        title: "Trail Map",
        description: "Reveal nearby discoverable locations.",
        perks: [
          {
            id: "exploration_discovery_5",
            type: "discovery_bonus",
            value: 0.1,
            description: "+10% discovery progress.",
          },
        ],
      },
    ],
  },
  [SKILL_IDS.CHARM]: {
    id: SKILL_IDS.CHARM,
    name: "Charm",
    description: "Spread warmth through gestures, gifts, and valley spirit.",
    iconKey: "charm",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("charm_lv7_gift_wrap"),
        skillId: SKILL_IDS.CHARM,
        level: 7,
        title: "Gift Wrap",
        description: "Give gifts with a little extra delight.",
        perks: [],
      },
    ],
  },
  [SKILL_IDS.FRIENDSHIP]: {
    id: SKILL_IDS.FRIENDSHIP,
    name: "Friendship",
    description: "Deepen bonds with villagers and fellow wanderers.",
    iconKey: "friendship",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("friendship_lv10_stories"),
        skillId: SKILL_IDS.FRIENDSHIP,
        level: 10,
        title: "Shared Stories",
        description: "Unlock personal story quests with NPCs.",
        perks: [],
      },
    ],
  },
  [SKILL_IDS.RESTORATION]: {
    id: SKILL_IDS.RESTORATION,
    name: "Restoration",
    description: "The heart of Hearthvale — rebuild, renew, and revive the land.",
    iconKey: "restoration",
    maxLevel: MAX_SKILL_LEVEL,
    unlocks: [
      {
        id: createId<"UnlockId">("restoration_lv5_blueprints"),
        skillId: SKILL_IDS.RESTORATION,
        level: 5,
        title: "Basic Blueprints",
        description: "Access tier-one restoration projects.",
        perks: [
          {
            id: "restoration_efficiency_5",
            type: "craft_efficiency",
            value: 0.05,
            description: "5% fewer resources per restoration stage.",
          },
        ],
      },
      {
        id: createId<"UnlockId">("restoration_lv20_master_plans"),
        skillId: SKILL_IDS.RESTORATION,
        level: 20,
        title: "Master Plans",
        description: "Unlock major regional restoration milestones.",
        perks: [
          {
            id: "restoration_gate_20",
            type: "unlock_gate",
            value: 1,
            description: "Enables advanced restoration projects.",
          },
        ],
      },
    ],
  },
} satisfies Record<CoreSkillId, SkillDefinition>;

export const ALL_SKILL_IDS = Object.values(SKILL_IDS);
