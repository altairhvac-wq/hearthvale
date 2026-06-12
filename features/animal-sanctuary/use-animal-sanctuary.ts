"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { buildAnimalContextFromGameState } from "@/game/animals/context";
import { buildAnimalSanctuaryData } from "@/game/animals/view-model";
import { useGameStore, useIsGameHydrated } from "@/store";

export function useAnimalSanctuaryData() {
  const isHydrated = useIsGameHydrated();
  const contextSource = useGameStore(
    useShallow((state) => ({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      animals: state.animals,
      animalSpecies: state.animalSpecies,
    })),
  );

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    return buildAnimalSanctuaryData(
      buildAnimalContextFromGameState(contextSource),
    );
  }, [isHydrated, contextSource]);
}

export function useRefreshAnimals() {
  return useGameStore((state) => state.refreshAnimalAvailability);
}

export function useRescueAnimal() {
  return useGameStore((state) => state.rescueAnimal);
}

export function useFeedAnimal() {
  return useGameStore((state) => state.feedAnimal);
}

export function useBondWithAnimal() {
  return useGameStore((state) => state.bondWithAnimal);
}
