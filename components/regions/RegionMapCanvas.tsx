"use client";

import type {
  MapConnectionViewModel,
  RegionViewModel,
} from "@/game/regions/view-model";
import { getRegionDisplayStatusLabel } from "@/game/regions/display-status";
import { LockIcon, RegionIcon } from "@/components/icons/GameIcons";
import { EmptyState } from "@/components/ui/EmptyState";
import { getRegionThemeStyle } from "@/components/theme/region-styles";

interface RegionMapCanvasProps {
  regions: RegionViewModel[];
  connections: MapConnectionViewModel[];
  selectedRegionId: RegionViewModel["id"] | null;
  onSelectRegion: (regionId: RegionViewModel["id"]) => void;
  className?: string;
}

function getRegionById(
  regions: RegionViewModel[],
  id: RegionViewModel["id"],
): RegionViewModel | undefined {
  return regions.find((region) => region.id === id);
}

export function RegionMapCanvas({
  regions,
  connections,
  selectedRegionId,
  onSelectRegion,
  className = "",
}: RegionMapCanvasProps) {
  const positionedRegions = regions.filter((region) => region.isOnMap);

  if (positionedRegions.length === 0) {
    return (
      <EmptyState
        title="Map unavailable"
        description="No regions have map positions yet. They will still appear in the list below."
        className={className}
      />
    );
  }

  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-b from-sky-100/40 via-emerald-50/50 to-amber-50/60 shadow-inner sm:aspect-[5/4] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[8%] h-32 w-32 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute bottom-[12%] right-[8%] h-40 w-40 rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="absolute left-[40%] top-[35%] h-24 w-24 rounded-full bg-sky-200/20 blur-2xl" />
      </div>

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {connections.map((connection) => {
          const from = getRegionById(regions, connection.from);
          const to = getRegionById(regions, connection.to);

          if (!from?.mapPosition || !to?.mapPosition) {
            return null;
          }

          const bothLocked =
            from.displayStatus === "locked" && to.displayStatus === "locked";

          return (
            <line
              key={`${connection.from}-${connection.to}`}
              x1={from.mapPosition.x}
              y1={from.mapPosition.y}
              x2={to.mapPosition.x}
              y2={to.mapPosition.y}
              className={
                bothLocked
                  ? "stroke-stone-300/50"
                  : "stroke-emerald-400/40"
              }
              strokeWidth="0.6"
              strokeDasharray={bothLocked ? "2 2" : "0"}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {positionedRegions.map((region) => {
        const theme = getRegionThemeStyle(region.theme);
        const isLocked = region.displayStatus === "locked";
        const isSelected = selectedRegionId === region.id;
        const position = region.mapPosition;
        const statusLabel = getRegionDisplayStatusLabel(region.displayStatus);

        if (!position) {
          return null;
        }

        return (
          <button
            key={region.id}
            type="button"
            onClick={() => onSelectRegion(region.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              isSelected ? "z-10 scale-110" : "z-0 hover:scale-105"
            } ${isLocked ? "opacity-70" : ""}`}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            aria-label={`${region.name} — ${statusLabel}`}
            aria-pressed={isSelected}
          >
            <div
              className={`flex flex-col items-center gap-1 ${isSelected ? "drop-shadow-lg" : ""}`}
            >
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ring-2 ring-white/80 shadow-md sm:h-14 sm:w-14 ${theme.nodeBg} ${theme.nodeRing} ${isLocked ? "grayscale" : ""}`}
              >
                {isLocked ? (
                  <LockIcon className="text-stone-500" />
                ) : (
                  <RegionIcon iconKey={region.iconKey} className="h-6 w-6" />
                )}
                {region.displayStatus === "in_progress" ? (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white" />
                ) : null}
                {region.displayStatus === "restored" ? (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-violet-500 ring-2 ring-white" />
                ) : null}
              </div>
              <span
                className={`max-w-[5.5rem] truncate rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur-sm sm:max-w-[6.5rem] sm:text-xs ${theme.accent}`}
              >
                {region.name}
              </span>
              {region.isActive ? (
                <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  You
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
