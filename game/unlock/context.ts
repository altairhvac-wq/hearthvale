import type {
  Quest,
  Region,
  RestorationProject,
  SkillId,
  SkillProgress,
} from "@/types";

export interface UnlockEvaluationContext {
  quests: Record<string, Quest>;
  skills: Record<string, SkillProgress>;
  regions: Record<string, Region>;
  restoration: Record<string, RestorationProject>;
  getSkillLevel: (skillId: SkillId) => number;
}
