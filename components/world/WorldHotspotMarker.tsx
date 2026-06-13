"use client";

import type { WorldHotspotViewModel } from "@/game/world/hotspot-view-model";
import { WORLD_HOTSPOT_LABELS } from "@/game/constants/world/labels";
import { LockIcon } from "@/components/icons/GameIcons";
import type { RegionId } from "@/types";

interface WorldHotspotMarkerProps {
  hotspot: WorldHotspotViewModel;
  isSelected: boolean;
  onSelect: (hotspotId: string) => void;
  hasEvent?: boolean;
}

export function WorldHotspotMarker({
  hotspot,
  isSelected,
  onSelect,
  hasEvent = false,
}: WorldHotspotMarkerProps) {
  const isMystery = hotspot.kind === "mystery";

  if (isMystery) {
    return (
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{
          left: `${hotspot.position.x}%`,
          top: `${hotspot.position.y}%`,
        }}
        title={hotspot.atmosphere}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-400/30 text-xs text-stone-500/80 backdrop-blur-sm sm:h-8 sm:w-8">
            {hotspot.markerEmoji === "?" ? "?" : "🌫️"}
          </div>
          <span className="max-w-[4rem] truncate text-[8px] font-medium text-stone-500/70 sm:text-[9px]">
            {hotspot.name}
          </span>
        </div>
      </div>
    );
  }

  const speakingCharacter = hotspot.characters[0];
  const isMarket = hotspot.kind === "market";

  return (
    <button
      type="button"
      onClick={() => onSelect(hotspot.id)}
      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
        isSelected ? "z-20 scale-110" : "z-10 hover:scale-105"
      } ${hotspot.isLocked ? "opacity-75" : ""}`}
      style={{
        left: `${hotspot.position.x}%`,
        top: `${hotspot.position.y}%`,
      }}
      aria-label={`${hotspot.name} — ${hotspot.subtitle}`}
      aria-pressed={isSelected}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className={`relative flex items-center justify-center rounded-2xl shadow-md ring-2 ring-white/90 backdrop-blur-sm ${
            isMarket
              ? "h-12 w-12 sm:h-14 sm:w-14"
              : "h-11 w-11 sm:h-12 sm:w-12"
          } ${
            hotspot.isLocked
              ? "bg-stone-200/80 grayscale"
              : isMarket
                ? "bg-gradient-to-br from-amber-100 to-orange-100"
                : "bg-gradient-to-br from-white/95 to-emerald-50/90"
          } ${isSelected ? "ring-amber-400/80 shadow-lg" : "ring-white/80"} ${
            hotspot.isHighlighted && !isSelected
              ? "animate-pulse ring-amber-300/70"
              : ""
          }`}
        >
          {hotspot.isLocked ? (
            <LockIcon className="text-stone-500" />
          ) : (
            <span
              className={`${isMarket ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
              aria-hidden
            >
              {hotspot.markerEmoji}
            </span>
          )}
          {speakingCharacter ? (
            <span
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow-md ring-2 ring-amber-200"
              title={speakingCharacter.name}
              aria-hidden
            >
              {speakingCharacter.portrait.fallbackEmoji}
            </span>
          ) : null}
          {hotspot.displayStatus === "in_progress" ? (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
          ) : null}
          {hotspot.displayStatus === "restored" ? (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-violet-500 ring-2 ring-white" />
          ) : null}
          {hasEvent ? (
            <span className="absolute -left-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] ring-2 ring-white">
              ✨
            </span>
          ) : null}
        </div>

        <span
          className={`max-w-[5.5rem] truncate rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur-sm sm:max-w-[6.5rem] sm:text-[11px] ${
            isSelected
              ? "bg-amber-100/95 text-amber-950"
              : isMarket && hotspot.isHighlighted
                ? "bg-amber-100/90 text-amber-950"
                : "bg-white/90 text-stone-700"
          }`}
        >
          {hotspot.name}
        </span>

        {hotspot.callout ? (
          <span className="rounded-full bg-rose-100/95 px-1.5 py-0.5 text-[8px] font-semibold text-rose-800 sm:text-[9px]">
            {hotspot.callout}
          </span>
        ) : null}

        {hotspot.isActive ? (
          <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white sm:text-[9px]">
            {WORLD_HOTSPOT_LABELS.youAreHere}
          </span>
        ) : null}
      </div>
    </button>
  );
}

export function hotspotHasEvent(
  hotspot: WorldHotspotViewModel,
  eventRegionIds: ReadonlySet<RegionId> | undefined,
): boolean {
  return Boolean(
    hotspot.regionId && eventRegionIds?.has(hotspot.regionId),
  );
}
