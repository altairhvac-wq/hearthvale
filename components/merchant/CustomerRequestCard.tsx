import type { CustomerRequestViewModel } from "@/game/requests/view-model";
import Link from "next/link";
import { RequestStatusBadge } from "./RequestStatusBadge";

interface CustomerRequestCardProps {
  request: CustomerRequestViewModel;
  onActivate?: () => void;
  onComplete?: () => void;
}

function buildCustomerLine(request: CustomerRequestViewModel): string {
  if (request.status === "locked") {
    return `${request.customerName} will visit when your stand grows.`;
  }

  const itemLabels = request.requiredResources
    .map((resource) => resource.label.toLowerCase())
    .join(" and ");

  if (request.status === "available") {
    return `${request.customerName} is looking for ${itemLabels}.`;
  }

  if (request.status === "active") {
    return request.hasMissingItems
      ? `${request.customerName} is still waiting for ${itemLabels}.`
      : `${request.customerName} is ready for you to deliver.`;
  }

  return request.description;
}

export function CustomerRequestCard({
  request,
  onActivate,
  onComplete,
}: CustomerRequestCardProps) {
  const showStock =
    request.status === "active" ||
    request.status === "available" ||
    request.status === "completed";
  const isActive = request.status === "active";
  const customerLine = buildCustomerLine(request);

  return (
    <article
      className={`rounded-2xl border p-4 shadow-sm ${
        request.status === "active"
          ? "border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-white/90"
          : request.status === "locked"
            ? "border-stone-200/50 bg-stone-50/60"
            : "border-stone-200/70 bg-white/80"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-stone-400">
            {request.customerName}
          </p>
          <h3 className="mt-0.5 font-semibold text-stone-800">{request.title}</h3>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-stone-600">{customerLine}</p>

      {request.status !== "locked" ? (
        <p className="mt-1 text-xs italic text-stone-400">{request.description}</p>
      ) : null}

      {request.requiredResources.length > 0 && request.status !== "locked" ? (
        <div className="mt-3 rounded-xl bg-stone-50 px-3 py-2">
          <p className="text-[11px] font-medium text-stone-500">In your pack</p>
          <ul className="mt-1 space-y-1">
            {request.requiredResources.map((resource) => (
              <li
                key={resource.placeholderId}
                className={`flex items-center justify-between text-xs ${
                  showStock && !resource.sufficient
                    ? "text-amber-700"
                    : "text-stone-600"
                }`}
              >
                <span>
                  {resource.label}
                  {showStock && resource.missing > 0 ? (
                    <span className="ml-1 text-[11px] text-amber-700">
                      — still need {resource.missing}
                    </span>
                  ) : null}
                </span>
                {showStock ? (
                  <span className="font-medium tabular-nums">
                    {resource.owned} of {resource.amount}
                  </span>
                ) : (
                  <span className="font-medium tabular-nums">{resource.amount}×</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {isActive && request.hasMissingItems ? (
        <p className="mt-2 text-xs text-amber-700">
          Wander the meadow and fill your pack.{" "}
          <Link
            href="/gather"
            className="font-medium underline decoration-amber-400/60 underline-offset-2"
          >
            Go gather
          </Link>
          {" · "}
          <Link
            href="/inventory"
            className="font-medium underline decoration-amber-400/60 underline-offset-2"
          >
            Check pack
          </Link>
        </p>
      ) : null}

      {request.rewardDescriptions.length > 0 && request.status !== "locked" ? (
        <div className="mt-2">
          <p className="text-[11px] font-medium text-emerald-600">You&apos;ll receive</p>
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
          Promise to help
        </button>
      ) : null}

      {isActive && onComplete ? (
        request.canComplete ? (
          <button
            type="button"
            onClick={onComplete}
            className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Deliver with care
          </button>
        ) : (
          <button
            type="button"
            disabled
            title={request.completionBlockedReason ?? "Gather more first"}
            className="mt-3 w-full cursor-not-allowed rounded-xl bg-stone-200 px-4 py-2 text-sm font-medium text-stone-500"
          >
            Gather more first
          </button>
        )
      ) : null}
    </article>
  );
}
