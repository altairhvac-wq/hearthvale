import { buildAnimalContextFromGameState } from "@/game/animals/context";
import {
  createAnimalService,
  unlockAnimalSpecies,
} from "@/game/animals/service";
import { findOwnedAnimalBySpecies, markSpeciesAvailable } from "@/game/animals/state";
import type { AnimalEvaluationContext } from "@/game/animals/context";
import type {
  Animal,
  AnimalActionResult,
  AnimalId,
  AnimalSpeciesId,
} from "@/types";
import type { GameStore } from "../game-store";
import { createStoreGameRewardCallbacks } from "./game-reward-callbacks";

export interface AnimalsSlice {
  refreshAnimalAvailability: () => void;
  rescueAnimal: (speciesId: AnimalSpeciesId) => AnimalActionResult | null;
  feedAnimal: (animalId: AnimalId) => AnimalActionResult | null;
  bondWithAnimal: (animalId: AnimalId) => AnimalActionResult | null;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createAnimalsSlice(set: SetState, get: GetState): AnimalsSlice {
  function buildAnimalContext(): AnimalEvaluationContext {
    return buildAnimalContextFromGameState(get());
  }

  function writeSpecies(
    speciesId: AnimalSpeciesId,
    updater: (
      current: GameStore["animalSpecies"][AnimalSpeciesId],
    ) => GameStore["animalSpecies"][AnimalSpeciesId],
  ): void {
    set((state) => {
      const current = state.animalSpecies[speciesId];

      if (!current) {
        return state;
      }

      return {
        animalSpecies: {
          ...state.animalSpecies,
          [speciesId]: updater(current),
        },
      };
    });
  }

  const rewardCallbacks = createStoreGameRewardCallbacks(set, get);

  const animalService = createAnimalService(
    () => get().animals,
    (animalId, updater) => {
      set((state) => {
        const current = state.animals[animalId];

        if (!current) {
          return state;
        }

        return {
          animals: {
            ...state.animals,
            [animalId]: updater(current),
          },
        };
      });
    },
    (animal: Animal) => {
      set((state) => {
        if (findOwnedAnimalBySpecies(state.animals, animal.speciesId)) {
          return state;
        }

        return {
          animals: {
            ...state.animals,
            [animal.id]: animal,
          },
        };
      });
    },
    writeSpecies,
    buildAnimalContext,
    {
      awardSkillXp: rewardCallbacks.awardSkillXp,
      incrementQuestObjective(questId, objectiveId) {
        get().incrementQuestObjective(questId, objectiveId);
      },
      onAnimalsChanged() {
        get().syncActiveQuestObjectives();
        get().refreshQuestAvailability();
        animalService.refreshAnimalAvailability();
        get().refreshMerchantSystems();
      },
    },
  );

  return {
    refreshAnimalAvailability() {
      animalService.refreshAnimalAvailability();
    },

    rescueAnimal(speciesId) {
      return animalService.rescueAnimal(speciesId);
    },

    feedAnimal(animalId) {
      return animalService.feedAnimal(animalId);
    },

    bondWithAnimal(animalId) {
      return animalService.bondWithAnimal(animalId);
    },
  };
}

export function applyAnimalSpeciesUnlock(
  set: SetState,
  speciesId: AnimalSpeciesId,
): void {
  set((state) => {
    const current = state.animalSpecies[speciesId];

    if (!current) {
      return state;
    }

    const next = markSpeciesAvailable(current);

    if (next === current) {
      return state;
    }

    return {
      animalSpecies: {
        ...state.animalSpecies,
        [speciesId]: next,
      },
    };
  });
}

export { unlockAnimalSpecies };
