import type {
  GameSaveData,
  QuestStatus,
  RestorationProjectStatus,
  SkillProgress,
  ValleyInviteStatus,
  ValleyPermission,
  ValleyRole,
} from "@/types";
import { isPersistedAnimalRecord, isPersistedAnimalSpeciesRecord } from "@/game/animals/validation";
import { isPersistedEventsState } from "@/game/events/validation";
import { isPersistedMiniGamesRecord } from "@/game/minigames/validation";
import { isPersistedMerchantState } from "@/game/merchant/validation";
import { isPersistedProsperityState } from "@/game/prosperity/validation";
import { isPersistedRequestsState } from "@/game/requests/validation";
import { isPersistedReputationState } from "@/game/reputation/validation";

const VALLEY_ROLES: readonly ValleyRole[] = ["owner", "member", "visitor"];

const VALLEY_PERMISSIONS: readonly ValleyPermission[] = [
  "view_valley",
  "collect_gifts",
  "help_tasks",
  "decorate",
  "manage_invites",
  "manage_valley",
];

const VALLEY_INVITE_STATUSES: readonly ValleyInviteStatus[] = [
  "pending",
  "accepted",
  "declined",
  "expired",
  "revoked",
];

const QUEST_STATUSES: readonly QuestStatus[] = [
  "locked",
  "available",
  "active",
  "completed",
];

const RESTORATION_STATUSES: readonly RestorationProjectStatus[] = [
  "locked",
  "available",
  "in_progress",
  "completed",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSkillProgress(value: unknown): value is SkillProgress {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.skillId === "string" &&
    typeof value.totalXp === "number" &&
    Number.isFinite(value.totalXp) &&
    value.totalXp >= 0
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return isObject(value);
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isValleyRole(value: unknown): value is ValleyRole {
  return (
    typeof value === "string" &&
    (VALLEY_ROLES as readonly string[]).includes(value)
  );
}

function isValleyPermission(value: unknown): value is ValleyPermission {
  return (
    typeof value === "string" &&
    (VALLEY_PERMISSIONS as readonly string[]).includes(value)
  );
}

function isValleyPermissionList(value: unknown): value is ValleyPermission[] {
  return isArray(value) && value.every(isValleyPermission);
}

function isValleyInviteStatus(value: unknown): value is ValleyInviteStatus {
  return (
    typeof value === "string" &&
    (VALLEY_INVITE_STATUSES as readonly string[]).includes(value)
  );
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isQuestStatus(value: unknown): value is QuestStatus {
  return (
    typeof value === "string" &&
    (QUEST_STATUSES as readonly string[]).includes(value)
  );
}

function isQuestObjective(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.description === "string" &&
    typeof value.target === "number" &&
    Number.isFinite(value.target) &&
    typeof value.current === "number" &&
    Number.isFinite(value.current) &&
    typeof value.completed === "boolean"
  );
}

function isQuest(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isQuestStatus(value.status) &&
    isArray(value.objectives) &&
    value.objectives.every(isQuestObjective) &&
    isNullableString(value.startedAt) &&
    isNullableString(value.completedAt)
  );
}

function isQuestRecord(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(isQuest);
}

function isRestorationStatus(value: unknown): value is RestorationProjectStatus {
  return (
    typeof value === "string" &&
    (RESTORATION_STATUSES as readonly string[]).includes(value)
  );
}

function isRestorationContribution(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.userId === "string" &&
    isArray(value.completedStageIds) &&
    value.completedStageIds.every((entry) => typeof entry === "string") &&
    typeof value.resourcesContributed === "number" &&
    Number.isFinite(value.resourcesContributed)
  );
}

function isRestorationProject(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.regionId === "string" &&
    isRestorationStatus(value.status) &&
    typeof value.currentStageIndex === "number" &&
    Number.isFinite(value.currentStageIndex) &&
    value.currentStageIndex >= 0 &&
    isArray(value.completedStageIds) &&
    value.completedStageIds.every((entry) => typeof entry === "string") &&
    isNullableString(value.startedAt) &&
    isNullableString(value.completedAt) &&
    isArray(value.contributions) &&
    value.contributions.every(isRestorationContribution)
  );
}

function isRestorationRecord(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(isRestorationProject);
}

function isValleySaveData(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  const activeRegionId = value.activeRegionId;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.ownerUserId === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    (activeRegionId === null || typeof activeRegionId === "string") &&
    isRecord(value.regions) &&
    isQuestRecord(value.quests) &&
    isRecord(value.animals) &&
    isPersistedAnimalRecord(value.animals) &&
    (value.animalSpecies === undefined ||
      isPersistedAnimalSpeciesRecord(value.animalSpecies)) &&
    isRestorationRecord(value.restoration) &&
    isPersistedEventsState(value.events) &&
    isPersistedMiniGamesRecord(value.minigames) &&
    isRecord(value.decorations) &&
    isPersistedMerchantState(value.merchant) &&
    isPersistedProsperityState(value.prosperity) &&
    isPersistedRequestsState(value.requests) &&
    isPersistedReputationState(value.reputation)
  );
}

function isValleyMember(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.valleyId === "string" &&
    typeof value.userId === "string" &&
    isValleyRole(value.role) &&
    isValleyPermissionList(value.permissions) &&
    typeof value.joinedAt === "string"
  );
}

function isValleyInvite(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.valleyId === "string" &&
    typeof value.invitedByUserId === "string" &&
    isNullableString(value.inviteeUserId) &&
    isValleyRole(value.role) &&
    isValleyPermissionList(value.permissions) &&
    typeof value.createdAt === "string" &&
    isNullableString(value.expiresAt) &&
    isValleyInviteStatus(value.status)
  );
}

function isVisitSession(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.valleyId === "string" &&
    typeof value.visitorUserId === "string" &&
    typeof value.hostUserId === "string" &&
    isValleyPermissionList(value.permissions) &&
    typeof value.startedAt === "string" &&
    isNullableString(value.endedAt)
  );
}

function isSocialRecordMap(
  value: unknown,
  validateEntry: (entry: unknown) => boolean,
): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(validateEntry);
}

function isValleySaveMap(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(isValleySaveData);
}

export function isValidSaveData(value: unknown): value is GameSaveData {
  if (!isObject(value)) {
    return false;
  }

  if (
    typeof value.version !== "number" ||
    value.version < 1 ||
    value.version > 999
  ) {
    return false;
  }

  if (typeof value.savedAt !== "string") {
    return false;
  }

  if (!isObject(value.user)) {
    return false;
  }

  if (
    typeof value.user.id !== "string" ||
    typeof value.user.displayName !== "string" ||
    typeof value.user.createdAt !== "string" ||
    typeof value.user.lastSeenAt !== "string"
  ) {
    return false;
  }

  if (!isObject(value.player)) {
    return false;
  }

  if (
    typeof value.player.id !== "string" ||
    typeof value.player.userId !== "string" ||
    typeof value.player.displayName !== "string"
  ) {
    return false;
  }

  if (typeof value.activeValleyId !== "string") {
    return false;
  }

  if (!isValleySaveMap(value.valleys)) {
    return false;
  }

  const valleys = value.valleys;
  const activeValley = valleys[value.activeValleyId];

  if (!isValleySaveData(activeValley)) {
    return false;
  }

  if (!isSocialRecordMap(value.memberships, isValleyMember)) {
    return false;
  }

  if (!isSocialRecordMap(value.pendingInvites, isValleyInvite)) {
    return false;
  }

  if (!isSocialRecordMap(value.visitSessions, isVisitSession)) {
    return false;
  }

  if (!isRecord(value.skills)) {
    return false;
  }

  for (const progress of Object.values(value.skills)) {
    if (!isSkillProgress(progress)) {
      return false;
    }
  }

  if (!isArray(value.inventory)) {
    return false;
  }

  return true;
}

export function isSupportedSaveVersion(version: number, currentVersion: number): boolean {
  return version >= 1 && version <= currentVersion;
}
