"use client";

import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { RegionId, RestorationProjectId } from "@/types";
import { buildRegionRestorationViewModels } from "@/game/restoration/view-model";
import { useIsGameHydrated, useGameStore } from "@/store";

export function useRegionRestoration(regionId: RegionId) {
  const isHydrated = useIsGameHydrated();
  const contextSource = useGameStore(
    useShallow((state) => ({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      playerResources: state.player.resources,
    })),
  );

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    return buildRegionRestorationViewModels(
      regionId,
      contextSource.restoration,
      contextSource,
    );
  }, [isHydrated, regionId, contextSource]);
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
