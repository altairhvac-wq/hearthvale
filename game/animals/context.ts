import type { UnlockEvaluationContext } from "@/game/unlock/context";
import type { Animal, AnimalSpeciesId, AnimalSpeciesProgress } from "@/types";

export interface AnimalEvaluationContext extends UnlockEvaluationContext {
  animals: Record<string, Animal>;
  animalSpecies: Record<AnimalSpeciesId, AnimalSpeciesProgress>;
}

export type AnimalContextSource = UnlockEvaluationContext & {
  animals: Record<string, Animal>;
  animalSpecies: Record<AnimalSpeciesId, AnimalSpeciesProgress>;
};

export type AnimalContextSlice = AnimalContextSource;

export function buildAnimalEvaluationContext(
  source: AnimalContextSource,
): AnimalEvaluationContext {
  return {
    quests: source.quests,
    skills: source.skills,
    regions: source.regions,
    restoration: source.restoration,
    getSkillLevel: source.getSkillLevel,
    animals: source.animals,
    animalSpecies: source.animalSpecies,
  };
}

export function buildAnimalContextFromGameState(
  state: AnimalContextSlice,
): AnimalEvaluationContext {
  return buildAnimalEvaluationContext(state);
}
