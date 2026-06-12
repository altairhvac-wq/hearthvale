import { getReputationProgress } from "./levels";
import type { ReputationState } from "@/types";

export interface ReputationViewModel {
  score: number;
  level: number;
  title: string;
  description: string;
  progressRatio: number;
  pointsToNext: number;
  nextTitle: string | null;
}

export function buildReputationViewModel(
  state: ReputationState,
): ReputationViewModel {
  const progress = getReputationProgress(state);

  return {
    score: state.score,
    level: progress.current.level,
    title: progress.current.title,
    description: progress.current.description,
    progressRatio: progress.progressRatio,
    pointsToNext: progress.pointsToNext,
    nextTitle: progress.next?.title ?? null,
  };
}
