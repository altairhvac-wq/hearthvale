import type { GameReward } from "./reward";
import type { ProsperityTierId } from "./ids";

/** Sources that feed the prosperity score — extensible for future systems. */
export type ProsperityContributionSource =
  | "restoration_completed"
  | "merchant_upgrade"
  | "animal_rescued"
  | "direct_reward"
  | "trade_route"
  | "citizen_happiness"
  | "tax_collection";

export interface ProsperityContributionWeights {
  restorationCompleted: number;
  merchantLevel: number;
  animalRescued: number;
}

/** Static tier definition — thresholds drive tier resolution. */
export interface ProsperityTierDefinition {
  id: ProsperityTierId;
  tier: number;
  title: string;
  description: string;
  minScore: number;
  rewards: GameReward[];
  /** Future hooks: unlock trade routes, festivals, etc. */
  metadata: Record<string, string | number | boolean>;
}

/** Valley-scoped prosperity progress. */
export interface ProsperityState {
  /** Bonus points from direct prosperity rewards (requests, events, etc.). */
  bonusScore: number;
  /** Tier levels whose one-time rewards have been claimed. */
  claimedTierRewards: number[];
  lastCalculatedAt: string | null;
}
