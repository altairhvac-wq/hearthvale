/** Known region map icon keys — extend when adding new region themes. */
export type RegionIconKey = "meadow" | "sanctuary" | "harbor" | "forest";

/** Known resource icon keys from the resource catalog. */
export type ResourceIconKey = "coin" | "heart" | "charm";

const REGION_ICON_KEYS = new Set<string>([
  "meadow",
  "sanctuary",
  "harbor",
  "forest",
]);

const RESOURCE_ICON_KEYS = new Set<string>(["coin", "heart", "charm"]);

export function isRegionIconKey(value: string): value is RegionIconKey {
  return REGION_ICON_KEYS.has(value);
}

export function isResourceIconKey(value: string): value is ResourceIconKey {
  return RESOURCE_ICON_KEYS.has(value);
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
