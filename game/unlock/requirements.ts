import { getQuestDefinition } from "@/game/constants/quests";
import type { UnlockRequirement } from "@/types";
import type { UnlockEvaluationContext } from "./context";

export function isUnlockRequirementMet(
  requirement: UnlockRequirement,
  context?: UnlockEvaluationContext,
): boolean {
  if (!context) {
    return false;
  }

  switch (requirement.kind) {
    case "quest_completed": {
      const quest = context.quests[requirement.questId];
      return quest?.status === "completed";
    }
    case "restoration_completed": {
      const project = context.restoration[requirement.projectId];
      return project?.status === "completed";
    }
    case "skill_level":
      return (
        context.getSkillLevel(requirement.skillId) >= requirement.level
      );
    case "region_state": {
      const region = context.regions[requirement.regionId];
      if (!region) {
        return false;
      }
      if (requirement.state === "restored") {
        return region.state === "restored";
      }
      return region.state === "unlocked" || region.state === "restored";
    }
    case "merchant_stage": {
      const stage = context.merchant?.stages[requirement.stageId];
      return (stage?.level ?? 0) >= requirement.minLevel;
    }
    case "prosperity_tier": {
      const tier = context.getProsperityTier?.() ?? 0;
      return tier >= requirement.minTier;
    }
  }
}

export function isUnlockRequirementDefined(
  requirement: UnlockRequirement | null,
): requirement is UnlockRequirement {
  return requirement !== null;
}

export function describeQuestUnlockRequirement(questId: string): string | null {
  const quest = getQuestDefinition(questId);
  return quest ? `Complete quest: ${quest.title}` : null;
}
