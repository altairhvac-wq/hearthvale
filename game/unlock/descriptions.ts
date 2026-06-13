import { QUEST_DEFINITIONS } from "@/game/constants/quests";
import { getMerchantStageDefinition } from "@/game/constants/merchant";
import { getProsperityTierByLevel } from "@/game/constants/prosperity";
import { tryGetSkillDefinition } from "@/game/skills";
import { getRegionDefinitionName } from "@/game/regions/state";
import type { UnlockRequirement } from "@/types";

export function describeUnlockRequirement(
  requirement: UnlockRequirement,
): string {
  switch (requirement.kind) {
    case "quest_completed": {
      const quest = QUEST_DEFINITIONS.find((entry) => entry.id === requirement.questId);
      return quest
        ? `Finish the tale: ${quest.title}`
        : "Finish a story the valley is waiting for";
    }
    case "restoration_completed":
      return "Complete a restoration project";
    case "skill_level": {
      const skill = tryGetSkillDefinition(requirement.skillId);
      const skillName = skill?.name ?? "Skill";
      return `Reach ${skillName} level ${requirement.level}`;
    }
    case "region_state": {
      const regionLabel = getRegionDefinitionName(requirement.regionId);
      return requirement.state === "restored"
        ? `Bring ${regionLabel} back to life`
        : `Find your way to ${regionLabel}`;
    }
    case "merchant_stage": {
      const stage = getMerchantStageDefinition(requirement.stageId);
      return stage
        ? `Grow ${stage.title} to feel truly settled`
        : "Tend your stand until the village notices";
    }
    case "prosperity_tier": {
      const tier = getProsperityTierByLevel(requirement.minTier);
      return `Earn the valley's trust — reach ${tier.title}`;
    }
  }
}
