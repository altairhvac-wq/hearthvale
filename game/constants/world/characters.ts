import { REGION_IDS } from "@/game/constants/regions";
import { LOCATION_IDS } from "./locations";
import { DIALOGUE_IDS } from "./dialogue";
import { createId, type CharacterDefinition } from "@/types";

export const CHARACTER_IDS = {
  ELENA: createId<"CharacterId">("elena"),
  FINN: createId<"CharacterId">("finn"),
  WILLOW: createId<"CharacterId">("willow"),
  CAPTAIN_ROWAN: createId<"CharacterId">("captain_rowan"),
} as const;

export const CHARACTER_DEFINITIONS = [
  {
    id: CHARACTER_IDS.ELENA,
    name: "Elena",
    description:
      "Your neighbor who loves flowers. She was the first to stop by your stall — a gentle soul who remembers when the square was full of color.",
    portrait: { assetKey: null, fallbackEmoji: "🌸" },
    presence: "active",
    homeLocationId: LOCATION_IDS.VILLAGE_SQUARE,
    regionId: REGION_IDS.VALLEY,
    futureQuestId: null,
    teaserDialogueId: null,
    roles: ["neighbor", "first_customer"],
    sortOrder: 0,
  },
  {
    id: CHARACTER_IDS.FINN,
    name: "Finn",
    description:
      "A village builder with calloused hands and a patient heart. He knows every beam in the harbor and dreams of mending what the storms broke.",
    portrait: { assetKey: null, fallbackEmoji: "🔨" },
    presence: "future_resident",
    homeLocationId: LOCATION_IDS.HARBOR,
    regionId: REGION_IDS.DOCK,
    futureQuestId: null,
    teaserDialogueId: DIALOGUE_IDS.FINN_TEASER,
    roles: ["builder", "harbor_guide"],
    sortOrder: 1,
  },
  {
    id: CHARACTER_IDS.WILLOW,
    name: "Willow",
    description:
      "The old sanctuary caretaker. She speaks softly to empty pens, believing the animals will return when the valley feels safe again.",
    portrait: { assetKey: null, fallbackEmoji: "🦊" },
    presence: "future_resident",
    homeLocationId: LOCATION_IDS.ANIMAL_SANCTUARY,
    regionId: REGION_IDS.SANCTUARY,
    futureQuestId: null,
    teaserDialogueId: DIALOGUE_IDS.WILLOW_TEASER,
    roles: ["caretaker", "sanctuary_guide"],
    sortOrder: 2,
  },
  {
    id: CHARACTER_IDS.CAPTAIN_ROWAN,
    name: "Captain Rowan",
    description:
      "A weathered sailor who once knew every channel beyond the harbor. His charts are faded, but his eyes still track the horizon.",
    portrait: { assetKey: null, fallbackEmoji: "⚓" },
    presence: "future_resident",
    homeLocationId: LOCATION_IDS.HARBOR,
    regionId: REGION_IDS.DOCK,
    futureQuestId: null,
    teaserDialogueId: DIALOGUE_IDS.CAPTAIN_ROWAN_TEASER,
    roles: ["explorer", "harbor_guide"],
    sortOrder: 3,
  },
] as const satisfies ReadonlyArray<CharacterDefinition>;
