import { DISCOVERY_LOCATION_IDS } from "./ids";
import { type DiscoveryLocationDefinition } from "@/types";

/** Unknown places on the map — curiosity only, never unlocked in V1. */
export const DISCOVERY_LOCATION_DEFINITIONS = [
  {
    id: DISCOVERY_LOCATION_IDS.MYSTERIOUS_RUINS,
    label: "Mysterious Ruins",
    teaser: "Stone arches half-swallowed by moss — someone lived here once.",
    position: { x: 8, y: 14 },
    sortOrder: 0,
  },
  {
    id: DISCOVERY_LOCATION_IDS.BEYOND_HARBOR,
    label: "Beyond the Harbor",
    teaser: "Misty shores drift in the fog — islands yet unseen.",
    position: { x: 92, y: 12 },
    sortOrder: 1,
  },
  {
    id: DISCOVERY_LOCATION_IDS.HIDDEN_GROVE,
    label: "???",
    teaser: "A silhouette in the treeline. Not ready to be named.",
    position: { x: 18, y: 78 },
    sortOrder: 2,
  },
] as const satisfies ReadonlyArray<DiscoveryLocationDefinition>;
