"use client";

import { useCallback, useState } from "react";
import type { RegionId } from "@/types";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { RegionCard } from "@/components/regions/RegionCard";
import { RegionMapCanvas } from "@/components/regions/RegionMapCanvas";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useIsGameHydrated,
  usePlayerHeaderData,
} from "@/store";
import { useSetActiveRegion, useValleyMapData } from "./use-valley-map";

export function ValleyMapScreen() {
  const isHydrated = useIsGameHydrated();
  const mapData = useValleyMapData();
  const headerData = usePlayerHeaderData();
  const setActiveRegionId = useSetActiveRegion();
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId | null>(
    null,
  );

  const handleSelectRegion = useCallback(
    (regionId: RegionId) => {
      setSelectedRegionId(regionId);

      const region = mapData?.regions.find((entry) => entry.id === regionId);
      if (region?.canTravel) {
        setActiveRegionId(regionId);
      }
    },
    [mapData?.regions, setActiveRegionId],
  );

  if (!isHydrated || !mapData || !headerData) {
    return <GameLoadingState />;
  }

  if (mapData.regions.length === 0) {
    return (
      <GameShell
        resources={headerData.resources}
        levelInfo={headerData.levelInfo}
        displayName={headerData.displayName}
        title="Hearthvale"
        subtitle="A living valley awaits your gentle touch"
      >
        <EmptyState
          title="The valley is quiet"
          description="No regions are available yet. Your journey will begin here once the world awakens."
        />
      </GameShell>
    );
  }

  const activeSelection =
    selectedRegionId ?? mapData.activeRegionId ?? mapData.regions[0]?.id ?? null;

  const selectedRegion =
    mapData.regions.find((region) => region.id === activeSelection) ?? null;

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      title="Hearthvale"
      subtitle="A living valley awaits your gentle touch"
    >
      <section className="space-y-5">
        <RegionMapCanvas
          regions={mapData.regions}
          connections={mapData.connections}
          selectedRegionId={activeSelection}
          onSelectRegion={handleSelectRegion}
        />

        {selectedRegion ? (
          <RegionCard
            region={selectedRegion}
            onSelect={handleSelectRegion}
          />
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-stone-700">
              Valley Regions
            </h2>
            <span className="shrink-0 text-xs text-stone-400">
              {mapData.reachableCount} of {mapData.regions.length} reachable
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {mapData.regions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                compact
                onSelect={handleSelectRegion}
                className={
                  region.id === activeSelection
                    ? "ring-2 ring-emerald-300/60"
                    : ""
                }
              />
            ))}
          </div>
        </div>
      </section>
    </GameShell>
  );
}
