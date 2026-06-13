import {
  CHARACTER_DEFINITIONS,
  DISCOVERY_LOCATION_DEFINITIONS,
  LOCATION_DEFINITIONS,
} from "./world";
import {
  CHARACTER_IDS,
  DISCOVERY_LOCATION_IDS,
  LOCATION_IDS,
} from "./world/ids";
import { resolveCharacterDialogue } from "@/game/world/dialogue";
import type { HomeObjectiveViewModel } from "@/game/onboarding/home-view-model";
import type { RequestsState } from "@/types";

/** Cozy narrative copy for the home screen and first session. */
export interface VillageStoryCopy {
  headline: string;
  intro: string;
  hope: string;
}

export const VILLAGE_STORY: VillageStoryCopy = {
  headline: "You're the keeper of the stand",
  intro:
    "Once a warm gathering place, Hearthvale has grown quiet. The old market stall is yours now — a small wooden corner of the square where trade might wake the village again.",
  hope:
    "Elena stopped by this morning. She asked for wildflowers to brighten her windowsill. A gentle first favor, and the valley begins to remember itself.",
} as const;

export const FIRST_SESSION_MOOD = "A quiet morning in the square";

export const FIRST_SESSION_OBJECTIVE = {
  title: "Elena's wildflowers",
  description:
    "Your neighbor Elena wants a bouquet for her windowsill. Promise to help at your stand, gather blooms in the meadow, then return with care.",
  steps: [
    "Visit your Market Stand and promise Elena you'll help",
    "Walk the meadow and gather wildflowers",
    "Return to the stand and deliver the bouquet",
  ],
} as const;

export interface FutureGoalPreview {
  id: string;
  title: string;
  teaser: string;
  iconEmoji: string;
  /** When true, shown as a distant silhouette on the map. */
  isMystery?: boolean;
}

function getLocationById(locationId: (typeof LOCATION_IDS)[keyof typeof LOCATION_IDS]) {
  return LOCATION_DEFINITIONS.find((entry) => entry.id === locationId);
}

function getCharacterById(characterId: (typeof CHARACTER_IDS)[keyof typeof CHARACTER_IDS]) {
  return CHARACTER_DEFINITIONS.find((entry) => entry.id === characterId);
}

function getDiscoveryById(
  discoveryId: (typeof DISCOVERY_LOCATION_IDS)[keyof typeof DISCOVERY_LOCATION_IDS],
) {
  return DISCOVERY_LOCATION_DEFINITIONS.find((entry) => entry.id === discoveryId);
}

const sanctuaryLocation = getLocationById(LOCATION_IDS.ANIMAL_SANCTUARY)!;
const harborLocation = getLocationById(LOCATION_IDS.HARBOR)!;
const willow = getCharacterById(CHARACTER_IDS.WILLOW)!;
const beyondHarbor = getDiscoveryById(DISCOVERY_LOCATION_IDS.BEYOND_HARBOR)!;

export const FUTURE_GOAL_PREVIEWS: readonly FutureGoalPreview[] = [
  {
    id: "sanctuary",
    title: sanctuaryLocation.title,
    teaser: sanctuaryLocation.restorationDream,
    iconEmoji: willow.portrait.fallbackEmoji,
  },
  {
    id: "village_shop",
    title: "A Village Shop",
    teaser:
      "One day your humble stall may grow into a cozy corner shop the whole square trusts.",
    iconEmoji: "🏪",
  },
  {
    id: "harbor",
    title: harborLocation.title,
    teaser: harborLocation.restorationDream,
    iconEmoji: "⚓",
  },
  {
    id: "islands",
    title: beyondHarbor.label,
    teaser: beyondHarbor.teaser,
    iconEmoji: "🏝️",
    isMystery: true,
  },
] as const;

/** Location restoration dreams keyed by region — for panels that need a quick lookup. */
export function getRestorationDreamForRegion(
  regionId: (typeof LOCATION_DEFINITIONS)[number]["regionId"],
): string | null {
  const location = LOCATION_DEFINITIONS.find((entry) => entry.regionId === regionId);
  return location?.restorationDream ?? null;
}

/** First-session mood line when a character request is active. */
export function buildFirstSessionStatusNarrative(requests: RequestsState): string {
  const elenaLine = resolveCharacterDialogue(CHARACTER_IDS.ELENA, { requests })?.text;

  if (elenaLine) {
    return `The square is still, but your stall waits — Elena left her request on the counter: "${elenaLine}"`;
  }

  return "The square is still, but your stall waits — and someone may stop by soon.";
}

/** Objective copy when a registry-linked customer request is in progress. */
export function buildActiveRequestObjectiveCopy(input: {
  customerName: string;
  requestTitle: string;
  hasMissingItems: boolean;
  customerLine?: string;
}): Pick<HomeObjectiveViewModel, "title" | "description" | "steps"> {
  const { customerName, hasMissingItems, customerLine } = input;

  const description = customerLine
    ? `${customerName} says: "${customerLine}"`
    : hasMissingItems
      ? `${customerName} is waiting. Head to the meadow and fill your pack.`
      : `You have what ${customerName} needs. Return to your Market Stand and complete the delivery.`;

  return {
    title: hasMissingItems
      ? `Gather what ${customerName} needs`
      : `Deliver for ${customerName}`,
    description,
    steps: hasMissingItems
      ? ["Gather what's needed in the valley", "Return to your Market Stand"]
      : ["Deliver at your Market Stand"],
  };
}
