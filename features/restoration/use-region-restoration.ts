"use client";

import { useCallback } from "react";
import type { RegionId, RestorationProjectId } from "@/types";
import { buildRegionRestorationViewModels } from "@/game/restoration/view-model";
import {
  useHydratedGameStore,
  useIsGameHydrated,
  useGameStore,
} from "@/store";

export function useRegionRestoration(regionId: RegionId) {
  return useHydratedGameStore((state) =>
    buildRegionRestorationViewModels(regionId, state.restoration, {
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      playerResources: state.player.resources,
    }),
  );
}

export function useStartRestorationProject() {
  const isHydrated = useIsGameHydrated();
  const startRestorationProject = useGameStore(
    (state) => state.startRestorationProject,
  );

  return useCallback(
    (projectId: RestorationProjectId) => {
      if (!isHydrated) {
        return false;
      }

      return startRestorationProject(projectId);
    },
    [isHydrated, startRestorationProject],
  );
}

export function useRestoreCurrentStage() {
  const isHydrated = useIsGameHydrated();
  const restoreCurrentStage = useGameStore((state) => state.restoreCurrentStage);

  return useCallback(
    (projectId: RestorationProjectId) => {
      if (!isHydrated) {
        return null;
      }

      return restoreCurrentStage(projectId);
    },
    [isHydrated, restoreCurrentStage],
  );
}
