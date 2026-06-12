import { QUEST_DEFINITIONS } from "@/game/constants/quests";
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
        ? `Complete quest: ${quest.title}`
        : "Complete a required quest";
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
        ? `Fully restore ${regionLabel}`
        : `Unlock ${regionLabel}`;
    }
  }
}
