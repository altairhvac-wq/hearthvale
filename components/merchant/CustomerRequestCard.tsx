import type { CustomerRequestViewModel } from "@/game/requests/view-model";
import { RequestStatusBadge } from "./RequestStatusBadge";

interface CustomerRequestCardProps {
  request: CustomerRequestViewModel;
  onActivate?: () => void;
  onComplete?: () => void;
}

export function CustomerRequestCard({
  request,
  onActivate,
  onComplete,
}: CustomerRequestCardProps) {
  return (
    <article className="rounded-2xl border border-stone-200/70 bg-white/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-stone-400">
            {request.customerName} · {request.category}
          </p>
          <h3 className="mt-0.5 font-semibold text-stone-800">{request.title}</h3>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-stone-500">
        {request.description}
      </p>

      {request.requiredResources.length > 0 ? (
        <div className="mt-3 rounded-xl bg-stone-50 px-3 py-2">
          <p className="text-[11px] font-medium text-stone-500">Needed</p>
          <ul className="mt-1 space-y-0.5">
            {request.requiredResources.map((resource) => (
              <li key={resource.label} className="text-xs text-stone-600">
                {resource.amount}× {resource.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {request.rewardDescriptions.length > 0 ? (
        <div className="mt-2">
          <p className="text-[11px] font-medium text-emerald-600">Rewards</p>
          <p className="text-xs text-stone-500">
            {request.rewardDescriptions.join(" · ")}
          </p>
        </div>
      ) : null}

      {request.unlockDescription && request.status === "locked" ? (
        <p className="mt-2 text-xs text-stone-400">{request.unlockDescription}</p>
      ) : null}

      {request.canActivate && onActivate ? (
        <button
          type="button"
          onClick={onActivate}
          className="mt-3 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          Accept request
        </button>
      ) : null}

      {request.canComplete && onComplete ? (
        <button
          type="button"
          onClick={onComplete}
          className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Fulfill request
        </button>
      ) : null}
    </article>
  );
}
