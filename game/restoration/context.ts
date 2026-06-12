import type { UnlockEvaluationContext } from "@/game/unlock/context";
import type { PlayerResources } from "@/types";

export interface RestorationEvaluationContext extends UnlockEvaluationContext {
  playerResources: PlayerResources;
}
