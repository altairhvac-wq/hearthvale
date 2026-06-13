import {
  MARKET_STAND_SCENE_HOTSPOT,
  MYSTERY_SCENE_HOTSPOTS,
  REGION_SCENE_HOTSPOTS,
} from "@/game/constants/world/scene-hotspots";
import { WORLD_HOTSPOT_LABELS } from "@/game/constants/world/labels";
import { REGION_IDS } from "@/game/constants/regions";
import type { RegionDisplayStatus } from "@/game/regions/display-status";
import type { RegionViewModel } from "@/game/regions/view-model";
import type { HomeMarketStandViewModel } from "@/game/onboarding/home-view-model";
import { buildDiscoveryLocationViewModels } from "./view-model";
import type { CharacterPresenceViewModel } from "./view-model";
import type { RegionId } from "@/types";

export type WorldHotspotKind = "market" | "region" | "mystery";

export interface WorldHotspotAction {
  label: string;
  href: string;
}

export interface WorldHotspotViewModel {
  id: string;
  kind: WorldHotspotKind;
  regionId: RegionId | null;
  name: string;
  subtitle: string;
  atmosphere: string;
  displayStatus: RegionDisplayStatus | "mystery";
  position: { x: number; y: number };
  markerEmoji: string;
  isLocked: boolean;
  isHighlighted: boolean;
  isActive: boolean;
  callout: string | null;
  action: WorldHotspotAction | null;
  progressPercent: number | null;
  progressNarrative: string | null;
  showProgress: boolean;
  characters: CharacterPresenceViewModel[];
}

function buildRegionAction(
  region: RegionViewModel,
  isFirstSession: boolean,
): WorldHotspotAction | null {
  if (!region.canTravel || region.displayStatus === "locked") {
    return null;
  }

  if (isFirstSession && region.id === REGION_IDS.VALLEY) {
    return {
      label: WORLD_HOTSPOT_LABELS.gatherWildflowers,
      href: "/gather",
    };
  }

  if (region.id === REGION_IDS.VALLEY) {
    return {
      label: WORLD_HOTSPOT_LABELS.walkMeadow,
      href: "/gather",
    };
  }

  if (region.id === REGION_IDS.SANCTUARY) {
    return {
      label: WORLD_HOTSPOT_LABELS.visitSanctuary,
      href: "/animals",
    };
  }

  return {
    label: WORLD_HOTSPOT_LABELS.explorePath,
    href: "/gather",
  };
}

function buildMarketHotspot(
  marketStand: HomeMarketStandViewModel,
  isFirstSession: boolean,
  isHighlighted: boolean,
  valleyCharacters: CharacterPresenceViewModel[],
): WorldHotspotViewModel {
  const speakingCharacter = valleyCharacters[0] ?? null;

  return {
    id: MARKET_STAND_SCENE_HOTSPOT.id,
    kind: "market",
    regionId: REGION_IDS.VALLEY,
    name: marketStand.title,
    subtitle: isFirstSession
      ? WORLD_HOTSPOT_LABELS.marketStandSubtitle
      : marketStand.statusLine,
    atmosphere: marketStand.narrative,
    displayStatus: "available",
    position: MARKET_STAND_SCENE_HOTSPOT.position,
    markerEmoji: marketStand.iconEmoji,
    isLocked: false,
    isHighlighted,
    isActive: isFirstSession,
    callout:
      isFirstSession && speakingCharacter ? speakingCharacter.name : null,
    action: {
      label: isFirstSession
        ? WORLD_HOTSPOT_LABELS.visitMarketStand
        : WORLD_HOTSPOT_LABELS.visitStand,
      href: marketStand.href,
    },
    progressPercent: null,
    progressNarrative: null,
    showProgress: false,
    characters: isFirstSession ? valleyCharacters : [],
  };
}

function buildRegionHotspot(
  region: RegionViewModel,
  isFirstSession: boolean,
): WorldHotspotViewModel | null {
  const layout = REGION_SCENE_HOTSPOTS.find(
    (entry) => entry.regionId === region.id,
  );

  if (!layout || !region.isOnMap) {
    return null;
  }

  const scene = region.worldScene;
  const isLocked = region.displayStatus === "locked";
  const isValley = region.id === REGION_IDS.VALLEY;

  return {
    id: region.id,
    kind: "region",
    regionId: region.id,
    name: region.name,
    subtitle: scene?.subtitle ?? region.description,
    atmosphere:
      scene?.atmosphereDescription ??
      scene?.discoveryDescription ??
      region.description,
    displayStatus: region.displayStatus,
    position: layout.position,
    markerEmoji: layout.markerEmoji,
    isLocked,
    isHighlighted: isFirstSession && isValley,
    isActive: region.isActive,
    callout: null,
    action: buildRegionAction(region, isFirstSession),
    progressPercent: isLocked ? null : region.progressPercent,
    progressNarrative: scene?.progressNarrative ?? null,
    showProgress: !isFirstSession && !isLocked,
    characters:
      isFirstSession && isValley
        ? []
        : (scene?.characters.filter((c) => c.isSpeakingToday) ?? []),
  };
}

function buildMysteryHotspots(): WorldHotspotViewModel[] {
  const discoveries = buildDiscoveryLocationViewModels();

  return MYSTERY_SCENE_HOTSPOTS.map((layout) => {
    const discovery = discoveries.find((entry) => entry.id === layout.id);

    return {
      id: layout.id,
      kind: "mystery",
      regionId: null,
      name: discovery?.label ?? WORLD_HOTSPOT_LABELS.unknownPlace,
      subtitle: WORLD_HOTSPOT_LABELS.mysterySubtitle,
      atmosphere: discovery?.teaser ?? WORLD_HOTSPOT_LABELS.mysteryAtmosphere,
      displayStatus: "mystery",
      position: layout.position,
      markerEmoji: layout.markerEmoji,
      isLocked: true,
      isHighlighted: false,
      isActive: false,
      callout: null,
      action: null,
      progressPercent: null,
      progressNarrative: null,
      showProgress: false,
      characters: [],
    };
  });
}

export function buildWorldHotspotViewModels(input: {
  regions: RegionViewModel[];
  marketStand: HomeMarketStandViewModel;
  isFirstSession: boolean;
}): WorldHotspotViewModel[] {
  const { regions, marketStand, isFirstSession } = input;

  const valleyRegion = regions.find((region) => region.id === REGION_IDS.VALLEY);
  const valleyCharacters =
    valleyRegion?.worldScene?.characters.filter((c) => c.isSpeakingToday) ?? [];

  const market = buildMarketHotspot(
    marketStand,
    isFirstSession,
    isFirstSession,
    valleyCharacters,
  );

  const regionHotspots = regions
    .map((region) => buildRegionHotspot(region, isFirstSession))
    .filter((entry): entry is WorldHotspotViewModel => entry !== null);

  const mysteries = buildMysteryHotspots();

  return [market, ...regionHotspots, ...mysteries];
}

export function resolveDefaultHotspotId(
  hotspots: WorldHotspotViewModel[],
  activeRegionId: RegionId | null,
  isFirstSession: boolean,
): string | null {
  if (isFirstSession) {
    const market = hotspots.find((h) => h.kind === "market");
    return market?.id ?? hotspots[0]?.id ?? null;
  }

  if (activeRegionId) {
    const match = hotspots.find((h) => h.regionId === activeRegionId);
    if (match) {
      return match.id;
    }
  }

  const valley = hotspots.find((h) => h.regionId === REGION_IDS.VALLEY);
  return valley?.id ?? hotspots[0]?.id ?? null;
}
