import type { ItemId, ResourceId, SkillId } from "./ids";
import type { UnlockReference } from "./unlock-requirement";

/** Shared reward shape for quests, restoration, events, and future systems. */
export type GameReward =
  | { type: "resource"; resourceId: ResourceId; amount: number }
  | { type: "skill_xp"; skillId: SkillId; amount: number }
  | { type: "unlock"; unlock: UnlockReference }
  | { type: "item"; itemId: ItemId; amount: number }
  | { type: "prosperity"; amount: number }
  | { type: "reputation"; amount: number };
