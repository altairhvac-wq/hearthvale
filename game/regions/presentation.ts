import type { RegionDisplayStatus } from "./display-status";

/** Semantic progress variant — presentation maps to theme styles. */
export type RegionProgressVariant =
  | "discovery"
  | "restoration"
  | "complete"
  | "locked";

export interface RegionProgressPresentation {
  label: string;
  variant: RegionProgressVariant;
}

const PROGRESS_BY_STATUS: Record<RegionDisplayStatus, RegionProgressPresentation> =
  {
    locked: { label: "Still hidden", variant: "locked" },
    available: { label: "Ready to explore", variant: "discovery" },
    in_progress: { label: "Help restore this place", variant: "restoration" },
    restored: { label: "Brought back to life", variant: "complete" },
  };

export function getRegionProgressPresentation(
  status: RegionDisplayStatus,
): RegionProgressPresentation {
  return PROGRESS_BY_STATUS[status];
}

export function shouldShowUnlockRequirement(
  displayStatus: RegionDisplayStatus,
  unlockRequirementDescription: string | null,
  isUnlockRequirementMet: boolean,
): boolean {
  if (!unlockRequirementDescription) {
    return false;
  }

  if (displayStatus === "locked" || displayStatus === "available") {
    return !isUnlockRequirementMet;
  }

  return false;
}
