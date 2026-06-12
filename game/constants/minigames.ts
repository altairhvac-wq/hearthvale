import {
  createId,
  type GameReward,
  type MiniGameDefinition,
  type MiniGameDifficulty,
  type MiniGameId,
  type MiniGameStatus,
} from "@/types";
import { QUEST_IDS } from "./quests";
import { REGION_IDS } from "./regions";
import { RESOURCE_IDS } from "./resources";
import { SKILL_IDS } from "./skills";

export const MINIGAME_IDS = {
  FISHING_DERBY: createId<"MiniGameId">("fishing_derby"),
  ANIMAL_RESCUE: createId<"MiniGameId">("animal_rescue"),
} as const;

export type CoreMiniGameId = (typeof MINIGAME_IDS)[keyof typeof MINIGAME_IDS];

export const MINIGAME_STATUSES = [
  "locked",
  "available",
  "active",
  "completed",
  "failed",
] as const satisfies readonly MiniGameStatus[];

export const MINIGAME_DIFFICULTIES = [
  "easy",
  "normal",
  "hard",
  "expert",
] as const satisfies readonly MiniGameDifficulty[];

export const MINIGAME_DEFINITIONS = [
  {
    id: MINIGAME_IDS.FISHING_DERBY,
    name: "Fishing Derby",
    description:
      "Catch as many fish as possible before time runs out.",
    category: "fishing",
    associatedSkillId: SKILL_IDS.FISHING,
    defaultDifficulty: "normal",
    supportedDifficulties: MINIGAME_DIFFICULTIES,
    availability: {
      gates: [
        { kind: "quest_completed", questId: QUEST_IDS.MEET_THE_VALLEY },
        { kind: "skill_level", skillId: SKILL_IDS.FISHING, level: 1 },
      ],
      repeatable: true,
      regionId: REGION_IDS.DOCK,
      seasonId: null,
    },
    rewardsByDifficulty: {
      easy: [
        { type: "skill_xp", skillId: SKILL_IDS.FISHING, amount: 25 },
        { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 30 },
      ],
      normal: [
        { type: "skill_xp", skillId: SKILL_IDS.FISHING, amount: 50 },
        { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 60 },
      ],
      hard: [
        { type: "skill_xp", skillId: SKILL_IDS.FISHING, amount: 80 },
        { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 100 },
      ],
      expert: [
        { type: "skill_xp", skillId: SKILL_IDS.FISHING, amount: 120 },
        { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 150 },
        { type: "resource", resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 1 },
      ],
    },
    sortOrder: 0,
    metadata: {
      time_limit_seconds: 60,
      tournament_ready: true,
    },
    linkedEventId: null,
  },
  {
    id: MINIGAME_IDS.ANIMAL_RESCUE,
    name: "Animal Rescue",
    description:
      "Help guide a lost animal back to safety.",
    category: "rescue",
    associatedSkillId: SKILL_IDS.ANIMAL_CARE,
    defaultDifficulty: "normal",
    supportedDifficulties: MINIGAME_DIFFICULTIES,
    availability: {
      gates: [
        { kind: "quest_completed", questId: QUEST_IDS.MEET_THE_VALLEY },
      ],
      repeatable: true,
      regionId: REGION_IDS.FOREST,
      seasonId: null,
    },
    rewardsByDifficulty: {
      easy: [
        { type: "skill_xp", skillId: SKILL_IDS.ANIMAL_CARE, amount: 30 },
        { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 2 },
      ],
      normal: [
        { type: "skill_xp", skillId: SKILL_IDS.ANIMAL_CARE, amount: 55 },
        { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 4 },
      ],
      hard: [
        { type: "skill_xp", skillId: SKILL_IDS.ANIMAL_CARE, amount: 85 },
        { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 6 },
      ],
      expert: [
        { type: "skill_xp", skillId: SKILL_IDS.ANIMAL_CARE, amount: 110 },
        { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 8 },
        { type: "resource", resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 1 },
      ],
    },
    sortOrder: 1,
    metadata: {
      animal_rescue_mode: "guide_home",
      multiplayer_ready: true,
    },
    linkedEventId: null,
  },
] as const satisfies ReadonlyArray<MiniGameDefinition>;

export function isRegisteredMiniGame(
  miniGameId: string,
): miniGameId is CoreMiniGameId {
  return MINIGAME_DEFINITIONS.some((entry) => entry.id === miniGameId);
}

export function getMiniGameDefinition(
  miniGameId: MiniGameId | string,
): MiniGameDefinition | undefined {
  return MINIGAME_DEFINITIONS.find((entry) => entry.id === miniGameId);
}

export function getMiniGameRewardsForDifficulty(
  definition: MiniGameDefinition,
  difficulty: MiniGameDifficulty,
): GameReward[] {
  return (
    definition.rewardsByDifficulty[difficulty] ??
    definition.rewardsByDifficulty.normal ??
    definition.rewardsByDifficulty.easy ??
    []
  );
}

export function resolveMiniGameDifficulty(
  definition: MiniGameDefinition,
  difficulty?: MiniGameDifficulty,
): MiniGameDifficulty {
  const requested = difficulty ?? definition.defaultDifficulty;

  if (definition.supportedDifficulties.includes(requested)) {
    return requested;
  }

  return definition.defaultDifficulty;
}

export function isMiniGameDifficultySupported(
  definition: MiniGameDefinition,
  difficulty: MiniGameDifficulty,
): boolean {
  return definition.supportedDifficulties.includes(difficulty);
}
