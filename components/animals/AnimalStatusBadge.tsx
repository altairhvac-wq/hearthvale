import type { AnimalRescueStatus } from "@/types";
import { getRescueStatusLabel } from "@/game/animals/view-model";

const STATUS_STYLES: Record<AnimalRescueStatus, string> = {
  rescued: "bg-emerald-100 text-emerald-800 ring-emerald-200/70",
  available: "bg-amber-100 text-amber-800 ring-amber-200/70",
  locked: "bg-stone-100 text-stone-500 ring-stone-200/70",
};

interface AnimalStatusBadgeProps {
  status: AnimalRescueStatus;
  className?: string;
}

export function AnimalStatusBadge({
  status,
  className = "",
}: AnimalStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ${STATUS_STYLES[status]} ${className}`}
    >
      {getRescueStatusLabel(status)}
    </span>
  );
}
