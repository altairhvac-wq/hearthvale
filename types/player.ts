import type { PlayerId, RegionId, ResourceId } from "./ids";

export interface PlayerResources {
  [resourceId: ResourceId]: number;
}

export interface PlayerPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
}

export interface Player {
  id: PlayerId;
  displayName: string;
  createdAt: string;
  lastPlayedAt: string;
  resources: PlayerResources;
  preferences: PlayerPreferences;
  /** Current region — unlock state lives on `regions[id].state`. */
  activeRegionId: RegionId | null;
}
