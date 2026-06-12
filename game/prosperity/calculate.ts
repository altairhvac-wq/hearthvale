import { PROSPERITY_CONTRIBUTION_WEIGHTS } from "@/game/constants/prosperity";
import { getTotalMerchantLevels } from "@/game/merchant/state";
import type {
  Animal,
  MerchantState,
  ProsperityState,
  RestorationProject,
} from "@/types";

export interface ProsperityCalculationExtensions {
  tradeRoutes?: number;
  citizenHappiness?: number;
  taxCollection?: number;
}

export interface ProsperityCalculationInput {
  restoration: Record<string, RestorationProject>;
  animals: Record<string, Animal>;
  merchant: MerchantState;
  prosperity: ProsperityState;
  /** Future systems plug in additional score here. */
  extensions?: ProsperityCalculationExtensions;
}

export interface ProsperityBreakdown {
  fromRestorations: number;
  fromMerchantLevels: number;
  fromRescuedAnimals: number;
  fromBonus: number;
  fromExtensions: number;
  total: number;
}

function sumProsperityExtensions(
  extensions: ProsperityCalculationExtensions | undefined,
): number {
  if (!extensions) {
    return 0;
  }

  return (
    (extensions.tradeRoutes ?? 0) +
    (extensions.citizenHappiness ?? 0) +
    (extensions.taxCollection ?? 0)
  );
}

export function countCompletedRestorations(
  restoration: Record<string, RestorationProject>,
): number {
  return Object.values(restoration).filter(
    (project) => project.status === "completed",
  ).length;
}

export function countRescuedAnimals(animals: Record<string, Animal>): number {
  return Object.keys(animals).length;
}

export function calculateProsperityBreakdown(
  input: ProsperityCalculationInput,
): ProsperityBreakdown {
  const weights = PROSPERITY_CONTRIBUTION_WEIGHTS;
  const fromRestorations =
    countCompletedRestorations(input.restoration) * weights.restorationCompleted;
  const fromMerchantLevels =
    getTotalMerchantLevels(input.merchant) * weights.merchantLevel;
  const fromRescuedAnimals =
    countRescuedAnimals(input.animals) * weights.animalRescued;
  const fromBonus = input.prosperity.bonusScore;
  const fromExtensions = sumProsperityExtensions(input.extensions);

  return {
    fromRestorations,
    fromMerchantLevels,
    fromRescuedAnimals,
    fromBonus,
    fromExtensions,
    total:
      fromRestorations +
      fromMerchantLevels +
      fromRescuedAnimals +
      fromBonus +
      fromExtensions,
  };
}

export function calculateProsperityScore(
  input: ProsperityCalculationInput,
): number {
  return calculateProsperityBreakdown(input).total;
}
