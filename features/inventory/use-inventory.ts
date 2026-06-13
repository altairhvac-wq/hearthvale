"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { buildInventoryScreenData } from "@/game/inventory/view-model";
import { useGameStore, useIsGameHydrated } from "@/store";

export function useInventoryData() {
  const isHydrated = useIsGameHydrated();
  const inventory = useGameStore(useShallow((state) => state.inventory));

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    return buildInventoryScreenData(inventory);
  }, [isHydrated, inventory]);
}
