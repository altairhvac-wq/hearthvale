"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { WorldHotspotViewModel } from "@/game/world/hotspot-view-model";
import { WORLD_HOTSPOT_LABELS } from "@/game/constants/world/labels";
import { getRegionProgressFill } from "@/components/theme/region-styles";
import { RegionStatusBadge } from "@/components/regions/RegionStatusBadge";
import { CharacterPresence } from "./CharacterPresence";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { RegionDisplayStatus } from "@/game/regions/display-status";

interface WorldHotspotPanelProps {
  hotspot: WorldHotspotViewModel | null;
  footer?: ReactNode;
  isFirstSession?: boolean;
  className?: string;
}

function resolveProgressVariant(
  status: RegionDisplayStatus | "mystery",
): "discovery" | "restoration" | "complete" | "locked" {
  if (status === "in_progress") {
    return "restoration";
  }

  if (status === "restored") {
    return "complete";
  }

  if (status === "locked" || status === "mystery") {
    return "locked";
  }

  return "discovery";
}

export function WorldHotspotPanel({
  hotspot,
  footer,
  isFirstSession = false,
  className = "",
}: WorldHotspotPanelProps) {
  if (!hotspot) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-stone-200/70 bg-white/50 px-4 py-6 text-center ${className}`}
      >
        <p className="text-sm text-stone-500">
          {WORLD_HOTSPOT_LABELS.tapToExplore}
        </p>
      </div>
    );
  }

  const isMystery = hotspot.displayStatus === "mystery";

  return (
    <article
      className={`overflow-hidden ${
        isFirstSession
          ? "rounded-2xl border border-amber-100/80 bg-amber-50/30"
          : `rounded-2xl border bg-white/85 shadow-sm backdrop-blur-sm ${
              isMystery
                ? "border-stone-200/60"
                : hotspot.kind === "market"
                  ? "border-amber-200/70"
                  : "border-emerald-200/60"
            }`
      } ${className}`}
    >
      <div className={isFirstSession ? "p-3 sm:p-4" : "p-4"}>
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ring-1 ${
              hotspot.isLocked
                ? "bg-stone-100 ring-stone-200/80 grayscale"
                : hotspot.kind === "market"
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 ring-amber-200/70"
                  : "bg-gradient-to-br from-emerald-50 to-lime-50 ring-emerald-200/60"
            }`}
            aria-hidden
          >
            {hotspot.markerEmoji}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-stone-900">
                {hotspot.name}
              </h3>
              {!isFirstSession && !isMystery ? (
                <RegionStatusBadge
                  status={hotspot.displayStatus as RegionDisplayStatus}
                />
              ) : null}
              {isMystery ? (
                <span className="inline-flex items-center rounded-full border border-stone-200/80 bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                  {WORLD_HOTSPOT_LABELS.distantSilhouette}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs font-medium italic text-stone-500">
              {hotspot.subtitle}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          {hotspot.atmosphere}
        </p>

        {hotspot.characters.length > 0 ? (
          <div className="mt-3 space-y-2">
            {hotspot.characters.map((character) => (
              <CharacterPresence
                key={character.id}
                character={character}
                compact
              />
            ))}
          </div>
        ) : null}

        {hotspot.showProgress &&
        hotspot.progressPercent !== null &&
        hotspot.progressNarrative ? (
          <div className="mt-4 opacity-90">
            <ProgressBar
              value={hotspot.progressPercent}
              label={hotspot.progressNarrative}
              showPercent={false}
              fillClassName={getRegionProgressFill(
                resolveProgressVariant(hotspot.displayStatus),
              )}
            />
          </div>
        ) : null}

        {hotspot.action ? (
          <div className="mt-4">
            <Link
              href={hotspot.action.href}
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors ${
                hotspot.kind === "market" || hotspot.isHighlighted
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {hotspot.action.label}
            </Link>
          </div>
        ) : null}
      </div>

      {footer ? (
        <div className="border-t border-stone-100/80 px-4 pb-4 pt-3">
          {footer}
        </div>
      ) : null}
    </article>
  );
}
