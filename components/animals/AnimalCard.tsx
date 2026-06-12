import type { ReactNode } from "react";
import type { AnimalCardViewModel } from "@/game/animals/view-model";
import { RARITY_COLOR_CLASSES } from "@/components/theme/rarity-styles";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimalMoodBadge } from "./AnimalMoodBadge";
import { AnimalStatusBadge } from "./AnimalStatusBadge";

interface AnimalCardProps {
  animal: AnimalCardViewModel;
  onRescue?: (speciesId: AnimalCardViewModel["speciesId"]) => void;
  onFeed?: (animalId: NonNullable<AnimalCardViewModel["id"]>) => void;
  onBond?: (animalId: NonNullable<AnimalCardViewModel["id"]>) => void;
  compact?: boolean;
  className?: string;
  footer?: ReactNode;
}

export function AnimalCard({
  animal,
  onRescue,
  onFeed,
  onBond,
  compact = false,
  className = "",
  footer,
}: AnimalCardProps) {
  const isRescued = animal.isRescued;
  const animalId = animal.id;

  return (
    <article
      className={`rounded-2xl border border-stone-200/60 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition-all ${
        isRescued ? "ring-2 ring-emerald-200/40" : ""
      } ${animal.rescueStatus === "available" ? "ring-2 ring-amber-200/40" : ""} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 ring-1 ring-amber-200/50">
          <span className="text-2xl" aria-hidden>
            {animal.displayEmoji}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-sm font-semibold text-stone-800 sm:text-base">
              {animal.name}
            </h3>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide ${RARITY_COLOR_CLASSES[animal.rarity]}`}
            >
              {animal.rarityLabel}
            </span>
            <AnimalStatusBadge status={animal.rescueStatus} />
          </div>

          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-400">
            {animal.speciesLabel} · {animal.sanctuaryName}
          </p>

          {!compact ? (
            <p className="mt-1.5 text-xs leading-relaxed text-stone-600 sm:text-sm">
              {animal.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200/60 bg-stone-50/50 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Personality
          </p>
          <p className="mt-0.5 font-medium text-stone-700">
            {animal.personalityLabel}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200/60 bg-stone-50/50 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Favorite Treat
          </p>
          <p className="mt-0.5 font-medium text-stone-700">
            {animal.favoriteTreatLabel}
          </p>
        </div>
        <div className="col-span-2 rounded-xl border border-stone-200/60 bg-stone-50/50 px-3 py-2 sm:col-span-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Home Region
          </p>
          <p className="mt-0.5 font-medium text-stone-700">{animal.regionName}</p>
        </div>
      </div>

      {isRescued ? (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <AnimalMoodBadge mood={animal.mood} />
            <span className="text-xs text-stone-500">
              Bond level {animal.bondLevel}
            </span>
          </div>

          <ProgressBar
            className="mt-3"
            value={animal.happinessPercent}
            label="Happiness"
            fillClassName="bg-gradient-to-r from-rose-400 to-amber-400"
          />

          <ProgressBar
            className="mt-2"
            value={animal.bondProgressPercent}
            label="Bond progress"
            trackClassName="bg-stone-200/50"
            fillClassName="bg-gradient-to-r from-violet-400 to-fuchsia-400"
          />

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {animal.canFeed && onFeed && animalId ? (
              <button
                type="button"
                onClick={() => onFeed(animalId)}
                className="flex-1 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-orange-500 hover:to-amber-500"
              >
                Share a treat
              </button>
            ) : null}
            {animal.canBond && onBond && animalId ? (
              <button
                type="button"
                onClick={() => onBond(animalId)}
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-violet-600 hover:to-fuchsia-600"
              >
                Quiet bonding moment
              </button>
            ) : null}
          </div>

          {!animal.canFeed && !animal.canBond ? (
            <p className="mt-3 rounded-xl border border-emerald-200/60 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-800">
              Fully content — happiness and bond are at their peak for now.
            </p>
          ) : null}
          {!animal.canFeed && animal.canBond ? (
            <p className="mt-2 text-xs text-stone-500">
              Happiness is full — a quiet moment together still deepens your bond.
            </p>
          ) : null}
          {animal.canFeed && !animal.canBond ? (
            <p className="mt-2 text-xs text-stone-500">
              Bond fully grown — treats still bring joy on cozy days.
            </p>
          ) : null}
        </>
      ) : null}

      {animal.rescueStatus === "available" && animal.canRescue && onRescue ? (
        <button
          type="button"
          onClick={() => onRescue(animal.speciesId)}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:to-teal-600"
        >
          Welcome to the sanctuary
        </button>
      ) : null}

      {animal.rescueStatus === "locked" && animal.unlockRequirementDescription ? (
        <div className="mt-3 rounded-xl border border-dashed border-stone-200/80 bg-stone-50/60 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            How to meet them
          </p>
          <p className="mt-1 text-xs text-stone-600">
            {animal.unlockRequirementDescription}
          </p>
        </div>
      ) : null}

      {footer ? <div className="mt-3">{footer}</div> : null}
    </article>
  );
}
