import { applyGameRewards, type GameRewardApplicationResult, type GameRewardCallbacks } from "@/game/rewards";
import type { GameReward } from "@/types";

export type GatheringRewardCallbacks = GameRewardCallbacks;

export function applyGatheringRewards(
  rewards: GameReward[],
  callbacks: GatheringRewardCallbacks,
): GameRewardApplicationResult {
  return applyGameRewards(rewards, callbacks);
}
