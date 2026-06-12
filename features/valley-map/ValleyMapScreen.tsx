"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RegionId } from "@/types";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { FestivalCartPanel } from "@/components/events/FestivalCartPanel";
import { ValleyEventBanner } from "@/components/events/ValleyEventIndicator";
import { ValleyEventIndicator } from "@/components/events/ValleyEventIndicator";
import { RegionCard } from "@/components/regions/RegionCard";
import { RegionMapCanvas } from "@/components/regions/RegionMapCanvas";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useIsGameHydrated,
  usePlayerHeaderData,
} from "@/store";
import { RegionRestorationFooter } from "@/features/restoration";
import {
  useActivateFeaturedEvent,
  useCompleteFeaturedEvent,
  useFestivalCartData,
  useRefreshEventScheduler,
} from "@/features/festival-cart";
import { useSetActiveRegion, useValleyMapData } from "./use-valley-map";

export function ValleyMapScreen() {
  const isHydrated = useIsGameHydrated();
  const mapData = useValleyMapData();
  const festivalCartData = useFestivalCartData();
  const headerData = usePlayerHeaderData();
  const setActiveRegionId = useSetActiveRegion();
  const refreshEventScheduler = useRefreshEventScheduler();
  const activateFeaturedEvent = useActivateFeaturedEvent();
  const completeFeaturedEvent = useCompleteFeaturedEvent();
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId | null>(
    null,
  );
  const hasEvaluatedScheduler = useRef(false);

  useEffect(() => {
    if (!isHydrated || hasEvaluatedScheduler.current) {
      return;
    }

    hasEvaluatedScheduler.current = true;
    refreshEventScheduler();
  }, [isHydrated, refreshEventScheduler]);

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

  const handleActivateEvent = useCallback(() => {
    activateFeaturedEvent();
  }, [activateFeaturedEvent]);

  const handleCompleteEvent = useCallback(() => {
    completeFeaturedEvent();
  }, [completeFeaturedEvent]);

  if (!isHydrated || !mapData || !headerData || !festivalCartData) {
    return <GameLoadingState />;
  }

  const eventIndicatorByRegion = new Map(
    festivalCartData.regionIndicators.map((indicator) => [
      indicator.regionId,
      indicator,
    ]),
  );

  const eventRegionIds = new Set(eventIndicatorByRegion.keys());

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
        {festivalCartData.isVisible && festivalCartData.featuredEvent ? (
          <ValleyEventBanner
            eventTitle={festivalCartData.featuredEvent.title}
            rarityLabel={festivalCartData.featuredEvent.rarityLabel}
          />
        ) : null}

        <FestivalCartPanel
          data={festivalCartData}
          onActivate={handleActivateEvent}
          onComplete={handleCompleteEvent}
        />

        {!festivalCartData.isVisible && !festivalCartData.isWaitingForCart ? (
          <p className="rounded-2xl border border-stone-200/70 bg-stone-50/80 px-3 py-2.5 text-center text-xs text-stone-500">
            The valley is peaceful — explore regions and check back for the
            Festival Cart.
          </p>
        ) : null}

        <RegionMapCanvas
          regions={mapData.regions}
          connections={mapData.connections}
          selectedRegionId={activeSelection}
          onSelectRegion={handleSelectRegion}
          eventRegionIds={eventRegionIds}
        />

        {selectedRegion ? (
          <RegionCard
            region={selectedRegion}
            onSelect={handleSelectRegion}
            footer={
              <>
                {eventIndicatorByRegion.get(selectedRegion.id) ? (
                  <div className="mb-3">
                    <ValleyEventIndicator
                      indicator={eventIndicatorByRegion.get(selectedRegion.id)!}
                    />
                  </div>
                ) : null}
                <RegionRestorationFooter regionId={selectedRegion.id} />
              </>
            }
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
                footer={
                  <>
                    {eventIndicatorByRegion.get(region.id) ? (
                      <div className="mb-3">
                        <ValleyEventIndicator
                          indicator={eventIndicatorByRegion.get(region.id)!}
                        />
                      </div>
                    ) : null}
                    <RegionRestorationFooter regionId={region.id} compact />
                  </>
                }
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
