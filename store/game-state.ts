import type {
  Animal,
  AnimalSpeciesId,
  AnimalSpeciesProgress,
  Decoration,
  EventsState,
  GameUser,
  GatheringState,
  InventoryItem,
  MerchantState,
  MiniGame,
  Player,
  ProsperityState,
  Quest,
  Region,
  RegionId,
  RequestsState,
  ReputationState,
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
  events: EventsState;
  minigames: Record<string, MiniGame>;
  decorations: Record<string, Decoration>;
  merchant: MerchantState;
  prosperity: ProsperityState;
  requests: RequestsState;
  reputation: ReputationState;
  gathering: GatheringState;
  isHydrated: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  saveError: string | null;
}
