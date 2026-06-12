import { buildMerchantContextFromGameState } from "@/game/merchant/context";
import { createMerchantService, type MerchantUpgradeResult } from "@/game/merchant/service";
import { calculateProsperityScore } from "@/game/prosperity/calculate";
import { createProsperityService } from "@/game/prosperity/service";
import { getProsperityTierLevel } from "@/game/prosperity/state";
import { buildRequestContextFromGameState } from "@/game/requests/context";
import {
  createRequestService,
  type RequestCompletionResult,
} from "@/game/requests/service";
import { createReputationService } from "@/game/reputation/service";
import { spendResourcesIfAffordable } from "@/game/player/resources";
import type {
  CustomerRequestId,
  MerchantStageId,
  ProsperityState,
  ReputationState,
  RestorationResourceRequirement,
} from "@/types";
import type { GameStore } from "../game-store";
import {
  createStoreGameRewardCallbacks,
} from "./game-reward-callbacks";

export interface MerchantSlice {
  refreshMerchantSystems: () => void;
  activateMerchantStage: (stageId: MerchantStageId) => boolean;
  upgradeMerchantStage: (stageId: MerchantStageId) => MerchantUpgradeResult | null;
  getProsperityScore: () => number;
  getProsperityTier: () => number;
  awardProsperityBonus: (amount: number) => void;
  claimProsperityTierReward: (tier: number) => boolean;
  claimNextProsperityTierReward: () => { tier: number; title: string } | null;
  awardReputation: (amount: number) => void;
  activateCustomerRequest: (requestId: CustomerRequestId) => boolean;
  completeCustomerRequest: (
    requestId: CustomerRequestId,
  ) => RequestCompletionResult | null;
}

type SetState = (
  partial:
    | Partial<GameStore>
    | ((state: GameStore) => Partial<GameStore>),
) => void;

type GetState = () => GameStore;

export function createMerchantSlice(set: SetState, get: GetState): MerchantSlice {
  function writeProsperity(
    updater: (current: ProsperityState) => ProsperityState,
  ): void {
    set((state) => ({
      prosperity: updater(state.prosperity),
    }));
  }

  function writeReputation(
    updater: (current: ReputationState) => ReputationState,
  ): void {
    set((state) => ({
      reputation: updater(state.reputation),
    }));
  }

  function readCalculationInput() {
    const state = get();

    return {
      restoration: state.restoration,
      animals: state.animals,
      merchant: state.merchant,
      prosperity: state.prosperity,
    };
  }

  function getProsperityScore(): number {
    const state = get();
    return calculateProsperityScore({
      restoration: state.restoration,
      animals: state.animals,
      merchant: state.merchant,
      prosperity: state.prosperity,
    });
  }

  function getProsperityTier(): number {
    return getProsperityTierLevel(getProsperityScore());
  }

  function buildMerchantContext() {
    const state = get();

    return buildMerchantContextFromGameState({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      animals: state.animals,
      merchant: state.merchant,
      prosperity: state.prosperity,
      reputation: state.reputation,
      requests: state.requests,
      player: state.player,
      getSkillLevel: state.getSkillLevel,
      getProsperityScore,
      getProsperityTier,
    });
  }

  function buildRequestContext() {
    const state = get();

    return buildRequestContextFromGameState({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      merchant: state.merchant,
      prosperity: state.prosperity,
      reputation: state.reputation,
      requests: state.requests,
      getSkillLevel: state.getSkillLevel,
      getProsperityTier,
    });
  }

  function refreshMerchantSystems(): void {
    merchantService.refreshMerchantAvailability();
    requestService.refreshRequestAvailability();
    prosperityService.touchCalculated();
  }

  const rewardCallbacks = createStoreGameRewardCallbacks(set, get);

  const reputationService = createReputationService(
    () => get().reputation,
    writeReputation,
  );

  const prosperityService = createProsperityService(
    () => get().prosperity,
    writeProsperity,
    readCalculationInput,
    {
      ...rewardCallbacks,
      onProsperityChanged: refreshMerchantSystems,
    },
  );

  function commitMerchantUpgrade(
    required: RestorationResourceRequirement[],
    applyMerchant: (merchant: GameStore["merchant"]) => GameStore["merchant"] | null,
  ): boolean {
    let committed = false;

    set((state) => {
      const nextResources = spendResourcesIfAffordable(
        state.player.resources,
        required,
      );

      if (!nextResources) {
        return state;
      }

      const nextMerchant = applyMerchant(state.merchant);

      if (!nextMerchant) {
        return state;
      }

      committed = true;

      return {
        player: {
          ...state.player,
          resources: nextResources,
        },
        merchant: nextMerchant,
      };
    });

    return committed;
  }

  const merchantService = createMerchantService(
    () => get().merchant,
    (updater) => {
      set((state) => ({
        merchant: updater(state.merchant),
      }));
    },
    buildMerchantContext,
    {
      ...rewardCallbacks,
      commitMerchantUpgrade,
      onMerchantChanged: refreshMerchantSystems,
    },
  );

  const requestService = createRequestService(
    () => get().requests,
    (requestId, updater) => {
      set((state) => {
        const current = state.requests.instances[requestId];

        if (!current) {
          return state;
        }

        return {
          requests: {
            ...state.requests,
            instances: {
              ...state.requests.instances,
              [requestId]: updater(current),
            },
          },
        };
      });
    },
    buildRequestContext,
    {
      ...rewardCallbacks,
      onRequestsChanged: refreshMerchantSystems,
    },
  );

  return {
    refreshMerchantSystems,

    activateMerchantStage(stageId) {
      return merchantService.activateMerchantStage(stageId);
    },

    upgradeMerchantStage(stageId) {
      return merchantService.upgradeMerchantStage(stageId);
    },

    getProsperityScore,
    getProsperityTier,

    awardProsperityBonus(amount) {
      prosperityService.awardProsperityBonus(amount);
    },

    claimProsperityTierReward(tier) {
      return prosperityService.claimTierReward(tier);
    },

    claimNextProsperityTierReward() {
      return prosperityService.claimNextTierReward();
    },

    awardReputation(amount) {
      reputationService.awardReputation(amount);
    },

    activateCustomerRequest(requestId) {
      return requestService.activateRequest(requestId);
    },

    completeCustomerRequest(requestId) {
      return requestService.completeRequest(requestId);
    },
  };
}
