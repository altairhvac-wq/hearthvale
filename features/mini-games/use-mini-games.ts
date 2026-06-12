"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore, useIsGameHydrated } from "@/store";

export function useMiniGameJournalData() {
  const isHydrated = useIsGameHydrated();
  const getMiniGameJournalData = useGameStore(
    (state) => state.getMiniGameJournalData,
  );
  const journalDependencies = useGameStore(
    useShallow((state) => ({
      minigames: state.minigames,
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      events: state.events,
      activeRegionId: state.activeRegionId,
    })),
  );

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    return getMiniGameJournalData();
  }, [isHydrated, getMiniGameJournalData, journalDependencies]);
}

export function useRefreshMiniGames() {
  return useGameStore((state) => state.refreshMiniGameAvailability);
}
