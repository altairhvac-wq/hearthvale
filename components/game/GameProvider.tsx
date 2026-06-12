"use client";

import { useEffect } from "react";
import {
  flushScheduledPersist,
  subscribeToAutoSave,
  useGameStore,
} from "@/store";

interface GameProviderProps {
  children: React.ReactNode;
}

/**
 * Hydrates persisted game state on mount and enables automatic saves.
 * Wrap the app once — all gameplay features read from the global store.
 */
export function GameProvider({ children }: GameProviderProps) {
  const hydrate = useGameStore((state) => state.hydrate);
  const touchLastPlayed = useGameStore((state) => state.touchLastPlayed);
  const persist = useGameStore((state) => state.persist);

  useEffect(() => {
    const unsubscribe = subscribeToAutoSave();

    hydrate();
    touchLastPlayed();

    const state = useGameStore.getState();
    state.refreshQuestAvailability();
    state.syncActiveQuestObjectives();
    state.refreshRestorationAvailability();
    state.refreshAnimalAvailability();
    state.refreshMiniGameAvailability();
    state.refreshMerchantSystems();

    persist();

    return () => {
      unsubscribe();
      flushScheduledPersist();
    };
  }, [hydrate, touchLastPlayed, persist]);

  return children;
}
