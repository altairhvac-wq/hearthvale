import { createInitialAnimalsState, createInitialAnimalSpeciesState } from "@/game/animals";
import { DEFAULT_USER_ID, DEFAULT_VALLEY_ID, DEFAULT_VALLEY_NAME } from "@/game/constants/valley";
import { createInitialDecorationsState } from "@/game/decorations";
import { createInitialEventsState } from "@/game/events";
import { createInitialMiniGamesState } from "@/game/minigames";
import { createInitialQuestsState } from "@/game/quests";
import { createInitialRegionsState } from "@/game/regions";
import { createInitialRestorationState } from "@/game/restoration";
import { FOUNDATION_EPOCH } from "@/game/constants/foundation";
import { REGION_IDS } from "@/game/constants/regions";
import type {
  GameUser,
  Valley,
  ValleyGameplayState,
  ValleyInvite,
  ValleyMember,
  ValleySaveData,
  ValleySocialState,
  VisitSession,
} from "@/types";

export function createDefaultGameUser(
  now: string = FOUNDATION_EPOCH,
): GameUser {
  return {
    id: DEFAULT_USER_ID,
    displayName: "Traveler",
    createdAt: now,
    lastSeenAt: now,
  };
}

export function createInitialValleyGameplayState(): ValleyGameplayState {
  return {
    activeRegionId: REGION_IDS.VALLEY,
    regions: createInitialRegionsState(),
    quests: createInitialQuestsState(),
    animals: createInitialAnimalsState(),
    animalSpecies: createInitialAnimalSpeciesState(),
    restoration: createInitialRestorationState(),
    events: createInitialEventsState(),
    minigames: createInitialMiniGamesState(),
    decorations: createInitialDecorationsState(),
  };
}

export function createDefaultValley(
  now: string = FOUNDATION_EPOCH,
  ownerUserId = DEFAULT_USER_ID,
): Valley {
  return {
    id: DEFAULT_VALLEY_ID,
    name: DEFAULT_VALLEY_NAME,
    ownerUserId,
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultValleySaveData(
  now: string = FOUNDATION_EPOCH,
): ValleySaveData {
  return {
    ...createDefaultValley(now),
    ...createInitialValleyGameplayState(),
  };
}

export function createInitialValleySocialState(): ValleySocialState {
  return {
    memberships: {},
    pendingInvites: {},
    visitSessions: {},
  };
}

export function createDefaultOwnerMembership(
  now: string = FOUNDATION_EPOCH,
  userId = DEFAULT_USER_ID,
  valleyId = DEFAULT_VALLEY_ID,
): ValleyMember {
  return {
    valleyId,
    userId,
    role: "owner",
    permissions: [],
    joinedAt: now,
  };
}

export function membershipKey(valleyId: Valley["id"], userId: GameUser["id"]): string {
  return `${valleyId}:${userId}`;
}

export function createInitialMembershipsState(
  now: string = FOUNDATION_EPOCH,
): Record<string, ValleyMember> {
  const membership = createDefaultOwnerMembership(now);

  return {
    [membershipKey(membership.valleyId, membership.userId)]: membership,
  };
}

export function createInitialInvitesState(): Record<string, ValleyInvite> {
  return {};
}

export function createInitialVisitSessionsState(): Record<string, VisitSession> {
  return {};
}
