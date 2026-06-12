import { createId, type QuestDefinition } from "@/types";
import { ANIMAL_SPECIES } from "@/types";
import { REGION_IDS } from "./regions";
import { RESOURCE_IDS } from "./resources";
import { SKILL_IDS } from "./skills";

export const QUEST_IDS = {
  WELCOME_TO_VALLEY: createId<"QuestId">("welcome_to_valley"),
  FIRST_RESTORATION: createId<"QuestId">("first_restoration"),
  MEET_THE_RABBIT: createId<"QuestId">("meet_the_rabbit"),
} as const;

export type CoreQuestId = (typeof QUEST_IDS)[keyof typeof QUEST_IDS];

export const QUEST_DEFINITIONS = [
  {
    id: QUEST_IDS.WELCOME_TO_VALLEY,
    title: "Welcome to the Valley",
    description:
      "Take your first steps in Hearthvale and learn the rhythm of restoration.",
    regionId: REGION_IDS.VALLEY,
    requiredRestorationLevel: 1,
    prerequisiteQuestIds: [],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 25 },
      { type: "skill_xp", skillId: SKILL_IDS.EXPLORATION, amount: 50 },
    ],
  },
  {
    id: QUEST_IDS.FIRST_RESTORATION,
    title: "First Restoration",
    description: "Begin restoring a forgotten corner of the valley.",
    regionId: REGION_IDS.VALLEY,
    requiredRestorationLevel: 1,
    prerequisiteQuestIds: [QUEST_IDS.WELCOME_TO_VALLEY],
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 3 },
      { type: "skill_xp", skillId: SKILL_IDS.RESTORATION, amount: 75 },
    ],
  },
  {
    id: QUEST_IDS.MEET_THE_RABBIT,
    title: "A Shy Visitor",
    description: "A rabbit has appeared near the sanctuary path.",
    regionId: REGION_IDS.SANCTUARY,
    requiredRestorationLevel: 1,
    prerequisiteQuestIds: [QUEST_IDS.WELCOME_TO_VALLEY],
    rewards: [
      {
        type: "unlock",
        unlock: { kind: "animal", speciesId: ANIMAL_SPECIES.RABBIT },
      },
      { type: "skill_xp", skillId: SKILL_IDS.ANIMAL_CARE, amount: 40 },
    ],
  },
] as const satisfies ReadonlyArray<QuestDefinition>;
