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
    name: "Valley",
    description:
      "The heart of Hearthvale — a gentle meadow waiting to bloom again.",
    theme: "meadow",
    sortOrder: 0,
    unlockRequirement: null,
  },
  {
    id: REGION_IDS.SANCTUARY,
    name: "Sanctuary",
    description:
      "A quiet refuge where animals gather and trust is earned slowly.",
    theme: "sanctuary",
    sortOrder: 1,
    unlockRequirement: null,
  },
  {
    id: REGION_IDS.DOCK,
    name: "Dock",
    description:
      "Weathered planks and distant horizons — the gateway to exploration.",
    theme: "harbor",
    sortOrder: 2,
    unlockRequirement: null,
  },
  {
    id: REGION_IDS.FOREST,
    name: "Forest",
    description:
      "Ancient trees hold secrets, forage, and paths yet to be cleared.",
    theme: "forest",
    sortOrder: 3,
    unlockRequirement: null,
  },
] as const satisfies ReadonlyArray<RegionDefinition>;
