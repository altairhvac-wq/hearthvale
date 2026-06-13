import { REGION_IDS } from "@/game/constants/regions";
import { DISCOVERY_LOCATION_IDS } from "./ids";
import type { RegionId } from "@/types";

/** Percentage-based positions on the storybook village scene (0–100). */
export interface SceneHotspotPosition {
  x: number;
  y: number;
}

export interface RegionSceneHotspot {
  regionId: RegionId;
  position: SceneHotspotPosition;
  markerEmoji: string;
}

export const MARKET_STAND_SCENE_HOTSPOT = {
  id: "market_stand" as const,
  position: { x: 36, y: 56 },
  markerEmoji: "🏪",
} as const;

export const REGION_SCENE_HOTSPOTS: readonly RegionSceneHotspot[] = [
  {
    regionId: REGION_IDS.VALLEY,
    position: { x: 58, y: 74 },
    markerEmoji: "🌸",
  },
  {
    regionId: REGION_IDS.FOREST,
    position: { x: 50, y: 20 },
    markerEmoji: "🌲",
  },
  {
    regionId: REGION_IDS.SANCTUARY,
    position: { x: 14, y: 44 },
    markerEmoji: "🦌",
  },
  {
    regionId: REGION_IDS.DOCK,
    position: { x: 86, y: 46 },
    markerEmoji: "⚓",
  },
] as const;

export const MYSTERY_SCENE_HOTSPOTS = [
  {
    id: DISCOVERY_LOCATION_IDS.MYSTERIOUS_RUINS,
    position: { x: 6, y: 16 },
    markerEmoji: "🏛️",
  },
  {
    id: DISCOVERY_LOCATION_IDS.BEYOND_HARBOR,
    position: { x: 94, y: 14 },
    markerEmoji: "🌫️",
  },
  {
    id: DISCOVERY_LOCATION_IDS.HIDDEN_GROVE,
    position: { x: 20, y: 82 },
    markerEmoji: "?",
  },
] as const;
