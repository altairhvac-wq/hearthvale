import {
  ANIMAL_DEFINITION_LIST,
} from "./definitions";
import { deriveMoodFromHappiness } from "./progression";
import {
  isAnimalPersonality,
  isRegisteredAnimalSpeciesId,
} from "./validation";
import type {
  Animal,
  AnimalSpeciesId,
  AnimalSpeciesProgress,
} from "@/types";

function normalizeHappiness(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 70;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeBondLevel(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(10, Math.round(value)));
}

function normalizeBondXp(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

function normalizeTimestamp(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function moodToHappiness(mood: unknown): number {
  switch (mood) {
    case "happy":
      return 85;
    case "content":
      return 65;
    case "lonely":
      return 45;
    case "hungry":
      return 25;
    case "resting":
      return 70;
    default:
      return 70;
  }
}

export function markSpeciesAvailable(
  current: AnimalSpeciesProgress,
  unlockedAt?: string,
): AnimalSpeciesProgress {
  if (current.isAvailable) {
    return current;
  }

  return {
    ...current,
    isAvailable: true,
    unlockedAt: current.unlockedAt ?? unlockedAt ?? new Date().toISOString(),
  };
}

export function mergeAnimalWithDefinition(
  saved: Animal | undefined,
  definitionSpeciesId: AnimalSpeciesId,
): Animal | null {
  if (!saved || saved.speciesId !== definitionSpeciesId) {
    return null;
  }

  const definition = ANIMAL_DEFINITION_LIST.find(
    (entry) => entry.speciesId === definitionSpeciesId,
  );

  if (!definition) {
    return null;
  }

  const legacySaved = saved as Animal & { unlockLevel?: number };
  const happiness =
    typeof legacySaved.happiness === "number"
      ? normalizeHappiness(legacySaved.happiness)
      : moodToHappiness(legacySaved.mood);

  return {
    id: saved.id,
    speciesId: saved.speciesId,
    name: typeof saved.name === "string" ? saved.name : definition.defaultName,
    personality:
      typeof legacySaved.personality === "string" &&
      isAnimalPersonality(legacySaved.personality)
        ? legacySaved.personality
        : definition.personality,
    happiness,
    mood: deriveMoodFromHappiness(happiness),
    bondLevel: normalizeBondLevel(saved.bondLevel),
    bondXp: normalizeBondXp(saved.bondXp),
    homeRegionId: saved.homeRegionId ?? definition.sanctuaryRegionId,
    habitatId: normalizeNullableString(saved.habitatId),
    acquiredAt:
      typeof saved.acquiredAt === "string"
        ? saved.acquiredAt
        : new Date().toISOString(),
    lastInteractionAt: normalizeTimestamp(saved.lastInteractionAt),
    lastFedAt: normalizeTimestamp(saved.lastFedAt),
  };
}

export function mergeAnimalSpeciesProgress(
  speciesId: AnimalSpeciesId,
  saved: AnimalSpeciesProgress | undefined,
): AnimalSpeciesProgress {
  return {
    speciesId,
    isAvailable: saved?.isAvailable === true,
    unlockedAt: normalizeTimestamp(saved?.unlockedAt),
  };
}

function reconcileSpeciesProgressFromOwnedAnimals(
  progress: Record<AnimalSpeciesId, AnimalSpeciesProgress>,
  animals: Record<string, Animal>,
): Record<AnimalSpeciesId, AnimalSpeciesProgress> {
  const next = { ...progress };

  for (const animal of Object.values(animals)) {
    if (!isRegisteredAnimalSpeciesId(animal.speciesId)) {
      continue;
    }

    next[animal.speciesId] = markSpeciesAvailable(
      next[animal.speciesId],
      animal.acquiredAt,
    );
  }

  return next;
}

export function createInitialAnimalSpeciesState(): Record<
  AnimalSpeciesId,
  AnimalSpeciesProgress
> {
  return ANIMAL_DEFINITION_LIST.reduce<
    Record<AnimalSpeciesId, AnimalSpeciesProgress>
  >((acc, definition) => {
    acc[definition.speciesId] = {
      speciesId: definition.speciesId,
      isAvailable: false,
      unlockedAt: null,
    };

    return acc;
  }, {} as Record<AnimalSpeciesId, AnimalSpeciesProgress>);
}

export function createInitialAnimalsState(): Record<string, Animal> {
  return {};
}

function dedupeAnimalsBySpecies(
  animals: Record<string, Animal>,
): Record<string, Animal> {
  const bySpecies = new Map<AnimalSpeciesId, Animal>();

  for (const animal of Object.values(animals)) {
    const existing = bySpecies.get(animal.speciesId);

    if (!existing) {
      bySpecies.set(animal.speciesId, animal);
      continue;
    }

    const existingScore =
      existing.bondXp + existing.happiness + Date.parse(existing.acquiredAt);
    const candidateScore =
      animal.bondXp + animal.happiness + Date.parse(animal.acquiredAt);

    if (candidateScore >= existingScore) {
      bySpecies.set(animal.speciesId, animal);
    }
  }

  const deduped: Record<string, Animal> = {};

  for (const animal of bySpecies.values()) {
    deduped[animal.id] = animal;
  }

  return deduped;
}

/** Reconcile persisted animals with the current species registry. */
export function mergeAnimalsState(
  saved: Record<string, Animal> | undefined,
): Record<string, Animal> {
  if (!saved) {
    return createInitialAnimalsState();
  }

  const merged: Record<string, Animal> = {};

  for (const [animalId, animal] of Object.entries(saved)) {
    if (!animal || typeof animal.speciesId !== "string") {
      continue;
    }

    if (!isRegisteredAnimalSpeciesId(animal.speciesId)) {
      continue;
    }

    const reconciled = mergeAnimalWithDefinition(animal, animal.speciesId);

    if (reconciled) {
      merged[animalId] = reconciled;
    }
  }

  return dedupeAnimalsBySpecies(merged);
}

export function mergeAnimalSpeciesState(
  saved: Record<string, AnimalSpeciesProgress> | undefined,
  ownedAnimals: Record<string, Animal> = {},
): Record<AnimalSpeciesId, AnimalSpeciesProgress> {
  const defaults = createInitialAnimalSpeciesState();

  const merged = ANIMAL_DEFINITION_LIST.reduce<
    Record<AnimalSpeciesId, AnimalSpeciesProgress>
  >((acc, definition) => {
    const savedEntry = saved?.[definition.speciesId];
    acc[definition.speciesId] = mergeAnimalSpeciesProgress(
      definition.speciesId,
      savedEntry,
    );

    return acc;
  }, defaults);

  return reconcileSpeciesProgressFromOwnedAnimals(merged, ownedAnimals);
}

export function findOwnedAnimalBySpecies(
  animals: Record<string, Animal>,
  speciesId: AnimalSpeciesId,
): Animal | null {
  return (
    Object.values(animals).find((animal) => animal.speciesId === speciesId) ??
    null
  );
}
