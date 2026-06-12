import type { GameReward } from "./reward";
import type { UnlockRequirement } from "./unlock-requirement";
import type { MerchantStageId, ResourceId } from "./ids";

export type MerchantStageStatus =
  | "locked"
  | "available"
  | "active"
  | "maxed";

/** Visual progression keyed by level — UI reads without hardcoding stage art. */
export type MerchantVisualState =
  | "humble_stall"
  | "woven_awning"
  | "lantern_stall"
  | "cozy_shopfront"
  | "flower_boxes"
  | "village_corner"
  | "wide_storefront"
  | "river_sign"
  | "general_store";

export interface MerchantStageUpgradeRequirement {
  level: number;
  requiredResources: Array<{ resourceId: ResourceId; amount: number }>;
}

export interface MerchantStageLevelReward {
  level: number;
  rewards: GameReward[];
}

/** Static catalog entry — logic lives in game/merchant services. */
export interface MerchantStageDefinition {
  id: MerchantStageId;
  title: string;
  description: string;
  maxLevel: number;
  sortOrder: number;
  unlockRequirement: UnlockRequirement | null;
  upgradeRequirements: MerchantStageUpgradeRequirement[];
  levelRewards: MerchantStageLevelReward[];
  /** Maps level → visual state for presentation. */
  visualStatesByLevel: Record<number, MerchantVisualState>;
  /** Emoji shown in the merchant screen header for this stage. */
  iconEmoji: string;
}

/** Per-valley runtime progress for one merchant stage. */
export interface MerchantStageProgress {
  id: MerchantStageId;
  status: MerchantStageStatus;
  level: number;
  upgradedAt: string | null;
}

/** Valley-scoped merchant progression — multiplayer-ready keyed records. */
export interface MerchantState {
  stages: Record<MerchantStageId, MerchantStageProgress>;
  activeStageId: MerchantStageId;
  /** Future: branch per settlement when multiple trade hubs ship. */
}
