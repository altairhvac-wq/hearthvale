/** Known region map icon keys — extend when adding new region themes. */
export type RegionIconKey = "meadow" | "sanctuary" | "harbor" | "forest";

/** Known resource icon keys from the resource catalog. */
export type ResourceIconKey = "coin" | "heart" | "charm";

/** Known inventory item icon keys from the item catalog. */
export type ItemIconKey =
  | "wildflowers"
  | "berries"
  | "pine_logs"
  | "stone"
  | "copper_ore"
  | "river_fish"
  | "basket"
  | "axe"
  | "pickaxe"
  | "fishing_rod";

const REGION_ICON_KEYS = new Set<string>([
  "meadow",
  "sanctuary",
  "harbor",
  "forest",
]);

const RESOURCE_ICON_KEYS = new Set<string>(["coin", "heart", "charm"]);

const ITEM_ICON_KEYS = new Set<string>([
  "wildflowers",
  "berries",
  "pine_logs",
  "stone",
  "copper_ore",
  "river_fish",
  "basket",
  "axe",
  "pickaxe",
  "fishing_rod",
]);

export function isRegionIconKey(value: string): value is RegionIconKey {
  return REGION_ICON_KEYS.has(value);
}

export function isResourceIconKey(value: string): value is ResourceIconKey {
  return RESOURCE_ICON_KEYS.has(value);
}

export function isItemIconKey(value: string): value is ItemIconKey {
  return ITEM_ICON_KEYS.has(value);
}

export function resolveRegionIconKey(
  mapIconKey: string | undefined,
  theme: string,
): RegionIconKey {
  if (mapIconKey && isRegionIconKey(mapIconKey)) {
    return mapIconKey;
  }

  if (isRegionIconKey(theme)) {
    return theme;
  }

  return "meadow";
}
