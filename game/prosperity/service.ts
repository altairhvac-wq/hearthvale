import {
  getProsperityTierByLevel,
  PROSPERITY_TIER_DEFINITIONS,
} from "@/game/constants/prosperity";
import { applyGameRewards, type GameRewardCallbacks } from "@/game/rewards";
import { calculateProsperityScore } from "./calculate";
import {
  getProsperityTierLevel,
  getUnclaimedProsperityTiers,
} from "./state";
import type { ProsperityCalculationInput } from "./calculate";
import type { ProsperityState } from "@/types";

export interface ProsperityServiceCallbacks extends GameRewardCallbacks {
  onProsperityChanged: () => void;
}

export interface ProsperityTierClaimResult {
  tier: number;
  title: string;
}

export interface ProsperityService {
  getScore: () => number;
  getTier: () => number;
  awardProsperityBonus: (amount: number) => void;
  claimTierReward: (tier: number) => boolean;
  claimNextTierReward: () => ProsperityTierClaimResult | null;
  touchCalculated: () => void;
}

type ProsperityReader = () => ProsperityState;
type ProsperityWriter = (
  updater: (current: ProsperityState) => ProsperityState,
) => void;
type CalculationInputReader = () => ProsperityCalculationInput;

export function createProsperityService(
  readProsperity: ProsperityReader,
  writeProsperity: ProsperityWriter,
  readCalculationInput: CalculationInputReader,
  callbacks: ProsperityServiceCallbacks,
): ProsperityService {
  function getScore(): number {
    return calculateProsperityScore({
      ...readCalculationInput(),
      prosperity: readProsperity(),
    });
  }

  return {
    getScore,
    getTier() {
      return getProsperityTierLevel(getScore());
    },

    awardProsperityBonus(amount) {
      if (amount <= 0) {
        return;
      }

      writeProsperity((current) => ({
        ...current,
        bonusScore: current.bonusScore + amount,
      }));
      callbacks.onProsperityChanged();
    },

    claimTierReward(tier) {
      const tierDefinition = PROSPERITY_TIER_DEFINITIONS.find(
        (entry) => entry.tier === tier,
      );

      if (!tierDefinition || tierDefinition.rewards.length === 0) {
        return false;
      }

      const score = getScore();

      if (score < tierDefinition.minScore) {
        return false;
      }

      let claimed = false;

      writeProsperity((current) => {
        if (current.claimedTierRewards.includes(tier)) {
          return current;
        }

        claimed = true;

        return {
          ...current,
          claimedTierRewards: [...current.claimedTierRewards, tier],
        };
      });

      if (!claimed) {
        return false;
      }

      applyGameRewards(tierDefinition.rewards, callbacks);
      callbacks.onProsperityChanged();
      return true;
    },

    claimNextTierReward() {
      const score = getScore();
      const unclaimed = getUnclaimedProsperityTiers(score, readProsperity());
      const nextTier = unclaimed[0];

      if (!nextTier) {
        return null;
      }

      if (!this.claimTierReward(nextTier.tier)) {
        return null;
      }

      return {
        tier: nextTier.tier,
        title: nextTier.title,
      };
    },

    touchCalculated() {
      writeProsperity((current) => ({
        ...current,
        lastCalculatedAt: new Date().toISOString(),
      }));
    },
  };
}

export { getProsperityTierByLevel };
