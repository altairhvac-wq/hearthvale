import { getUnlocksForSkillAtLevel } from "@/game/skills/progression";
import { SKILL_IDS } from "@/game/constants/skills";
import type { Animal, AnimalMood, AnimalRescueStatus, AnimalSpeciesId } from "@/types";
import type { AnimalEvaluationContext } from "./context";
import {
  ANIMAL_DEFINITION_LIST,
  getAnimalDefinition,
} from "./definitions";
import { findOwnedAnimalBySpecies } from "./state";
import { isUnlockRequirementMet } from "@/game/unlock/requirements";

const BOND_LEVEL_THRESHOLDS = [0, 40, 100, 200, 350, 550, 800, 1100, 1450, 1850] as const;

export const MAX_BOND_LEVEL = BOND_LEVEL_THRESHOLDS.length;

export function getBondLevelFromXp(bondXp: number): number {
  let level = 1;

  for (let index = BOND_LEVEL_THRESHOLDS.length - 1; index >= 0; index -= 1) {
    if (bondXp >= BOND_LEVEL_THRESHOLDS[index]!) {
      level = index + 1;
      break;
    }
  }

  return Math.min(level, MAX_BOND_LEVEL);
}

export function getBondProgressRatio(bondXp: number, bondLevel: number): number {
  if (bondLevel >= MAX_BOND_LEVEL) {
    return 1;
  }

  const currentThreshold = BOND_LEVEL_THRESHOLDS[bondLevel - 1] ?? 0;
  const nextThreshold = BOND_LEVEL_THRESHOLDS[bondLevel] ?? currentThreshold + 1;
  const span = Math.max(1, nextThreshold - currentThreshold);

  return Math.min(1, (bondXp - currentThreshold) / span);
}

export function deriveMoodFromHappiness(happiness: number): AnimalMood {
  if (happiness >= 85) {
    return "happy";
  }

  if (happiness >= 60) {
    return "content";
  }

  if (happiness >= 35) {
    return "lonely";
  }

  return "hungry";
}

export function clampHappiness(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function applyBondXp(
  animal: Animal,
  bondXpDelta: number,
  bondBonusMultiplier = 1,
): Pick<Animal, "bondXp" | "bondLevel"> {
  const adjustedDelta = Math.round(bondXpDelta * bondBonusMultiplier);
  const bondXp = animal.bondXp + adjustedDelta;

  return {
    bondXp,
    bondLevel: getBondLevelFromXp(bondXp),
  };
}

export function getAnimalCareBondBonus(context: AnimalEvaluationContext): number {
  const unlocks = getUnlocksForSkillAtLevel(
    SKILL_IDS.ANIMAL_CARE,
    context.getSkillLevel(SKILL_IDS.ANIMAL_CARE),
  );

  const bondPerk = unlocks
    .flatMap((unlock) => unlock.perks)
    .find((perk) => perk.type === "bond_bonus");

  return bondPerk ? 1 + bondPerk.value : 1;
}

export function isSpeciesExplicitlyAvailable(
  context: AnimalEvaluationContext,
  speciesId: AnimalSpeciesId,
): boolean {
  return context.animalSpecies[speciesId]?.isAvailable === true;
}

export function isSpeciesUnlockRequirementMet(
  context: AnimalEvaluationContext,
  speciesId: AnimalSpeciesId,
): boolean {
  const definition = getAnimalDefinition(speciesId);

  if (!definition) {
    return false;
  }

  return isUnlockRequirementMet(definition.unlockRequirement, context);
}

export function canRescueSpecies(
  context: AnimalEvaluationContext,
  speciesId: AnimalSpeciesId,
): boolean {
  const owned = findOwnedAnimalBySpecies(context.animals, speciesId);

  if (owned) {
    return false;
  }

  return (
    isSpeciesExplicitlyAvailable(context, speciesId) ||
    isSpeciesUnlockRequirementMet(context, speciesId)
  );
}

export function resolveSpeciesRescueStatus(
  context: AnimalEvaluationContext,
  speciesId: AnimalSpeciesId,
): AnimalRescueStatus {
  const owned = findOwnedAnimalBySpecies(context.animals, speciesId);

  if (owned) {
    return "rescued";
  }

  if (canRescueSpecies(context, speciesId)) {
    return "available";
  }

  return "locked";
}

export function canFeedAnimal(animal: Animal): boolean {
  return animal.happiness < 100;
}

export function canBondWithAnimal(animal: Animal): boolean {
  return animal.bondLevel < MAX_BOND_LEVEL;
}

export function shouldRefreshSpeciesAvailability(
  context: AnimalEvaluationContext,
  speciesId: AnimalSpeciesId,
): boolean {
  const progress = context.animalSpecies[speciesId];

  if (!progress || progress.isAvailable) {
    return false;
  }

  return isSpeciesUnlockRequirementMet(context, speciesId);
}

export function getAllSpeciesIds(): AnimalSpeciesId[] {
  return ANIMAL_DEFINITION_LIST.map((definition) => definition.speciesId);
}
