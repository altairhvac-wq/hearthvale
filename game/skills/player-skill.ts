import type { SkillId, SkillProgress, PlayerSkill } from "@/types";
import {
  computeSkillLevelInfo,
  getUnlocksForSkillAtLevel,
  tryGetSkillDefinition,
} from "./progression";

export function buildPlayerSkill(
  skillId: SkillId,
  progress: SkillProgress,
): PlayerSkill | null {
  const definition = tryGetSkillDefinition(skillId);

  if (!definition) {
    return null;
  }

  const levelInfo = computeSkillLevelInfo(progress);
  const unlockedMilestones = getUnlocksForSkillAtLevel(skillId, levelInfo.level);
  const activePerks = unlockedMilestones.flatMap((unlock) => unlock.perks);

  return {
    definition,
    progress,
    unlockedMilestones,
    activePerks,
  };
}
