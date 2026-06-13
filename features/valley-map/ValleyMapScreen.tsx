"use client";

import { useCallback, useEffect, useRef } from "react";
import type { RegionId } from "@/types";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import {
  CurrentObjectivePanel,
  FutureUnlocksPanel,
  VillageStoryPanel,
} from "@/components/immersion";
import { FestivalCartPanel } from "@/components/events/FestivalCartPanel";
import { ValleyEventBanner } from "@/components/events/ValleyEventIndicator";
import { ValleyEventIndicator } from "@/components/events/ValleyEventIndicator";
import { StorybookWorldMap } from "@/components/world";
import { EmptyState } from "@/components/ui/EmptyState";
import { HOME_SCREEN_LABELS, WORLD_HOTSPOT_LABELS } from "@/game/constants/world/labels";
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

  const renderHotspotFooter = useCallback(
    (regionId: RegionId) => {
      const eventIndicator = festivalCartData?.regionIndicators.find(
        (indicator) => indicator.regionId === regionId,
      );

      return (
        <>
          {eventIndicator ? (
            <div className="mb-3">
              <ValleyEventIndicator indicator={eventIndicator} />
            </div>
          ) : null}
          <RegionRestorationFooter regionId={regionId} />
        </>
      );
    },
    [festivalCartData?.regionIndicators],
  );

  if (
    !isHydrated ||
    !mapData ||
    !headerData ||
    !festivalCartData ||
    !immersionData
  ) {
    return <GameLoadingState />;
  }

  const eventRegionIds = new Set(
    festivalCartData.regionIndicators.map((indicator) => indicator.regionId),
  );

  if (mapData.regions.length === 0) {
    return (
      <GameShell
        resources={headerData.resources}
        levelInfo={headerData.levelInfo}
        displayName={headerData.displayName}
        isNewPlayer={headerData.isNewPlayer}
        title="Hearthvale"
        subtitle={HOME_SCREEN_LABELS.subtitle}
      >
        <EmptyState
          title={HOME_SCREEN_LABELS.emptyTitle}
          description={HOME_SCREEN_LABELS.emptyDescription}
        />
      </GameShell>
    );
  }

  const activeRegionId =
    mapData.activeRegionId ?? mapData.regions[0]?.id ?? null;

  const isFirstSession = immersionData.isFirstSession;

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      isNewPlayer={headerData.isNewPlayer}
      title="Hearthvale"
      subtitle={
        isFirstSession
          ? immersionData.villageStatus.moodTitle
          : HOME_SCREEN_LABELS.subtitle
      }
    >
      <section className="space-y-5">
        {!isFirstSession ? (
          <VillageStoryPanel
            story={immersionData.villageStory}
            villageStatus={immersionData.villageStatus}
            showFullStory={immersionData.showVillageStory}
          />
        ) : null}

        <div>
          <div className="mb-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700/80">
              {WORLD_HOTSPOT_LABELS.sceneEyebrow}
            </p>
            <h2 className="text-base font-semibold text-stone-800 sm:text-lg">
              {isFirstSession
                ? WORLD_HOTSPOT_LABELS.firstSessionSceneTitle
                : WORLD_HOTSPOT_LABELS.sceneTitle}
            </h2>
            {isFirstSession ? (
              <p className="mt-1 font-serif text-sm italic text-stone-500">
                {immersionData.villageStatus.narrative}
              </p>
            ) : null}
          </div>

          <StorybookWorldMap
            regions={mapData.regions}
            marketStand={immersionData.marketStand}
            isFirstSession={isFirstSession}
            activeRegionId={activeRegionId}
            onSelectRegion={handleSelectRegion}
            eventRegionIds={eventRegionIds}
            renderHotspotFooter={renderHotspotFooter}
          />
        </div>

        <CurrentObjectivePanel objective={immersionData.currentObjective} />

        {!isFirstSession ? (
          <FutureUnlocksPanel
            nextUnlock={immersionData.nextUnlock}
            futureGoals={immersionData.futureGoals}
          />
        ) : null}

        {!isFirstSession && festivalCartData.isVisible && festivalCartData.featuredEvent ? (
          <ValleyEventBanner
            eventTitle={festivalCartData.featuredEvent.title}
            rarityLabel={festivalCartData.featuredEvent.rarityLabel}
          />
        ) : null}

        {!isFirstSession ? (
          <FestivalCartPanel
            data={festivalCartData}
            onActivate={handleActivateEvent}
            onComplete={handleCompleteEvent}
          />
        ) : null}

        {!isFirstSession &&
        !festivalCartData.isVisible &&
        !festivalCartData.isWaitingForCart ? (
          <p className="rounded-2xl border border-stone-200/50 bg-stone-50/60 px-3 py-2.5 text-center text-xs italic text-stone-500">
            {HOME_SCREEN_LABELS.peacefulDay}
          </p>
        ) : null}
      </section>
    </GameShell>
  );
}
