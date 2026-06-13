import { CHARACTER_IDS } from "./characters";
import { createId, type DialogueDefinition } from "@/types";

export const DIALOGUE_IDS = {
  ELENA_REQUEST: createId<"DialogueId">("elena_request"),
  ELENA_THANKS: createId<"DialogueId">("elena_thanks"),
  ELENA_GREETING: createId<"DialogueId">("elena_greeting"),
  FINN_TEASER: createId<"DialogueId">("finn_teaser"),
  WILLOW_TEASER: createId<"DialogueId">("willow_teaser"),
  CAPTAIN_ROWAN_TEASER: createId<"DialogueId">("captain_rowan_teaser"),
} as const;

export const DIALOGUE_DEFINITIONS = [
  {
    id: DIALOGUE_IDS.ELENA_REQUEST,
    characterId: CHARACTER_IDS.ELENA,
    text: "Could you find wildflowers for my windowsill?",
    context: "request",
    sortOrder: 0,
  },
  {
    id: DIALOGUE_IDS.ELENA_THANKS,
    characterId: CHARACTER_IDS.ELENA,
    text: "Thank you. The square feels brighter already.",
    context: "thanks",
    sortOrder: 1,
  },
  {
    id: DIALOGUE_IDS.ELENA_GREETING,
    characterId: CHARACTER_IDS.ELENA,
    text: "Good morning. I hope the valley treats you kindly today.",
    context: "greeting",
    sortOrder: 2,
  },
  {
    id: DIALOGUE_IDS.FINN_TEASER,
    characterId: CHARACTER_IDS.FINN,
    text: "These docks won't mend themselves — but someone will come who knows how.",
    context: "teaser",
    sortOrder: 0,
  },
  {
    id: DIALOGUE_IDS.WILLOW_TEASER,
    characterId: CHARACTER_IDS.WILLOW,
    text: "The pens are empty, but I leave fresh hay anyway. They'll remember the way home.",
    context: "teaser",
    sortOrder: 0,
  },
  {
    id: DIALOGUE_IDS.CAPTAIN_ROWAN_TEASER,
    characterId: CHARACTER_IDS.CAPTAIN_ROWAN,
    text: "Beyond the harbor, waters I've not sailed in years. Perhaps someday.",
    context: "teaser",
    sortOrder: 0,
  },
] as const satisfies ReadonlyArray<DialogueDefinition>;
