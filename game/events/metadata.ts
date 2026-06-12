import type { EventDefinition } from "@/types";

/** Known metadata keys for future event plug-ins — registry definitions stay data-driven. */
export type EventMetadataKey =
  | "cart_featured"
  | "animal_species"
  | "merchant_tier"
  | "story_hook"
  | "minigame_id"
  | "boat_route"
  | "weather_type"
  | "seasonal_festival";

export function getEventMetadata(
  definition: EventDefinition,
  key: EventMetadataKey,
): string | number | boolean | undefined {
  return definition.metadata[key];
}

export function isCartFeaturedEvent(definition: EventDefinition): boolean {
  return getEventMetadata(definition, "cart_featured") === true;
}
