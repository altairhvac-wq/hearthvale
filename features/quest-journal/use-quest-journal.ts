"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { buildQuestEvaluationContext } from "@/game/quests/context";
import { buildQuestJournalData } from "@/game/quests/view-model";
import { useGameStore, useIsGameHydrated } from "@/store";

export function useQuestJournalData() {
  const isHydrated = useIsGameHydrated();
  const questContextSource = useGameStore(
    useShallow((state) => ({
      quests: state.quests,
      skills: state.skills,
      regions: state.regions,
      restoration: state.restoration,
      getSkillLevel: state.getSkillLevel,
      playerResources: state.player.resources,
    })),
  );

  return useMemo(() => {
    if (!isHydrated) {
      return undefined;
    }

    return buildQuestJournalData(
      questContextSource.quests,
      buildQuestEvaluationContext(questContextSource),
    );
  }, [isHydrated, questContextSource]);
}

export function useStartQuest() {
  return useGameStore((state) => state.startQuest);
}

export function useRefreshQuests() {
  const refreshQuestAvailability = useGameStore(
    (state) => state.refreshQuestAvailability,
  );
  const syncActiveQuestObjectives = useGameStore(
    (state) => state.syncActiveQuestObjectives,
  );

  return () => {
    refreshQuestAvailability();
    syncActiveQuestObjectives();
  };
}
