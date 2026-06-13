import {
  CHARACTER_DEFINITIONS,
  DISCOVERY_LOCATION_DEFINITIONS,
  LOCATION_DEFINITIONS,
  DIALOGUE_DEFINITIONS,
} from "@/game/constants/world";
import type {
  CharacterDefinition,
  CharacterId,
  DialogueDefinition,
  DiscoveryLocationDefinition,
  LocationDefinition,
  LocationId,
} from "@/types";
import type { RegionId } from "@/types";

const REGISTERED_LOCATION_IDS = new Set<string>(
  LOCATION_DEFINITIONS.map((entry) => entry.id),
);
const REGISTERED_CHARACTER_IDS = new Set<string>(
  CHARACTER_DEFINITIONS.map((entry) => entry.id),
);
const REGISTERED_DIALOGUE_IDS = new Set<string>(
  DIALOGUE_DEFINITIONS.map((entry) => entry.id),
);
const REGISTERED_DISCOVERY_IDS = new Set<string>(
  DISCOVERY_LOCATION_DEFINITIONS.map((entry) => entry.id),
);

export function isRegisteredLocation(locationId: string): locationId is LocationId {
  return REGISTERED_LOCATION_IDS.has(locationId);
}

export function isRegisteredCharacter(
  characterId: string,
): characterId is CharacterId {
  return REGISTERED_CHARACTER_IDS.has(characterId);
}

export function isRegisteredDialogue(
  dialogueId: string,
): dialogueId is DialogueDefinition["id"] {
  return REGISTERED_DIALOGUE_IDS.has(dialogueId);
}

export function isRegisteredDiscoveryLocation(
  discoveryId: string,
): discoveryId is DiscoveryLocationDefinition["id"] {
  return REGISTERED_DISCOVERY_IDS.has(discoveryId);
}

export function getLocationDefinition(
  locationId: LocationId,
): LocationDefinition | undefined {
  return LOCATION_DEFINITIONS.find((entry) => entry.id === locationId);
}

export function getLocationByRegionId(
  regionId: RegionId,
): LocationDefinition | undefined {
  return LOCATION_DEFINITIONS.find((entry) => entry.regionId === regionId);
}

export function getCharacterDefinition(
  characterId: CharacterId,
): CharacterDefinition | undefined {
  return CHARACTER_DEFINITIONS.find((entry) => entry.id === characterId);
}

export function getDialogueDefinition(
  dialogueId: DialogueDefinition["id"],
): DialogueDefinition | undefined {
  return DIALOGUE_DEFINITIONS.find((entry) => entry.id === dialogueId);
}

export function getDialoguesForCharacter(
  characterId: CharacterId,
): readonly DialogueDefinition[] {
  return DIALOGUE_DEFINITIONS.filter((entry) => entry.characterId === characterId);
}

export function getDiscoveryLocationDefinition(
  discoveryId: DiscoveryLocationDefinition["id"],
): DiscoveryLocationDefinition | undefined {
  return DISCOVERY_LOCATION_DEFINITIONS.find((entry) => entry.id === discoveryId);
}

export function getCharactersForLocation(
  locationId: LocationId,
): readonly CharacterDefinition[] {
  const location = getLocationDefinition(locationId);

  if (!location) {
    return [];
  }

  return location.characterIds
    .map((characterId) => getCharacterDefinition(characterId))
    .filter((entry): entry is CharacterDefinition => entry !== undefined);
}

export function getAllDiscoveryLocations(): readonly DiscoveryLocationDefinition[] {
  return DISCOVERY_LOCATION_DEFINITIONS;
}

export function getAllLocationDefinitions(): readonly LocationDefinition[] {
  return LOCATION_DEFINITIONS;
}
