import {
  getNextProsperityTier,
  getProsperityTierByLevel,
  PROSPERITY_TIER_DEFINITIONS,
  resolveProsperityTier,
} from "@/game/constants/prosperity";
import { calculateProsperityBreakdown, type ProsperityBreakdown, type ProsperityCalculationInput } from "./calculate";
import { getProsperityTierLevel, getUnclaimedProsperityTiers } from "./state";
import type { ProsperityState } from "@/types";

export interface ProsperityViewModel {
  score: number;
  tier: number;
  tierTitle: string;
  tierDescription: string;
  progressRatio: number;
  pointsToNextTier: number;
  nextTierTitle: string | null;
  breakdown: ProsperityBreakdown;
  unclaimedTierCount: number;
}

export function buildProsperityViewModel(
  input: ProsperityCalculationInput,
): ProsperityViewModel {
  const breakdown = calculateProsperityBreakdown(input);
  const score = breakdown.total;
  const currentTier = resolveProsperityTier(score);
  const nextTier = getNextProsperityTier(currentTier);
  const unclaimed = getUnclaimedProsperityTiers(score, input.prosperity);

  let progressRatio = 1;
  let pointsToNextTier = 0;

  if (nextTier) {
    const span = nextTier.minScore - currentTier.minScore;
    const earned = score - currentTier.minScore;
    progressRatio = span > 0 ? Math.min(1, earned / span) : 0;
    pointsToNextTier = Math.max(0, nextTier.minScore - score);
  }

  return {
    score,
    tier: currentTier.tier,
    tierTitle: currentTier.title,
    tierDescription: currentTier.description,
    progressRatio,
    pointsToNextTier,
    nextTierTitle: nextTier?.title ?? null,
    breakdown,
    unclaimedTierCount: unclaimed.length,
  };
}

export function buildProsperityTierCards(state: ProsperityState, score: number) {
  const currentTierLevel = getProsperityTierLevel(score);

  return PROSPERITY_TIER_DEFINITIONS.map((tier) => ({
    ...tier,
    isCurrent: tier.tier === currentTierLevel,
    isReached: score >= tier.minScore,
    isClaimed: state.claimedTierRewards.includes(tier.tier),
    canClaim:
      score >= tier.minScore &&
      tier.rewards.length > 0 &&
      !state.claimedTierRewards.includes(tier.tier),
  }));
}

export { getProsperityTierByLevel };
