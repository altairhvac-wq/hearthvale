import type { EventId, MiniGameId, RegionId, SeasonId, SkillId } from "./ids";
import type { GameReward } from "./reward";
import type { UnlockRequirement } from "./unlock-requirement";

export type MiniGameCategory =
  | "fishing"
  | "rescue"
  | "puzzle"
  | "crafting"
  | "exploration"
  | "seasonal";

export type MiniGameStatus =
  | "locked"
  | "available"
  | "active"
  | "completed"
  | "failed";

export type MiniGameDifficulty = "easy" | "normal" | "hard" | "expert";

/** Gates evaluated by the mini-game availability engine. */
export type MiniGameGate =
  | UnlockRequirement
  | { kind: "event_completed"; eventId: EventId }
  | { kind: "minigame_completed"; miniGameId: MiniGameId; difficulty?: MiniGameDifficulty }
  | { kind: "season_active"; seasonId: SeasonId };

export interface MiniGameAvailabilityRules {
  gates: MiniGameGate[];
  /** When false, a completed mini-game stays completed. */
  repeatable: boolean;
  /** Optional region where the mini-game can be played. */
  regionId: RegionId | null;
  /** When set, the mini-game only appears during this season. Null means year-round. */
  seasonId: SeasonId | null;
}

/** Static catalog entry — gameplay logic lives in future feature modules. */
export interface MiniGameDefinition {
  id: MiniGameId;
  name: string;
  description: string;
  category: MiniGameCategory;
  associatedSkillId: SkillId;
  defaultDifficulty: MiniGameDifficulty;
  supportedDifficulties: readonly MiniGameDifficulty[];
  availability: MiniGameAvailabilityRules;
  /** Completion rewards keyed by difficulty — falls back to normal when absent. */
  rewardsByDifficulty: Partial<Record<MiniGameDifficulty, GameReward[]>>;
  sortOrder: number;
  /** Extensibility for boat routes, tournaments, leaderboards, and multiplayer. */
  metadata: Record<string, string | number | boolean>;
  /** Optional event that can trigger this mini-game via the event system. */
  linkedEventId: EventId | null;
}

/** Per-valley runtime progress for one mini-game definition. */
export interface MiniGame {
  id: MiniGameId;
  status: MiniGameStatus;
  selectedDifficulty: MiniGameDifficulty | null;
  highScoreByDifficulty: Partial<Record<MiniGameDifficulty, number>>;
  participationCount: number;
  completionCount: number;
  failureCount: number;
  lastPlayedAt: string | null;
  activatedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  /** Multiplayer-ready session anchor — null in solo V1. */
  activeSessionId: string | null;
}
