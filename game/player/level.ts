import { MAX_SKILL_LEVEL } from "@/game/constants/skills";
import {
  getCurrentXpWithinLevel,
  getLevelFromTotalXp,
  getProgressRatio,
  getXpToNextLevel,
} from "@/game/skills/xp";
import type { SkillProgress } from "@/types";

export interface PlayerLevelInfo {
  level: number;
  totalXp: number;
  currentXp: number;
  xpRequiredForNextLevel: number;
  progressRatio: number;
  isMaxLevel: boolean;
}

/** Aggregate player level derived from total skill XP — not persisted separately. */
export function computePlayerLevelInfo(
  skills: Record<string, SkillProgress>,
): PlayerLevelInfo {
  const totalXp = Object.values(skills).reduce(
    (sum, progress) => sum + progress.totalXp,
    0,
  );
  const level = getLevelFromTotalXp(totalXp, MAX_SKILL_LEVEL);
  const isMaxLevel = level >= MAX_SKILL_LEVEL;

  return {
    level,
    totalXp,
    currentXp: getCurrentXpWithinLevel(totalXp, level),
    xpRequiredForNextLevel: isMaxLevel
      ? 0
      : getXpToNextLevel(totalXp, level, MAX_SKILL_LEVEL),
    progressRatio: getProgressRatio(totalXp, level, MAX_SKILL_LEVEL),
    isMaxLevel,
  };
}
