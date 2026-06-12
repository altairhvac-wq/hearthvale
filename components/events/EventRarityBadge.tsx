import type { Rarity } from "@/types";

const RARITY_BADGE_STYLES: Record<Rarity, string> = {
  common: "bg-stone-100 text-stone-700 ring-stone-200/70",
  uncommon: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
  rare: "bg-sky-50 text-sky-700 ring-sky-200/70",
  epic: "bg-violet-50 text-violet-700 ring-violet-200/70",
  legendary: "bg-amber-50 text-amber-700 ring-amber-200/70",
  mythic: "bg-rose-50 text-rose-700 ring-rose-200/70",
};

interface EventRarityBadgeProps {
  label: string;
  rarity: Rarity;
}

export function EventRarityBadge({ label, rarity }: EventRarityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${RARITY_BADGE_STYLES[rarity]}`}
    >
      {label}
    </span>
  );
}
