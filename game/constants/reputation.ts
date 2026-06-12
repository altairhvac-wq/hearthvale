import type { ReputationLevelDefinition } from "@/types";

export const REPUTATION_LEVEL_DEFINITIONS = [
  {
    level: 1,
    title: "Newcomer",
    description: "Few villagers know your name yet.",
    minScore: 0,
  },
  {
    level: 2,
    title: "Familiar Face",
    description: "Regulars greet you with a warm nod.",
    minScore: 50,
  },
  {
    level: 3,
    title: "Trusted Merchant",
    description: "Villagers seek you out for hard-to-find goods.",
    minScore: 150,
  },
  {
    level: 4,
    title: "Valley Favorite",
    description: "Your reputation draws visitors from neighboring paths.",
    minScore: 300,
  },
  {
    level: 5,
    title: "Renowned Trader",
    description: "Travelers speak of your shop before they arrive.",
    minScore: 500,
  },
] as const satisfies ReadonlyArray<ReputationLevelDefinition>;

export function resolveReputationLevel(score: number): ReputationLevelDefinition {
  const sorted = [...REPUTATION_LEVEL_DEFINITIONS].sort(
    (a, b) => b.minScore - a.minScore,
  );
  return sorted.find((entry) => score >= entry.minScore) ?? REPUTATION_LEVEL_DEFINITIONS[0]!;
}

export function getNextReputationLevel(
  current: ReputationLevelDefinition,
): ReputationLevelDefinition | null {
  return (
    REPUTATION_LEVEL_DEFINITIONS.find((entry) => entry.level === current.level + 1) ??
    null
  );
}
