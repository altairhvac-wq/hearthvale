import { createId } from "@/types";

export const CHARACTER_IDS = {
  ELENA: createId<"CharacterId">("elena"),
  FINN: createId<"CharacterId">("finn"),
  WILLOW: createId<"CharacterId">("willow"),
  CAPTAIN_ROWAN: createId<"CharacterId">("captain_rowan"),
} as const;

export const DIALOGUE_IDS = {
  ELENA_REQUEST: createId<"DialogueId">("elena_request"),
  ELENA_THANKS: createId<"DialogueId">("elena_thanks"),
  ELENA_GREETING: createId<"DialogueId">("elena_greeting"),
  FINN_TEASER: createId<"DialogueId">("finn_teaser"),
  WILLOW_TEASER: createId<"DialogueId">("willow_teaser"),
  CAPTAIN_ROWAN_TEASER: createId<"DialogueId">("captain_rowan_teaser"),
} as const;

export const LOCATION_IDS = {
  VILLAGE_SQUARE: createId<"LocationId">("village_square"),
  FOREST_PATH: createId<"LocationId">("forest_path"),
  ANIMAL_SANCTUARY: createId<"LocationId">("animal_sanctuary"),
  HARBOR: createId<"LocationId">("harbor"),
} as const;

export const DISCOVERY_LOCATION_IDS = {
  MYSTERIOUS_RUINS: createId<"DiscoveryLocationId">("mysterious_ruins"),
  BEYOND_HARBOR: createId<"DiscoveryLocationId">("beyond_harbor"),
  HIDDEN_GROVE: createId<"DiscoveryLocationId">("hidden_grove"),
} as const;
