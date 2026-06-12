import { QUEST_DEFINITIONS } from "@/game/constants/quests";
import { getRegionDefinitionName } from "@/game/regions/state";
import type {
  Quest,
  QuestCategory,
  QuestDefinition,
  QuestId,
  QuestReward,
  QuestStatus,
  QuestVisibility,
} from "@/types";
import type { QuestEvaluationContext } from "./context";
import {
  canStartQuest,
  arePrerequisitesMet,
  getPrerequisiteTitles,
  isQuestVisibleInJournal,
} from "./progression";
import { computeQuestProgressPercent } from "./objectives";
import { describeQuestReward } from "./rewards";

export interface QuestObjectiveViewModel {
  id: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
  progressPercent: number;
}

export interface QuestRewardViewModel {
  description: string;
  reward: QuestReward;
}

export interface QuestViewModel {
  id: QuestId;
  title: string;
  description: string;
  category: QuestCategory;
  visibility: QuestVisibility;
  regionName: string | null;
  status: QuestStatus;
  objectives: QuestObjectiveViewModel[];
  rewards: QuestRewardViewModel[];
  progressPercent: number;
  prerequisiteTitles: string[];
  prerequisitesMet: boolean;
  canStart: boolean;
  sortOrder: number;
  startedAt: string | null;
  completedAt: string | null;
}

export interface QuestJournalSection {
  id: "active" | "available" | "completed";
  title: string;
  subtitle: string;
  quests: QuestViewModel[];
}

export interface QuestJournalData {
  sections: QuestJournalSection[];
  activeQuests: QuestViewModel[];
  availableQuests: QuestViewModel[];
  completedQuests: QuestViewModel[];
  hiddenQuestCount: number;
  totalVisibleQuests: number;
}

function buildObjectiveViewModel(
  objective: Quest["objectives"][number],
): QuestObjectiveViewModel {
  const progressPercent =
    objective.target > 0
      ? Math.round((objective.current / objective.target) * 100)
      : 0;

  return {
    id: objective.id,
    description: objective.description,
    current: objective.current,
    target: objective.target,
    completed: objective.completed,
    progressPercent,
  };
}

function buildQuestViewModel(
  definition: (typeof QUEST_DEFINITIONS)[number],
  quest: Quest,
  context: QuestEvaluationContext,
): QuestViewModel {
  const prerequisiteTitles = getPrerequisiteTitles(definition);
  const prerequisitesMet = arePrerequisitesMet(definition, context.quests);

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    category: definition.category,
    visibility: definition.visibility,
    regionName: definition.regionId
      ? getRegionDefinitionName(definition.regionId)
      : null,
    status: quest.status,
    objectives: quest.objectives.map(buildObjectiveViewModel),
    rewards: definition.rewards.map((reward) => ({
      description: describeQuestReward(reward),
      reward,
    })),
    progressPercent: computeQuestProgressPercent(quest),
    prerequisiteTitles,
    prerequisitesMet,
    canStart: canStartQuest(definition, quest, context),
    sortOrder: definition.sortOrder,
    startedAt: quest.startedAt,
    completedAt: quest.completedAt,
  };
}

export function buildQuestJournalData(
  quests: Record<string, Quest>,
  context: QuestEvaluationContext,
): QuestJournalData {
  const visibleQuests = QUEST_DEFINITIONS.filter((definition) => {
    const quest = quests[definition.id];
    return quest && isQuestVisibleInJournal(definition, quest);
  })
    .map((definition) => {
      const quest = quests[definition.id]!;

      return buildQuestViewModel(definition, quest, context);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeQuests = visibleQuests.filter(
    (quest) => quest.status === "active",
  );
  const availableQuests = visibleQuests.filter(
    (quest) => quest.status === "available",
  );
  const completedQuests = visibleQuests.filter(
    (quest) => quest.status === "completed",
  );

  const hiddenQuestCount = QUEST_DEFINITIONS.filter((definition) => {
    const questDefinition = definition as QuestDefinition;

    if (questDefinition.visibility !== "hidden") {
      return false;
    }

    const quest = quests[definition.id];
    return !quest || !isQuestVisibleInJournal(questDefinition, quest);
  }).length;

  const sections: QuestJournalSection[] = [
    {
      id: "active",
      title: "Active Stories",
      subtitle: "Quests you are currently pursuing",
      quests: activeQuests,
    },
    {
      id: "available",
      title: "Awaiting You",
      subtitle: "New chapters ready to begin",
      quests: availableQuests,
    },
    {
      id: "completed",
      title: "Completed Tales",
      subtitle: "Stories you have finished",
      quests: completedQuests,
    },
  ];

  return {
    sections,
    activeQuests,
    availableQuests,
    completedQuests,
    hiddenQuestCount,
    totalVisibleQuests: visibleQuests.length,
  };
}
