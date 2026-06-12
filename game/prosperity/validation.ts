import type { ProsperityState } from "@/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isPersistedProsperityState(
  value: unknown,
): value is ProsperityState {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.bonusScore === "number" &&
    Number.isFinite(value.bonusScore) &&
    value.bonusScore >= 0 &&
    Array.isArray(value.claimedTierRewards) &&
    value.claimedTierRewards.every(
      (entry) => typeof entry === "number" && Number.isFinite(entry) && entry >= 1,
    ) &&
    (value.lastCalculatedAt === null || typeof value.lastCalculatedAt === "string")
  );
}
