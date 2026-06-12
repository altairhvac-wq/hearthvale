import type { CustomerRequestStatus } from "@/types";

interface RequestStatusBadgeProps {
  status: CustomerRequestStatus;
}

function labelForStatus(status: CustomerRequestStatus): string {
  switch (status) {
    case "locked":
      return "Locked";
    case "available":
      return "Available";
    case "active":
      return "Active";
    case "completed":
      return "Done";
    default:
      return status;
  }
}

function colorForStatus(status: CustomerRequestStatus): string {
  switch (status) {
    case "locked":
      return "bg-stone-100 text-stone-500";
    case "available":
      return "bg-sky-50 text-sky-700";
    case "active":
      return "bg-amber-50 text-amber-700";
    case "completed":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-stone-100 text-stone-600";
  }
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${colorForStatus(status)}`}
    >
      {labelForStatus(status)}
    </span>
  );
}
