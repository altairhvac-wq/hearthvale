"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnimalActionResult, AnimalId, AnimalSpeciesId } from "@/types";
import { formatAnimalActionMessage } from "@/game/animals/view-model";
import { GameShell } from "@/components/game/GameShell";
import { GameLoadingState } from "@/components/game/GameLoadingState";
import { AnimalCard } from "@/components/animals/AnimalCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useIsGameHydrated,
  usePlayerHeaderData,
} from "@/store";
import {
  useAnimalSanctuaryData,
  useBondWithAnimal,
  useFeedAnimal,
  useRefreshAnimals,
  useRescueAnimal,
} from "./use-animal-sanctuary";

export function AnimalSanctuaryScreen() {
  const isHydrated = useIsGameHydrated();
  const headerData = usePlayerHeaderData();
  const sanctuaryData = useAnimalSanctuaryData();
  const refreshAnimals = useRefreshAnimals();
  const rescueAnimal = useRescueAnimal();
  const feedAnimal = useFeedAnimal();
  const bondWithAnimal = useBondWithAnimal();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated) {
      refreshAnimals();
    }
  }, [isHydrated, refreshAnimals]);

  useEffect(() => {
    if (!actionMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActionMessage(null);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actionMessage]);

  const showActionResult = useCallback((result: AnimalActionResult | null) => {
    if (result) {
      setActionMessage(formatAnimalActionMessage(result));
    }
  }, []);

  const handleRescue = useCallback(
    (speciesId: AnimalSpeciesId) => {
      showActionResult(rescueAnimal(speciesId));
    },
    [rescueAnimal, showActionResult],
  );

  const handleFeed = useCallback(
    (animalId: AnimalId) => {
      showActionResult(feedAnimal(animalId));
    },
    [feedAnimal, showActionResult],
  );

  const handleBond = useCallback(
    (animalId: AnimalId) => {
      showActionResult(bondWithAnimal(animalId));
    },
    [bondWithAnimal, showActionResult],
  );

  if (!isHydrated || !sanctuaryData || !headerData) {
    return <GameLoadingState />;
  }

  const hasAnyAnimals = sanctuaryData.totalSpecies > 0;

  return (
    <GameShell
      resources={headerData.resources}
      levelInfo={headerData.levelInfo}
      displayName={headerData.displayName}
      title="Animal Sanctuary"
      subtitle="Rescue gentle companions and nurture their trust"
    >
      <section className="space-y-6">
        <div className="rounded-3xl border border-rose-200/50 bg-gradient-to-br from-rose-50/90 via-white/70 to-amber-50/60 p-5 shadow-sm backdrop-blur-sm">
          <p className="font-serif text-sm italic leading-relaxed text-stone-600 sm:text-base">
            Every rescued friend brings warmth back to the valley. Share treats,
            spend quiet moments together, and watch trust bloom like morning
            light through the sanctuary trees.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500">
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
              {sanctuaryData.rescuedCount} sanctuary friends
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
              {sanctuaryData.availableCount} awaiting rescue
            </span>
            {sanctuaryData.lockedCount > 0 ? (
              <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-stone-200/60">
                {sanctuaryData.lockedCount} still wandering
              </span>
            ) : null}
          </div>
        </div>

        {actionMessage ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-200/70 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-sm"
          >
            {actionMessage}
          </div>
        ) : null}

        {!hasAnyAnimals ? (
          <EmptyState
            title="The sanctuary is quiet"
            description="Companions will find their way here as you explore and restore the valley."
          />
        ) : (
          sanctuaryData.sections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div>
                <h2 className="font-serif text-base font-semibold text-stone-800">
                  {section.title}
                </h2>
                <p className="mt-0.5 text-xs text-stone-500">{section.subtitle}</p>
              </div>

              {section.animals.length > 0 ? (
                <div className="space-y-3">
                  {section.animals.map((animal) => (
                    <AnimalCard
                      key={animal.speciesId}
                      animal={animal}
                      onRescue={
                        section.id === "available" ? handleRescue : undefined
                      }
                      onFeed={section.id === "rescued" ? handleFeed : undefined}
                      onBond={section.id === "rescued" ? handleBond : undefined}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  compact
                  title={
                    section.id === "rescued"
                      ? "No companions yet"
                      : section.id === "available"
                        ? "None ready to rescue"
                        : "All companions discovered"
                  }
                  description={
                    section.id === "rescued"
                      ? "Rescue a gentle soul from the list below when the valley opens its heart."
                      : section.id === "available"
                        ? "Complete quests and explore regions to meet new friends."
                        : "Every species in the valley has found their way to you."
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
