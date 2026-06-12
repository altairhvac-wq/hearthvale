import type { EventCategory } from "@/types";

const EVENT_CATEGORY_STYLES: Record<EventCategory, string> = {
  festival: "bg-amber-100 text-amber-800 ring-amber-200/70",
  visitor: "bg-sky-100 text-sky-800 ring-sky-200/70",
  animal_encounter: "bg-emerald-100 text-emerald-800 ring-emerald-200/70",
  discovery: "bg-violet-100 text-violet-800 ring-violet-200/70",
  merchant: "bg-orange-100 text-orange-800 ring-orange-200/70",
  story: "bg-rose-100 text-rose-800 ring-rose-200/70",
  minigame_trigger: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200/70",
};

interface EventCategoryBadgeProps {
  label: string;
  category: EventCategory;
}

export function EventCategoryBadge({
  label,
  category,
}: EventCategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${EVENT_CATEGORY_STYLES[category]}`}
    >
      {label}
    </span>
  );
}
