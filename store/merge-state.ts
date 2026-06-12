import type { Player, PlayerPreferences, PlayerResources } from "@/types";

export function mergePlayerResources(
  defaults: PlayerResources,
  saved: PlayerResources | undefined,
): PlayerResources {
  return {
    ...defaults,
    ...saved,
  };
}

export function mergePlayerPreferences(
  defaults: PlayerPreferences,
  saved: PlayerPreferences | undefined,
): PlayerPreferences {
  return {
    ...defaults,
    ...saved,
  };
}

export function mergePlayer(defaults: Player, saved: Player | undefined): Player {
  if (!saved) {
    return defaults;
  }

  return {
    ...defaults,
    ...saved,
    resources: mergePlayerResources(defaults.resources, saved.resources),
    preferences: mergePlayerPreferences(defaults.preferences, saved.preferences),
  };
}

export function mergeKeyedRecord<T extends { id: string }>(
  defaults: Record<string, T>,
  saved: Record<string, T> | undefined,
): Record<string, T> {
  if (!saved) {
    return defaults;
  }

  const merged = { ...defaults };

  for (const [key, value] of Object.entries(saved)) {
    if (value && typeof value === "object" && "id" in value) {
      merged[key] = value;
    }
  }

  return merged;
}
