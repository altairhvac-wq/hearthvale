import {
  getMiniGameRewardsForDifficulty,
  isMiniGameDifficultySupported,
  resolveMiniGameDifficulty,
} from "@/game/constants/minigames";
import type {
  GameReward,
  MiniGame,
  MiniGameDefinition,
  MiniGameDifficulty,
  MiniGameId,
} from "@/types";
import { isMiniGameRegionRequirementMet } from "./availability";
import type { MiniGameEvaluationContext } from "./context";

export function canActivateMiniGame(
  definition: MiniGameDefinition,
  miniGame: MiniGame,
  difficulty: MiniGameDifficulty,
  context: MiniGameEvaluationContext,
): boolean {
  if (miniGame.status !== "available") {
    return false;
  }

  if (!isMiniGameRegionRequirementMet(definition, context)) {
    return false;
  }

  return isMiniGameDifficultySupported(definition, difficulty);
}

export function activateMiniGameInstance(
  miniGame: MiniGame,
  definition: MiniGameDefinition,
  difficulty: MiniGameDifficulty | undefined,
  now: string,
  sessionId: string | null = null,
  context: MiniGameEvaluationContext,
): MiniGame | null {
  const resolvedDifficulty = resolveMiniGameDifficulty(definition, difficulty);

  if (!canActivateMiniGame(definition, miniGame, resolvedDifficulty, context)) {
    return null;
  }

  return {
    ...miniGame,
    status: "active",
    selectedDifficulty: resolvedDifficulty,
    participationCount: miniGame.participationCount + 1,
    activatedAt: now,
    lastPlayedAt: now,
    activeSessionId: sessionId,
    completedAt: null,
    failedAt: null,
  };
}

export function completeMiniGameInstance(
  miniGame: MiniGame,
  score: number,
  now: string,
): MiniGame | null {
  if (miniGame.status !== "active" || !miniGame.selectedDifficulty) {
    return null;
  }

  const difficulty = miniGame.selectedDifficulty;
  const previousHighScore = miniGame.highScoreByDifficulty[difficulty] ?? 0;

  return {
    ...miniGame,
    status: "completed",
    highScoreByDifficulty: {
      ...miniGame.highScoreByDifficulty,
      [difficulty]: Math.max(previousHighScore, score),
    },
    completionCount: miniGame.completionCount + 1,
    completedAt: now,
    lastPlayedAt: now,
    activeSessionId: null,
  };
}

export function failMiniGameInstance(
  miniGame: MiniGame,
  now: string,
): MiniGame | null {
  if (miniGame.status !== "active") {
    return null;
  }

  return {
    ...miniGame,
    status: "failed",
    failureCount: miniGame.failureCount + 1,
    failedAt: now,
    lastPlayedAt: now,
    activeSessionId: null,
  };
}

export function getCompletionRewards(
  definition: MiniGameDefinition,
  difficulty: MiniGameDifficulty,
): GameReward[] {
  return getMiniGameRewardsForDifficulty(definition, difficulty);
}

export function createMiniGameSessionId(
  miniGameId: MiniGameId,
  now: string,
): string {
  return `${miniGameId}:${now}`;
}
