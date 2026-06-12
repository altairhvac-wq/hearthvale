import type { SkillId, UnlockId } from "./ids";

/** Perk slots reserved for future gameplay modifiers. */
export type SkillPerkType =
  | "yield_bonus"
  | "speed_bonus"
  | "discovery_bonus"
  | "bond_bonus"
  | "craft_efficiency"
  | "unlock_gate";

export interface SkillPerk {
  id: string;
  type: SkillPerkType;
  value: number;
  description: string;
}

export interface SkillUnlock {
  id: UnlockId;
  skillId: SkillId;
  level: number;
  title: string;
  description: string;
  perks: SkillPerk[];
}

export interface SkillDefinition {
  id: SkillId;
  name: string;
  description: string;
  iconKey: string;
  maxLevel: number;
  unlocks: SkillUnlock[];
}

/** Static skill metadata combined with runtime progress. */
export interface PlayerSkill {
  definition: SkillDefinition;
  progress: SkillProgress;
  unlockedMilestones: SkillUnlock[];
  activePerks: SkillPerk[];
}

/** Persisted skill progress — totals are source of truth; levels are derived. */
export interface SkillProgress {
  skillId: SkillId;
  totalXp: number;
}

/** Computed view of a skill's current progression state. */
export interface SkillLevelInfo {
  skillId: SkillId;
  level: number;
  currentXp: number;
  xpRequiredForNextLevel: number;
  totalXp: number;
  progressRatio: number;
  isMaxLevel: boolean;
}
