import {
  buildActiveRequestObjectiveCopy,
  buildFirstSessionStatusNarrative,
  FIRST_SESSION_MOOD,
  FIRST_SESSION_OBJECTIVE,
  FUTURE_GOAL_PREVIEWS,
  VILLAGE_STORY,
  type FutureGoalPreview,
  type VillageStoryCopy,
} from "@/game/constants/immersion";
import { QUEST_IDS } from "@/game/constants/quests";
import { CUSTOMER_REQUEST_IDS, getCustomerRequestDefinition } from "@/game/constants/requests";
import { MERCHANT_STAGE_IDS } from "@/game/constants/merchant";
import { CHARACTER_DEFINITIONS } from "@/game/constants/world";
import { CHARACTER_IDS } from "@/game/constants/world/ids";
import { resolveCharacterDialogue } from "@/game/world/dialogue";
import type { MerchantScreenData } from "@/game/merchant/view-model";
import type { ProsperityViewModel } from "@/game/prosperity/view-model";
import type { CharacterId, Quest, RequestsState } from "@/types";
import { isFirstSession, isWelcomeQuestComplete } from "./first-session";
import { WORLD_HOTSPOT_LABELS } from "@/game/constants/world/labels";

export interface HomeObjectiveViewModel {
  title: string;
  description: string;
  steps: readonly string[];
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  isHighlighted: boolean;
}

export interface HomeMarketStandViewModel {
  title: string;
  statusLine: string;
  narrative: string;
  iconEmoji: string;
  href: string;
  hasPendingCustomer: boolean;
  customerLine?: string;
}

export interface HomeVillageStatusViewModel {
  moodTitle: string;
  narrative: string;
}

export interface HomeImmersionViewModel {
  isFirstSession: boolean;
  showVillageStory: boolean;
  villageStory: VillageStoryCopy;
  villageStatus: HomeVillageStatusViewModel;
  currentObjective: HomeObjectiveViewModel;
  marketStand: HomeMarketStandViewModel;
  nextUnlock: FutureGoalPreview;
  futureGoals: readonly FutureGoalPreview[];
}

function buildObjectiveForFirstSession(): HomeObjectiveViewModel {
  return {
    title: FIRST_SESSION_OBJECTIVE.title,
    description: FIRST_SESSION_OBJECTIVE.description,
    steps: FIRST_SESSION_OBJECTIVE.steps,
    primaryAction: {
      label: WORLD_HOTSPOT_LABELS.visitMarketStand,
      href: "/merchant",
    },
    secondaryAction: {
      label: WORLD_HOTSPOT_LABELS.gatherWildflowers,
      href: "/gather",
    },
    isHighlighted: true,
  };
}

function buildObjectiveForActiveRequest(
  customerName: string,
  hasMissingItems: boolean,
  customerLine?: string,
): HomeObjectiveViewModel {
  const copy = buildActiveRequestObjectiveCopy({
    customerName,
    requestTitle: "",
    hasMissingItems,
    customerLine,
  });

  return {
    title: copy.title,
    description: copy.description,
    steps: copy.steps,
    primaryAction: hasMissingItems
      ? { label: "Go gather", href: "/gather" }
      : { label: "Deliver at stand", href: "/merchant" },
    secondaryAction: hasMissingItems
      ? { label: "Check your pack", href: "/inventory" }
      : undefined,
    isHighlighted: true,
  };
}

function buildObjectiveForPostWelcome(): HomeObjectiveViewModel {
  return {
    title: "Explore the valley",
    description:
      "Walk the paths, discover each landmark, and learn what Hearthvale needs most.",
    steps: [
      "Visit the sanctuary, harbor, and forest path",
      "Help restore the Animal Sanctuary when you're ready",
    ],
    primaryAction: { label: "Open your journal", href: "/journal" },
    secondaryAction: { label: "Explore the map", href: "/" },
    isHighlighted: false,
  };
}

function resolveRequestCharacterId(requestId: string): CharacterId | null {
  const definition = getCustomerRequestDefinition(
    requestId as (typeof CUSTOMER_REQUEST_IDS)[keyof typeof CUSTOMER_REQUEST_IDS],
  );

  if (definition?.characterId) {
    return definition.characterId;
  }

  if (!definition) {
    return null;
  }

  const match = CHARACTER_DEFINITIONS.find(
    (character) => character.name === definition.customerName,
  );

  return match?.id ?? null;
}

function resolveNextUnlock(merchantData: MerchantScreenData): FutureGoalPreview {
  const marketStand = merchantData.stages.find(
    (stage) => stage.id === MERCHANT_STAGE_IDS.MARKET_STAND,
  );

  if (!marketStand || marketStand.level < marketStand.maxLevel) {
    return (
      FUTURE_GOAL_PREVIEWS.find((goal) => goal.id === "village_shop") ??
      FUTURE_GOAL_PREVIEWS[1]!
    );
  }

  if (
    merchantData.stages.find((stage) => stage.id === MERCHANT_STAGE_IDS.VILLAGE_SHOP)
      ?.status === "locked"
  ) {
    return (
      FUTURE_GOAL_PREVIEWS.find((goal) => goal.id === "village_shop") ??
      FUTURE_GOAL_PREVIEWS[1]!
    );
  }

  return (
    FUTURE_GOAL_PREVIEWS.find((goal) => goal.id === "sanctuary") ??
    FUTURE_GOAL_PREVIEWS[0]!
  );
}

export function buildHomeImmersionViewModel(input: {
  quests: Record<string, Quest>;
  totalXp: number;
  merchantData: MerchantScreenData;
  prosperity: ProsperityViewModel;
  requests: RequestsState;
}): HomeImmersionViewModel {
  const { quests, totalXp, merchantData, prosperity, requests } = input;
  const firstSession = isFirstSession(quests, totalXp);
  const welcomeComplete = isWelcomeQuestComplete(quests);

  const elenaDialogue = resolveCharacterDialogue(CHARACTER_IDS.ELENA, {
    requests,
  });

  const elenaRequest =
    merchantData.activeRequests.find((r) => r.id === CUSTOMER_REQUEST_IDS.WILDFLOWERS) ??
    merchantData.availableRequests.find((r) => r.id === CUSTOMER_REQUEST_IDS.WILDFLOWERS);

  let currentObjective: HomeObjectiveViewModel;

  if (firstSession) {
    if (elenaRequest?.status === "active") {
      currentObjective = buildObjectiveForActiveRequest(
        elenaRequest.customerName,
        elenaRequest.hasMissingItems,
        elenaDialogue?.text,
      );
    } else {
      currentObjective = buildObjectiveForFirstSession();
    }
  } else if (!welcomeComplete) {
    currentObjective = buildObjectiveForFirstSession();
  } else if (merchantData.activeRequests.length > 0) {
    const active = merchantData.activeRequests[0]!;
    const characterId = resolveRequestCharacterId(active.id);
    const dialogue = characterId
      ? resolveCharacterDialogue(characterId, { requests })?.text
      : undefined;
    currentObjective = buildObjectiveForActiveRequest(
      active.customerName,
      active.hasMissingItems,
      dialogue,
    );
  } else {
    currentObjective = buildObjectiveForPostWelcome();
  }

  const pendingCustomer =
    merchantData.availableRequests[0] ?? merchantData.activeRequests[0];

  const pendingCharacterId = pendingCustomer
    ? resolveRequestCharacterId(pendingCustomer.id)
    : null;
  const pendingDialogue = pendingCharacterId
    ? resolveCharacterDialogue(pendingCharacterId, { requests })
    : null;

  const marketStand: HomeMarketStandViewModel = {
    title: merchantData.activeStage.title,
    statusLine: firstSession
      ? "Your first stall — trade begins here"
      : `${merchantData.activeStage.visualLabel} · Level ${merchantData.activeStage.level}`,
    narrative: firstSession
      ? "A humble wooden stall at the edge of the square. Villagers will come when you have something they need."
      : merchantData.activeStage.description,
    iconEmoji: merchantData.activeStage.iconEmoji,
    href: "/merchant",
    hasPendingCustomer: Boolean(pendingCustomer),
    customerLine: pendingCustomer
      ? pendingDialogue
        ? `"${pendingDialogue.text}" — ${pendingCustomer.customerName}`
        : `${pendingCustomer.customerName} is looking for ${pendingCustomer.title.toLowerCase()}.`
      : undefined,
  };

  const meetValleyQuest = quests[QUEST_IDS.MEET_THE_VALLEY];
  const showVillageStory =
    firstSession || (welcomeComplete && meetValleyQuest?.status === "active");

  return {
    isFirstSession: firstSession,
    showVillageStory,
    villageStory: VILLAGE_STORY,
    villageStatus: {
      moodTitle: firstSession ? FIRST_SESSION_MOOD : prosperity.tierTitle,
      narrative: firstSession
        ? buildFirstSessionStatusNarrative(requests)
        : prosperity.tierDescription,
    },
    currentObjective,
    marketStand,
    nextUnlock: resolveNextUnlock(merchantData),
    futureGoals: FUTURE_GOAL_PREVIEWS,
  };
}
