import type { RegionDisplayStatus } from "@/game/regions/display-status";

/** Narrative progress copy — replaces system-heavy percentage labels. */
export interface LocationProgressNarrative {
  label: string;
  /** Optional whisper shown beneath the progress bar. */
  whisper: string | null;
}

const DISCOVERY_NARRATIVES: readonly { threshold: number; label: string }[] = [
  { threshold: 0, label: "The valley sleeps deeply." },
  { threshold: 5, label: "The valley is beginning to wake." },
  { threshold: 25, label: "New footsteps mark familiar paths." },
  { threshold: 50, label: "This place remembers being loved." },
  { threshold: 75, label: "Warmth returns to forgotten corners." },
];

const RESTORATION_NARRATIVES: readonly { threshold: number; label: string }[] = [
  { threshold: 0, label: "Help is needed here." },
  { threshold: 10, label: "Small changes take root." },
  { threshold: 40, label: "Care is showing in every detail." },
  { threshold: 70, label: "Almost whole again." },
];

function pickNarrative(
  progressPercent: number,
  tiers: readonly { threshold: number; label: string }[],
): string {
  let chosen = tiers[0]?.label ?? "";

  for (const tier of tiers) {
    if (progressPercent >= tier.threshold) {
      chosen = tier.label;
    }
  }

  return chosen;
}

export function getLocationProgressNarrative(
  displayStatus: RegionDisplayStatus,
  progressPercent: number,
): LocationProgressNarrative {
  switch (displayStatus) {
    case "locked":
      return {
        label: "Still hidden from the path",
        whisper: null,
      };
    case "available":
      return {
        label: pickNarrative(progressPercent, DISCOVERY_NARRATIVES),
        whisper: null,
      };
    case "in_progress":
      return {
        label: pickNarrative(progressPercent, RESTORATION_NARRATIVES),
        whisper: "Every bit of care brings this place closer to whole.",
      };
    case "restored":
      return {
        label: "Brought back to life",
        whisper: "The valley holds this place in gratitude.",
      };
  }
}
