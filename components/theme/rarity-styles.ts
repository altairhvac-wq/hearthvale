import type { Rarity } from "@/types";

/** Presentation mapping — keep Tailwind out of domain types. */
export const RARITY_COLOR_CLASSES: Record<Rarity, string> = {
  common: "text-stone-600",
  uncommon: "text-emerald-600",
  rare: "text-sky-600",
  epic: "text-violet-600",
  legendary: "text-amber-600",
  mythic: "text-rose-600",
};
