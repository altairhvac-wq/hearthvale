import { createId, type GameUserId, type ValleyId } from "@/types";

export const DEFAULT_USER_ID = createId<"GameUserId">("user_local_1");
export const DEFAULT_VALLEY_ID = createId<"ValleyId">("valley_home");
export const DEFAULT_VALLEY_NAME = "My Valley";

export const VALLEY_IDS = {
  HOME: DEFAULT_VALLEY_ID,
} as const satisfies Record<string, ValleyId>;

export const USER_IDS = {
  LOCAL: DEFAULT_USER_ID,
} as const satisfies Record<string, GameUserId>;
