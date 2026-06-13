import type { HomeMarketStandViewModel } from "@/game/onboarding/home-view-model";
import { HOME_SCREEN_LABELS } from "@/game/constants/world/labels";
import Link from "next/link";

interface MarketStandSpotlightProps {
  marketStand: HomeMarketStandViewModel;
}

export function MarketStandSpotlight({ marketStand }: MarketStandSpotlightProps) {
  return (
    <Link
      href={marketStand.href}
      className="group block rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-rose-50/40 p-5 shadow-sm transition-all hover:border-amber-300/80 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-4xl shadow-inner ring-1 ring-amber-200/60 transition-transform group-hover:scale-105"
          aria-hidden
        >
          {marketStand.iconEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700/80">
            {HOME_SCREEN_LABELS.marketStandEyebrow}
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-stone-900">
            {marketStand.title}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-amber-800/75">
            {marketStand.statusLine}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {marketStand.narrative}
          </p>
          {marketStand.hasPendingCustomer && marketStand.customerLine ? (
            <p className="mt-3 rounded-xl border border-amber-200/60 bg-white/70 px-3 py-2 text-xs leading-relaxed text-amber-950/90">
              <span className="font-semibold">{HOME_SCREEN_LABELS.neighborAsks}</span>{" "}
              {marketStand.customerLine}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 self-center rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-amber-700">
          {HOME_SCREEN_LABELS.visit}
        </span>
      </div>
    </Link>
  );
}
