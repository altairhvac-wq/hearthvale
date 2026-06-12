import type { GameReward } from "./reward";
import type { UnlockRequirement } from "./unlock-requirement";
import type { CustomerRequestId } from "./ids";

/** Extensible request categories for future expansion. */
export type RequestCategory =
  | "foraging"
  | "fishing"
  | "gardening"
  | "crafting"
  | "delivery"
  | "special";

export type CustomerRequestStatus =
  | "locked"
  | "available"
  | "active"
  | "completed";

/** Placeholder resource reference until inventory integration ships. */
export interface RequestResourceRequirement {
  placeholderId: string;
  label: string;
  amount: number;
}

/** Static catalog entry — logic lives in game/requests services. */
export interface CustomerRequestDefinition {
  id: CustomerRequestId;
  title: string;
  description: string;
  category: RequestCategory;
  customerName: string;
  unlockRequirement: UnlockRequirement | null;
  requiredResources: RequestResourceRequirement[];
  rewards: GameReward[];
  sortOrder: number;
}

/** Per-valley runtime progress for one customer request. */
export interface CustomerRequestInstance {
  id: CustomerRequestId;
  status: CustomerRequestStatus;
  activatedAt: string | null;
  completedAt: string | null;
  completionCount: number;
}

/** Valley-scoped customer request board. */
export interface RequestsState {
  instances: Record<CustomerRequestId, CustomerRequestInstance>;
}
