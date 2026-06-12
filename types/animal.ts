import type { AnimalId, RegionId } from "./ids";
import type { Rarity } from "./rarity";
import type { UnlockRequirement } from "./unlock-requirement";

export const ANIMAL_SPECIES = {
  RABBIT: "rabbit",
  DUCK: "duck",
  FOX: "fox",
} as const;

export type AnimalSpeciesId =
  (typeof ANIMAL_SPECIES)[keyof typeof ANIMAL_SPECIES];

/** Placeholder treat ids — inventory integration ships later. */
export const TREAT_IDS = {
  CARROT: "carrot",
  BREAD_CRUMB: "bread_crumb",
  BERRIES: "berries",
} as const;

export type TreatId = (typeof TREAT_IDS)[keyof typeof TREAT_IDS];

export const ANIMAL_PERSONALITIES = [
  "gentle",
  "cheerful",
  "shy",
  "playful",
  "curious",
  "loyal",
] as const;

export type AnimalPersonality = (typeof ANIMAL_PERSONALITIES)[number];

export const ANIMAL_MOODS = [
  "content",
  "happy",
  "lonely",
  "hungry",
  "resting",
] as const;

export type AnimalMood = (typeof ANIMAL_MOODS)[number];

export type AnimalAction = "rescue" | "feed" | "bond";

export type AnimalRescueStatus = "locked" | "available" | "rescued";

/** Static registry entry — species metadata shared across all valleys. */
export interface AnimalDefinition {
  speciesId: AnimalSpeciesId;
  /** Default cozy name shown before the player renames (future). */
  defaultName: string;
  /** Species label for journal entries and locked cards. */
  speciesLabel: string;
  description: string;
  /** Registry-driven sanctuary card icon — avoids species-specific UI branches. */
  displayEmoji: string;
  personality: AnimalPersonality;
  preferredRegionId: RegionId;
  sanctuaryRegionId: RegionId;
  rarity: Rarity;
  favoriteTreatId: TreatId;
  unlockRequirement: UnlockRequirement;
  sortOrder: number;
}

/** Valley-scoped unlock progress for a species — separate from owned instances. */
export interface AnimalSpeciesProgress {
  speciesId: AnimalSpeciesId;
  /** Explicitly unlocked via rewards or auto-evaluated availability. */
  isAvailable: boolean;
  unlockedAt: string | null;
}

/** Owned companion instance — valley-scoped, multiplayer-safe record shape. */
export interface Animal {
  id: AnimalId;
  speciesId: AnimalSpeciesId;
  name: string;
  personality: AnimalPersonality;
  happiness: number;
  mood: AnimalMood;
  bondLevel: number;
  bondXp: number;
  homeRegionId: RegionId;
  /** Reserved for future habitat placement — null in V1. */
  habitatId: string | null;
  acquiredAt: string;
  lastInteractionAt: string | null;
  lastFedAt: string | null;
}

export interface AnimalActionResult {
  animalId: AnimalId;
  speciesId: AnimalSpeciesId;
  action: AnimalAction;
  happinessDelta: number;
  bondXpDelta: number;
  skillXpAwarded: number;
  bondLevel: number;
  happiness: number;
  mood: AnimalMood;
}
