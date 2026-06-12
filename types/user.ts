import type { GameUserId } from "./ids";

/** Account identity — local stub today, cloud-backed after auth ships. */
export interface GameUser {
  id: GameUserId;
  displayName: string;
  createdAt: string;
  lastSeenAt: string;
}
