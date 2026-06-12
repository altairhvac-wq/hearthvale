"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore, useIsGameHydrated } from "@/store";

export function useGatheringData() {
  const isHydrated = useIsGameHydrated();
  const getGatheringScreenData = useGameStore(
    (state) => state.getGatheringScreenData,
  );
  const contextVersion = useGameStore(
    useShallow((state) => ({
      gathering: state.gathering,
      inventory: state.inventory,
      regions: state.regions,
      skills: state.skills,
      activeRegionId: state.activeRegionId,
    })),
  );

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    return getGatheringScreenData();
  }, [isHydrated, getGatheringScreenData, contextVersion]);
}

export function useRefreshGatheringState() {
  return useGameStore((state) => state.refreshGatheringState);
}

export function useGatherFromNode() {
  return useGameStore((state) => state.gatherFromNode);
}

export function useSetActiveRegion() {
  return useGameStore((state) => state.setActiveRegionId);
}
