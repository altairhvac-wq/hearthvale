import { createId, type QuestDefinition, type QuestId } from "@/types";
import { REGION_IDS } from "./regions";
import { RESOURCE_IDS } from "./resources";
import { SKILL_IDS } from "./skills";

export const QUEST_IDS = {
  WELCOME_TO_HEARTHVALE: createId<"QuestId">("welcome_to_hearthvale"),
  MEET_THE_VALLEY: createId<"QuestId">("meet_the_valley"),
  RESTORE_THE_SANCTUARY: createId<"QuestId">("restore_the_sanctuary"),
  GATHER_SUPPLIES: createId<"QuestId">("gather_supplies"),
  COZY_COMPANIONS: createId<"QuestId">("cozy_companions"),
} as const;

export type CoreQuestId = (typeof QUEST_IDS)[keyof typeof QUEST_IDS];

export const QUEST_DEFINITIONS = [
  {
    id: QUEST_IDS.WELCOME_TO_HEARTHVALE,
    title: "Welcome To Hearthvale",
    description: "Begin your journey in the valley.",
    category: "story",
    visibility: "visible",
    regionId: REGION_IDS.VALLEY,
    requiredRestorationLevel: 1,
    prerequisiteQuestIds: [],
    sortOrder: 0,
    objectives: [
      {
        id: "begin_journey",
        kind: "manual",
        description: "Take your first steps in the valley",
        target: 1,
      },
    ],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 100 },
    ],
  },
  {
    id: QUEST_IDS.MEET_THE_VALLEY,
    title: "Meet The Valley",
    description: "Visit the major landmarks of the valley.",
    category: "exploration",
    visibility: "visible",
    regionId: REGION_IDS.VALLEY,
    requiredRestorationLevel: 1,
    prerequisiteQuestIds: [QUEST_IDS.WELCOME_TO_HEARTHVALE],
    sortOrder: 1,
    objectives: [
      {
        id: "visit_valley",
        kind: "visit_region",
        regionId: REGION_IDS.VALLEY,
        description: "Explore the Valley meadow",
        target: 1,
      },
      {
        id: "visit_sanctuary",
        kind: "visit_region",
        regionId: REGION_IDS.SANCTUARY,
        description: "Discover the Animal Sanctuary",
        target: 1,
      },
      {
        id: "visit_dock",
        kind: "visit_region",
        regionId: REGION_IDS.DOCK,
        description: "Walk the weathered Dock",
        target: 1,
      },
      {
        id: "visit_forest",
        kind: "visit_region",
        regionId: REGION_IDS.FOREST,
        description: "Wander the Forest Path",
        target: 1,
      },
    ],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 50 },
    ],
  },
  {
    id: QUEST_IDS.RESTORE_THE_SANCTUARY,
    title: "Restore The Sanctuary",
    description: "Help bring life back to the sanctuary.",
    category: "restoration",
    visibility: "visible",
    regionId: REGION_IDS.SANCTUARY,
    requiredRestorationLevel: 1,
    prerequisiteQuestIds: [QUEST_IDS.MEET_THE_VALLEY],
    sortOrder: 2,
    objectives: [
      {
        id: "restore_sanctuary",
        kind: "restore_region",
        regionId: REGION_IDS.SANCTUARY,
        description: "Restore the sanctuary to 25% vitality",
        target: 25,
      },
    ],
    rewards: [
      {
        type: "unlock",
        unlock: { kind: "region", regionId: REGION_IDS.SANCTUARY },
      },
    ],
  },
  {
    id: QUEST_IDS.GATHER_SUPPLIES,
    title: "Gather Supplies",
    description: "Collect resources needed for restoration.",
    category: "collection",
    visibility: "visible",
    regionId: REGION_IDS.VALLEY,
    requiredRestorationLevel: 1,
    prerequisiteQuestIds: [QUEST_IDS.WELCOME_TO_HEARTHVALE],
    sortOrder: 3,
    objectives: [
      {
        id: "gather_resources",
        kind: "manual",
        description: "Gather restoration supplies",
        target: 5,
      },
    ],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 1 },
    ],
  },
  {
    id: QUEST_IDS.COZY_COMPANIONS,
    title: "Cozy Companions",
    description:
      "Rescue a gentle soul, share a treat, and earn a moment of trust.",
    category: "friendship",
    visibility: "visible",
    regionId: REGION_IDS.SANCTUARY,
    requiredRestorationLevel: 1,
    prerequisiteQuestIds: [QUEST_IDS.MEET_THE_VALLEY],
    sortOrder: 4,
    objectives: [
      {
        id: "rescue_companion",
        kind: "manual",
        description: "Rescue your first sanctuary companion",
        target: 1,
      },
      {
        id: "feed_companion",
        kind: "manual",
        description: "Share a favorite treat",
        target: 1,
      },
      {
        id: "bond_companion",
        kind: "manual",
        description: "Spend a quiet bonding moment together",
        target: 1,
      },
    ],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 25 },
      {
        type: "skill_xp",
        skillId: SKILL_IDS.ANIMAL_CARE,
        amount: 50,
      },
    ],
  },
] as const satisfies ReadonlyArray<QuestDefinition>;

export function getQuestDefinition(
  questId: QuestId | string,
): QuestDefinition | undefined {
  return QUEST_DEFINITIONS.find((entry) => entry.id === questId);
}

export function isRegisteredQuest(questId: string): questId is CoreQuestId {
  return QUEST_DEFINITIONS.some((entry) => entry.id === questId);
}
