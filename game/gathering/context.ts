import type { RegionId, SkillId } from "@/types";
import type { UnlockEvaluationContext } from "@/game/unlock/context";
import type { GatheringState, InventoryItem, Region } from "@/types";

export interface GatheringEvaluationContext extends UnlockEvaluationContext {
  gathering: GatheringState;
  inventory: ReadonlyArray<InventoryItem>;
  activeRegionId: RegionId | null;
  getSkillLevel: (skillId: SkillId) => number;
}

export type GatheringContextSource = Pick<
  UnlockEvaluationContext,
  "quests" | "skills" | "regions" | "restoration" | "getSkillLevel"
> & {
  gathering: GatheringState;
  inventory: ReadonlyArray<InventoryItem>;
  activeRegionId?: RegionId | null;
};

export function buildGatheringEvaluationContext(
  source: GatheringContextSource,
): GatheringEvaluationContext {
  return {
    quests: source.quests,
    skills: source.skills,
    regions: source.regions,
    restoration: source.restoration,
    getSkillLevel: source.getSkillLevel,
    gathering: source.gathering,
    inventory: source.inventory,
    activeRegionId: source.activeRegionId ?? null,
  };
}

export function isRegionAccessibleForGathering(
  regionId: RegionId,
  regions: Record<string, Region>,
): boolean {
  const region = regions[regionId];

  if (!region) {
    return false;
  }

  return region.state === "unlocked" || region.state === "restored";
}
