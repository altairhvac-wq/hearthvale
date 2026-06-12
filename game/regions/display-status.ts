import type { Region } from "@/types";

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
  switch (status) {
    case "locked":
      return "Locked";
    case "available":
      return "Available";
    case "in_progress":
      return "In Progress";
    case "restored":
      return "Restored";
  }
}
