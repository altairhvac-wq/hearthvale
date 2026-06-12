import type { RegionIconKey } from "@/game/constants/icon-keys";
import { REGION_IDS } from "./regions";
import type { RegionId } from "@/types";

/** Percentage-based layout for the valley map canvas (0–100). */
export interface MapNodePosition {
  x: number;
  y: number;
}

export interface ValleyMapNode {
  regionId: RegionId;
  position: MapNodePosition;
  iconKey: RegionIconKey;
}

export interface ValleyMapConnection {
  from: RegionId;
  to: RegionId;
}

export const VALLEY_MAP_NODES: readonly ValleyMapNode[] = [
  {
    regionId: REGION_IDS.VALLEY,
    position: { x: 50, y: 68 },
    iconKey: "meadow",
  },
  {
    regionId: REGION_IDS.SANCTUARY,
    position: { x: 18, y: 42 },
    iconKey: "sanctuary",
  },
  {
    regionId: REGION_IDS.DOCK,
    position: { x: 82, y: 50 },
    iconKey: "harbor",
  },
  {
    regionId: REGION_IDS.FOREST,
    position: { x: 50, y: 18 },
    iconKey: "forest",
  },
] as const;

export const VALLEY_MAP_CONNECTIONS: readonly ValleyMapConnection[] = [
  { from: REGION_IDS.VALLEY, to: REGION_IDS.SANCTUARY },
  { from: REGION_IDS.VALLEY, to: REGION_IDS.DOCK },
  { from: REGION_IDS.VALLEY, to: REGION_IDS.FOREST },
  { from: REGION_IDS.SANCTUARY, to: REGION_IDS.FOREST },
] as const;

const MAP_NODE_BY_REGION = new Map(
  VALLEY_MAP_NODES.map((node) => [node.regionId, node]),
);

export function getValleyMapNode(regionId: RegionId): ValleyMapNode | null {
  return MAP_NODE_BY_REGION.get(regionId) ?? null;
}
