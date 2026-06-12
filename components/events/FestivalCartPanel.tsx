"use client";

import type { FestivalCartData } from "@/game/events/view-model";
import { EVENT_CATEGORY_EMOJI } from "@/game/events/presentation";
import { EventCategoryBadge } from "./EventCategoryBadge";
import { EventRarityBadge } from "./EventRarityBadge";

interface FestivalCartPanelProps {
  data: FestivalCartData;
  onActivate: () => void;
  onComplete: () => void;
}

function FestivalCartWaitingState({
  cartCooldownRemaining,
}: {
  cartCooldownRemaining: number;
}) {
  const visitLabel = cartCooldownRemaining === 1 ? "visit" : "visits";

  return (
    <section className="rounded-3xl border border-dashed border-amber-200/70 bg-gradient-to-br from-stone-50 via-amber-50/40 to-orange-50/30 px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100/80 text-xl opacity-70">
          <span aria-hidden>🛒</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700/70">
            Traveling Festival Cart
          </p>
          <h2 className="mt-1 text-sm font-semibold text-stone-700 sm:text-base">
            The cart is on the road
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            Bells fade in the distance. Return after{" "}
            <span className="font-semibold text-amber-800">
              {cartCooldownRemaining} more valley {visitLabel}
            </span>{" "}
            to welcome the next surprise.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FestivalCartPanel({
  data,
  onActivate,
  onComplete,
}: FestivalCartPanelProps) {
  if (data.isWaitingForCart) {
    return (
      <FestivalCartWaitingState
        cartCooldownRemaining={data.cartCooldownRemaining}
      />
    );
  }

  if (!data.isVisible || !data.featuredEvent) {
    return null;
  }

  const event = data.featuredEvent;
  const categoryEmoji = EVENT_CATEGORY_EMOJI[event.category];
  const cartTitle = event.isCartFeatured
    ? "Traveling Festival Cart"
    : "Festival Cart Discovery";

  return (
    <section className="overflow-hidden rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50/80 to-rose-50 shadow-lg shadow-amber-100/60 ring-1 ring-amber-100/80">
      <div className="relative px-4 py-4 sm:px-5 sm:py-5">
        <div
          className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-amber-200/40 to-orange-200/20 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-4 h-24 w-24 rounded-full bg-gradient-to-tr from-rose-200/30 to-violet-200/20 blur-2xl"
          aria-hidden
        />

        <div className="relative flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-orange-100 to-rose-100 text-2xl shadow-inner ring-2 ring-amber-200/60">
            <span aria-hidden>🛒</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700/80">
              {cartTitle}
            </p>
            <h2 className="mt-1 text-base font-semibold text-stone-800 sm:text-lg">
              {event.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <EventCategoryBadge
                label={event.categoryLabel}
                category={event.category}
              />
              <EventRarityBadge label={event.rarityLabel} rarity={event.rarity} />
            </div>
          </div>

          <span className="shrink-0 text-xl" aria-hidden>
            {categoryEmoji}
          </span>
        </div>

        <p className="relative mt-3 text-sm leading-relaxed text-stone-600">
          {event.description}
        </p>

        {event.regionName ? (
          <p className="relative mt-2 text-xs font-medium text-amber-800/80">
            Spotted near {event.regionName}
          </p>
        ) : null}

        {event.rewards.length === 0 && event.bonusRewards.length === 0 ? (
          <p className="relative mt-4 rounded-2xl border border-amber-200/40 bg-white/50 px-3 py-3 text-sm text-stone-500">
            No material rewards — enjoy the moment.
          </p>
        ) : (
          <div className="relative mt-4 rounded-2xl border border-amber-200/50 bg-white/60 px-3 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">
              Rewards
            </p>
            <ul className="mt-2 space-y-1.5">
              {event.rewards.map((reward) => (
                <li
                  key={reward.description}
                  className="flex items-center gap-2 text-sm text-stone-700"
                >
                  <span className="text-amber-500" aria-hidden>
                    ✦
                  </span>
                  {reward.description}
                </li>
              ))}
              {event.bonusRewards.map((bonus) => (
                <li
                  key={bonus}
                  className="flex items-center gap-2 text-sm text-stone-500"
                >
                  <span className="text-violet-400" aria-hidden>
                    ◇
                  </span>
                  <span>
                    {bonus}
                    <span className="ml-1 text-[10px] uppercase tracking-wide text-stone-400">
                      bonus
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative mt-4 flex flex-col gap-2 sm:flex-row">
          {event.canActivate ? (
            <button
              type="button"
              onClick={onActivate}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-300/40 transition hover:from-amber-600 hover:to-orange-600 active:scale-[0.98]"
            >
              Welcome the Cart
            </button>
          ) : null}

          {event.canComplete ? (
            <button
              type="button"
              onClick={onComplete}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-300/40 transition hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98]"
            >
              Complete Event
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
