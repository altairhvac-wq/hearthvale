"use client";

import { useMemo } from "react";
import { useGameStore, useIsGameHydrated } from "@/store";
import { buildFestivalCartData } from "@/game/events/view-model";

export function useFestivalCartData() {
  const isHydrated = useIsGameHydrated();
  const events = useGameStore((state) => state.events);

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    return buildFestivalCartData(events);
  }, [isHydrated, events]);
}

export function useRefreshEventScheduler() {
  return useGameStore((state) => state.refreshEventScheduler);
}

export function useActivateFeaturedEvent() {
  return useGameStore((state) => state.activateFeaturedEvent);
}

export function useCompleteFeaturedEvent() {
  return useGameStore((state) => state.completeFeaturedEvent);
}
