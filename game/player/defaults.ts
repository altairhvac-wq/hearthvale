import { STARTER_RESOURCES } from "@/game/constants/resources";
import { DEFAULT_USER_ID } from "@/game/constants/valley";
import { FOUNDATION_EPOCH } from "@/game/constants/foundation";
import { createId, type Player } from "@/types";

export function createDefaultPlayer(now: string = FOUNDATION_EPOCH): Player {
  return {
    id: createId<"PlayerId">("player_1"),
    userId: DEFAULT_USER_ID,
    displayName: "Traveler",
    createdAt: now,
    lastPlayedAt: now,
    resources: { ...STARTER_RESOURCES },
    preferences: {
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,
      reducedMotion: false,
    },
  };
}
