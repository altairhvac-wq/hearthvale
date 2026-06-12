import { EVENT_DEFINITIONS, getEventDefinition } from "@/game/constants/events";
import { RARITY_DEFINITIONS } from "@/game/constants/rarities";
import { getRegionDefinitionName } from "@/game/regions/state";
import { isCartFeaturedEvent } from "@/game/events/metadata";
import type { EventCategory, EventId, EventsState, EventStatus, Rarity, RegionId } from "@/types";
import { describeEventReward } from "./rewards";
import { getEventCategoryLabel } from "./presentation";

export interface EventRewardViewModel {
  description: string;
}

export interface EventViewModel {
  id: EventId;
  title: string;
  description: string;
  category: EventCategory;
  categoryLabel: string;
  rarity: Rarity;
  rarityLabel: string;
  regionName: string | null;
  status: EventStatus;
  rewards: EventRewardViewModel[];
  bonusRewards: string[];
  canActivate: boolean;
  canComplete: boolean;
  isCartFeatured: boolean;
  sortOrder: number;
}

export interface FestivalCartData {
  isVisible: boolean;
  hasCartArrived: boolean;
  isWaitingForCart: boolean;
  featuredEvent: EventViewModel | null;
  regionIndicators: EventRegionIndicator[];
  evaluationCount: number;
  cartCooldownRemaining: number;
}

export interface EventRegionIndicator {
  regionId: RegionId;
  regionName: string;
  eventTitle: string;
  rarityLabel: string;
  status: EventStatus;
}

function buildEventViewModel(
  eventId: EventId,
  status: EventStatus,
  featuredEventId: EventId | null,
): EventViewModel | null {
  const definition = getEventDefinition(eventId);

  if (!definition) {
    return null;
  }

  const rarityDefinition = RARITY_DEFINITIONS[definition.rarity];

  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    category: definition.category,
    categoryLabel: getEventCategoryLabel(definition.category),
    rarity: definition.rarity,
    rarityLabel: rarityDefinition.label,
    regionName: definition.regionId
      ? getRegionDefinitionName(definition.regionId)
      : null,
    status,
    rewards: definition.rewards.map((reward) => ({
      description: describeEventReward(reward),
    })),
    bonusRewards: definition.bonusRewardDescriptions,
    canActivate: status === "available" && featuredEventId === eventId,
    canComplete: status === "active" && featuredEventId === eventId,
    isCartFeatured: isCartFeaturedEvent(definition),
    sortOrder: definition.sortOrder,
  };
}

export function buildFestivalCartData(eventsState: EventsState): FestivalCartData {
  const featuredEventId = eventsState.scheduler.featuredEventId;
  const featuredInstance = featuredEventId
    ? eventsState.instances[featuredEventId]
    : null;

  const featuredEvent =
    featuredEventId && featuredInstance
      ? buildEventViewModel(
          featuredEventId,
          featuredInstance.status,
          featuredEventId,
        )
      : null;

  const isVisible =
    featuredEvent !== null &&
    (featuredEvent.status === "available" ||
      featuredEvent.status === "active");

  const isWaitingForCart =
    !isVisible && eventsState.scheduler.cartCooldownRemaining > 0;

  const regionIndicators: EventRegionIndicator[] = [];

  if (featuredEvent && featuredEvent.regionName && isVisible) {
    const definition = getEventDefinition(featuredEvent.id);

    if (definition?.regionId) {
      regionIndicators.push({
        regionId: definition.regionId,
        regionName: featuredEvent.regionName,
        eventTitle: featuredEvent.title,
        rarityLabel: featuredEvent.rarityLabel,
        status: featuredEvent.status,
      });
    }
  }

  return {
    isVisible,
    hasCartArrived: isVisible,
    isWaitingForCart,
    featuredEvent,
    regionIndicators,
    evaluationCount: eventsState.scheduler.evaluationCount,
    cartCooldownRemaining: eventsState.scheduler.cartCooldownRemaining,
  };
}

export function buildAllEventViewModels(
  eventsState: EventsState,
): EventViewModel[] {
  return EVENT_DEFINITIONS.map((definition) => {
    const instance = eventsState.instances[definition.id];
    const status = instance?.status ?? "locked";

    return buildEventViewModel(
      definition.id,
      status,
      eventsState.scheduler.featuredEventId,
    );
  }).filter((entry): entry is EventViewModel => entry !== null);
}
