"use client";

import { buildValleyMapData } from "@/game/regions/view-model";
import { useGameStore, useHydratedGameStore } from "@/store";

export function useValleyMapData() {
  return useHydratedGameStore((state) =>
    buildValleyMapData(state.activeRegionId, state.regions, {
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
    }),
  );
}

export function useSetActiveRegion() {
  return useGameStore((state) => state.setActiveRegionId);
}
