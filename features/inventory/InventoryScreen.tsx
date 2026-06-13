"use client";

import Link from "next/link";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { InventoryCategorySection } from "@/components/inventory/InventoryCategorySection";
import { EmptyState } from "@/components/ui/EmptyState";
import { useIsGameHydrated, usePlayerHeaderData } from "@/store";
import { useInventoryData } from "./use-inventory";

export function InventoryScreen() {
  const isHydrated = useIsGameHydrated();
  const headerData = usePlayerHeaderData();
  const inventoryData = useInventoryData();

  if (!isHydrated || !inventoryData || !headerData) {
    return <GameLoadingState />;
  }

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      title="Inventory"
      subtitle="Everything you've gathered and the tools you carry"
    >
      <div className="space-y-5 pb-4">
        <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-stone-50/80 to-emerald-50/50 px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-stone-800">
            {inventoryData.isEmpty
              ? "Your pack is light"
              : `${inventoryData.totalItemCount} items in your pack`}
          </p>
          {!inventoryData.isEmpty ? (
            <p className="mt-1 text-xs text-stone-500">
              {inventoryData.resourceCount} gathered resources ·{" "}
              {inventoryData.toolCount} tools
            </p>
          ) : null}
        </div>

        {inventoryData.isEmpty ? (
          <EmptyState
            title="Nothing gathered yet"
            description="Explore the valley, gather wildflowers, berries, and fish, then return here to see what you've collected."
          />
        ) : (
          inventoryData.groups.map((group) => (
            <InventoryCategorySection key={group.category} group={group} />
          ))
        )}

        <section className="rounded-2xl border border-dashed border-stone-200/80 bg-white/50 px-4 py-3">
          <p className="text-xs leading-relaxed text-stone-500">
            Use gathered goods to fulfill merchant requests and help restore the
            valley.{" "}
            <Link
              href="/gather"
              className="font-medium text-emerald-700 underline decoration-emerald-300/60 underline-offset-2"
            >
              Go gather
            </Link>
            {" · "}
            <Link
              href="/merchant"
              className="font-medium text-emerald-700 underline decoration-emerald-300/60 underline-offset-2"
            >
              Visit merchant
            </Link>
          </p>
        </section>
      </div>
    </GameShell>
  );
}
