import type { AnimalMood } from "@/types";
import { getMoodLabel } from "@/game/animals/view-model";

const MOOD_STYLES: Record<
  AnimalMood,
  { badge: string; dot: string }
> = {
  happy: {
    badge: "bg-amber-100 text-amber-800 ring-amber-200/70",
    dot: "bg-amber-400",
  },
  content: {
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200/70",
    dot: "bg-emerald-400",
  },
  lonely: {
    badge: "bg-sky-100 text-sky-800 ring-sky-200/70",
    dot: "bg-sky-400",
  },
  hungry: {
    badge: "bg-orange-100 text-orange-800 ring-orange-200/70",
    dot: "bg-orange-400",
  },
  resting: {
    badge: "bg-violet-100 text-violet-800 ring-violet-200/70",
    dot: "bg-violet-400",
  },
};

interface AnimalMoodBadgeProps {
  mood: AnimalMood;
  className?: string;
}

export function AnimalMoodBadge({ mood, className = "" }: AnimalMoodBadgeProps) {
  const styles = MOOD_STYLES[mood];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ${styles.badge} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
        aria-hidden
      />
      {getMoodLabel(mood)}
    </span>
  );
}
