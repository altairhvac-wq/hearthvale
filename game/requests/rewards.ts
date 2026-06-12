import { applyGameRewards, type GameRewardCallbacks } from "@/game/rewards";
import type { GameReward } from "@/types";

export function applyRequestRewards(
  rewards: GameReward[],
  callbacks: GameRewardCallbacks,
) {
  return applyGameRewards(rewards, callbacks);
}
