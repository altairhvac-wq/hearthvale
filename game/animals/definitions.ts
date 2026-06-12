import { ANIMAL_SPECIES, type AnimalSpeciesId } from "@/types";
import { REGION_IDS } from "@/game/constants/regions";
import type { AnimalDefinition } from "@/types";

export { ANIMAL_SPECIES, type AnimalSpeciesId };

export const ANIMAL_DEFINITIONS: Record<AnimalSpeciesId, AnimalDefinition> = {
  [ANIMAL_SPECIES.RABBIT]: {
    speciesId: ANIMAL_SPECIES.RABBIT,
    name: "Rabbit",
    description: "Soft-footed and curious — often the first friend you meet.",
    preferredRegionId: REGION_IDS.SANCTUARY,
    rarity: "common",
    unlockLevel: 1,
  },
  [ANIMAL_SPECIES.DUCK]: {
    speciesId: ANIMAL_SPECIES.DUCK,
    name: "Duck",
    description: "Cheerful paddlers who love the dock at golden hour.",
    preferredRegionId: REGION_IDS.DOCK,
    rarity: "common",
    unlockLevel: 1,
  },
  [ANIMAL_SPECIES.FOX]: {
    speciesId: ANIMAL_SPECIES.FOX,
    name: "Fox",
    description: "Shy and clever, drawn to quiet forest edges.",
    preferredRegionId: REGION_IDS.FOREST,
    rarity: "uncommon",
    unlockLevel: 1,
  },
};

export function createInitialAnimalsState(): Record<string, never> {
  return {};
}
