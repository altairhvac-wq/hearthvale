import type { GameReward } from "./reward";
import type { Rarity } from "./rarity";
import type { UnlockRequirement } from "./unlock-requirement";
import type { EventId, RegionId, SeasonId } from "./ids";

export type EventCategory =
  | "festival"
  | "visitor"
  | "animal_encounter"
  | "discovery"
  | "merchant"
  | "story"
  | "minigame_trigger";

export type EventStatus =
  | "locked"
  | "available"
  | "active"
  | "completed"
  | "expired";

/** Gates evaluated by the event availability engine. */
export type EventGate =
  | UnlockRequirement
  | { kind: "event_completed"; eventId: EventId }
  | { kind: "season_active"; seasonId: SeasonId };

export interface EventAvailabilityRules {
  /** Structured gates — quest, skill, region, seasonal, and event dependencies. */
  gates: EventGate[];
  /** Evaluations to wait after completion before this event can appear again. */
  cooldownEvaluations: number;
  /** Base weight for weighted random selection. */
  selectionWeight: number;
  /** Minimum scheduler evaluations before this event can be selected. */
  minEvaluationCount: number;
  /** When set, the event only appears during this season. Null means year-round. */
  seasonId: SeasonId | null;
}

/** Static catalog entry — logic lives in game/events services. */
export interface EventDefinition {
  id: EventId;
  title: string;
  description: string;
  category: EventCategory;
  rarity: Rarity;
  regionId: RegionId | null;
  rewards: GameReward[];
  /** Shown in UI for future systems not yet wired to GameReward. */
  bonusRewardDescriptions: string[];
  availability: EventAvailabilityRules;
  sortOrder: number;
  /** Extensibility for mini-games, merchants, story arcs, and multiplayer. */
  metadata: Record<string, string | number | boolean>;
}

/** Per-valley runtime progress for one event definition. */
export interface EventInstance {
  id: EventId;
  status: EventStatus;
  availableAt: string | null;
  activatedAt: string | null;
  completedAt: string | null;
  expiredAt: string | null;
  completionCount: number;
  /** Evaluation count when this instance last completed — drives cooldowns. */
  lastCompletedEvaluation: number | null;
}

/** Festival Cart scheduling state — valley-scoped, no real-time timers in V1. */
export interface EventSchedulerState {
  evaluationCount: number;
  lastEvaluatedAt: string | null;
  /** Evaluations remaining before the cart can bring another event. */
  cartCooldownRemaining: number;
  /** Event currently featured by the traveling cart, if any. */
  featuredEventId: EventId | null;
  lastCartArrivalAt: string | null;
}

export interface EventsState {
  instances: Record<string, EventInstance>;
  scheduler: EventSchedulerState;
}
