import type { RegionId, SeasonId } from "@/types";
import type { UnlockEvaluationContext } from "@/game/unlock/context";
import type { EventsState, MiniGame, Quest } from "@/types";

/** Extended context for mini-game availability and event integration. */
export interface MiniGameEvaluationContext extends UnlockEvaluationContext {
  minigames: Record<string, MiniGame>;
  events: EventsState;
  quests: Record<string, Quest>;
  activeRegionId: RegionId | null;
  activeSeasonId: SeasonId | null;
}

export type MiniGameContextSource = Pick<
  UnlockEvaluationContext,
  "quests" | "skills" | "regions" | "restoration" | "getSkillLevel"
> & {
  minigames: Record<string, MiniGame>;
  events: EventsState;
  activeRegionId?: RegionId | null;
  activeSeasonId?: SeasonId | null;
};

export function buildMiniGameEvaluationContext(
  source: MiniGameContextSource,
): MiniGameEvaluationContext {
  return {
    quests: source.quests,
    skills: source.skills,
    regions: source.regions,
    restoration: source.restoration,
    getSkillLevel: source.getSkillLevel,
    minigames: source.minigames,
    events: source.events,
    activeRegionId: source.activeRegionId ?? null,
    activeSeasonId: source.activeSeasonId ?? null,
  };
}
