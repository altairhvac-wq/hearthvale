import {
  MINIGAME_DEFINITIONS,
  getMiniGameDefinition,
  isRegisteredMiniGame,
  resolveMiniGameDifficulty,
} from "@/game/constants/minigames";
import type {
  EventId,
  GameReward,
  MiniGame,
  MiniGameDifficulty,
  MiniGameId,
} from "@/types";
import { resolveNextMiniGameStatus } from "./availability";
import type { MiniGameEvaluationContext } from "./context";
import { getMiniGameIdFromEvent } from "./event-integration";
import {
  activateMiniGameInstance,
  completeMiniGameInstance,
  createMiniGameSessionId,
  failMiniGameInstance,
  getCompletionRewards,
} from "./progression";
import {
  applyMiniGameRewards,
  type MiniGameRewardApplicationResult,
  type MiniGameRewardCallbacks,
} from "./rewards";

export interface MiniGameCompletionResult {
  miniGameId: MiniGameId;
  difficulty: MiniGameDifficulty;
  score: number;
  rewards: GameReward[];
  rewardResult: MiniGameRewardApplicationResult;
  isNewHighScore: boolean;
}

export interface MiniGameActivationResult {
  miniGameId: MiniGameId;
  difficulty: MiniGameDifficulty;
  sessionId: string;
}

export interface MiniGameService {
  refreshAvailability(): void;
  activateMiniGame(
    miniGameId: MiniGameId,
    difficulty?: MiniGameDifficulty,
    sessionId?: string | null,
  ): MiniGameActivationResult | null;
  completeMiniGame(
    miniGameId: MiniGameId,
    score: number,
  ): MiniGameCompletionResult | null;
  failMiniGame(miniGameId: MiniGameId): boolean;
  activateMiniGameFromEvent(eventId: EventId): MiniGameActivationResult | null;
  getMiniGame(miniGameId: MiniGameId): MiniGame | null;
}

type MiniGameStoreReader = () => Record<string, MiniGame>;
type MiniGameStoreWriter = (
  miniGameId: MiniGameId,
  updater: (current: MiniGame) => MiniGame,
) => void;
type ContextReader = () => MiniGameEvaluationContext;

export function createMiniGameService(
  readMiniGames: MiniGameStoreReader,
  writeMiniGame: MiniGameStoreWriter,
  readContext: ContextReader,
  rewardCallbacks: MiniGameRewardCallbacks,
): MiniGameService {
  function getMiniGameOrNull(miniGameId: MiniGameId): MiniGame | null {
    return readMiniGames()[miniGameId] ?? null;
  }

  function writeMiniGameIfExists(
    miniGameId: MiniGameId,
    updater: (current: MiniGame) => MiniGame,
  ): MiniGame | null {
    const current = getMiniGameOrNull(miniGameId);

    if (!current) {
      return null;
    }

    writeMiniGame(miniGameId, updater);
    return readMiniGames()[miniGameId] ?? null;
  }

  return {
    refreshAvailability() {
      const context = readContext();
      const miniGames = readMiniGames();

      for (const definition of MINIGAME_DEFINITIONS) {
        const miniGame = miniGames[definition.id];

        if (!miniGame) {
          continue;
        }

        const nextStatus = resolveNextMiniGameStatus(
          definition,
          miniGame,
          context,
        );

        if (nextStatus !== miniGame.status) {
          writeMiniGame(definition.id, (current) => ({
            ...current,
            status: nextStatus,
          }));
        }
      }
    },

    activateMiniGame(miniGameId, difficulty, sessionId) {
      if (!isRegisteredMiniGame(miniGameId)) {
        return null;
      }

      const definition = getMiniGameDefinition(miniGameId);
      const miniGame = getMiniGameOrNull(miniGameId);
      const context = readContext();

      if (!definition || !miniGame) {
        return null;
      }

      const now = new Date().toISOString();
      const resolvedDifficulty = resolveMiniGameDifficulty(definition, difficulty);
      const resolvedSessionId =
        sessionId ?? createMiniGameSessionId(miniGameId, now);

      let result: MiniGameActivationResult | null = null;

      const updated = writeMiniGameIfExists(miniGameId, (current) => {
        const activated = activateMiniGameInstance(
          current,
          definition,
          resolvedDifficulty,
          now,
          resolvedSessionId,
          context,
        );

        if (!activated) {
          return current;
        }

        result = {
          miniGameId,
          difficulty: resolvedDifficulty,
          sessionId: resolvedSessionId,
        };

        return activated;
      });

      if (!updated || !result) {
        return null;
      }

      return result;
    },

    completeMiniGame(miniGameId, score) {
      if (!isRegisteredMiniGame(miniGameId)) {
        return null;
      }

      const definition = getMiniGameDefinition(miniGameId);
      const miniGame = getMiniGameOrNull(miniGameId);

      if (!definition || !miniGame || miniGame.status !== "active") {
        return null;
      }

      const difficulty =
        miniGame.selectedDifficulty ?? definition.defaultDifficulty;
      const previousHighScore = miniGame.highScoreByDifficulty[difficulty] ?? 0;
      const now = new Date().toISOString();
      const rewards = getCompletionRewards(definition, difficulty);

      const updated = writeMiniGameIfExists(miniGameId, (current) => {
        const completed = completeMiniGameInstance(current, score, now);

        if (!completed) {
          return current;
        }

        return completed;
      });

      if (!updated) {
        return null;
      }

      const rewardResult = applyMiniGameRewards(rewards, rewardCallbacks);

      this.refreshAvailability();

      return {
        miniGameId,
        difficulty,
        score,
        rewards,
        rewardResult,
        isNewHighScore: score > previousHighScore,
      };
    },

    failMiniGame(miniGameId) {
      if (!isRegisteredMiniGame(miniGameId)) {
        return false;
      }

      const miniGame = getMiniGameOrNull(miniGameId);

      if (!miniGame || miniGame.status !== "active") {
        return false;
      }

      const now = new Date().toISOString();
      let failed = false;

      writeMiniGameIfExists(miniGameId, (current) => {
        const next = failMiniGameInstance(current, now);

        if (!next) {
          return current;
        }

        failed = true;
        return next;
      });

      if (failed) {
        this.refreshAvailability();
      }

      return failed;
    },

    activateMiniGameFromEvent(eventId) {
      const miniGameId = getMiniGameIdFromEvent(eventId);

      if (!miniGameId) {
        return null;
      }

      return this.activateMiniGame(miniGameId);
    },

    getMiniGame(miniGameId) {
      return getMiniGameOrNull(miniGameId);
    },
  };
}

export function getRegisteredMiniGameDefinitions() {
  return MINIGAME_DEFINITIONS;
}
