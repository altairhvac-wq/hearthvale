import type { RegionIconKey, ResourceIconKey } from "@/game/constants/icon-keys";

interface IconProps {
  className?: string;
}

export function CoinIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" className="fill-amber-300 stroke-amber-500" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" className="stroke-amber-600/50" strokeWidth="1" />
      <path
        d="M12 8.5v7M9.5 10.5h5M9.5 13.5h5"
        className="stroke-amber-700"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 20.5s-7-4.6-7-10a4 4 0 0 1 7-2.2A4 4 0 0 1 19 10.5c0 5.4-7 10-7 10Z"
        className="fill-rose-300 stroke-rose-500"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CharmIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3l1.8 4.2L18 9l-3.5 2.8L16 16l-4-2.4L8 16l1.5-4.2L6 9l4.2-1.8L12 3Z"
        className="fill-violet-200 stroke-violet-500"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="1.5" className="fill-violet-400" />
    </svg>
  );
}

export function MapIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 4 9 6.5V4Z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 6.5v10.5M15 4v13" className="stroke-current" strokeWidth="1.5" />
    </svg>
  );
}

export function AnimalIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="10" r="2" className="fill-current opacity-60" />
      <circle cx="16" cy="10" r="2" className="fill-current opacity-60" />
      <path
        d="M6 14c1.5 3 4 4.5 6 4.5s4.5-1.5 6-4.5"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 6c-1 0-2 .5-2.5 1.5M12 6c1 0 2 .5 2.5 1.5"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MerchantIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 9h16l-1.2 10.5H5.2L4 9Z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3 9 5 4.5h14L21 9"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 14h6" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function InventoryIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4"
        y="7"
        width="16"
        height="13"
        rx="2"
        className="stroke-current"
        strokeWidth="1.5"
      />
      <path
        d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7"
        className="stroke-current"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function JournalIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V4Z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 18h12M10 8h6M10 12h6"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LockIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        className="stroke-current"
        strokeWidth="1.5"
      />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MeadowIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 18c2-4 4-6 8-6s6 2 8 6"
        className="stroke-emerald-600"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 12V8M9 10l3-2 3 2" className="stroke-emerald-500" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="7" r="2" className="fill-amber-300 stroke-amber-400" strokeWidth="1" />
    </svg>
  );
}

export function SanctuaryIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4 4 9v10h16V9L12 4Z"
        className="stroke-amber-700"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 19v-6h6v6" className="stroke-amber-600" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="1.5" className="fill-amber-400" />
    </svg>
  );
}

export function HarborIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 16c2-1 4-1 6 0s4 1 6 0 4-1 6 0"
        className="stroke-sky-500"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M8 16V9l4-3 4 3v7" className="stroke-sky-700" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 12h4" className="stroke-sky-600" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ForestIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4 7 14h10L12 4Z"
        className="stroke-teal-700"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 14h4v6h-4v-6Z"
        className="stroke-teal-600"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 20h12" className="stroke-teal-500" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const REGION_ICON_MAP: Record<RegionIconKey, typeof MeadowIcon> = {
  meadow: MeadowIcon,
  sanctuary: SanctuaryIcon,
  harbor: HarborIcon,
  forest: ForestIcon,
};

export function RegionIcon({
  iconKey,
  className,
}: {
  iconKey: RegionIconKey;
  className?: string;
}) {
  const Icon = REGION_ICON_MAP[iconKey];
  return <Icon className={className} />;
}

const RESOURCE_ICON_MAP: Record<ResourceIconKey, typeof CoinIcon> = {
  coin: CoinIcon,
  heart: HeartIcon,
  charm: CharmIcon,
};

export function ResourceIcon({
  iconKey,
  className,
}: {
  iconKey: ResourceIconKey;
  className?: string;
}) {
  const Icon = RESOURCE_ICON_MAP[iconKey];
  return <Icon className={className} />;
}
