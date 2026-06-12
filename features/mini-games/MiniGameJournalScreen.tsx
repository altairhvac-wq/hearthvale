"use client";

import { useEffect } from "react";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { MiniGameCard } from "@/components/minigames/MiniGameCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useIsGameHydrated,
  usePlayerHeaderData,
} from "@/store";
import {
  useMiniGameJournalData,
  useRefreshMiniGames,
} from "./use-mini-games";

export function MiniGameJournalScreen() {
  const isHydrated = useIsGameHydrated();
  const headerData = usePlayerHeaderData();
  const journalData = useMiniGameJournalData();
  const refreshMiniGames = useRefreshMiniGames();

  useEffect(() => {
    if (isHydrated) {
      refreshMiniGames();
    }
  }, [isHydrated, refreshMiniGames]);

  if (!isHydrated || !journalData || !headerData) {
    return <GameLoadingState />;
  }

  const hasVisibleMiniGames = journalData.visibleCount > 0;

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      title="Mini-Games"
      subtitle="Challenges, competitions, and skill-building fun across the valley"
    >
      <section className="space-y-6">
        <div className="rounded-3xl border border-fuchsia-200/50 bg-gradient-to-br from-fuchsia-50/90 via-white/70 to-violet-50/60 p-5 shadow-sm backdrop-blur-sm">
          <p className="font-serif text-sm italic leading-relaxed text-stone-600 sm:text-base">
            From fishing derbies to animal rescues, mini-games bring excitement
            and skill progression to every corner of Hearthvale. Track what is
            available, revisit your victories, and prepare for future
            competitions.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500">
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
              {journalData.availableMiniGames.length} available
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
              {journalData.completedMiniGames.length} completed
            </span>
            {journalData.failedMiniGames.length > 0 ? (
              <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
                {journalData.failedMiniGames.length} recent attempts
              </span>
            ) : null}
            {journalData.lockedCount > 0 ? (
              <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
                {journalData.lockedCount} locked
              </span>
            ) : null}
          </div>
        </div>

        {!hasVisibleMiniGames ? (
          <EmptyState
            title="No mini-games yet"
            description="Complete quests and explore the valley to unlock mini-game challenges."
          />
        ) : (
          journalData.sections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div>
                <h2 className="font-serif text-base font-semibold text-stone-800">
                  {section.title}
                </h2>
                <p className="mt-0.5 text-xs text-stone-500">{section.subtitle}</p>
              </div>

              {section.miniGames.length > 0 ? (
                <div className="space-y-3">
                  {section.miniGames.map((miniGame) => (
                    <MiniGameCard key={miniGame.id} miniGame={miniGame} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  compact
                  title={
                    section.id === "available"
                      ? "Nothing ready to play"
                      : section.id === "active"
                        ? "No active mini-games"
                        : section.id === "failed"
                          ? "No recent attempts"
                          : "No completed mini-games yet"
                  }
                  description={
                    section.id === "available"
                      ? "Unlock prerequisites to reveal new challenges."
                      : section.id === "active"
                        ? "Start a mini-game when gameplay launches."
                        : section.id === "failed"
                          ? "Failed runs will appear here for another try."
                          : "Your victories will appear here after you play."
                  }
                />
              )}
            </div>
          ))
        )}
      </section>
    </GameShell>
  );
}
