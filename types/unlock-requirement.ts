import type { AnimalSpeciesId } from "./animal";
import type {
  QuestId,
  RegionId,
  RestorationProjectId,
  SkillId,
} from "./ids";

/** Structured gate for unlocking content — evaluators live in domain services. */
export type UnlockRequirement =
  | { kind: "quest_completed"; questId: QuestId }
  | { kind: "restoration_completed"; projectId: RestorationProjectId }
  | { kind: "skill_level"; skillId: SkillId; level: number }
  | { kind: "region_state"; regionId: RegionId; state: "unlocked" | "restored" };

/** Structured reward unlock — replaces opaque string keys. */
export type UnlockReference =
  | { kind: "animal"; speciesId: AnimalSpeciesId }
  | { kind: "region"; regionId: RegionId }
  | { kind: "quest"; questId: QuestId };
