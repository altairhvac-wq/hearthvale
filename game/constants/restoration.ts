import { createId, type RestorationProjectDefinition, type RestorationProjectId } from "@/types";
import { QUEST_IDS } from "./quests";
import { REGION_IDS } from "./regions";
import { RESOURCE_IDS } from "./resources";
import { SKILL_IDS } from "./skills";

export const RESTORATION_PROJECT_IDS = {
  ANIMAL_SANCTUARY: createId<"RestorationProjectId">("animal_sanctuary"),
} as const;

export type CoreRestorationProjectId =
  (typeof RESTORATION_PROJECT_IDS)[keyof typeof RESTORATION_PROJECT_IDS];

export const RESTORATION_DEFINITIONS = [
  {
    id: RESTORATION_PROJECT_IDS.ANIMAL_SANCTUARY,
    regionId: REGION_IDS.SANCTUARY,
    title: "Animal Sanctuary",
    description:
      "Bring warmth back to this quiet refuge where animals once gathered.",
    sortOrder: 0,
    unlockRequirement: {
      kind: "quest_completed",
      questId: QUEST_IDS.MEET_THE_VALLEY,
    },
    linkedQuestIds: [
      {
        questId: QUEST_IDS.RESTORE_THE_SANCTUARY,
        startOnProjectStart: true,
      },
    ],
    stages: [
      {
        id: "clear_the_gate",
        label: "Clear the Gate",
        description:
          "Sweep fallen branches and reopen the sanctuary entrance.",
        requiredResources: [{ resourceId: RESOURCE_IDS.COINS, amount: 25 }],
        completionBonusXp: 50,
      },
      {
        id: "mend_the_fence",
        label: "Mend the Fence",
        description:
          "Repair weathered fences so visitors can wander safely.",
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 40 },
          { resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 1 },
        ],
        completionBonusXp: 75,
      },
      {
        id: "prepare_the_nests",
        label: "Prepare the Nests",
        description: "Line sleeping nooks with soft hay and gentle care.",
        requiredResources: [{ resourceId: RESOURCE_IDS.COINS, amount: 50 }],
        completionBonusXp: 100,
      },
      {
        id: "welcome_the_animals",
        label: "Welcome the Animals",
        description: "Hang the welcome wreath and open the sanctuary fully.",
        requiredResources: [
          { resourceId: RESOURCE_IDS.COINS, amount: 30 },
          { resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 1 },
        ],
        completionBonusXp: 150,
      },
    ],
    completionRewards: [
      {
        type: "skill_xp",
        skillId: SKILL_IDS.RESTORATION,
        amount: 200,
      },
      {
        type: "resource",
        resourceId: RESOURCE_IDS.VALLEY_CHARM,
        amount: 2,
      },
      {
        type: "unlock",
        unlock: { kind: "region", regionId: REGION_IDS.SANCTUARY },
      },
    ],
  },
] as const satisfies ReadonlyArray<RestorationProjectDefinition>;

export function getRestorationDefinition(
  projectId: RestorationProjectId | string,
): RestorationProjectDefinition | undefined {
  return RESTORATION_DEFINITIONS.find((entry) => entry.id === projectId);
}

export function isRegisteredRestorationProject(
  projectId: string,
): projectId is CoreRestorationProjectId {
  return RESTORATION_DEFINITIONS.some((entry) => entry.id === projectId);
}

export function getRestorationProjectsForRegion(
  regionId: string,
): RestorationProjectDefinition[] {
  return RESTORATION_DEFINITIONS.filter((entry) => entry.regionId === regionId);
}
