import { getItemDefinitionName } from "@/game/constants/items";
import { RESOURCE_DEFINITIONS } from "@/game/constants/resources";
import { QUEST_DEFINITIONS } from "@/game/constants/quests";
import { getAnimalDefinition } from "@/game/animals/definitions";
import { getRegionDefinitionName } from "@/game/regions/state";
import { tryGetSkillDefinition } from "@/game/skills";
import type { GameReward, ItemId, ResourceId, SkillId } from "@/types";
import type { UnlockReference } from "@/types";

export interface GameRewardCallbacks {
  awardResource: (resourceId: ResourceId, amount: number) => void;
  awardSkillXp: (skillId: SkillId, amount: number) => void;
  applyUnlock: (unlock: UnlockReference) => void;
  awardItem: (itemId: ItemId, amount: number) => void;
  awardProsperity: (amount: number) => void;
  awardReputation: (amount: number) => void;
}

export interface GameRewardApplicationResult {
  rewards: GameReward[];
  skillXpAwarded: Array<{ skillId: SkillId; amount: number }>;
  resourcesAwarded: Array<{ resourceId: ResourceId; amount: number }>;
  itemsAwarded: Array<{ itemId: ItemId; amount: number }>;
  unlocksApplied: UnlockReference[];
  prosperityAwarded: number;
  reputationAwarded: number;
}

export function describeGameReward(reward: GameReward): string {
  switch (reward.type) {
    case "resource": {
      const definition = RESOURCE_DEFINITIONS.find(
        (entry) => entry.id === reward.resourceId,
      );
      const name = definition?.name ?? "Resource";
      return `${reward.amount} ${name}`;
    }
    case "skill_xp": {
      const skill = tryGetSkillDefinition(reward.skillId);
      const name = skill?.name ?? "Skill";
      return `${reward.amount} ${name} XP`;
    }
    case "unlock":
      return describeUnlockReward(reward.unlock);
    case "item":
      return `${reward.amount} ${getItemDefinitionName(reward.itemId)}`;
    case "prosperity":
      return `${reward.amount} Prosperity`;
    case "reputation":
      return `${reward.amount} Reputation`;
  }
}

function describeUnlockReward(unlock: UnlockReference): string {
  switch (unlock.kind) {
    case "animal": {
      const definition = getAnimalDefinition(unlock.speciesId);
      return definition
        ? `Unlock ${definition.defaultName} the ${definition.speciesLabel}`
        : "Unlock animal companion";
    }
    case "region": {
      const name = getRegionDefinitionName(unlock.regionId);
      return `Unlock ${name}`;
    }
    case "quest": {
      const quest = QUEST_DEFINITIONS.find((entry) => entry.id === unlock.questId);
      return quest ? `Discover: ${quest.title}` : "Discover a new quest";
    }
  }
}

export function applyGameRewards(
  rewards: GameReward[],
  callbacks: GameRewardCallbacks,
): GameRewardApplicationResult {
  const result: GameRewardApplicationResult = {
    rewards,
    skillXpAwarded: [],
    resourcesAwarded: [],
    itemsAwarded: [],
    unlocksApplied: [],
    prosperityAwarded: 0,
    reputationAwarded: 0,
  };

  for (const reward of rewards) {
    switch (reward.type) {
      case "resource":
        callbacks.awardResource(reward.resourceId, reward.amount);
        result.resourcesAwarded.push({
          resourceId: reward.resourceId,
          amount: reward.amount,
        });
        break;
      case "skill_xp":
        callbacks.awardSkillXp(reward.skillId, reward.amount);
        result.skillXpAwarded.push({
          skillId: reward.skillId,
          amount: reward.amount,
        });
        break;
      case "unlock":
        callbacks.applyUnlock(reward.unlock);
        result.unlocksApplied.push(reward.unlock);
        break;
      case "item":
        callbacks.awardItem(reward.itemId, reward.amount);
        result.itemsAwarded.push({
          itemId: reward.itemId,
          amount: reward.amount,
        });
        break;
      case "prosperity":
        callbacks.awardProsperity(reward.amount);
        result.prosperityAwarded += reward.amount;
        break;
      case "reputation":
        callbacks.awardReputation(reward.amount);
        result.reputationAwarded += reward.amount;
        break;
    }
  }

  return result;
}
