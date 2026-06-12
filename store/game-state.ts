import type {
  Animal,
  AnimalSpeciesId,
  AnimalSpeciesProgress,
  Decoration,
  Event,
  GameUser,
  InventoryItem,
  MiniGame,
  Player,
  Quest,
  Region,
  RegionId,
  RestorationProject,
  SkillProgress,
  Valley,
  ValleyId,
  ValleyInvite,
  ValleyMember,
  ValleySaveData,
  VisitSession,
} from "@/types";

export interface GameState {
  user: GameUser;
  player: Player;
  activeValleyId: ValleyId;
  /** Full valley save map — active valley gameplay is also denormalized at store root. */
  valleys: Record<string, ValleySaveData>;
  valley: Valley;
  memberships: Record<string, ValleyMember>;
  pendingInvites: Record<string, ValleyInvite>;
  visitSessions: Record<string, VisitSession>;
  skills: Record<string, SkillProgress>;
  inventory: InventoryItem[];
  activeRegionId: RegionId | null;
  regions: Record<string, Region>;
  quests: Record<string, Quest>;
  animals: Record<string, Animal>;
  animalSpecies: Record<AnimalSpeciesId, AnimalSpeciesProgress>;
  restoration: Record<string, RestorationProject>;
  events: Record<string, Event>;
  minigames: Record<string, MiniGame>;
  decorations: Record<string, Decoration>;
  isHydrated: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  saveError: string | null;
}
