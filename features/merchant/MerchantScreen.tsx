"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { CustomerRequestId, MerchantStageId } from "@/types";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { MerchantStageCard } from "@/components/merchant/MerchantStageCard";
import { ProsperityPanel } from "@/components/merchant/ProsperityPanel";
import { ReputationPanel } from "@/components/merchant/ReputationPanel";
import { CustomerRequestCard } from "@/components/merchant/CustomerRequestCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useIsGameHydrated,
  usePlayerHeaderData,
} from "@/store";
import {
  useActivateCustomerRequest,
  useActivateMerchantStage,
  useClaimNextProsperityTierReward,
  useCompleteCustomerRequest,
  useMerchantData,
  useRefreshMerchantSystems,
  useUpgradeMerchantStage,
} from "./use-merchant";

export function MerchantScreen() {
  const isHydrated = useIsGameHydrated();
  const headerData = usePlayerHeaderData();
  const merchantData = useMerchantData();
  const refreshMerchantSystems = useRefreshMerchantSystems();
  const activateMerchantStage = useActivateMerchantStage();
  const upgradeMerchantStage = useUpgradeMerchantStage();
  const claimNextProsperityTierReward = useClaimNextProsperityTierReward();
  const activateCustomerRequest = useActivateCustomerRequest();
  const completeCustomerRequest = useCompleteCustomerRequest();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      refreshMerchantSystems();
    }
  }, [isHydrated, refreshMerchantSystems]);

  useEffect(() => {
    if (!actionMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActionMessage(null);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actionMessage]);

  const handleActivateStage = useCallback(
    (stageId: MerchantStageId) => {
      const success = activateMerchantStage(stageId);
      if (success) {
        setActionMessage("Your business has expanded — the village takes notice!");
      }
    },
    [activateMerchantStage],
  );

  const handleUpgradeStage = useCallback(
    (stageId: MerchantStageId) => {
      const result = upgradeMerchantStage(stageId);
      if (result) {
        setActionMessage(
          result.stageMaxed
            ? "Your stand shines at its fullest — neighbors pause to admire it!"
            : "Your stand grows a little sturdier — villagers notice the change.",
        );
      }
    },
    [upgradeMerchantStage],
  );

  const handleClaimTier = useCallback(() => {
    const result = claimNextProsperityTierReward();

    if (result) {
      setActionMessage(`The village celebrates — ${result.title} rewards are yours!`);
    }
  }, [claimNextProsperityTierReward]);

  const handleActivateRequest = useCallback(
    (requestId: CustomerRequestId) => {
      if (activateCustomerRequest(requestId)) {
        setActionMessage("You've promised to help — time to gather what's needed.");
      }
    },
    [activateCustomerRequest],
  );

  const handleCompleteRequest = useCallback(
    (requestId: CustomerRequestId) => {
      const result = completeCustomerRequest(requestId);
      if (result) {
        setActionMessage(`Delivered with care — ${result.title} brought a smile.`);
        return;
      }

      setActionMessage("Your pack is still missing a few things — gather more first.");
    },
    [completeCustomerRequest],
  );

  if (!isHydrated || !merchantData || !headerData) {
    return <GameLoadingState />;
  }

  const isNewPlayer = headerData.isNewPlayer;
  const pendingRequests = [
    ...merchantData.activeRequests,
    ...merchantData.availableRequests,
  ];

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      isNewPlayer={headerData.isNewPlayer}
      title="Market Stand"
      subtitle="Trade, trust, and village warmth"
    >
      <div className="space-y-5 pb-4">
        {actionMessage ? (
          <div
            className="rounded-2xl border border-emerald-200/70 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 shadow-sm"
            role="status"
          >
            {actionMessage}
          </div>
        ) : null}

        <header className="rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-rose-50/40 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
                Your stand
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-5xl" aria-hidden="true">
                  {merchantData.activeStage.iconEmoji}
                </span>
                <div>
                  <h1 className="text-xl font-bold text-stone-800">
                    {merchantData.activeStage.title}
                  </h1>
                  <p className="text-sm text-amber-800/80">
                    {merchantData.activeStage.visualLabel}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {merchantData.activeStage.description}
              </p>
            </div>
            <Link
              href="/gather"
              className="shrink-0 rounded-xl border border-amber-200/70 bg-white/70 px-2.5 py-1.5 text-[11px] font-medium text-amber-900 transition-colors hover:bg-white"
            >
              Go gather
            </Link>
          </div>
        </header>

        <section>
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700/80">
              {isNewPlayer ? "At your door" : "Village needs"}
            </p>
            <h2 className="text-sm font-semibold text-stone-800">
              {isNewPlayer ? "Elena left a request" : "Who needs your help today"}
            </h2>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {merchantData.activeRequests.map((request) => (
                <CustomerRequestCard
                  key={request.id}
                  request={request}
                  onComplete={() => handleCompleteRequest(request.id)}
                />
              ))}
              {merchantData.availableRequests.map((request) => (
                <CustomerRequestCard
                  key={request.id}
                  request={request}
                  onActivate={() => handleActivateRequest(request.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="The square is quiet"
              description="Elena may visit soon with a request for wildflowers — check back, or wander the meadow."
            />
          )}
        </section>

        {merchantData.lockedRequests.length > 0 ? (
          <section>
            <div className="mb-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
                Soon
              </p>
              <h2 className="text-sm font-semibold text-stone-600">
                More villagers will come
              </h2>
            </div>
            <div className="space-y-3 opacity-80">
              {merchantData.lockedRequests.map((request) => (
                <CustomerRequestCard key={request.id} request={request} />
              ))}
            </div>
          </section>
        ) : null}

        {!isNewPlayer ? (
          <section className="rounded-2xl border border-stone-200/50 bg-stone-50/50 p-4">
            <button
              type="button"
              onClick={() => setShowDetails((value) => !value)}
              className="flex w-full items-center justify-between gap-2 text-left"
              aria-expanded={showDetails}
            >
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
                  Village warmth
                </p>
                <p className="text-sm font-medium text-stone-700">
                  {merchantData.prosperity.tierTitle}
                </p>
              </div>
              <span className="text-xs font-medium text-stone-500">
                {showDetails ? "Hide" : "Show"} details
              </span>
            </button>

            {showDetails ? (
              <div className="mt-4 space-y-4">
                <ProsperityPanel
                  prosperity={merchantData.prosperity}
                  onClaimTier={
                    merchantData.prosperity.unclaimedTierCount > 0
                      ? handleClaimTier
                      : undefined
                  }
                />
                <ReputationPanel reputation={merchantData.reputation} />
              </div>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-stone-500">
                {merchantData.prosperity.tierDescription}
              </p>
            )}
          </section>
        ) : null}

        {!isNewPlayer ? (
          <section>
            <div className="mb-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
                Your stand&apos;s future
              </p>
              <h2 className="text-sm font-semibold text-stone-700">
                Dreams for the square
              </h2>
            </div>
            {merchantData.upgradeOpportunities.length > 0 ? (
              <div className="space-y-3">
                {merchantData.upgradeOpportunities.map((stage) => (
                  <MerchantStageCard
                    key={stage.id}
                    stage={stage}
                    compact
                    onActivate={
                      stage.canActivate
                        ? () => handleActivateStage(stage.id)
                        : undefined
                    }
                    onUpgrade={
                      stage.canUpgrade
                        ? () => handleUpgradeStage(stage.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Your stand looks wonderful"
                description="Keep helping villagers and restoring the valley to unlock what comes next."
              />
            )}
          </section>
        ) : null}

        {!isNewPlayer ? (
          <details className="rounded-2xl border border-stone-200/40 bg-white/50">
            <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-stone-500">
              Dreams for every stage of your stand
            </summary>
            <div className="space-y-3 border-t border-stone-100 px-4 pb-4 pt-3">
              {merchantData.stages.map((stage) => (
                <MerchantStageCard
                  key={stage.id}
                  stage={stage}
                  onActivate={
                    stage.canActivate
                      ? () => handleActivateStage(stage.id)
                      : undefined
                  }
                  onUpgrade={
                    stage.canUpgrade
                      ? () => handleUpgradeStage(stage.id)
                      : undefined
                  }
                />
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </GameShell>
  );
}
