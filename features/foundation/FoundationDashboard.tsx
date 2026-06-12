"use client";

import { ALL_SKILL_IDS, SKILL_IDS } from "@/game/constants/skills";
import { getRegionDisplayName } from "@/game/regions";
import { useGameStore, useIsGameHydrated } from "@/store";

/** Minimal smoke panel — reads runtime store state only. */
export function FoundationDashboard() {
  const isHydrated = useIsGameHydrated();
  const player = useGameStore((state) => state.player);
  const regions = useGameStore((state) => state.regions);
  const quests = useGameStore((state) => state.quests);
  const animals = useGameStore((state) => state.animals);
  const getSkillLevelInfo = useGameStore((state) => state.getSkillLevelInfo);
  const lastSavedAt = useGameStore((state) => state.lastSavedAt);
  const saveError = useGameStore((state) => state.saveError);

  if (!isHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-stone-500">Loading save...</p>
      </div>
    );
  }

  const skillCount = ALL_SKILL_IDS.length;
  const unlockedRegions = Object.values(regions).filter(
    (region) => region.state === "unlocked" || region.state === "restored",
  ).length;
  const activeQuests = Object.values(quests).filter(
    (quest) => quest.status === "active" || quest.status === "available",
  ).length;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4 font-mono text-sm">
      <h1 className="text-base font-semibold text-stone-800">
        Hearthvale Foundation
      </h1>

      <section className="space-y-1 rounded border border-stone-200 bg-white/90 p-3">
        <p>hydrated: true</p>
        <p>player: {player.displayName}</p>
        <p>region: {getRegionDisplayName(player.activeRegionId, regions)}</p>
        <p>skills: {skillCount} registered</p>
        <p>
          restoration lv:{" "}
          {getSkillLevelInfo(SKILL_IDS.RESTORATION)?.level ?? 1}
        </p>
        <p>regions unlocked: {unlockedRegions}</p>
        <p>quests active/available: {activeQuests}</p>
        <p>animals owned: {Object.keys(animals).length}</p>
        <p>save: {lastSavedAt ? new Date(lastSavedAt).toISOString() : "none"}</p>
        {saveError ? <p className="text-red-600">error: {saveError}</p> : null}
      </section>
    </main>
  );
}
