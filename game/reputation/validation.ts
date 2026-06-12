import type { ReputationState } from "@/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isPersistedReputationState(
  value: unknown,
): value is ReputationState {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.score === "number" &&
    Number.isFinite(value.score) &&
    value.score >= 0
  );
}
