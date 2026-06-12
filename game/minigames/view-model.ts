import { MINIGAME_DEFINITIONS } from "@/game/constants/minigames";
import { getRegionDefinitionName } from "@/game/regions/state";
import { tryGetSkillDefinition } from "@/game/skills";
import type {
  GameReward,
  MiniGame,
  MiniGameCategory,
  MiniGameDifficulty,
  MiniGameId,
  MiniGameStatus,
} from "@/types";
import {
  areMiniGameGatesMet,
  evaluateMiniGameAvailability,
  isMiniGameRegionRequirementMet,
  shouldMiniGameBeAvailable,
} from "./availability";
import type { MiniGameEvaluationContext } from "./context";
import { canActivateMiniGame } from "./progression";
import { describeMiniGameReward } from "./rewards";

export interface MiniGameRewardViewModel {
  description: string;
  reward: GameReward;
  difficulty: MiniGameDifficulty;
}

export interface MiniGameDifficultyViewModel {
  difficulty: MiniGameDifficulty;
  rewards: MiniGameRewardViewModel[];
  highScore: number;
  isSupported: boolean;
}

export interface MiniGameViewModel {
  id: MiniGameId;
  name: string;
  description: string;
  category: MiniGameCategory;
  associatedSkillName: string;
  regionName: string | null;
  status: MiniGameStatus;
  defaultDifficulty: MiniGameDifficulty;
  selectedDifficulty: MiniGameDifficulty | null;
  difficulties: MiniGameDifficultyViewModel[];
  participationCount: number;
  completionCount: number;
  failureCount: number;
  isAvailable: boolean;
  canActivate: boolean;
  canActivateInCurrentRegion: boolean;
  isRepeatable: boolean;
  sortOrder: number;
  lastPlayedAt: string | null;
  completedAt: string | null;
}

export interface MiniGameJournalSection {
  id: "available" | "active" | "completed" | "failed";
  title: string;
  subtitle: string;
  miniGames: MiniGameViewModel[];
}

export interface MiniGameJournalData {
  sections: MiniGameJournalSection[];
  availableMiniGames: MiniGameViewModel[];
  activeMiniGames: MiniGameViewModel[];
  completedMiniGames: MiniGameViewModel[];
  failedMiniGames: MiniGameViewModel[];
  lockedCount: number;
  totalMiniGames: number;
  visibleCount: number;
}

function buildDifficultyViewModels(
  definition: (typeof MINIGAME_DEFINITIONS)[number],
  miniGame: MiniGame,
): MiniGameDifficultyViewModel[] {
  return definition.supportedDifficulties.map((difficulty) => ({
    difficulty,
    isSupported: true,
    highScore: miniGame.highScoreByDifficulty[difficulty] ?? 0,
    rewards: (definition.rewardsByDifficulty[difficulty] ?? []).map(
      (reward) => ({
        description: describeMiniGameReward(reward),
        reward,
        difficulty,
      }),
    ),
  }));
}

function buildMiniGameViewModel(
  definition: (typeof MINIGAME_DEFINITIONS)[number],
  miniGame: MiniGame,
  context: MiniGameEvaluationContext,
): MiniGameViewModel {
  const skill = tryGetSkillDefinition(definition.associatedSkillId);
  const canActivate =
    definition.supportedDifficulties.some((difficulty) =>
      canActivateMiniGame(definition, miniGame, difficulty, context),
    );

  return {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    category: definition.category,
    associatedSkillName: skill?.name ?? "Skill",
    regionName: definition.availability.regionId
      ? getRegionDefinitionName(definition.availability.regionId)
      : null,
    status: miniGame.status,
    defaultDifficulty: definition.defaultDifficulty,
    selectedDifficulty: miniGame.selectedDifficulty,
    difficulties: buildDifficultyViewModels(definition, miniGame),
    participationCount: miniGame.participationCount,
    completionCount: miniGame.completionCount,
    failureCount: miniGame.failureCount,
    isAvailable: shouldMiniGameBeAvailable(definition, miniGame, context),
    canActivate,
    canActivateInCurrentRegion: isMiniGameRegionRequirementMet(
      definition,
      context,
    ),
    isRepeatable: definition.availability.repeatable,
    sortOrder: definition.sortOrder,
    lastPlayedAt: miniGame.lastPlayedAt,
    completedAt: miniGame.completedAt,
  };
}

export function isMiniGameVisibleInJournal(
  definition: (typeof MINIGAME_DEFINITIONS)[number],
  miniGame: MiniGame,
  context: MiniGameEvaluationContext,
): boolean {
  if (miniGame.status !== "locked") {
    return true;
  }

  return areMiniGameGatesMet(definition, context);
}

export function buildMiniGameJournalData(
  miniGames: Record<string, MiniGame>,
  context: MiniGameEvaluationContext,
): MiniGameJournalData {
  const visibleMiniGames = MINIGAME_DEFINITIONS.filter((definition) => {
    const miniGame = miniGames[definition.id];
    return miniGame && isMiniGameVisibleInJournal(definition, miniGame, context);
  })
    .map((definition) => {
      const miniGame = miniGames[definition.id]!;

      return buildMiniGameViewModel(definition, miniGame, context);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const availableMiniGames = visibleMiniGames.filter(
    (entry) =>
      entry.isAvailable &&
      entry.status !== "active" &&
      entry.status !== "failed",
  );
  const activeMiniGames = visibleMiniGames.filter(
    (entry) => entry.status === "active",
  );
  const completedMiniGames = visibleMiniGames.filter(
    (entry) =>
      entry.status === "completed" ||
      (entry.status === "failed" && entry.completionCount > 0),
  );
  const failedMiniGames = visibleMiniGames.filter(
    (entry) => entry.status === "failed" && entry.completionCount === 0,
  );

  const lockedCount = MINIGAME_DEFINITIONS.filter((definition) => {
    const miniGame = miniGames[definition.id];

    if (!miniGame) {
      return true;
    }

    return (
      miniGame.status === "locked" &&
      !evaluateMiniGameAvailability(definition, miniGame, context)
    );
  }).length;

  const sections: MiniGameJournalSection[] = [
    {
      id: "available",
      title: "Ready to Play",
      subtitle: "Mini-games unlocked and waiting for you",
      miniGames: availableMiniGames,
    },
    {
      id: "active",
      title: "In Progress",
      subtitle: "Mini-games you have started",
      miniGames: activeMiniGames,
    },
    {
      id: "completed",
      title: "Completed",
      subtitle: "Victories and high scores earned",
      miniGames: completedMiniGames,
    },
    {
      id: "failed",
      title: "Recent Attempts",
      subtitle: "Try again when you are ready",
      miniGames: failedMiniGames,
    },
  ];

  return {
    sections,
    availableMiniGames,
    activeMiniGames,
    completedMiniGames,
    failedMiniGames,
    lockedCount,
    totalMiniGames: MINIGAME_DEFINITIONS.length,
    visibleCount: visibleMiniGames.length,
  };
}
