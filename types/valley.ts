import type { Animal, AnimalSpeciesId, AnimalSpeciesProgress } from "./animal";
import type { Decoration } from "./decoration";
import type { Event } from "./event";
import type { GameUserId, RegionId, ValleyId, ValleyInviteId, VisitSessionId } from "./ids";
import type { InventoryItem } from "./inventory";
import type { MiniGame } from "./minigame";
import type { Quest } from "./quest";
import type { Region } from "./region";
import type { RestorationProject } from "./restoration";

/** Who someone is within a valley — not an auth account. */
export type ValleyRole = "owner" | "member" | "visitor";

/** Granular capabilities for async co-op and visits. */
export type ValleyPermission =
  | "view_valley"
  | "collect_gifts"
  | "help_tasks"
  | "decorate"
  | "manage_invites"
  | "manage_valley";

export type ValleyInviteStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired"
  | "revoked";

/** Valley container metadata — progress lives in `ValleyGameplayState`. */
export interface Valley {
  id: ValleyId;
  name: string;
  ownerUserId: GameUserId;
  createdAt: string;
  updatedAt: string;
}

/** Gameplay progress scoped to one valley. */
export interface ValleyGameplayState {
  activeRegionId: RegionId | null;
  regions: Record<string, Region>;
  quests: Record<string, Quest>;
  animals: Record<string, Animal>;
  animalSpecies: Record<AnimalSpeciesId, AnimalSpeciesProgress>;
  restoration: Record<string, RestorationProject>;
  events: Record<string, Event>;
  minigames: Record<string, MiniGame>;
  decorations: Record<string, Decoration>;
}

/** Persisted valley record — metadata plus scoped gameplay. */
export interface ValleySaveData extends Valley, ValleyGameplayState {}

/** Membership in a shared or owned valley. */
export interface ValleyMember {
  valleyId: ValleyId;
  userId: GameUserId;
  role: ValleyRole;
  /** Explicit grants; empty means role defaults apply. */
  permissions: ValleyPermission[];
  joinedAt: string;
}

/** Async invite — no real-time session required. */
export interface ValleyInvite {
  id: ValleyInviteId;
  valleyId: ValleyId;
  invitedByUserId: GameUserId;
  /** Null for open link invites before a user claims them. */
  inviteeUserId: GameUserId | null;
  role: ValleyRole;
  permissions: ValleyPermission[];
  createdAt: string;
  expiresAt: string | null;
  status: ValleyInviteStatus;
}

/** A cozy visit — read/help asynchronously, not live co-presence. */
export interface VisitSession {
  id: VisitSessionId;
  valleyId: ValleyId;
  visitorUserId: GameUserId;
  hostUserId: GameUserId;
  permissions: ValleyPermission[];
  startedAt: string;
  endedAt: string | null;
}

/** Multiplayer scaffolding persisted locally until cloud sync ships. */
export interface ValleySocialState {
  memberships: Record<string, ValleyMember>;
  pendingInvites: Record<string, ValleyInvite>;
  visitSessions: Record<string, VisitSession>;
}
