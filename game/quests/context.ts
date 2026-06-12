import type { PlayerResources, SeasonId } from "@/types";
import type { UnlockEvaluationContext } from "@/game/unlock/context";

/** Extended context for quest objective evaluation and availability checks. */
export interface QuestEvaluationContext extends UnlockEvaluationContext {
  playerResources: PlayerResources;
  /** Active seasonal event id — null when no seasonal content is running. */
  activeSeasonId: SeasonId | null;
}

export type QuestContextSource = Pick<
  UnlockEvaluationContext,
  "quests" | "skills" | "regions" | "restoration" | "getSkillLevel"
> & {
  playerResources: PlayerResources;
  activeSeasonId?: SeasonId | null;
};

export function buildQuestEvaluationContext(
  source: QuestContextSource,
): QuestEvaluationContext {
  return {
    quests: source.quests,
    skills: source.skills,
    regions: source.regions,
    restoration: source.restoration,
    getSkillLevel: source.getSkillLevel,
    playerResources: source.playerResources,
    activeSeasonId: source.activeSeasonId ?? null,
  };
}
