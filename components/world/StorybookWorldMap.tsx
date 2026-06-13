"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { RegionId } from "@/types";
import type { RegionViewModel } from "@/game/regions/view-model";
import type { HomeMarketStandViewModel } from "@/game/onboarding/home-view-model";
import {
  buildWorldHotspotViewModels,
  resolveDefaultHotspotId,
} from "@/game/world/hotspot-view-model";
import { StorybookVillageScene } from "./StorybookVillageScene";
import { hotspotHasEvent, WorldHotspotMarker } from "./WorldHotspotMarker";
import { WorldHotspotPanel } from "./WorldHotspotPanel";

interface StorybookWorldMapProps {
  regions: RegionViewModel[];
  marketStand: HomeMarketStandViewModel;
  isFirstSession: boolean;
  activeRegionId: RegionId | null;
  onSelectRegion: (regionId: RegionId) => void;
  eventRegionIds?: ReadonlySet<RegionId>;
  renderHotspotFooter?: (regionId: RegionId) => ReactNode;
  className?: string;
}

export function StorybookWorldMap({
  regions,
  marketStand,
  isFirstSession,
  activeRegionId,
  onSelectRegion,
  eventRegionIds,
  renderHotspotFooter,
  className = "",
}: StorybookWorldMapProps) {
  const hotspots = useMemo(
    () =>
      buildWorldHotspotViewModels({
        regions,
        marketStand,
        isFirstSession,
      }),
    [regions, marketStand, isFirstSession],
  );

  const defaultHotspotId = useMemo(
    () => resolveDefaultHotspotId(hotspots, activeRegionId, isFirstSession),
    [hotspots, activeRegionId, isFirstSession],
  );

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (defaultHotspotId) {
      setSelectedHotspotId((current) => current ?? defaultHotspotId);
    }
  }, [defaultHotspotId]);

  const selectedHotspot =
    hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? null;

  const handleSelectHotspot = useCallback(
    (hotspotId: string) => {
      setSelectedHotspotId(hotspotId);

      const hotspot = hotspots.find((entry) => entry.id === hotspotId);
      if (hotspot?.regionId && hotspot.kind !== "mystery") {
        onSelectRegion(hotspot.regionId);
      }
    },
    [hotspots, onSelectRegion],
  );

  const interactiveHotspots = hotspots.filter(
    (hotspot) => hotspot.kind !== "mystery",
  );

  const panelFooter =
    selectedHotspot?.regionId && renderHotspotFooter && !isFirstSession
      ? renderHotspotFooter(selectedHotspot.regionId)
      : undefined;

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden rounded-3xl border shadow-inner sm:aspect-[5/4] ${
          isFirstSession
            ? "border-amber-200/60 bg-gradient-to-b from-sky-100/50 via-amber-50/40 to-emerald-50/50"
            : "border-amber-200/50 bg-gradient-to-b from-sky-100/40 via-emerald-50/50 to-amber-50/60"
        }`}
      >
        <StorybookVillageScene highlightMarket={isFirstSession} />

        {interactiveHotspots.map((hotspot) => (
          <WorldHotspotMarker
            key={hotspot.id}
            hotspot={hotspot}
            isSelected={selectedHotspotId === hotspot.id}
            onSelect={handleSelectHotspot}
            hasEvent={hotspotHasEvent(hotspot, eventRegionIds)}
          />
        ))}

        {hotspots
          .filter((hotspot) => hotspot.kind === "mystery")
          .map((hotspot) => (
            <WorldHotspotMarker
              key={hotspot.id}
              hotspot={hotspot}
              isSelected={false}
              onSelect={handleSelectHotspot}
            />
          ))}
      </div>

      <WorldHotspotPanel
        hotspot={selectedHotspot}
        footer={panelFooter}
        isFirstSession={isFirstSession}
      />
    </div>
  );
}
