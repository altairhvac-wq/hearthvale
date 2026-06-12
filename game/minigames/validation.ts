import {
  isRegisteredMiniGame,
  MINIGAME_DIFFICULTIES,
  MINIGAME_STATUSES,
} from "@/game/constants/minigames";
import type { MiniGame, MiniGameDifficulty, MiniGameStatus } from "@/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNonNegativeInteger(value: unknown): boolean {
  return (
    typeof value === "number" && Number.isFinite(value) && value >= 0
  );
}

function isMiniGameStatus(value: unknown): value is MiniGameStatus {
  return (
    typeof value === "string" &&
    (MINIGAME_STATUSES as readonly string[]).includes(value)
  );
}

function isMiniGameDifficulty(value: unknown): value is MiniGameDifficulty {
  return (
    typeof value === "string" &&
    (MINIGAME_DIFFICULTIES as readonly string[]).includes(value)
  );
}

function isHighScoreByDifficulty(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return Object.entries(value).every(
    ([difficulty, score]) =>
      isMiniGameDifficulty(difficulty) && isNonNegativeInteger(score),
  );
}

function isLooseMiniGame(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  const selectedDifficulty = value.selectedDifficulty;
  const highScoreByDifficulty = value.highScoreByDifficulty;

  return (
    typeof value.id === "string" &&
    isMiniGameStatus(value.status) &&
    (selectedDifficulty === null || isMiniGameDifficulty(selectedDifficulty)) &&
    (highScoreByDifficulty === undefined ||
      isHighScoreByDifficulty(highScoreByDifficulty)) &&
    isNonNegativeInteger(value.participationCount) &&
    isNonNegativeInteger(value.completionCount) &&
    isNonNegativeInteger(value.failureCount) &&
    isNullableString(value.lastPlayedAt) &&
    isNullableString(value.activatedAt) &&
    isNullableString(value.completedAt) &&
    isNullableString(value.failedAt) &&
    (value.activeSessionId === null ||
      typeof value.activeSessionId === "string")
  );
}

export function isMiniGame(value: unknown): value is MiniGame {
  if (!isLooseMiniGame(value)) {
    return false;
  }

  return isRegisteredMiniGame((value as { id: string }).id);
}

/** Structural check for persisted mini-game blobs — normalization happens in mergeMiniGamesState. */
export function isPersistedMiniGamesRecord(
  value: unknown,
): value is Record<string, MiniGame> {
  if (!isObject(value)) {
    return false;
  }

  return Object.values(value).every(isLooseMiniGame);
}
