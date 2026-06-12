import type { GameReward } from "@/types";
import {
  applyGameRewards,
  describeGameReward,
  type GameRewardApplicationResult,
  type GameRewardCallbacks,
} from "@/game/rewards";

export type EventRewardApplicationResult = GameRewardApplicationResult;
export type EventRewardCallbacks = GameRewardCallbacks;

export function describeEventReward(reward: GameReward): string {
  return describeGameReward(reward);
}

export function applyEventRewards(
  rewards: GameReward[],
  callbacks: EventRewardCallbacks,
): EventRewardApplicationResult {
  return applyGameRewards(rewards, callbacks);
}
