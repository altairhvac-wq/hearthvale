import {
  getNextReputationLevel,
  resolveReputationLevel,
} from "@/game/constants/reputation";
import type { ReputationState } from "@/types";

export function getReputationLevel(state: ReputationState) {
  return resolveReputationLevel(state.score);
}

export function getReputationProgress(state: ReputationState) {
  const current = getReputationLevel(state);
  const next = getNextReputationLevel(current);

  if (!next) {
    return {
      current,
      next: null,
      progressRatio: 1,
      pointsToNext: 0,
    };
  }

  const span = next.minScore - current.minScore;
  const earned = state.score - current.minScore;
  const progressRatio = span > 0 ? Math.min(1, earned / span) : 0;

  return {
    current,
    next,
    progressRatio,
    pointsToNext: Math.max(0, next.minScore - state.score),
  };
}
