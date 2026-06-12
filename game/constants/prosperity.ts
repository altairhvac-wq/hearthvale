import { RESOURCE_IDS } from "@/game/constants/resources";
import { createId, type ProsperityTierDefinition, type ProsperityTierId } from "@/types";

export const PROSPERITY_TIER_IDS = {
  STRUGGLING: createId<"ProsperityTierId">("struggling"),
  WAKING: createId<"ProsperityTierId">("waking"),
  GROWING: createId<"ProsperityTierId">("growing"),
  FLOURISHING: createId<"ProsperityTierId">("flourishing"),
  PROSPEROUS: createId<"ProsperityTierId">("prosperous"),
} as const;

/** Points contributed per source — recalculated from valley progress. */
export const PROSPERITY_CONTRIBUTION_WEIGHTS = {
  restorationCompleted: 25,
  merchantLevel: 10,
  animalRescued: 15,
} as const;

export const PROSPERITY_TIER_DEFINITIONS = [
  {
    id: PROSPERITY_TIER_IDS.STRUGGLING,
    tier: 1,
    title: "Struggling Village",
    description: "The valley is quiet, but your market stand offers a spark of hope.",
    minScore: 0,
    rewards: [],
    metadata: { trade_routes_unlocked: 0 },
  },
  {
    id: PROSPERITY_TIER_IDS.WAKING,
    tier: 2,
    title: "Waking Village",
    description: "Foot traffic returns. Villagers pause to browse your wares.",
    minScore: 50,
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 30 },
      { type: "reputation", amount: 10 },
    ],
    metadata: { trade_routes_unlocked: 0 },
  },
  {
    id: PROSPERITY_TIER_IDS.GROWING,
    tier: 3,
    title: "Growing Village",
    description: "New faces arrive from neighboring paths. Commerce stirs again.",
    minScore: 150,
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 60 },
      { type: "resource", resourceId: RESOURCE_IDS.HEARTS, amount: 3 },
      { type: "prosperity", amount: 5 },
    ],
    metadata: { trade_routes_unlocked: 0 },
  },
  {
    id: PROSPERITY_TIER_IDS.FLOURISHING,
    tier: 4,
    title: "Flourishing Village",
    description: "The square hums with warmth. Your shop is a village landmark.",
    minScore: 350,
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 100 },
      { type: "resource", resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 1 },
      { type: "reputation", amount: 25 },
    ],
    metadata: { trade_routes_unlocked: 1 },
  },
  {
    id: PROSPERITY_TIER_IDS.PROSPEROUS,
    tier: 5,
    title: "Prosperous Valley",
    description: "Hearthvale glows with renewed life — a destination worth traveling to.",
    minScore: 600,
    rewards: [
      { type: "resource", resourceId: RESOURCE_IDS.COINS, amount: 200 },
      { type: "resource", resourceId: RESOURCE_IDS.VALLEY_CHARM, amount: 2 },
      { type: "reputation", amount: 50 },
    ],
    metadata: { trade_routes_unlocked: 2, kingdom_management_hook: 1 },
  },
] as const satisfies ReadonlyArray<ProsperityTierDefinition>;

export function getProsperityTierDefinition(
  tierId: ProsperityTierId,
): ProsperityTierDefinition | undefined {
  return PROSPERITY_TIER_DEFINITIONS.find((entry) => entry.id === tierId);
}

export function getProsperityTierByLevel(tier: number): ProsperityTierDefinition {
  const sorted = [...PROSPERITY_TIER_DEFINITIONS].sort((a, b) => b.tier - a.tier);
  return sorted.find((entry) => entry.tier <= tier) ?? PROSPERITY_TIER_DEFINITIONS[0]!;
}

export function resolveProsperityTier(score: number): ProsperityTierDefinition {
  const sorted = [...PROSPERITY_TIER_DEFINITIONS].sort((a, b) => b.minScore - a.minScore);
  return sorted.find((entry) => score >= entry.minScore) ?? PROSPERITY_TIER_DEFINITIONS[0]!;
}

export function getNextProsperityTier(
  currentTier: ProsperityTierDefinition,
): ProsperityTierDefinition | null {
  return (
    PROSPERITY_TIER_DEFINITIONS.find((entry) => entry.tier === currentTier.tier + 1) ??
    null
  );
}
