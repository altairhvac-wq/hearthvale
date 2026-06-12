import { getEventDefinition } from "@/game/constants/events";
import { MINIGAME_DEFINITIONS, isRegisteredMiniGame } from "@/game/constants/minigames";
import { getEventMetadata } from "@/game/events/metadata";
import type { EventId, MiniGameId } from "@/types";

function getMiniGameIdFromEventMetadata(eventId: EventId): MiniGameId | null {
  const definition = getEventDefinition(eventId);

  if (!definition || definition.category !== "minigame_trigger") {
    return null;
  }

  const miniGameId = getEventMetadata(definition, "minigame_id");

  if (typeof miniGameId !== "string" || !isRegisteredMiniGame(miniGameId)) {
    return null;
  }

  return miniGameId;
}

function getMiniGameIdFromLinkedDefinition(eventId: EventId): MiniGameId | null {
  const linkedDefinition = MINIGAME_DEFINITIONS.find(
    (entry) => entry.linkedEventId === eventId,
  );

  return linkedDefinition?.id ?? null;
}

/** Resolve a mini-game id from event metadata or definition reverse links. */
export function resolveMiniGameIdForEvent(eventId: EventId): MiniGameId | null {
  return (
    getMiniGameIdFromEventMetadata(eventId) ??
    getMiniGameIdFromLinkedDefinition(eventId)
  );
}

/** @deprecated Use resolveMiniGameIdForEvent — kept for transitional imports. */
export const getMiniGameIdFromEvent = resolveMiniGameIdForEvent;
