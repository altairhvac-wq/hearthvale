import { SKILL_DEFINITIONS, type CoreSkillId } from "@/game/constants/skills";
import type { SkillId, SkillLevelInfo, SkillProgress, SkillUnlock } from "@/types";
import {
  getCurrentXpWithinLevel,
  getLevelFromTotalXp,
  getProgressRatio,
  getTotalXpForLevel,
  getXpToNextLevel,
} from "./xp";

export function tryGetSkillDefinition(skillId: SkillId) {
  return SKILL_DEFINITIONS[skillId as CoreSkillId] ?? null;
}

export function getSkillDefinition(skillId: SkillId) {
  const definition = tryGetSkillDefinition(skillId);

  if (!definition) {
    throw new Error(`Unknown skill: ${skillId}`);
  }

  return definition;
}

export function computeSkillLevelInfo(progress: SkillProgress): SkillLevelInfo {
  const definition = getSkillDefinition(progress.skillId);
  const level = getLevelFromTotalXp(progress.totalXp, definition.maxLevel);
  const isMaxLevel = level >= definition.maxLevel;

  return {
    skillId: progress.skillId,
    level,
    currentXp: getCurrentXpWithinLevel(progress.totalXp, level),
    xpRequiredForNextLevel: isMaxLevel
      ? 0
      : getXpToNextLevel(progress.totalXp, level, definition.maxLevel),
    totalXp: progress.totalXp,
    progressRatio: getProgressRatio(
      progress.totalXp,
      level,
      definition.maxLevel,
    ),
    isMaxLevel,
  };
}

export function getUnlocksForSkillAtLevel(
  skillId: SkillId,
  level: number,
): SkillUnlock[] {
  const definition = getSkillDefinition(skillId);

  return definition.unlocks.filter((unlock) => unlock.level <= level);
}

export function getNextUnlockForSkill(
  skillId: SkillId,
  level: number,
): SkillUnlock | null {
  const definition = getSkillDefinition(skillId);

  return (
    definition.unlocks
      .filter((unlock) => unlock.level > level)
      .sort((a, b) => a.level - b.level)[0] ?? null
  );
}

export function createInitialSkillProgress(skillId: SkillId): SkillProgress {
  return {
    skillId,
    totalXp: 0,
  };
}

export function applySkillXp(
  progress: SkillProgress,
  amount: number,
): { progress: SkillProgress; levelsGained: number; newUnlocks: SkillUnlock[] } {
  if (amount <= 0) {
    return { progress, levelsGained: 0, newUnlocks: [] };
  }

  const definition = getSkillDefinition(progress.skillId);
  const previousLevel = getLevelFromTotalXp(
    progress.totalXp,
    definition.maxLevel,
  );

  const nextTotalXp = progress.totalXp + amount;
  const maxTotalXp = getTotalXpForLevel(definition.maxLevel + 1) - 1;
  const cappedTotalXp = Math.min(nextTotalXp, maxTotalXp);

  const nextLevel = getLevelFromTotalXp(
    cappedTotalXp,
    definition.maxLevel,
  );

  const newUnlocks =
    nextLevel > previousLevel
      ? definition.unlocks.filter(
          (unlock) => unlock.level > previousLevel && unlock.level <= nextLevel,
        )
      : [];

  return {
    progress: {
      skillId: progress.skillId,
      totalXp: cappedTotalXp,
    },
    levelsGained: nextLevel - previousLevel,
    newUnlocks,
  };
}
