import { MAX_SKILL_LEVEL } from "@/game/constants/skills";

/**
 * RuneScape-inspired XP curve — familiar progression feel with cozy pacing.
 * Total XP required to reach `level` (level 1 = 0 XP).
 */
export function getTotalXpForLevel(level: number): number {
  if (level <= 1) {
    return 0;
  }

  let total = 0;
  for (let i = 1; i < level; i += 1) {
    total += Math.floor(i + 300 * 2 ** (i / 7));
  }

  return Math.floor(total / 4);
}

export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) {
    return getTotalXpForLevel(2);
  }

  return getTotalXpForLevel(level + 1) - getTotalXpForLevel(level);
}

export function getLevelFromTotalXp(totalXp: number, maxLevel: number): number {
  let level = 1;

  while (level < maxLevel && totalXp >= getTotalXpForLevel(level + 1)) {
    level += 1;
  }

  return level;
}

export function getCurrentXpWithinLevel(
  totalXp: number,
  level: number,
): number {
  return totalXp - getTotalXpForLevel(level);
}

export function getXpToNextLevel(
  totalXp: number,
  level: number,
  maxLevel: number,
): number {
  if (level >= maxLevel) {
    return 0;
  }

  return getTotalXpForLevel(level + 1) - totalXp;
}

export function getProgressRatio(
  totalXp: number,
  level: number,
  maxLevel: number,
): number {
  if (level >= maxLevel) {
    return 1;
  }

  const xpIntoLevel = getCurrentXpWithinLevel(totalXp, level);
  const xpForLevel = getXpRequiredForLevel(level);

  if (xpForLevel <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, xpIntoLevel / xpForLevel));
}

export function clampSkillLevel(level: number, maxLevel: number): number {
  return Math.min(Math.max(1, level), maxLevel);
}

export { MAX_SKILL_LEVEL };
