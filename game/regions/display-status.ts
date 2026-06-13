import type { Region } from "@/types";
import { REGION_STATUS_LABELS } from "@/game/constants/world/labels";

/** Player-facing region status for map and cards. */
export type RegionDisplayStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "restored";

export function deriveRegionDisplayStatus(region: Region): RegionDisplayStatus {
  if (region.state === "restored") {
    return "restored";
  }

  if (region.state === "locked") {
    return "locked";
  }

  if (region.state === "discoverable") {
    return "available";
  }

  if (region.restorationProgress > 0) {
    return "in_progress";
  }

  return "available";
}

export function getRegionDisplayStatusLabel(status: RegionDisplayStatus): string {
  return REGION_STATUS_LABELS[status];
}
