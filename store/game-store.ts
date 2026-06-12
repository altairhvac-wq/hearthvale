import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { ValleyId } from "@/types";
import {
  createInitialGameState,
  fromSaveData,
  toSaveData,
  buildStateForValleySwitch,
  type GameState,
} from "./initial-state";
import { loadGameSave, saveGameSave } from "./persistence";
import {
  hasPersistableStateChanged,
  resetPersistableSnapshot,
} from "./persistable-state";
import { syncActiveValleyIntoValleys } from "./valley-state";
import { createSkillsSlice, type SkillsSlice } from "./slices/skills";
import { createRegionsSlice, type RegionsSlice } from "./slices/regions";

export interface GameStore extends GameState, SkillsSlice, RegionsSlice {
  hydrate: () => void;
  persist: () => boolean;
  resetGame: () => void;
  touchLastPlayed: () => void;
  switchActiveValley: (valleyId: ValleyId) => boolean;
}

let persistTimeout: ReturnType<typeof setTimeout> | null = null;
const PERSIST_DEBOUNCE_MS = 500;

export function cancelScheduledPersist(): void {
  if (persistTimeout) {
    clearTimeout(persistTimeout);
    persistTimeout = null;
  }
}

export function flushScheduledPersist(): void {
  cancelScheduledPersist();

  const state = useGameStore.getState();

  if (state.isHydrated) {
    state.persist();
  }
}

function schedulePersist(persist: () => void): void {
  cancelScheduledPersist();

  persistTimeout = setTimeout(() => {
    persist();
    persistTimeout = null;
  }, PERSIST_DEBOUNCE_MS);
}

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...createInitialGameState(),
    isHydrated: false,
    isSaving: false,
    lastSavedAt: null,
    saveError: null,
    ...createSkillsSlice(set, get),
    ...createRegionsSlice(set, get),

    hydrate() {
      const saved = loadGameSave();

      if (saved) {
        const restored = fromSaveData(saved);
        set({
          ...restored,
          isHydrated: true,
          lastSavedAt: saved.savedAt,
          saveError: null,
        });
        resetPersistableSnapshot(get());
        return;
      }

      set({ isHydrated: true, saveError: null });
      resetPersistableSnapshot(get());
    },

    persist() {
      set({ isSaving: true, saveError: null });

      const syncedValleys = syncActiveValleyIntoValleys(get());
      set({ valleys: syncedValleys });

      const saveData = toSaveData(get());
      const success = saveGameSave(saveData);

      set({
        isSaving: false,
        lastSavedAt: success ? saveData.savedAt : get().lastSavedAt,
        saveError: success ? null : "Failed to write save to localStorage.",
      });

      if (success) {
        resetPersistableSnapshot(get());
      }

      return success;
    },

    resetGame() {
      const fresh = createInitialGameState();
      set({
        ...fresh,
        isHydrated: true,
        isSaving: false,
        lastSavedAt: null,
        saveError: null,
      });
      resetPersistableSnapshot(get());
      get().persist();
    },

    touchLastPlayed() {
      const now = new Date().toISOString();

      set((state) => ({
        user: {
          ...state.user,
          lastSeenAt: now,
        },
        player: {
          ...state.player,
          lastPlayedAt: now,
        },
      }));
    },

    switchActiveValley(valleyId) {
      const nextState = buildStateForValleySwitch(get(), valleyId);

      if (!nextState) {
        return false;
      }

      set(nextState);
      return true;
    },
  })),
);

/** Auto-save when persistable game state changes after hydration. */
export function subscribeToAutoSave(): () => void {
  return useGameStore.subscribe((state) => {
    if (!state.isHydrated) {
      return;
    }

    if (!hasPersistableStateChanged(state)) {
      return;
    }

    schedulePersist(() => {
      useGameStore.getState().persist();
    });
  });
}

export type { GameState } from "./initial-state";
