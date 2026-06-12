import { ALL_SKILL_IDS } from "@/game/constants/skills";
import type { SkillId, SkillProgress } from "@/types";
import { createInitialSkillProgress } from "./progression";

const REGISTERED_SKILL_IDS = new Set<string>(ALL_SKILL_IDS);

export function createInitialSkillsState(): Record<string, SkillProgress> {
  return ALL_SKILL_IDS.reduce<Record<string, SkillProgress>>((acc, skillId) => {
    acc[skillId] = createInitialSkillProgress(skillId);
    return acc;
  }, {});
}

export function normalizeSkillsState(
  skills: Record<string, SkillProgress> | undefined,
): Record<string, SkillProgress> {
  const base = createInitialSkillsState();

  if (!skills) {
    return base;
  }

  for (const skillId of ALL_SKILL_IDS) {
    const existing = skills[skillId];

    if (isValidSkillProgress(existing, skillId)) {
      base[skillId] = existing;
    }
  }

  return base;
}

function isValidSkillProgress(
  value: SkillProgress | undefined,
  skillId: SkillId,
): value is SkillProgress {
  return (
    value !== undefined &&
    value.skillId === skillId &&
    typeof value.totalXp === "number" &&
    Number.isFinite(value.totalXp) &&
    value.totalXp >= 0
  );
}

export function isRegisteredSkill(skillId: string): skillId is SkillId {
  return REGISTERED_SKILL_IDS.has(skillId);
}
