import type { MiniGameId, SkillId } from "./ids";

export type MiniGameStatus = "locked" | "available" | "completed";

export interface MiniGame {
  id: MiniGameId;
  name: string;
  description: string;
  associatedSkillId: SkillId;
  unlockLevel: number;
  highScore: number;
  timesPlayed: number;
  status: MiniGameStatus;
}
