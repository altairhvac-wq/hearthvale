import type { QuestReward } from "@/types";
import {
  applyGameRewards,
  describeGameReward,
  type GameRewardApplicationResult,
  type GameRewardCallbacks,
} from "@/game/rewards";

export type QuestRewardApplicationResult = GameRewardApplicationResult;
export type QuestRewardCallbacks = GameRewardCallbacks;

export function describeQuestReward(reward: QuestReward): string {
  return describeGameReward(reward);
}

export function applyQuestRewards(
  rewards: QuestReward[],
  callbacks: QuestRewardCallbacks,
): QuestRewardApplicationResult {
  return applyGameRewards(rewards, callbacks);
}
