import type { RegionDisplayStatus } from "@/game/regions/display-status";
import type { RegionProgressVariant } from "@/game/regions/presentation";

export interface RegionThemeStyle {
  accent: string;
  accentSoft: string;
  border: string;
  glow: string;
  nodeBg: string;
  nodeRing: string;
}

export const REGION_THEME_STYLES: Record<string, RegionThemeStyle> = {
  meadow: {
    accent: "text-emerald-700",
    accentSoft: "bg-emerald-100/80",
    border: "border-emerald-200/70",
    glow: "shadow-emerald-200/40",
    nodeBg: "bg-gradient-to-br from-emerald-100 to-lime-50",
    nodeRing: "ring-emerald-300/60",
  },
  sanctuary: {
    accent: "text-amber-800",
    accentSoft: "bg-amber-100/80",
    border: "border-amber-200/70",
    glow: "shadow-amber-200/40",
    nodeBg: "bg-gradient-to-br from-amber-100 to-orange-50",
    nodeRing: "ring-amber-300/60",
  },
  harbor: {
    accent: "text-sky-800",
    accentSoft: "bg-sky-100/80",
    border: "border-sky-200/70",
    glow: "shadow-sky-200/40",
    nodeBg: "bg-gradient-to-br from-sky-100 to-cyan-50",
    nodeRing: "ring-sky-300/60",
  },
  forest: {
    accent: "text-teal-800",
    accentSoft: "bg-teal-100/80",
    border: "border-teal-200/70",
    glow: "shadow-teal-200/40",
    nodeBg: "bg-gradient-to-br from-teal-100 to-emerald-50",
    nodeRing: "ring-teal-300/60",
  },
};

export const REGION_STATUS_STYLES: Record<
  RegionDisplayStatus,
  { badge: string; dot: string }
> = {
  locked: {
    badge: "bg-stone-100 text-stone-500 border-stone-200/80",
    dot: "bg-stone-400",
  },
  available: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  in_progress: {
    badge: "bg-amber-50 text-amber-800 border-amber-200/80",
    dot: "bg-amber-500",
  },
  restored: {
    badge: "bg-violet-50 text-violet-700 border-violet-200/80",
    dot: "bg-violet-500",
  },
};

export const REGION_PROGRESS_FILL: Record<RegionProgressVariant, string> = {
  locked: "bg-gradient-to-r from-stone-300 to-stone-400",
  discovery: "bg-gradient-to-r from-emerald-400 to-teal-500",
  restoration: "bg-gradient-to-r from-amber-400 to-orange-400",
  complete: "bg-gradient-to-r from-violet-400 to-purple-500",
};

export function getRegionProgressFill(variant: RegionProgressVariant): string {
  return REGION_PROGRESS_FILL[variant];
}

export function getRegionThemeStyle(theme: string): RegionThemeStyle {
  return REGION_THEME_STYLES[theme] ?? REGION_THEME_STYLES.meadow;
}
