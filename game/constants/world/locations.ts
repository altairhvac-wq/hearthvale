import { REGION_IDS } from "@/game/constants/regions";
import { CHARACTER_IDS, LOCATION_IDS } from "./ids";
import { type LocationDefinition } from "@/types";

export type CoreLocationId = (typeof LOCATION_IDS)[keyof typeof LOCATION_IDS];

export const LOCATION_DEFINITIONS = [
  {
    id: LOCATION_IDS.VILLAGE_SQUARE,
    title: "Village Square",
    subtitle: "Heart of Hearthvale",
    atmosphereDescription:
      "A quiet square waiting for laughter again. Your market stall sits at the edge, where trade once warmed cold mornings.",
    discoveryDescription:
      "Footsteps echo differently here now — but the cobblestones still remember festival days.",
    restorationDream:
      "One day the square may ring with voices again, stalls blooming like wildflowers after rain.",
    characterIds: [CHARACTER_IDS.ELENA],
    regionId: REGION_IDS.VALLEY,
    sortOrder: 0,
  },
  {
    id: LOCATION_IDS.FOREST_PATH,
    title: "Forest Path",
    subtitle: "Whispers among the trees",
    atmosphereDescription:
      "The old trail disappears beneath wild growth. Ancient roots hold secrets for those patient enough to listen.",
    discoveryDescription:
      "Something moves in the deeper woods — a path not yet cleared, a story not yet told.",
    restorationDream:
      "When the trail is cleared, forgotten groves may open to wanderers who seek them.",
    characterIds: [],
    regionId: REGION_IDS.FOREST,
    sortOrder: 1,
  },
  {
    id: LOCATION_IDS.ANIMAL_SANCTUARY,
    title: "Animal Sanctuary",
    subtitle: "Waiting for gentle souls",
    atmosphereDescription:
      "The fences have fallen silent. The animals may return someday — if someone earns their trust with patience.",
    discoveryDescription:
      "Empty pens and overturned feeders tell of creatures who fled when the valley grew still.",
    restorationDream:
      "The sanctuary may bloom again with soft footsteps, warm nests, and a caretaker's steady hand.",
    characterIds: [CHARACTER_IDS.WILLOW],
    regionId: REGION_IDS.SANCTUARY,
    sortOrder: 2,
  },
  {
    id: LOCATION_IDS.HARBOR,
    title: "Harbor",
    subtitle: "Gateway to distant waters",
    atmosphereDescription:
      "Weathered docks stare out across distant waters. Planks creak with memory of arrivals and farewells.",
    discoveryDescription:
      "Ropes hang loose on moorings that haven't held a boat in seasons. The horizon still beckons.",
    restorationDream:
      "Strong timbers and mended lines may one day welcome travelers from shores yet unseen.",
    characterIds: [CHARACTER_IDS.FINN, CHARACTER_IDS.CAPTAIN_ROWAN],
    regionId: REGION_IDS.DOCK,
    sortOrder: 3,
  },
] as const satisfies ReadonlyArray<LocationDefinition>;
