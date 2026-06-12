import type { UnlockRequirement } from "@/types";
import type { UnlockEvaluationContext } from "./context";

/** Stub evaluator — returns false until gameplay systems wire requirements. */
export function isUnlockRequirementMet(
  requirement: UnlockRequirement,
  context?: UnlockEvaluationContext,
): boolean {
  void requirement;
  void context;
  return false;
}

export function isUnlockRequirementDefined(
  requirement: UnlockRequirement | null,
): requirement is UnlockRequirement {
  return requirement !== null;
}
