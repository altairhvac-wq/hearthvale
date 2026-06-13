"use client";

import { useCallback, useEffect } from "react";
import type { QuestId } from "@/types";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { QuestCard } from "@/components/quests/QuestCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useIsGameHydrated,
  usePlayerHeaderData,
} from "@/store";
import {
  useQuestJournalData,
  useRefreshQuests,
  useStartQuest,
} from "./use-quest-journal";

export function QuestJournalScreen() {
  const isHydrated = useIsGameHydrated();
  const headerData = usePlayerHeaderData();
  const journalData = useQuestJournalData();
  const startQuest = useStartQuest();
  const refreshQuests = useRefreshQuests();

  useEffect(() => {
    if (isHydrated) {
      refreshQuests();
    }
  }, [isHydrated, refreshQuests]);

  const handleStartQuest = useCallback(
    (questId: QuestId) => {
      startQuest(questId);
    },
    [startQuest],
  );

  if (!isHydrated || !journalData || !headerData) {
    return <GameLoadingState />;
  }

  const hasAnyQuests = journalData.totalVisibleQuests > 0;

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      isNewPlayer={headerData.isNewPlayer}
      title="Journal"
      subtitle="Stories guiding your journey through Hearthvale"
    >
      <section className="space-y-6">
        <div className="rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-50/90 via-white/70 to-orange-50/60 p-5 shadow-sm backdrop-blur-sm">
          <p className="font-serif text-sm italic leading-relaxed text-stone-600 sm:text-base">
            Every path through the valley begins with a gentle story. Your
            welcome quest is already underway — gather for Elena, explore each
            region, and restore the sanctuary when you are ready.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500">
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
              {journalData.activeQuests.length} active
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
              {journalData.completedQuests.length} completed
            </span>
            {journalData.hiddenQuestCount > 0 ? (
              <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
                {journalData.hiddenQuestCount} undiscovered
              </span>
            ) : null}
          </div>
        </div>

        {!hasAnyQuests ? (
          <EmptyState
            title="Your journal awaits"
            description="Stories will appear here as you explore and restore the valley."
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

              {section.quests.length > 0 ? (
                <div className="space-y-3">
                  {section.quests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onStart={
                        section.id === "available" ? handleStartQuest : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  compact
                  title={
                    section.id === "active"
                      ? "No active stories"
                      : section.id === "available"
                        ? "Nothing new to begin"
                        : "No completed tales yet"
                  }
                  description={
                    section.id === "active"
                      ? "Begin a quest from the list below when you are ready."
                      : section.id === "available"
                        ? "Complete prerequisites or explore the valley to unlock more chapters."
                        : "Finished quests will appear here for you to revisit."
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
