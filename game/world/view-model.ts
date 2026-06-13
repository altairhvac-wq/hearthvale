import { CHARACTER_DEFINITIONS } from "@/game/constants/world";
import type {
  CharacterDialogueViewModel,
  CharacterId,
  DiscoveryLocationDefinition,
  LocationId,
  RegionId,
  RequestsState,
  WorldState,
} from "@/types";
import { resolveCharacterDialogue } from "./dialogue";
import type { RegionDisplayStatus } from "@/game/regions/display-status";
import { getLocationProgressNarrative } from "./presentation";
import {
  getAllDiscoveryLocations,
  getCharacterDefinition,
  getLocationByRegionId,
  getLocationDefinition,
} from "./registry";

export interface CharacterPresenceViewModel {
  id: CharacterId;
  name: string;
  description: string;
  portrait: CharacterDialogueViewModel["portrait"];
  presence: "active" | "future_resident";
  dialogue: CharacterDialogueViewModel | null;
  isSpeakingToday: boolean;
}

export interface DiscoveryLocationViewModel {
  id: DiscoveryLocationDefinition["id"];
  label: string;
  teaser: string;
  position: { x: number; y: number };
}

export interface LocationSceneViewModel {
  locationId: LocationId;
  regionId: RegionId;
  title: string;
  subtitle: string;
  atmosphereDescription: string;
  discoveryDescription: string;
  restorationDream: string;
  progressNarrative: string;
  progressWhisper: string | null;
  characters: CharacterPresenceViewModel[];
}

export interface WorldLayerContext {
  requests: RequestsState;
}

function buildCharacterPresence(
  characterId: CharacterId,
  context: WorldLayerContext,
): CharacterPresenceViewModel | null {
  const definition = getCharacterDefinition(characterId);

  if (!definition) {
    return null;
  }

  const dialogue = resolveCharacterDialogue(characterId, context);

  return {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    portrait: definition.portrait,
    presence: definition.presence,
    dialogue,
    isSpeakingToday: dialogue?.isActive ?? false,
  };
}

export function buildLocationSceneViewModel(
  regionId: RegionId,
  displayStatus: RegionDisplayStatus,
  progressPercent: number,
  context: WorldLayerContext,
): LocationSceneViewModel | null {
  const location = getLocationByRegionId(regionId);

  if (!location) {
    return null;
  }

  const progress = getLocationProgressNarrative(displayStatus, progressPercent);

  const characters = location.characterIds
    .map((characterId) => buildCharacterPresence(characterId, context))
    .filter((entry): entry is CharacterPresenceViewModel => entry !== null)
    .sort((a, b) => {
      const orderA =
        CHARACTER_DEFINITIONS.find((c) => c.id === a.id)?.sortOrder ?? 0;
      const orderB =
        CHARACTER_DEFINITIONS.find((c) => c.id === b.id)?.sortOrder ?? 0;
      return orderA - orderB;
    });

  return {
    locationId: location.id,
    regionId: location.regionId,
    title: location.title,
    subtitle: location.subtitle,
    atmosphereDescription: location.atmosphereDescription,
    discoveryDescription: location.discoveryDescription,
    restorationDream: location.restorationDream,
    progressNarrative: progress.label,
    progressWhisper: progress.whisper,
    characters,
  };
}

export function buildDiscoveryLocationViewModels(): DiscoveryLocationViewModel[] {
  return getAllDiscoveryLocations().map((discovery) => ({
    id: discovery.id,
    label: discovery.label,
    teaser: discovery.teaser,
    position: discovery.position,
  }));
}

/** Future-ready initial world state — not persisted in V1. */
export function createInitialWorldState(): WorldState {
  return {
    characters: {},
    noticedDiscoveries: [],
  };
}

/** Merge persisted world state with registry — drops unknown ids. */
export function mergeWorldState(
  persisted: WorldState | undefined,
): WorldState {
  const base = createInitialWorldState();

  if (!persisted) {
    return base;
  }

  return {
    characters: persisted.characters ?? base.characters,
    noticedDiscoveries: Array.isArray(persisted.noticedDiscoveries)
      ? persisted.noticedDiscoveries.filter((id) =>
          getAllDiscoveryLocations().some((entry) => entry.id === id),
        )
      : base.noticedDiscoveries,
  };
}

export { getLocationDefinition, getLocationByRegionId };
