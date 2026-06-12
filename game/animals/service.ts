import { createId } from "@/types";
import { SKILL_IDS } from "@/game/constants/skills";
import type {
  Animal,
  AnimalActionResult,
  AnimalId,
  AnimalSpeciesId,
} from "@/types";
import type { AnimalEvaluationContext } from "./context";
import {
  ANIMAL_ACTION_REWARDS,
  ANIMAL_QUEST_OBJECTIVES,
  getAnimalDefinition,
  isRegisteredAnimalSpecies,
} from "./definitions";
import {
  applyBondXp,
  canBondWithAnimal,
  canFeedAnimal,
  canRescueSpecies,
  clampHappiness,
  deriveMoodFromHappiness,
  getAnimalCareBondBonus,
  getAllSpeciesIds,
  shouldRefreshSpeciesAvailability,
} from "./progression";
import { findOwnedAnimalBySpecies, markSpeciesAvailable } from "./state";

export interface AnimalServiceCallbacks {
  awardSkillXp: (skillId: typeof SKILL_IDS.ANIMAL_CARE, amount: number) => void;
  incrementQuestObjective: (
    questId: (typeof ANIMAL_QUEST_OBJECTIVES)[keyof typeof ANIMAL_QUEST_OBJECTIVES]["questId"],
    objectiveId: string,
  ) => void;
  onAnimalsChanged: () => void;
}

export interface AnimalService {
  refreshAnimalAvailability: () => void;
  rescueAnimal: (speciesId: AnimalSpeciesId) => AnimalActionResult | null;
  feedAnimal: (animalId: AnimalId) => AnimalActionResult | null;
  bondWithAnimal: (animalId: AnimalId) => AnimalActionResult | null;
  getAnimal: (animalId: AnimalId) => Animal | null;
}

type AnimalsReader = () => Record<string, Animal>;
type AnimalWriter = (
  animalId: AnimalId,
  updater: (current: Animal) => Animal,
) => void;
type AnimalCreator = (animal: Animal) => void;
type SpeciesWriter = (
  speciesId: AnimalSpeciesId,
  updater: (
    current: AnimalEvaluationContext["animalSpecies"][AnimalSpeciesId],
  ) => AnimalEvaluationContext["animalSpecies"][AnimalSpeciesId],
) => void;
type ContextReader = () => AnimalEvaluationContext;

export function createAnimalService(
  readAnimals: AnimalsReader,
  writeAnimal: AnimalWriter,
  createAnimal: AnimalCreator,
  writeSpecies: SpeciesWriter,
  readContext: ContextReader,
  callbacks: AnimalServiceCallbacks,
): AnimalService {
  function getAnimalOrNull(animalId: AnimalId): Animal | null {
    return readAnimals()[animalId] ?? null;
  }

  function awardAnimalCareXp(amount: number): number {
    if (amount <= 0) {
      return 0;
    }

    callbacks.awardSkillXp(SKILL_IDS.ANIMAL_CARE, amount);
    return amount;
  }

  function trackQuestProgress(
    action: keyof typeof ANIMAL_QUEST_OBJECTIVES,
  ): void {
    const link = ANIMAL_QUEST_OBJECTIVES[action];
    callbacks.incrementQuestObjective(link.questId, link.objectiveId);
  }

  function buildActionResult(
    animal: Animal,
    action: AnimalActionResult["action"],
    happinessDelta: number,
    bondXpDelta: number,
    skillXpAwarded: number,
  ): AnimalActionResult {
    return {
      animalId: animal.id,
      speciesId: animal.speciesId,
      action,
      happinessDelta,
      bondXpDelta,
      skillXpAwarded,
      bondLevel: animal.bondLevel,
      happiness: animal.happiness,
      mood: animal.mood,
    };
  }

  return {
    refreshAnimalAvailability() {
      const context = readContext();

      for (const speciesId of getAllSpeciesIds()) {
        if (!shouldRefreshSpeciesAvailability(context, speciesId)) {
          continue;
        }

        writeSpecies(speciesId, (current) =>
          markSpeciesAvailable(current),
        );
      }
    },

    rescueAnimal(speciesId) {
      if (!isRegisteredAnimalSpecies(speciesId)) {
        return null;
      }

      const definition = getAnimalDefinition(speciesId);
      const context = readContext();

      if (
        !definition ||
        !canRescueSpecies(context, speciesId) ||
        findOwnedAnimalBySpecies(readAnimals(), speciesId)
      ) {
        return null;
      }

      const now = new Date().toISOString();
      const rewards = ANIMAL_ACTION_REWARDS.rescue;
      const animalId = createId<"AnimalId">(
        `${speciesId}_${Date.now().toString(36)}`,
      );

      const animal: Animal = {
        id: animalId,
        speciesId,
        name: definition.defaultName,
        personality: definition.personality,
        happiness: clampHappiness(rewards.happiness),
        mood: deriveMoodFromHappiness(rewards.happiness),
        bondLevel: 1,
        bondXp: rewards.bondXp,
        homeRegionId: definition.sanctuaryRegionId,
        habitatId: null,
        acquiredAt: now,
        lastInteractionAt: now,
        lastFedAt: null,
      };

      createAnimal(animal);

      writeSpecies(speciesId, (current) => markSpeciesAvailable(current, now));

      const skillXpAwarded = awardAnimalCareXp(rewards.skillXp);
      trackQuestProgress("RESCUE");
      callbacks.onAnimalsChanged();

      return buildActionResult(
        animal,
        "rescue",
        rewards.happiness,
        rewards.bondXp,
        skillXpAwarded,
      );
    },

    feedAnimal(animalId) {
      const animal = getAnimalOrNull(animalId);

      if (!animal || !canFeedAnimal(animal)) {
        return null;
      }

      const rewards = ANIMAL_ACTION_REWARDS.feed;
      const bondBonus = getAnimalCareBondBonus(readContext());
      const now = new Date().toISOString();
      let updatedAnimal: Animal | null = null;

      writeAnimal(animalId, (current) => {
        const nextHappiness = clampHappiness(
          current.happiness + rewards.happiness,
        );
        const bondUpdate = applyBondXp(current, rewards.bondXp, bondBonus);

        updatedAnimal = {
          ...current,
          happiness: nextHappiness,
          mood: deriveMoodFromHappiness(nextHappiness),
          ...bondUpdate,
          lastInteractionAt: now,
          lastFedAt: now,
        };

        return updatedAnimal;
      });

      if (!updatedAnimal) {
        return null;
      }

      const skillXpAwarded = awardAnimalCareXp(rewards.skillXp);
      trackQuestProgress("FEED");
      callbacks.onAnimalsChanged();

      return buildActionResult(
        updatedAnimal,
        "feed",
        rewards.happiness,
        rewards.bondXp,
        skillXpAwarded,
      );
    },

    bondWithAnimal(animalId) {
      const animal = getAnimalOrNull(animalId);

      if (!animal || !canBondWithAnimal(animal)) {
        return null;
      }

      const rewards = ANIMAL_ACTION_REWARDS.bond;
      const bondBonus = getAnimalCareBondBonus(readContext());
      const now = new Date().toISOString();
      let updatedAnimal: Animal | null = null;

      writeAnimal(animalId, (current) => {
        const nextHappiness = clampHappiness(
          current.happiness + rewards.happiness,
        );
        const bondUpdate = applyBondXp(current, rewards.bondXp, bondBonus);

        updatedAnimal = {
          ...current,
          happiness: nextHappiness,
          mood: deriveMoodFromHappiness(nextHappiness),
          ...bondUpdate,
          lastInteractionAt: now,
        };

        return updatedAnimal;
      });

      if (!updatedAnimal) {
        return null;
      }

      const skillXpAwarded = awardAnimalCareXp(rewards.skillXp);
      trackQuestProgress("BOND");
      callbacks.onAnimalsChanged();

      return buildActionResult(
        updatedAnimal,
        "bond",
        rewards.happiness,
        rewards.bondXp,
        skillXpAwarded,
      );
    },

    getAnimal(animalId) {
      return getAnimalOrNull(animalId);
    },
  };
}

export function unlockAnimalSpecies(
  speciesId: AnimalSpeciesId,
  writeSpecies: SpeciesWriter,
): void {
  if (!isRegisteredAnimalSpecies(speciesId)) {
    return;
  }

  writeSpecies(speciesId, (current) => markSpeciesAvailable(current));
}
