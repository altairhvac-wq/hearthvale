import { createId, type RegionDefinition } from "@/types";

export const REGION_IDS = {
  VALLEY: createId<"RegionId">("valley"),
  SANCTUARY: createId<"RegionId">("sanctuary"),
  DOCK: createId<"RegionId">("dock"),
  FOREST: createId<"RegionId">("forest"),
} as const;

export type CoreRegionId = (typeof REGION_IDS)[keyof typeof REGION_IDS];

export const REGION_DEFINITIONS = [
  {
    id: REGION_IDS.VALLEY,
    name: "Valley Meadow",
    description:
      "The meadow still remembers laughter — wildflowers bloom where footsteps return.",
    theme: "meadow",
    sortOrder: 0,
    unlockRequirement: null,
  },
  {
    id: REGION_IDS.SANCTUARY,
    name: "Animal Sanctuary",
    description:
      "The old sanctuary has fallen silent. Gentle souls wait for someone patient enough to earn their trust.",
    theme: "sanctuary",
    sortOrder: 1,
    unlockRequirement: null,
  },
  {
    id: REGION_IDS.DOCK,
    name: "Weathered Harbor",
    description:
      "The harbor has seen better days. Weathered planks creak, but distant horizons still call.",
    theme: "harbor",
    sortOrder: 2,
    unlockRequirement: null,
  },
  {
    id: REGION_IDS.FOREST,
    name: "Forest Path",
    description:
      "The forest path hides forgotten secrets — ancient trees, wild forage, and trails yet to be cleared.",
    theme: "forest",
    sortOrder: 3,
    unlockRequirement: null,
  },
] as const satisfies ReadonlyArray<RegionDefinition>;
