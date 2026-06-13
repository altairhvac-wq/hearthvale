"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { buildMerchantContextFromGameState } from "@/game/merchant/context";
import { buildMerchantScreenData } from "@/game/merchant/view-model";
import { buildHomeImmersionViewModel } from "@/game/onboarding/home-view-model";
import { computePlayerLevelInfo } from "@/game/player/level";
import { useGameStore, useIsGameHydrated } from "@/store";

export function useHomeImmersionData() {
  const isHydrated = useIsGameHydrated();
  const source = useGameStore(
    useShallow((state) => ({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      animals: state.animals,
      merchant: state.merchant,
      prosperity: state.prosperity,
      reputation: state.reputation,
      requests: state.requests,
      inventory: state.inventory,
      player: state.player,
      getSkillLevel: state.getSkillLevel,
      getProsperityScore: state.getProsperityScore,
      getProsperityTier: state.getProsperityTier,
    })),
  );

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    const merchantData = buildMerchantScreenData(
      buildMerchantContextFromGameState(source),
    );
    const levelInfo = computePlayerLevelInfo(source.skills);

    return buildHomeImmersionViewModel({
      quests: source.quests,
      totalXp: levelInfo.totalXp,
      merchantData,
      prosperity: merchantData.prosperity,
    });
  }, [isHydrated, source]);
}
