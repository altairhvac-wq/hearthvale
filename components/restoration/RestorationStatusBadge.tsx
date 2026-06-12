import type { RestorationProjectStatus } from "@/types";

interface RestorationStatusBadgeProps {
  status: RestorationProjectStatus;
  className?: string;
}

const STATUS_STYLES: Record<
  RestorationProjectStatus,
  { label: string; className: string }
> = {
  locked: {
    label: "Locked",
    className: "bg-stone-100 text-stone-500 ring-stone-200/80",
  },
  available: {
    label: "Available",
    className: "bg-sky-50 text-sky-700 ring-sky-200/70",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-50 text-amber-800 ring-amber-200/70",
  },
  completed: {
    label: "Restored",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
  },
};

export function RestorationStatusBadge({
  status,
  className = "",
}: RestorationStatusBadgeProps) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${style.className} ${className}`}
    >
      {style.label}
    </span>
  );
}
