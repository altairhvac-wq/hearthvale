import type { RegionId } from "./ids";
import type { UnlockRequirement } from "./unlock-requirement";

export type RegionUnlockState = "locked" | "discoverable" | "unlocked" | "restored";

export interface RegionDefinition {
  id: RegionId;
  name: string;
  description: string;
  theme: string;
  sortOrder: number;
  unlockRequirement: UnlockRequirement | null;
}

export interface Region {
  id: RegionId;
  state: RegionUnlockState;
  discoveryProgress: number;
  restorationProgress: number;
  unlockedAt: string | null;
  restoredAt: string | null;
}
