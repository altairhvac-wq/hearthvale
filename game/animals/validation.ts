import {
  ANIMAL_MOODS,
  ANIMAL_PERSONALITIES,
  ANIMAL_SPECIES,
  type Animal,
  type AnimalMood,
  type AnimalPersonality,
  type AnimalSpeciesId,
  type AnimalSpeciesProgress,
} from "@/types";

const REGISTERED_SPECIES = new Set<string>(Object.values(ANIMAL_SPECIES));

export function isRegisteredAnimalSpeciesId(
  value: string,
): value is AnimalSpeciesId {
  return REGISTERED_SPECIES.has(value);
}

export function isAnimalPersonality(value: string): value is AnimalPersonality {
  return (ANIMAL_PERSONALITIES as readonly string[]).includes(value);
}

export function isAnimalMood(value: string): value is AnimalMood {
  return (ANIMAL_MOODS as readonly string[]).includes(value);
}

export function isAnimalSpeciesProgress(value: unknown): value is AnimalSpeciesProgress {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.speciesId === "string" &&
    isRegisteredAnimalSpeciesId(record.speciesId) &&
    typeof record.isAvailable === "boolean" &&
    (record.unlockedAt === null || typeof record.unlockedAt === "string")
  );
}

export function isAnimal(value: unknown): value is Animal {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.speciesId === "string" &&
    isRegisteredAnimalSpeciesId(record.speciesId) &&
    typeof record.name === "string" &&
    typeof record.personality === "string" &&
    isAnimalPersonality(record.personality) &&
    typeof record.happiness === "number" &&
    Number.isFinite(record.happiness) &&
    typeof record.mood === "string" &&
    isAnimalMood(record.mood) &&
    typeof record.bondLevel === "number" &&
    Number.isFinite(record.bondLevel) &&
    typeof record.bondXp === "number" &&
    Number.isFinite(record.bondXp) &&
    typeof record.homeRegionId === "string" &&
    (record.habitatId === null || typeof record.habitatId === "string") &&
    typeof record.acquiredAt === "string" &&
    (record.lastInteractionAt === null ||
      typeof record.lastInteractionAt === "string") &&
    (record.lastFedAt === null || typeof record.lastFedAt === "string")
  );
}

export function isPersistedAnimal(value: unknown): boolean {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.speciesId === "string" &&
    isRegisteredAnimalSpeciesId(record.speciesId)
  );
}

export function isPersistedAnimalRecord(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isPersistedAnimal);
}

export function isPersistedAnimalSpeciesRecord(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isAnimalSpeciesProgress);
}

export function isAnimalRecord(value: unknown): value is Record<string, Animal> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isAnimal);
}

export function isAnimalSpeciesRecord(
  value: unknown,
): value is Record<AnimalSpeciesId, AnimalSpeciesProgress> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return Object.values(ANIMAL_SPECIES).every((speciesId) => {
    const entry = record[speciesId];
    return entry !== undefined && isAnimalSpeciesProgress(entry);
  });
}
