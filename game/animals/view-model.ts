import { RARITY_DEFINITIONS } from "@/game/constants/rarities";
import { getRegionDefinitionName } from "@/game/regions/state";
import { describeUnlockRequirement } from "@/game/unlock/descriptions";
import type {
  Animal,
  AnimalActionResult,
  AnimalId,
  AnimalPersonality,
  AnimalRescueStatus,
  AnimalSpeciesId,
  Rarity,
  TreatId,
} from "@/types";
import type { AnimalEvaluationContext } from "./context";
import {
  ANIMAL_DEFINITION_LIST,
  TREAT_LABELS,
  getAnimalDefinition,
} from "./definitions";
import {
  canBondWithAnimal,
  canFeedAnimal,
  canRescueSpecies,
  getBondProgressRatio,
  resolveSpeciesRescueStatus,
} from "./progression";
import { findOwnedAnimalBySpecies } from "./state";

export interface AnimalCardViewModel {
  id: AnimalId | null;
  speciesId: AnimalSpeciesId;
  name: string;
  speciesLabel: string;
  description: string;
  displayEmoji: string;
  personality: AnimalPersonality;
  personalityLabel: string;
  rarity: Rarity;
  rarityLabel: string;
  favoriteTreatLabel: string;
  favoriteTreatId: TreatId;
  regionName: string;
  sanctuaryName: string;
  rescueStatus: AnimalRescueStatus;
  rescueStatusLabel: string;
  happiness: number;
  happinessPercent: number;
  mood: Animal["mood"];
  moodLabel: string;
  bondLevel: number;
  bondProgressPercent: number;
  canRescue: boolean;
  canFeed: boolean;
  canBond: boolean;
  unlockRequirementDescription: string | null;
  isRescued: boolean;
}

export interface AnimalSanctuarySection {
  id: "rescued" | "available" | "locked";
  title: string;
  subtitle: string;
  animals: AnimalCardViewModel[];
}

export interface AnimalSanctuaryData {
  sections: AnimalSanctuarySection[];
  rescuedCount: number;
  availableCount: number;
  lockedCount: number;
  totalSpecies: number;
}

const PERSONALITY_LABELS: Record<Animal["personality"], string> = {
  gentle: "Gentle",
  cheerful: "Cheerful",
  shy: "Shy",
  playful: "Playful",
  curious: "Curious",
  loyal: "Loyal",
};

const MOOD_LABELS: Record<Animal["mood"], string> = {
  content: "Content",
  happy: "Happy",
  lonely: "Lonely",
  hungry: "Hungry",
  resting: "Resting",
};

const RESCUE_STATUS_LABELS: Record<AnimalRescueStatus, string> = {
  locked: "Locked",
  available: "Awaiting Rescue",
  rescued: "Sanctuary Friend",
};

function buildCardViewModel(
  speciesId: AnimalSpeciesId,
  context: AnimalEvaluationContext,
): AnimalCardViewModel | null {
  const definition = getAnimalDefinition(speciesId);

  if (!definition) {
    return null;
  }

  const owned = findOwnedAnimalBySpecies(context.animals, speciesId);
  const rescueStatus = resolveSpeciesRescueStatus(context, speciesId);
  const rarityLabel = RARITY_DEFINITIONS[definition.rarity].label;

  return {
    id: owned?.id ?? null,
    speciesId,
    name: owned?.name ?? definition.defaultName,
    speciesLabel: definition.speciesLabel,
    description: definition.description,
    displayEmoji: definition.displayEmoji,
    personality: definition.personality,
    personalityLabel: PERSONALITY_LABELS[definition.personality],
    rarity: definition.rarity,
    rarityLabel,
    favoriteTreatLabel: TREAT_LABELS[definition.favoriteTreatId],
    favoriteTreatId: definition.favoriteTreatId,
    regionName: getRegionDefinitionName(definition.preferredRegionId),
    sanctuaryName: getRegionDefinitionName(definition.sanctuaryRegionId),
    rescueStatus,
    rescueStatusLabel: RESCUE_STATUS_LABELS[rescueStatus],
    happiness: owned?.happiness ?? 0,
    happinessPercent: owned?.happiness ?? 0,
    mood: owned?.mood ?? "content",
    moodLabel: owned ? MOOD_LABELS[owned.mood] : "—",
    bondLevel: owned?.bondLevel ?? 0,
    bondProgressPercent: owned
      ? Math.round(getBondProgressRatio(owned.bondXp, owned.bondLevel) * 100)
      : 0,
    canRescue: canRescueSpecies(context, speciesId),
    canFeed: owned ? canFeedAnimal(owned) : false,
    canBond: owned ? canBondWithAnimal(owned) : false,
    unlockRequirementDescription:
      rescueStatus === "locked"
        ? describeUnlockRequirement(definition.unlockRequirement)
        : null,
    isRescued: rescueStatus === "rescued",
  };
}

export function buildAnimalSanctuaryData(
  context: AnimalEvaluationContext,
): AnimalSanctuaryData {
  const cards = ANIMAL_DEFINITION_LIST.flatMap((definition) => {
    const card = buildCardViewModel(definition.speciesId, context);
    return card ? [card] : [];
  });

  const rescued = cards.filter((card) => card.rescueStatus === "rescued");
  const available = cards.filter((card) => card.rescueStatus === "available");
  const locked = cards.filter((card) => card.rescueStatus === "locked");

  return {
    sections: [
      {
        id: "rescued",
        title: "Sanctuary Friends",
        subtitle: "Companions you've welcomed home with care.",
        animals: rescued,
      },
      {
        id: "available",
        title: "Awaiting Rescue",
        subtitle: "Gentle souls ready to trust a kind hand.",
        animals: available,
      },
      {
        id: "locked",
        title: "Still Wandering",
        subtitle: "They'll find you when the valley opens its heart.",
        animals: locked,
      },
    ],
    rescuedCount: rescued.length,
    availableCount: available.length,
    lockedCount: locked.length,
    totalSpecies: cards.length,
  };
}

export function getPersonalityLabel(
  personality: Animal["personality"],
): string {
  return PERSONALITY_LABELS[personality];
}

export function getMoodLabel(mood: Animal["mood"]): string {
  return MOOD_LABELS[mood];
}

export function getRescueStatusLabel(status: AnimalRescueStatus): string {
  return RESCUE_STATUS_LABELS[status];
}

export function formatAnimalActionMessage(
  result: AnimalActionResult,
): string {
  switch (result.action) {
    case "rescue":
      return `A new sanctuary friend! +${result.skillXpAwarded} Animal Care XP.`;
    case "feed":
      return `Treat shared — happiness +${result.happinessDelta}, bond +${result.bondXpDelta}.`;
    case "bond":
      return `Quiet moment together — bond level ${result.bondLevel}, +${result.skillXpAwarded} Animal Care XP.`;
  }
}
