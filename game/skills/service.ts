import type { SkillId, SkillUnlock } from "@/types";
import { isRegisteredSkill } from "./registry";
import {
  applySkillXp,
  computeSkillLevelInfo,
  getUnlocksForSkillAtLevel,
} from "./progression";

export interface SkillXpAwardResult {
  skillId: SkillId;
  amountAwarded: number;
  previousLevel: number;
  newLevel: number;
  levelsGained: number;
  newUnlocks: SkillUnlock[];
}

export interface SkillXpService {
  awardXp(skillId: SkillId, amount: number): SkillXpAwardResult | null;
  getLevel(skillId: SkillId): number;
  getUnlocks(skillId: SkillId): SkillUnlock[];
}

type SkillStoreReader = () => Record<string, { skillId: SkillId; totalXp: number }>;
type SkillStoreWriter = (
  skillId: SkillId,
  updater: (current: { skillId: SkillId; totalXp: number }) => {
    skillId: SkillId;
    totalXp: number;
  },
) => void;

/**
 * Factory for the centralized skill XP service.
 * Gameplay systems should award XP through this service — never by mutating store slices directly.
 */
export function createSkillXpService(
  readSkills: SkillStoreReader,
  writeSkill: SkillStoreWriter,
): SkillXpService {
  return {
    awardXp(skillId, amount) {
      if (!isRegisteredSkill(skillId) || amount <= 0) {
        return null;
      }

      const skills = readSkills();
      const current = skills[skillId];

      if (!current) {
        return null;
      }

      const previousLevel = computeSkillLevelInfo(current).level;
      const result = applySkillXp(current, amount);

      writeSkill(skillId, () => result.progress);

      const newLevel = computeSkillLevelInfo(result.progress).level;

      return {
        skillId,
        amountAwarded: amount,
        previousLevel,
        newLevel,
        levelsGained: result.levelsGained,
        newUnlocks: result.newUnlocks,
      };
    },

    getLevel(skillId) {
      const skills = readSkills();
      const progress = skills[skillId];

      if (!progress) {
        return 1;
      }

      return computeSkillLevelInfo(progress).level;
    },

    getUnlocks(skillId) {
      const level = this.getLevel(skillId);
      return getUnlocksForSkillAtLevel(skillId, level);
    },
  };
}

export {
  computeSkillLevelInfo,
  getUnlocksForSkillAtLevel,
  applySkillXp,
} from "./progression";

export { getTotalXpForLevel, getLevelFromTotalXp } from "./xp";
