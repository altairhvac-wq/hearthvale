import {
  PROSPERITY_TIER_DEFINITIONS,
  resolveProsperityTier,
} from "@/game/constants/prosperity";
import type { ProsperityState } from "@/types";

export function createInitialProsperityState(): ProsperityState {
  return {
    bonusScore: 0,
    claimedTierRewards: [],
    lastCalculatedAt: null,
  };
}

function normalizeClaimedTiers(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is number => typeof entry === "number" && entry >= 1)
    .map((entry) => Math.floor(entry));
}

function normalizeBonusScore(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function normalizeTimestamp(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function mergeProsperityState(
  saved: ProsperityState | undefined,
): ProsperityState {
  const defaults = createInitialProsperityState();

  if (!saved) {
    return defaults;
  }

  return {
    bonusScore: normalizeBonusScore(saved.bonusScore),
    claimedTierRewards: normalizeClaimedTiers(saved.claimedTierRewards),
    lastCalculatedAt: normalizeTimestamp(saved.lastCalculatedAt),
  };
}

export function getProsperityTierLevel(score: number): number {
  return resolveProsperityTier(score).tier;
}

export function getUnclaimedProsperityTiers(
  score: number,
  state: ProsperityState,
) {
  const currentTier = getProsperityTierLevel(score);

  return PROSPERITY_TIER_DEFINITIONS.filter(
    (tier) =>
      tier.tier <= currentTier &&
      tier.rewards.length > 0 &&
      !state.claimedTierRewards.includes(tier.tier),
  ).sort((a, b) => a.tier - b.tier);
}
