import type { AnimalId, RegionId } from "./ids";
import type { Rarity } from "./rarity";

export const ANIMAL_SPECIES = {
  RABBIT: "rabbit",
  DUCK: "duck",
  FOX: "fox",
} as const;

export type AnimalSpeciesId =
  (typeof ANIMAL_SPECIES)[keyof typeof ANIMAL_SPECIES];

export type AnimalMood = "content" | "happy" | "lonely" | "hungry" | "resting";

export interface AnimalDefinition {
  speciesId: AnimalSpeciesId;
  name: string;
  description: string;
  preferredRegionId: RegionId;
  rarity: Rarity;
  unlockLevel: number;
}

export interface Animal {
  id: AnimalId;
  speciesId: AnimalSpeciesId;
  name: string;
  mood: AnimalMood;
  bondLevel: number;
  bondXp: number;
  homeRegionId: RegionId;
  acquiredAt: string;
  lastInteractionAt: string | null;
}
