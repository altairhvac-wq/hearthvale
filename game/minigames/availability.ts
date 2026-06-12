import { isUnlockRequirementMet } from "@/game/unlock/requirements";
import type {
  MiniGame,
  MiniGameDefinition,
  MiniGameGate,
} from "@/types";
import type { MiniGameEvaluationContext } from "./context";

export function isMiniGameRegionRequirementMet(
  definition: MiniGameDefinition,
  context: MiniGameEvaluationContext,
): boolean {
  const requiredRegionId = definition.availability.regionId;

  if (!requiredRegionId) {
    return true;
  }

  return context.activeRegionId === requiredRegionId;
}

function isMiniGameGateMet(
  gate: MiniGameGate,
  context: MiniGameEvaluationContext,
): boolean {
  switch (gate.kind) {
    case "quest_completed":
    case "restoration_completed":
    case "skill_level":
    case "region_state":
    case "merchant_stage":
    case "prosperity_tier":
      return isUnlockRequirementMet(gate, context);
    case "event_completed": {
      const instance = context.events.instances[gate.eventId];
      return (instance?.completionCount ?? 0) > 0;
    }
    case "minigame_completed": {
      const miniGame = context.minigames[gate.miniGameId];

      if (!miniGame || miniGame.completionCount === 0) {
        return false;
      }

      if (!gate.difficulty) {
        return true;
      }

      return (miniGame.highScoreByDifficulty[gate.difficulty] ?? 0) > 0;
    }
    case "season_active":
      return context.activeSeasonId === gate.seasonId;
  }
}

export function areMiniGameGatesMet(
  definition: MiniGameDefinition,
  context: MiniGameEvaluationContext,
): boolean {
  return definition.availability.gates.every((gate) =>
    isMiniGameGateMet(gate, context),
  );
}

export function isMiniGameSeasonActive(
  definition: MiniGameDefinition,
  context: MiniGameEvaluationContext,
): boolean {
  if (!definition.availability.seasonId) {
    return true;
  }

  return context.activeSeasonId === definition.availability.seasonId;
}

export function evaluateMiniGameAvailability(
  definition: MiniGameDefinition,
  miniGame: MiniGame,
  context: MiniGameEvaluationContext,
): boolean {
  if (miniGame.status === "active") {
    return true;
  }

  if (!isMiniGameSeasonActive(definition, context)) {
    return false;
  }

  return areMiniGameGatesMet(definition, context);
}

export function shouldMiniGameBeAvailable(
  definition: MiniGameDefinition,
  miniGame: MiniGame,
  context: MiniGameEvaluationContext,
): boolean {
  if (miniGame.status === "active") {
    return false;
  }

  if (
    miniGame.status === "completed" &&
    !definition.availability.repeatable
  ) {
    return false;
  }

  return evaluateMiniGameAvailability(definition, miniGame, context);
}

export function resolveNextMiniGameStatus(
  definition: MiniGameDefinition,
  miniGame: MiniGame,
  context: MiniGameEvaluationContext,
): MiniGame["status"] {
  if (miniGame.status === "active") {
    return "active";
  }

  if (
    miniGame.status === "completed" &&
    !definition.availability.repeatable
  ) {
    return "completed";
  }

  if (shouldMiniGameBeAvailable(definition, miniGame, context)) {
    return "available";
  }

  if (
    miniGame.status === "completed" ||
    miniGame.status === "failed"
  ) {
    return "locked";
  }

  return "locked";
}
