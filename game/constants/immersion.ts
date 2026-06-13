import { REGION_IDS } from "./regions";
import type { RegionId } from "@/types";

/** Cozy narrative copy for the home screen and first session. */
export interface VillageStoryCopy {
  headline: string;
  intro: string;
  hope: string;
}

export const VILLAGE_STORY: VillageStoryCopy = {
  headline: "You're the keeper of the stand",
  intro:
    "Once a warm gathering place, Hearthvale has grown quiet. The old market stall is yours now — a small wooden corner of the square where trade might wake the village again.",
  hope:
    "Elena stopped by this morning. She asked for wildflowers to brighten her windowsill. A gentle first favor, and the valley begins to remember itself.",
} as const;

export const FIRST_SESSION_MOOD = "A quiet morning in the square";

export const FIRST_SESSION_OBJECTIVE = {
  title: "Elena's wildflowers",
  description:
    "Your neighbor Elena wants a bouquet for her windowsill. Promise to help at your stand, gather blooms in the meadow, then return with care.",
  steps: [
    "Visit your Market Stand and promise Elena you'll help",
    "Walk the meadow and gather wildflowers",
    "Return to the stand and deliver the bouquet",
  ],
} as const;

export interface FutureGoalPreview {
  id: string;
  title: string;
  teaser: string;
  iconEmoji: string;
  /** When true, shown as a distant silhouette on the map. */
  isMystery?: boolean;
}

export const FUTURE_GOAL_PREVIEWS: readonly FutureGoalPreview[] = [
  {
    id: "sanctuary",
    title: "The Animal Sanctuary",
    teaser: "The old sanctuary has fallen silent — gentle souls wait to return.",
    iconEmoji: "🦊",
  },
  {
    id: "village_shop",
    title: "A Village Shop",
    teaser: "One day your humble stall may grow into a cozy corner shop the whole square trusts.",
    iconEmoji: "🏪",
  },
  {
    id: "harbor",
    title: "The Harbor",
    teaser: "The harbor has seen better days — distant horizons still call.",
    iconEmoji: "⚓",
  },
  {
    id: "islands",
    title: "Misty Shores",
    teaser: "Beyond the dock, islands drift in the fog — secrets yet unseen.",
    iconEmoji: "🏝️",
    isMystery: true,
  },
] as const;

export interface RegionAtmosphere {
  tagline: string;
  moodLabel: string;
}

/** Atmospheric copy keyed by region — replaces system-heavy labels in UI. */
export const REGION_ATMOSPHERE: Record<RegionId, RegionAtmosphere> = {
  [REGION_IDS.VALLEY]: {
    tagline: "The meadow still remembers laughter.",
    moodLabel: "Heart of the valley",
  },
  [REGION_IDS.SANCTUARY]: {
    tagline: "The old sanctuary has fallen silent.",
    moodLabel: "Waiting for care",
  },
  [REGION_IDS.DOCK]: {
    tagline: "The harbor has seen better days.",
    moodLabel: "Gateway to the horizon",
  },
  [REGION_IDS.FOREST]: {
    tagline: "The forest path hides forgotten secrets.",
    moodLabel: "Whispers among the trees",
  },
};

/** Mystery silhouettes placed on the valley map — visual anticipation only. */
export interface MysteryMapLocation {
  id: string;
  label: string;
  position: { x: number; y: number };
}

export const MYSTERY_MAP_LOCATIONS: readonly MysteryMapLocation[] = [
  {
    id: "distant_isles",
    label: "???",
    position: { x: 92, y: 12 },
  },
  {
    id: "hidden_grove",
    label: "???",
    position: { x: 8, y: 14 },
  },
] as const;
