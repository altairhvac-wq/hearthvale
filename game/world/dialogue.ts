import { CUSTOMER_REQUEST_IDS } from "@/game/constants/requests";
import { CHARACTER_IDS, DIALOGUE_IDS } from "@/game/constants/world/ids";
import type {
  CharacterDialogueViewModel,
  CharacterId,
  RequestsState,
} from "@/types";
import {
  getCharacterDefinition,
  getDialogueDefinition,
  getDialoguesForCharacter,
} from "./registry";

export interface DialogueResolutionContext {
  requests: RequestsState;
}

function buildDialogueViewModel(
  characterId: CharacterId,
  dialogueId: (typeof DIALOGUE_IDS)[keyof typeof DIALOGUE_IDS],
  isActive: boolean,
): CharacterDialogueViewModel | null {
  const character = getCharacterDefinition(characterId);
  const dialogue = getDialogueDefinition(dialogueId);

  if (!character || !dialogue) {
    return null;
  }

  return {
    characterId,
    characterName: character.name,
    text: dialogue.text,
    portrait: character.portrait,
    isActive,
  };
}

function resolveElenaDialogue(
  context: DialogueResolutionContext,
): CharacterDialogueViewModel | null {
  const wildflowers = context.requests.instances[CUSTOMER_REQUEST_IDS.WILDFLOWERS];
  const status = wildflowers?.status;

  if (status === "completed") {
    return buildDialogueViewModel(CHARACTER_IDS.ELENA, DIALOGUE_IDS.ELENA_THANKS, true);
  }

  if (status === "active" || status === "available") {
    return buildDialogueViewModel(CHARACTER_IDS.ELENA, DIALOGUE_IDS.ELENA_REQUEST, true);
  }

  return buildDialogueViewModel(CHARACTER_IDS.ELENA, DIALOGUE_IDS.ELENA_GREETING, true);
}

function resolveRegistryTeaserDialogue(
  characterId: CharacterId,
): CharacterDialogueViewModel | null {
  const character = getCharacterDefinition(characterId);

  if (!character?.teaserDialogueId) {
    return null;
  }

  return buildDialogueViewModel(characterId, character.teaserDialogueId, false);
}

function resolveDefaultGreetingDialogue(
  characterId: CharacterId,
): CharacterDialogueViewModel | null {
  const greeting = getDialoguesForCharacter(characterId).find(
    (entry) => entry.context === "greeting",
  );

  if (!greeting) {
    return null;
  }

  const character = getCharacterDefinition(characterId);

  if (!character) {
    return null;
  }

  return {
    characterId,
    characterName: character.name,
    text: greeting.text,
    portrait: character.portrait,
    isActive: character.presence === "active",
  };
}

/** Resolve the best dialogue line for a character given current game state. */
export function resolveCharacterDialogue(
  characterId: CharacterId,
  context: DialogueResolutionContext,
): CharacterDialogueViewModel | null {
  const character = getCharacterDefinition(characterId);

  if (!character) {
    return null;
  }

  if (character.presence === "future_resident") {
    return resolveRegistryTeaserDialogue(characterId);
  }

  switch (characterId) {
    case CHARACTER_IDS.ELENA:
      return resolveElenaDialogue(context);
    default:
      return resolveDefaultGreetingDialogue(characterId);
  }
}

/** Whether this character should speak today (vs. appearing as a future resident). */
export function isCharacterSpeakingToday(
  characterId: CharacterId,
  context: DialogueResolutionContext,
): boolean {
  const dialogue = resolveCharacterDialogue(characterId, context);
  return dialogue?.isActive ?? false;
}
