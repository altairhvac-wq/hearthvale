import type { EventRegionIndicator } from "@/game/events/view-model";

interface ValleyEventIndicatorProps {
  indicator: EventRegionIndicator;
}

export function ValleyEventIndicator({ indicator }: ValleyEventIndicatorProps) {
  const statusLabel =
    indicator.status === "available" ? "New event" : "Active event";

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800 shadow-sm ring-1 ring-amber-100/80">
      <span className="text-xs" aria-hidden>
        ✨
      </span>
      <span>{statusLabel}</span>
      <span className="text-amber-600/70">·</span>
      <span className="font-medium text-amber-700/90">
        {indicator.rarityLabel}
      </span>
    </div>
  );
}

interface ValleyEventBannerProps {
  eventTitle: string;
  rarityLabel: string;
}

export function ValleyEventBanner({
  eventTitle,
  rarityLabel,
}: ValleyEventBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50/95 via-orange-50/90 to-rose-50/80 px-3 py-2.5 shadow-sm ring-1 ring-amber-100/70">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-orange-100 text-lg shadow-inner">
        🛒
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700/75">
          Festival Cart Nearby
        </p>
        <p className="truncate text-sm font-semibold text-stone-800">
          {eventTitle}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
        {rarityLabel}
      </span>
    </div>
  );
}
