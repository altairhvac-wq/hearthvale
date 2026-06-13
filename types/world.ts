import type {
  CharacterId,
  DiscoveryLocationId,
  LocationId,
  RegionId,
} from "./ids";

/** Static catalog entry for a world location scene. */
export interface LocationDefinition {
  id: LocationId;
  /** Player-facing place name (e.g. "Village Square"). */
  title: string;
  subtitle: string;
  atmosphereDescription: string;
  discoveryDescription: string;
  restorationDream: string;
  /** Characters associated with this place. */
  characterIds: readonly CharacterId[];
  /** Linked gameplay region — one location per core region in V1. */
  regionId: RegionId;
  sortOrder: number;
}

/** Unknown place on the map — curiosity only, never unlocked in V1. */
export interface DiscoveryLocationDefinition {
  id: DiscoveryLocationId;
  /** Shown on map — may be "???" or a evocative name. */
  label: string;
  teaser: string;
  position: { x: number; y: number };
  sortOrder: number;
}

/**
 * Multiplayer-safe world progress shape — per-valley, merge-friendly.
 * Not persisted in V1; documents future quest/dialogue integration.
 */
export interface CharacterWorldProgress {
  characterId: CharacterId;
  /** When the player first encountered this character. */
  metAt: string | null;
  /** Last resolved dialogue id — for quest continuity. */
  lastDialogueId: string | null;
}

export interface WorldState {
  /** Per-character narrative progress — keyed by CharacterId. */
  characters: Record<string, CharacterWorldProgress>;
  /** Discovery ids the player has noticed — V1 uses static teasers only. */
  noticedDiscoveries: readonly DiscoveryLocationId[];
}
