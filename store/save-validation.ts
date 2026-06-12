import type { GameSaveData, SkillProgress } from "@/types";

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

  if (!isObject(value.player)) {
    return false;
  }

  if (
    typeof value.player.id !== "string" ||
    typeof value.player.displayName !== "string"
  ) {
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

  if (!isRecord(value.regions)) {
    return false;
  }

  if (!isRecord(value.quests)) {
    return false;
  }

  if (!isRecord(value.animals)) {
    return false;
  }

  if (!isRecord(value.restoration)) {
    return false;
  }

  if (!isRecord(value.events)) {
    return false;
  }

  if (!isRecord(value.minigames)) {
    return false;
  }

  if (!isRecord(value.decorations)) {
    return false;
  }

  return true;
}

export function isSupportedSaveVersion(version: number, currentVersion: number): boolean {
  return version >= 1 && version <= currentVersion;
}
