import type { GatheringCategory } from "@/types";

interface GatherCategoryBadgeProps {
  category: GatheringCategory;
  className?: string;
}

const CATEGORY_STYLES: Record<
  GatheringCategory,
  { label: string; className: string }
> = {
  foraging: {
    label: "Foraging",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  woodcutting: {
    label: "Woodcutting",
    className: "bg-amber-100 text-amber-900 border-amber-200",
  },
  mining: {
    label: "Mining",
    className: "bg-stone-200 text-stone-800 border-stone-300",
  },
  fishing: {
    label: "Fishing",
    className: "bg-sky-100 text-sky-900 border-sky-200",
  },
};

export function GatherCategoryBadge({
  category,
  className = "",
}: GatherCategoryBadgeProps) {
  const style = CATEGORY_STYLES[category];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.className} ${className}`}
    >
      {style.label}
    </span>
  );
}
