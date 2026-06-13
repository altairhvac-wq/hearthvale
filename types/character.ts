import type { CharacterId, DialogueId, LocationId, QuestId } from "./ids";
import type { RegionId } from "./ids";

/** Placeholder-ready portrait reference — asset path or emoji fallback. */
export interface CharacterPortrait {
  /** Future asset key for portrait art. */
  assetKey: string | null;
  /** Emoji shown until portrait art ships. */
  fallbackEmoji: string;
}

/** Whether a character is interactable today or a discoverable future resident. */
export type CharacterPresence = "active" | "future_resident";

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  description: string;
  portrait: CharacterPortrait;
  presence: CharacterPresence;
  /** Primary home location for this character. */
  homeLocationId: LocationId;
  /** Region they are associated with for map/scene wiring. */
  regionId: RegionId;
  /** Future quest hook — not active in V1. */
  futureQuestId: QuestId | null;
  /** Teaser dialogue for future residents — resolved from registry. */
  teaserDialogueId: DialogueId | null;
  /** Tags for narrative context (e.g. "builder", "caretaker"). */
  roles: readonly string[];
  sortOrder: number;
}

/** Static dialogue line in the character registry. */
export interface DialogueDefinition {
  id: DialogueId;
  characterId: CharacterId;
  /** Player-facing line — shown as character speech. */
  text: string;
  /** Optional context tag for resolution logic. */
  context: DialogueContext;
  sortOrder: number;
}

export type DialogueContext =
  | "greeting"
  | "request"
  | "thanks"
  | "teaser"
  | "discovery";

/** Runtime dialogue resolution — derived from game state in V1. */
export interface CharacterDialogueViewModel {
  characterId: CharacterId;
  characterName: string;
  text: string;
  portrait: CharacterPortrait;
  isActive: boolean;
}
