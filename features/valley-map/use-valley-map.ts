"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { buildValleyMapData } from "@/game/regions/view-model";
import { useGameStore, useIsGameHydrated } from "@/store";

export function useValleyMapData() {
  const isHydrated = useIsGameHydrated();
  const mapContextSource = useGameStore(
    useShallow((state) => ({
      activeRegionId: state.activeRegionId,
      regions: state.regions,
      quests: state.quests,
      skills: state.skills,
      restoration: state.restoration,
      requests: state.requests,
      getSkillLevel: state.getSkillLevel,
    })),
  );

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    return buildValleyMapData(
      mapContextSource.activeRegionId,
      mapContextSource.regions,
      {
        quests: mapContextSource.quests,
        skills: mapContextSource.skills,
        regions: mapContextSource.regions,
        restoration: mapContextSource.restoration,
        getSkillLevel: mapContextSource.getSkillLevel,
      },
      mapContextSource.requests,
    );
  }, [isHydrated, mapContextSource]);
}

export function useSetActiveRegion() {
  return useGameStore((state) => state.setActiveRegionId);
}
