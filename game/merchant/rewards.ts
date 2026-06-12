import { applyGameRewards, type GameRewardCallbacks } from "@/game/rewards";
import type { GameReward } from "@/types";

export function applyMerchantRewards(
  rewards: GameReward[],
  callbacks: GameRewardCallbacks,
) {
  return applyGameRewards(rewards, callbacks);
}
