import type {
  MiniGameCategory,
  MiniGameDifficulty,
  MiniGameStatus,
} from "@/types";

const MINIGAME_STATUS_LABELS: Record<MiniGameStatus, string> = {
  locked: "Locked",
  available: "Available",
  active: "In Progress",
  completed: "Completed",
  failed: "Failed",
};

const MINIGAME_STATUS_STYLES: Record<
  MiniGameStatus,
  { badge: string; dot: string }
> = {
  locked: {
    badge: "border-stone-200 bg-stone-50 text-stone-500",
    dot: "bg-stone-400",
  },
  available: {
    badge: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    dot: "bg-fuchsia-500",
  },
  active: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  completed: {
    badge: "border-teal-200 bg-teal-50 text-teal-700",
    dot: "bg-teal-500",
  },
  failed: {
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
};

const MINIGAME_CATEGORY_LABELS: Record<MiniGameCategory, string> = {
  fishing: "Fishing",
  rescue: "Rescue",
  puzzle: "Puzzle",
  crafting: "Crafting",
  exploration: "Exploration",
  seasonal: "Seasonal",
};

export const MINIGAME_CATEGORY_STYLES: Record<
  MiniGameCategory,
  { badge: string }
> = {
  fishing: { badge: "border-sky-200/80 bg-sky-50/80 text-sky-700" },
  rescue: { badge: "border-amber-200/80 bg-amber-50/80 text-amber-700" },
  puzzle: { badge: "border-violet-200/80 bg-violet-50/80 text-violet-700" },
  crafting: { badge: "border-orange-200/80 bg-orange-50/80 text-orange-700" },
  exploration: {
    badge: "border-emerald-200/80 bg-emerald-50/80 text-emerald-700",
  },
  seasonal: { badge: "border-pink-200/80 bg-pink-50/80 text-pink-700" },
};

const MINIGAME_DIFFICULTY_LABELS: Record<MiniGameDifficulty, string> = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
  expert: "Expert",
};

export const MINIGAME_DIFFICULTY_STYLES: Record<
  MiniGameDifficulty,
  { badge: string }
> = {
  easy: { badge: "border-lime-200/80 bg-lime-50/80 text-lime-700" },
  normal: { badge: "border-blue-200/80 bg-blue-50/80 text-blue-700" },
  hard: { badge: "border-orange-200/80 bg-orange-50/80 text-orange-700" },
  expert: { badge: "border-red-200/80 bg-red-50/80 text-red-700" },
};

export function getMiniGameStatusLabel(status: MiniGameStatus): string {
  return MINIGAME_STATUS_LABELS[status];
}

export function getMiniGameCategoryLabel(category: MiniGameCategory): string {
  return MINIGAME_CATEGORY_LABELS[category];
}

export function getMiniGameDifficultyLabel(
  difficulty: MiniGameDifficulty,
): string {
  return MINIGAME_DIFFICULTY_LABELS[difficulty];
}

export { MINIGAME_STATUS_STYLES };
