import { FOUNDATION_EPOCH } from "@/game/constants/foundation";
import { REGION_DEFINITIONS, REGION_IDS } from "@/game/constants/regions";
import type { Region, RegionId } from "@/types";

export function createInitialRegionsState(): Record<string, Region> {
  return REGION_DEFINITIONS.reduce<Record<string, Region>>((acc, definition) => {
    const isStartingRegion = definition.id === REGION_IDS.VALLEY;

    acc[definition.id] = {
      id: definition.id,
      state: isStartingRegion ? "unlocked" : "locked",
      discoveryProgress: isStartingRegion ? 10 : 0,
      restorationProgress: 0,
      unlockedAt: isStartingRegion ? FOUNDATION_EPOCH : null,
      restoredAt: null,
    };

    return acc;
  }, {});
}

export function getUnlockedRegionIds(
  regions: Record<string, Region>,
): RegionId[] {
  return Object.values(regions)
    .filter(
      (region) => region.state === "unlocked" || region.state === "restored",
    )
    .map((region) => region.id);
}

export function getRegionDisplayName(
  regionId: RegionId | null,
  regions: Record<string, Region>,
): string {
  if (!regionId) {
    return "—";
  }

  const runtime = regions[regionId];
  if (runtime) {
    return regionId.charAt(0).toUpperCase() + regionId.slice(1);
  }

  return regionId;
}
