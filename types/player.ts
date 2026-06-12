import type { GameUserId, PlayerId, ResourceId } from "./ids";

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
  /** Links gameplay profile to account identity. */
  userId: GameUserId;
  displayName: string;
  createdAt: string;
  lastPlayedAt: string;
  resources: PlayerResources;
  preferences: PlayerPreferences;
}
