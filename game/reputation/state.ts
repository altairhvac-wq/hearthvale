import type { ReputationState } from "@/types";

export function createInitialReputationState(): ReputationState {
  return {
    score: 0,
  };
}

function normalizeScore(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

export function mergeReputationState(
  saved: ReputationState | undefined,
): ReputationState {
  const defaults = createInitialReputationState();

  if (!saved) {
    return defaults;
  }

  return {
    score: normalizeScore(saved.score),
  };
}
