import type { EventCategory } from "@/types";

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  festival: "Festival",
  visitor: "Visitor",
  animal_encounter: "Animal Encounter",
  discovery: "Discovery",
  merchant: "Merchant",
  story: "Story",
  minigame_trigger: "Mini-Game",
};

export const EVENT_CATEGORY_EMOJI: Record<EventCategory, string> = {
  festival: "🎪",
  visitor: "🧳",
  animal_encounter: "🐇",
  discovery: "✨",
  merchant: "🛒",
  story: "📜",
  minigame_trigger: "🎮",
};

export function getEventCategoryLabel(category: EventCategory): string {
  return EVENT_CATEGORY_LABELS[category];
}
