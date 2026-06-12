import type { QuestCategory, QuestStatus } from "@/types";

const QUEST_STATUS_LABELS: Record<QuestStatus, string> = {
  locked: "Locked",
  available: "Available",
  active: "In Progress",
  completed: "Completed",
};

const QUEST_STATUS_STYLES: Record<
  QuestStatus,
  { badge: string; dot: string }
> = {
  locked: {
    badge: "border-stone-200 bg-stone-50 text-stone-500",
    dot: "bg-stone-400",
  },
  available: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  active: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  completed: {
    badge: "border-teal-200 bg-teal-50 text-teal-700",
    dot: "bg-teal-500",
  },
};

export function getQuestStatusLabel(status: QuestStatus): string {
  return QUEST_STATUS_LABELS[status];
}

export function getQuestCategoryLabel(category: QuestCategory): string {
  switch (category) {
    case "story":
      return "Story";
    case "exploration":
      return "Exploration";
    case "restoration":
      return "Restoration";
    case "collection":
      return "Collection";
    case "skill":
      return "Skill";
    case "boat":
      return "Boat";
    case "island":
      return "Island";
    case "friendship":
      return "Friendship";
    case "seasonal":
      return "Seasonal";
  }
}

export const QUEST_CATEGORY_STYLES: Record<
  QuestCategory,
  { badge: string }
> = {
  story: { badge: "border-rose-200/80 bg-rose-50/80 text-rose-700" },
  exploration: {
    badge: "border-sky-200/80 bg-sky-50/80 text-sky-700",
  },
  restoration: {
    badge: "border-emerald-200/80 bg-emerald-50/80 text-emerald-700",
  },
  collection: {
    badge: "border-amber-200/80 bg-amber-50/80 text-amber-700",
  },
  skill: { badge: "border-violet-200/80 bg-violet-50/80 text-violet-700" },
  boat: { badge: "border-blue-200/80 bg-blue-50/80 text-blue-700" },
  island: { badge: "border-cyan-200/80 bg-cyan-50/80 text-cyan-700" },
  friendship: { badge: "border-pink-200/80 bg-pink-50/80 text-pink-700" },
  seasonal: { badge: "border-orange-200/80 bg-orange-50/80 text-orange-700" },
};

export { QUEST_STATUS_STYLES };
