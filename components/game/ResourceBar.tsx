import type { ResourceDisplayItem } from "@/game/player/resources";
import { ResourceIcon } from "@/components/icons/GameIcons";

interface ResourceBarProps {
  resources: ResourceDisplayItem[];
  className?: string;
  hidden?: boolean;
}

export function ResourceBar({ resources, className = "", hidden = false }: ResourceBarProps) {
  if (hidden) {
    return null;
  }
  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
    >
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-2xl border border-white/60 bg-white/70 px-2.5 py-1.5 shadow-sm backdrop-blur-sm sm:gap-2 sm:px-3"
          title={resource.name}
        >
          <ResourceIcon iconKey={resource.iconKey} className="h-4 w-4 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium uppercase tracking-wide text-stone-400">
              {resource.name}
            </p>
            <p className="text-sm font-semibold tabular-nums text-stone-800">
              {resource.amount.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
