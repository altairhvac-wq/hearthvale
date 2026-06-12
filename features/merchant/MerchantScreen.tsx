"use client";

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
        setActionMessage("Your business has expanded to a new stage!");
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
            ? "Stage fully upgraded — the valley takes notice!"
            : `Upgraded to level ${result.newLevel}!`,
        );
      }
    },
    [upgradeMerchantStage],
  );

  const handleClaimTier = useCallback(() => {
    const result = claimNextProsperityTierReward();

    if (result) {
      setActionMessage(`Claimed ${result.title} rewards!`);
    }
  }, [claimNextProsperityTierReward]);

  const handleActivateRequest = useCallback(
    (requestId: CustomerRequestId) => {
      if (activateCustomerRequest(requestId)) {
        setActionMessage("Request accepted — time to gather goods!");
      }
    },
    [activateCustomerRequest],
  );

  const handleCompleteRequest = useCallback(
    (requestId: CustomerRequestId) => {
      const result = completeCustomerRequest(requestId);
      if (result) {
        setActionMessage(`Delivered: ${result.title}`);
      }
    },
    [completeCustomerRequest],
  );

  if (!isHydrated || !merchantData || !headerData) {
    return <GameLoadingState />;
  }

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      title="Merchant"
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

        <header className="rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-rose-50/40 p-5 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
            Your business
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">
              {merchantData.activeStage.iconEmoji}
            </span>
            <div>
              <h1 className="text-xl font-bold text-stone-800">
                {merchantData.activeStage.title}
              </h1>
              <p className="text-sm text-stone-500">
                Level {merchantData.activeStage.level} ·{" "}
                {merchantData.activeStage.visualLabel}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {merchantData.activeStage.description}
          </p>
        </header>

        <ProsperityPanel
          prosperity={merchantData.prosperity}
          onClaimTier={
            merchantData.prosperity.unclaimedTierCount > 0
              ? handleClaimTier
              : undefined
          }
        />

        <ReputationPanel reputation={merchantData.reputation} />

        <section>
          <h2 className="mb-3 text-sm font-semibold text-stone-700">
            Active requests
          </h2>
          {merchantData.activeRequests.length > 0 ? (
            <div className="space-y-3">
              {merchantData.activeRequests.map((request) => (
                <CustomerRequestCard
                  key={request.id}
                  request={request}
                  onComplete={() => handleCompleteRequest(request.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active requests"
              description="Accept a customer request below to start earning coins and reputation."
            />
          )}
        </section>

        {merchantData.availableRequests.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-stone-700">
              Available requests
            </h2>
            <div className="space-y-3">
              {merchantData.availableRequests.map((request) => (
                <CustomerRequestCard
                  key={request.id}
                  request={request}
                  onActivate={() => handleActivateRequest(request.id)}
                />
              ))}
            </div>
          </section>
        ) : merchantData.lockedRequests.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-stone-700">
              Locked requests
            </h2>
            <div className="space-y-3">
              {merchantData.lockedRequests.map((request) => (
                <CustomerRequestCard key={request.id} request={request} />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 text-sm font-semibold text-stone-700">
            Upgrade opportunities
          </h2>
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
              title="All caught up"
              description="Keep restoring the valley and fulfilling requests to unlock more upgrades."
            />
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-stone-700">
            Business stages
          </h2>
          <div className="space-y-3">
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
        </section>
      </div>
    </GameShell>
  );
}
