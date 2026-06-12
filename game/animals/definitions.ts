import {
  ANIMAL_SPECIES,
  TREAT_IDS,
  type AnimalDefinition,
  type AnimalSpeciesId,
} from "@/types";
import { QUEST_IDS } from "@/game/constants/quests";
import { REGION_IDS } from "@/game/constants/regions";
import { SKILL_IDS } from "@/game/constants/skills";

export { ANIMAL_SPECIES, TREAT_IDS, type AnimalSpeciesId };

export const ANIMAL_DEFINITIONS: Record<AnimalSpeciesId, AnimalDefinition> = {
  [ANIMAL_SPECIES.RABBIT]: {
    speciesId: ANIMAL_SPECIES.RABBIT,
    defaultName: "Clover",
    speciesLabel: "Rabbit",
    description:
      "Soft-footed and curious — often the first gentle soul to trust your hand.",
    displayEmoji: "🐰",
    personality: "gentle",
    preferredRegionId: REGION_IDS.SANCTUARY,
    sanctuaryRegionId: REGION_IDS.SANCTUARY,
    rarity: "common",
    favoriteTreatId: TREAT_IDS.CARROT,
    unlockRequirement: {
      kind: "quest_completed",
      questId: QUEST_IDS.MEET_THE_VALLEY,
    },
    sortOrder: 0,
  },
  [ANIMAL_SPECIES.DUCK]: {
    speciesId: ANIMAL_SPECIES.DUCK,
    defaultName: "Puddles",
    speciesLabel: "Duck",
    description:
      "Cheerful paddlers who brighten every puddle and golden-hour moment.",
    displayEmoji: "🦆",
    personality: "cheerful",
    preferredRegionId: REGION_IDS.DOCK,
    sanctuaryRegionId: REGION_IDS.SANCTUARY,
    rarity: "common",
    favoriteTreatId: TREAT_IDS.BREAD_CRUMB,
    unlockRequirement: {
      kind: "region_state",
      regionId: REGION_IDS.DOCK,
      state: "unlocked",
    },
    sortOrder: 1,
  },
  [ANIMAL_SPECIES.FOX]: {
    speciesId: ANIMAL_SPECIES.FOX,
    defaultName: "Ember",
    speciesLabel: "Fox",
    description:
      "Shy and clever, drawn to quiet forest edges and patient kindness.",
    displayEmoji: "🦊",
    personality: "shy",
    preferredRegionId: REGION_IDS.FOREST,
    sanctuaryRegionId: REGION_IDS.SANCTUARY,
    rarity: "uncommon",
    favoriteTreatId: TREAT_IDS.BERRIES,
    unlockRequirement: {
      kind: "skill_level",
      skillId: SKILL_IDS.ANIMAL_CARE,
      level: 2,
    },
    sortOrder: 2,
  },
};

export const ANIMAL_DEFINITION_LIST = Object.values(ANIMAL_DEFINITIONS).sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

export function getAnimalDefinition(
  speciesId: AnimalSpeciesId | string,
): AnimalDefinition | undefined {
  return ANIMAL_DEFINITIONS[speciesId as AnimalSpeciesId];
}

export function isRegisteredAnimalSpecies(
  speciesId: string,
): speciesId is AnimalSpeciesId {
  return speciesId in ANIMAL_DEFINITIONS;
}

export { isRegisteredAnimalSpeciesId } from "./validation";

export const ANIMAL_ACTION_REWARDS = {
  rescue: {
    happiness: 75,
    bondXp: 15,
    skillXp: 25,
  },
  feed: {
    happiness: 15,
    bondXp: 10,
    skillXp: 10,
  },
  bond: {
    happiness: 10,
    bondXp: 20,
    skillXp: 15,
  },
} as const;

export const TREAT_LABELS: Record<
  (typeof TREAT_IDS)[keyof typeof TREAT_IDS],
  string
> = {
  [TREAT_IDS.CARROT]: "Crunchy Carrot",
  [TREAT_IDS.BREAD_CRUMB]: "Dockside Crumb",
  [TREAT_IDS.BERRIES]: "Forest Berries",
};

/** Quest objectives incremented by animal care actions. */
export const ANIMAL_QUEST_OBJECTIVES = {
  RESCUE: { questId: QUEST_IDS.COZY_COMPANIONS, objectiveId: "rescue_companion" },
  FEED: { questId: QUEST_IDS.COZY_COMPANIONS, objectiveId: "feed_companion" },
  BOND: { questId: QUEST_IDS.COZY_COMPANIONS, objectiveId: "bond_companion" },
} as const;
