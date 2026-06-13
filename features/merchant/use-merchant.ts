"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { buildMerchantContextFromGameState } from "@/game/merchant/context";
import { buildMerchantScreenData } from "@/game/merchant/view-model";
import { useGameStore, useIsGameHydrated } from "@/store";

export function useMerchantData() {
  const isHydrated = useIsGameHydrated();
  const contextSource = useGameStore(
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

    return buildMerchantScreenData(
      buildMerchantContextFromGameState(contextSource),
    );
  }, [isHydrated, contextSource]);
}

export function useRefreshMerchantSystems() {
  return useGameStore((state) => state.refreshMerchantSystems);
}

export function useActivateMerchantStage() {
  return useGameStore((state) => state.activateMerchantStage);
}

export function useUpgradeMerchantStage() {
  return useGameStore((state) => state.upgradeMerchantStage);
}

export function useClaimProsperityTierReward() {
  return useGameStore((state) => state.claimProsperityTierReward);
}

export function useClaimNextProsperityTierReward() {
  return useGameStore((state) => state.claimNextProsperityTierReward);
}

export function useActivateCustomerRequest() {
  return useGameStore((state) => state.activateCustomerRequest);
}

export function useCompleteCustomerRequest() {
  return useGameStore((state) => state.completeCustomerRequest);
}
