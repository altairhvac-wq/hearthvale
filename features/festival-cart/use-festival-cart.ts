"use client";

import { useGameStore, useHydratedGameStore } from "@/store";
import { buildFestivalCartData } from "@/game/events/view-model";

export function useFestivalCartData() {
  return useHydratedGameStore((state) => buildFestivalCartData(state.events));
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
