"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { RegionId } from "@/types";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { GatherRegionPanel } from "@/components/gathering/GatherRegionPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useIsGameHydrated,
  usePlayerHeaderData,
} from "@/store";
import {
  useGatherFromNode,
  useGatheringData,
  useRefreshGatheringState,
  useSetActiveRegion,
} from "./use-gathering";

export function GatheringScreen() {
  const isHydrated = useIsGameHydrated();
  const headerData = usePlayerHeaderData();
  const gatheringData = useGatheringData();
  const refreshGatheringState = useRefreshGatheringState();
  const gatherFromNode = useGatherFromNode();
  const setActiveRegionId = useSetActiveRegion();
  const [expandedRegionId, setExpandedRegionId] = useState<RegionId | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated) {
      refreshGatheringState();
    }
  }, [isHydrated, refreshGatheringState]);

  useEffect(() => {
    if (!gatheringData?.activeRegionId) {
      return;
    }

    setExpandedRegionId((current) => current ?? gatheringData.activeRegionId);
  }, [gatheringData?.activeRegionId]);

  useEffect(() => {
    if (!actionMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActionMessage(null);
    }, 3500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actionMessage]);

  const accessibleRegions = useMemo(
    () => gatheringData?.regions.filter((region) => region.isAccessible) ?? [],
    [gatheringData?.regions],
  );

  const handleToggleRegion = useCallback((regionId: RegionId) => {
    setExpandedRegionId((current) => (current === regionId ? null : regionId));
  }, []);

  const handleGather = useCallback(
    (nodeId: import("@/types").ResourceNodeId) => {
      const result = gatherFromNode(nodeId);

      if (result) {
        setActionMessage(
          `Gathered ${result.yieldAmount} ${result.resourceName} (+${result.skillXp} XP)`,
        );
        refreshGatheringState();
        return;
      }

      setActionMessage("Could not gather from this spot right now.");
    },
    [gatherFromNode, refreshGatheringState],
  );

  const handleTravelToRegion = useCallback(
    (regionId: RegionId) => {
      setActiveRegionId(regionId);
      setExpandedRegionId(regionId);
      setActionMessage("You traveled to a new region. You can gather here now.");
    },
    [setActiveRegionId],
  );

  if (!isHydrated || !gatheringData || !headerData) {
    return <GameLoadingState />;
  }

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      isNewPlayer={headerData.isNewPlayer}
      title="Gather"
      subtitle="Find materials for merchant requests and restoration"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">
                {gatheringData.totalAvailableNodes} gathering spots ready
              </p>
              <p className="mt-1 text-xs text-emerald-800/80">
                Gather materials here, then bring them to the Market Stand to
                fulfill customer requests. Spots refresh when you leave and
                return to this page.
              </p>
            </div>
            <Link
              href="/merchant"
              className="shrink-0 rounded-lg border border-emerald-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-emerald-800 transition-colors hover:bg-white"
            >
              Market Stand
            </Link>
          </div>
        </div>

        {actionMessage ? (
          <div
            role="status"
            className="rounded-2xl border border-amber-200/70 bg-amber-50/90 px-4 py-3 text-sm text-amber-900"
          >
            {actionMessage}
          </div>
        ) : null}

        {accessibleRegions.length === 0 ? (
          <EmptyState
            title="No regions unlocked yet"
            description="Explore the valley map and unlock regions to discover gathering spots."
          />
        ) : (
          accessibleRegions.map((region) => (
            <div key={region.id} className="space-y-2">
              <GatherRegionPanel
                region={region}
                isExpanded={expandedRegionId === region.id}
                onToggle={() => handleToggleRegion(region.id)}
                onGather={handleGather}
              />
              {!region.isActive ? (
                <button
                  type="button"
                  onClick={() => handleTravelToRegion(region.id)}
                  className="w-full rounded-xl border border-stone-200 bg-white/70 px-4 py-2 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50"
                >
                  Travel to {region.name}
                </button>
              ) : null}
            </div>
          ))
        )}

        {gatheringData.regions.some((region) => !region.isAccessible) ? (
          <section className="rounded-2xl border border-dashed border-stone-200 bg-white/40 px-4 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Locked regions
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-stone-500">
              {gatheringData.regions
                .filter((region) => !region.isAccessible)
                .map((region) => (
                  <li key={region.id}>
                    {region.name} — unlock on the map to gather here
                  </li>
                ))}
            </ul>
          </section>
        ) : null}
      </div>
    </GameShell>
  );
}
