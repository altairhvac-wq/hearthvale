import type { ReactNode } from "react";
import type { RegionViewModel } from "@/game/regions/view-model";
import { getRegionProgressPresentation } from "@/game/regions/presentation";
import { getRegionProgressFill } from "@/components/theme/region-styles";
import { LockIcon, RegionIcon } from "@/components/icons/GameIcons";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getRegionThemeStyle } from "@/components/theme/region-styles";
import { RegionStatusBadge } from "./RegionStatusBadge";

interface RegionCardProps {
  region: RegionViewModel;
  onSelect?: (regionId: RegionViewModel["id"]) => void;
  compact?: boolean;
  className?: string;
  /** Optional slot for future restoration projects, quest hints, etc. */
  footer?: ReactNode;
}

export function RegionCard({
  region,
  onSelect,
  compact = false,
  className = "",
  footer,
}: RegionCardProps) {
  const theme = getRegionThemeStyle(region.theme);
  const isLocked = region.displayStatus === "locked";
  const progress = getRegionProgressPresentation(region.displayStatus);

  const content = (
    <>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${theme.nodeBg} ${theme.nodeRing} ${isLocked ? "opacity-50 grayscale" : ""}`}
        >
          {isLocked ? (
            <LockIcon className="text-stone-500" />
          ) : (
            <RegionIcon iconKey={region.iconKey} className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-sm font-semibold sm:text-base ${theme.accent}`}>
              {region.name}
            </h3>
            <RegionStatusBadge status={region.displayStatus} />
            {region.isActive ? (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Here
              </span>
            ) : null}
            {!region.isOnMap ? (
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500">
                List only
              </span>
            ) : null}
          </div>

          {!compact ? (
            <p className="mt-1 text-xs leading-relaxed text-stone-600 sm:text-sm">
              {region.description}
            </p>
          ) : null}
        </div>
      </div>

      {!isLocked ? (
        <ProgressBar
          className="mt-3"
          value={region.progressPercent}
          label={progress.label}
          fillClassName={getRegionProgressFill(progress.variant)}
        />
      ) : null}

      {region.showUnlockRequirement ? (
        <div className="mt-3 rounded-xl border border-dashed border-stone-200/80 bg-stone-50/60 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Unlock requirement
          </p>
          <p className="mt-0.5 text-xs text-stone-600">
            {region.unlockRequirementDescription}
          </p>
        </div>
      ) : null}

      {footer ? <div className="mt-3">{footer}</div> : null}
    </>
  );

  const cardClasses = `rounded-2xl border bg-white/75 p-4 shadow-sm backdrop-blur-sm transition-all ${theme.border} ${region.isActive ? `ring-2 ring-offset-1 ${theme.nodeRing}` : ""} ${isLocked ? "opacity-90" : "hover:shadow-md"} ${className}`;

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(region.id)}
        className={`${cardClasses} w-full text-left`}
      >
        {content}
      </button>
    );
  }

  return <article className={cardClasses}>{content}</article>;
}
