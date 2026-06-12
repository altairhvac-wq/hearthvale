import type { UnlockRequirement } from "@/types";

/** Stub evaluator — returns false until gameplay systems wire requirements. */
export function isUnlockRequirementMet(requirement: UnlockRequirement): boolean {
  void requirement;
  return false;
}

export function isUnlockRequirementDefined(
  requirement: UnlockRequirement | null,
): requirement is UnlockRequirement {
  return requirement !== null;
}
