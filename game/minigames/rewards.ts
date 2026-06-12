import type { GameReward } from "@/types";
import {
  applyGameRewards,
  describeGameReward,
  type GameRewardApplicationResult,
  type GameRewardCallbacks,
} from "@/game/rewards";

export type MiniGameRewardApplicationResult = GameRewardApplicationResult;
export type MiniGameRewardCallbacks = GameRewardCallbacks;

export function describeMiniGameReward(reward: GameReward): string {
  return describeGameReward(reward);
}

export function applyMiniGameRewards(
  rewards: GameReward[],
  callbacks: MiniGameRewardCallbacks,
): MiniGameRewardApplicationResult {
  return applyGameRewards(rewards, callbacks);
}
