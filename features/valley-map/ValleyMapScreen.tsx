"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RegionId } from "@/types";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import {
  CurrentObjectivePanel,
  FutureUnlocksPanel,
  MarketStandSpotlight,
  VillageStoryPanel,
} from "@/components/immersion";
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
import { useHomeImmersionData } from "./use-home-immersion";
import { useSetActiveRegion, useValleyMapData } from "./use-valley-map";

export function ValleyMapScreen() {
  const isHydrated = useIsGameHydrated();
  const mapData = useValleyMapData();
  const immersionData = useHomeImmersionData();
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

  if (
    !isHydrated ||
    !mapData ||
    !headerData ||
    !festivalCartData ||
    !immersionData
  ) {
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
        isNewPlayer={headerData.isNewPlayer}
        title="Hearthvale"
        subtitle="A valley waiting to bloom again"
      >
        <EmptyState
          title="The valley is quiet"
          description="No paths are open yet — but your journey will begin here soon."
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
      isNewPlayer={headerData.isNewPlayer}
      title="Hearthvale"
      subtitle="A valley waiting to bloom again"
    >
      <section className="space-y-5">
        <VillageStoryPanel
          story={immersionData.villageStory}
          villageStatus={immersionData.villageStatus}
          showFullStory={immersionData.showVillageStory}
        />

        <CurrentObjectivePanel objective={immersionData.currentObjective} />

        <MarketStandSpotlight marketStand={immersionData.marketStand} />

        <FutureUnlocksPanel
          nextUnlock={immersionData.nextUnlock}
          futureGoals={immersionData.futureGoals}
          compact={immersionData.isFirstSession}
        />

        {!immersionData.isFirstSession && festivalCartData.isVisible && festivalCartData.featuredEvent ? (
          <ValleyEventBanner
            eventTitle={festivalCartData.featuredEvent.title}
            rarityLabel={festivalCartData.featuredEvent.rarityLabel}
          />
        ) : null}

        {!immersionData.isFirstSession ? (
          <FestivalCartPanel
            data={festivalCartData}
            onActivate={handleActivateEvent}
            onComplete={handleCompleteEvent}
          />
        ) : null}

        <div>
          <div className="mb-2 flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700/80">
                The valley
              </p>
              <h2 className="text-sm font-semibold text-stone-800">
                {immersionData.isFirstSession
                  ? "Paths waiting to be walked"
                  : "Places waiting for you"}
              </h2>
            </div>
            {!immersionData.isFirstSession ? (
              <Link
                href="/gather"
                className="shrink-0 text-xs font-medium text-emerald-700 underline decoration-emerald-300/60 underline-offset-2"
              >
                Go gather
              </Link>
            ) : null}
          </div>

          <RegionMapCanvas
            regions={mapData.regions}
            connections={mapData.connections}
            selectedRegionId={activeSelection}
            onSelectRegion={handleSelectRegion}
            eventRegionIds={eventRegionIds}
          />
        </div>

        {selectedRegion && !immersionData.isFirstSession ? (
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

        {!immersionData.isFirstSession ? (
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
                Explore
              </p>
              <h2 className="text-sm font-semibold text-stone-700">
                Walk the valley paths
              </h2>
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
        ) : null}

        {!immersionData.isFirstSession &&
        !festivalCartData.isVisible &&
        !festivalCartData.isWaitingForCart ? (
          <p className="rounded-2xl border border-stone-200/50 bg-stone-50/60 px-3 py-2.5 text-center text-xs italic text-stone-500">
            The valley is peaceful today — wander the paths and listen for the
            Festival Cart&apos;s bells.
          </p>
        ) : null}
      </section>
    </GameShell>
  );
}
