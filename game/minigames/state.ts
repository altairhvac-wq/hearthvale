import {
  MINIGAME_DEFINITIONS,
  MINIGAME_DIFFICULTIES,
  MINIGAME_STATUSES,
} from "@/game/constants/minigames";
import type {
  MiniGame,
  MiniGameDefinition,
  MiniGameDifficulty,
  MiniGameStatus,
} from "@/types";

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

function normalizeTimestamp(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeHighScoreByDifficulty(
  saved: Partial<Record<MiniGameDifficulty, number>> | undefined,
  legacyHighScore: unknown,
): Partial<Record<MiniGameDifficulty, number>> {
  const normalized: Partial<Record<MiniGameDifficulty, number>> = {
    ...(saved ?? {}),
  };

  if (
    typeof legacyHighScore === "number" &&
    legacyHighScore > 0 &&
    normalized.normal === undefined
  ) {
    normalized.normal = legacyHighScore;
  }

  return normalized;
}

function normalizeCount(value: unknown, legacyFallback?: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }

  if (
    typeof legacyFallback === "number" &&
    Number.isFinite(legacyFallback) &&
    legacyFallback >= 0
  ) {
    return Math.floor(legacyFallback);
  }

  return 0;
}

interface LegacyMiniGameFields {
  highScore?: number;
  timesPlayed?: number;
}

export function createDefaultMiniGame(
  definition: MiniGameDefinition,
): MiniGame {
  return {
    id: definition.id,
    status: "locked",
    selectedDifficulty: null,
    highScoreByDifficulty: {},
    participationCount: 0,
    completionCount: 0,
    failureCount: 0,
    lastPlayedAt: null,
    activatedAt: null,
    completedAt: null,
    failedAt: null,
    activeSessionId: null,
  };
}

export function mergeMiniGameWithDefinition(
  definition: MiniGameDefinition,
  saved: (MiniGame & LegacyMiniGameFields) | undefined,
  defaultMiniGame: MiniGame,
): MiniGame {
  if (!saved || saved.id !== definition.id) {
    return defaultMiniGame;
  }

  const status = isMiniGameStatus(saved.status)
    ? saved.status
    : defaultMiniGame.status;
  const selectedDifficulty = isMiniGameDifficulty(saved.selectedDifficulty)
    ? saved.selectedDifficulty
    : null;

  return {
    id: definition.id,
    status,
    selectedDifficulty,
    highScoreByDifficulty: normalizeHighScoreByDifficulty(
      saved.highScoreByDifficulty,
      saved.highScore,
    ),
    participationCount: normalizeCount(
      saved.participationCount,
      saved.timesPlayed,
    ),
    completionCount: normalizeCount(saved.completionCount),
    failureCount: normalizeCount(saved.failureCount),
    lastPlayedAt: normalizeTimestamp(saved.lastPlayedAt),
    activatedAt: normalizeTimestamp(saved.activatedAt),
    completedAt: normalizeTimestamp(saved.completedAt),
    failedAt: normalizeTimestamp(saved.failedAt),
    activeSessionId:
      typeof saved.activeSessionId === "string" ? saved.activeSessionId : null,
  };
}

function abandonInterruptedSession(miniGame: MiniGame): MiniGame {
  if (miniGame.status !== "active") {
    return miniGame;
  }

  return {
    ...miniGame,
    status: "failed",
    activeSessionId: null,
  };
}

/**
 * Normalize inconsistent runtime state after hydration or registry changes.
 * Abandons orphaned active sessions without incrementing failure counts.
 */
export function reconcileMiniGamesState(
  state: Record<string, MiniGame>,
): Record<string, MiniGame> {
  const reconciled = { ...state };

  for (const definition of MINIGAME_DEFINITIONS) {
    const miniGame = reconciled[definition.id];

    if (miniGame) {
      reconciled[definition.id] = abandonInterruptedSession(miniGame);
    }
  }

  return reconciled;
}

/** Reconcile persisted mini-game progress with the current registry. */
export function mergeMiniGamesState(
  saved: Record<string, MiniGame> | undefined,
): Record<string, MiniGame> {
  const defaults = createInitialMiniGamesState();

  if (!saved) {
    return defaults;
  }

  const merged = MINIGAME_DEFINITIONS.reduce<Record<string, MiniGame>>(
    (acc, definition) => {
      acc[definition.id] = mergeMiniGameWithDefinition(
        definition,
        saved[definition.id],
        defaults[definition.id]!,
      );

      return acc;
    },
    {},
  );

  return reconcileMiniGamesState(merged);
}

export function createInitialMiniGamesState(): Record<string, MiniGame> {
  return MINIGAME_DEFINITIONS.reduce<Record<string, MiniGame>>((acc, definition) => {
    acc[definition.id] = createDefaultMiniGame(definition);
    return acc;
  }, {});
}
