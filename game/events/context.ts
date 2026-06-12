import type { SeasonId } from "@/types";
import type { UnlockEvaluationContext } from "@/game/unlock/context";

/** Extended context for event availability, scheduling, and activation. */
export interface EventEvaluationContext extends UnlockEvaluationContext {
  /** Active seasonal event id — null when no seasonal content is running. */
  activeSeasonId: SeasonId | null;
}

export type EventContextSource = Pick<
  UnlockEvaluationContext,
  "quests" | "skills" | "regions" | "restoration" | "getSkillLevel"
> & {
  activeSeasonId?: SeasonId | null;
};

export function buildEventEvaluationContext(
  source: EventContextSource,
): EventEvaluationContext {
  return {
    quests: source.quests,
    skills: source.skills,
    regions: source.regions,
    restoration: source.restoration,
    getSkillLevel: source.getSkillLevel,
    activeSeasonId: source.activeSeasonId ?? null,
  };
}
