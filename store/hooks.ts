"use client";

import { useSyncExternalStore } from "react";
import { computePlayerLevelInfo } from "@/game/player/level";
import { getCoreResourceDisplay } from "@/game/player/resources";
import { useGameStore, type GameStore } from "./game-store";

type HydratedSelector<T> = (state: GameStore) => T;

function subscribeHydration(onStoreChange: () => void): () => void {
  return useGameStore.subscribe((state, previous) => {
    if (state.isHydrated !== previous.isHydrated) {
      onStoreChange();
    }
  });
}

function getHydrationSnapshot(): boolean {
  return useGameStore.getState().isHydrated;
}

function getHydrationServerSnapshot(): boolean {
  return false;
}

/** Returns false until persisted state has been loaded on the client. */
export function useIsGameHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    getHydrationServerSnapshot,
  );
}

/**
 * Read store state only after hydration completes.
 * Returns `undefined` while loading — gate UI before rendering gameplay data.
 */
export function useHydratedGameStore<T>(
  selector: HydratedSelector<T>,
): T | undefined {
  const isHydrated = useIsGameHydrated();

  return useGameStore((state) => {
    if (!isHydrated) {
      return undefined as T | undefined;
    }

    return selector(state);
  });
}

export function usePlayerHeaderData() {
  return useHydratedGameStore((state) => ({
    displayName: state.player.displayName,
    resources: getCoreResourceDisplay(state.player.resources),
    levelInfo: computePlayerLevelInfo(state.skills),
  }));
}
