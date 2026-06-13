"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useShallow } from "zustand/react/shallow";
import { computePlayerLevelInfo } from "@/game/player/level";
import { isFirstSession } from "@/game/onboarding/first-session";
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
 *
 * Selectors must return stable references (primitives or existing store slices).
 * For derived view models, use `useIsGameHydrated` with `useShallow` and `useMemo`.
 */
export function useHydratedGameStore<T>(
  selector: HydratedSelector<T>,
): T | undefined {
  const isHydrated = useIsGameHydrated();
  const selected = useGameStore(selector);

  if (!isHydrated) {
    return undefined;
  }

  return selected;
}

export function usePlayerHeaderData() {
  const isHydrated = useIsGameHydrated();
  const headerSource = useGameStore(
    useShallow((state) => ({
      displayName: state.player.displayName,
      resources: state.player.resources,
      skills: state.skills,
      quests: state.quests,
    })),
  );

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    const levelInfo = computePlayerLevelInfo(headerSource.skills);

    return {
      displayName: headerSource.displayName,
      resources: getCoreResourceDisplay(headerSource.resources),
      levelInfo,
      isNewPlayer: isFirstSession(headerSource.quests, levelInfo.totalXp),
    };
  }, [isHydrated, headerSource]);
}
