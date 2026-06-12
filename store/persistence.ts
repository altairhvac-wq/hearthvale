import { SAVE_VERSION, type GameSaveData } from "@/types";
import { migrateSaveData } from "./migrations";
import {
  isSupportedSaveVersion,
  isValidSaveData,
} from "./save-validation";

export const SAVE_STORAGE_KEY = "hearthvale:save";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseSavePayload(raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readValidatedSave(parsed: Record<string, unknown>): GameSaveData | null {
  const migrated = migrateSaveData(parsed);

  if (!isValidSaveData(migrated)) {
    console.warn("[Hearthvale] Invalid save data — starting fresh.");
    return null;
  }

  if (!isSupportedSaveVersion(migrated.version, SAVE_VERSION)) {
    console.warn(
      `[Hearthvale] Unsupported save version ${migrated.version} — starting fresh.`,
    );
    return null;
  }

  return migrated;
}

export function loadGameSave(): GameSaveData | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SAVE_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = parseSavePayload(raw);

    if (!parsed) {
      console.warn("[Hearthvale] Corrupt save JSON — starting fresh.");
      return null;
    }

    return readValidatedSave(parsed);
  } catch (error) {
    console.error("[Hearthvale] Failed to load save:", error);
    return null;
  }
}

export function saveGameSave(data: GameSaveData): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("[Hearthvale] Failed to save game:", error);
    return false;
  }
}

export function clearGameSave(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SAVE_STORAGE_KEY);
}

export function exportGameSave(data: GameSaveData): string {
  return JSON.stringify(data, null, 2);
}

export function importGameSave(json: string): GameSaveData | null {
  const parsed = parseSavePayload(json);

  if (!parsed) {
    return null;
  }

  return readValidatedSave(parsed);
}
