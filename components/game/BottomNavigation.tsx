"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimalIcon,
  GatherIcon,
  InventoryIcon,
  JournalIcon,
  MapIcon,
  MerchantIcon,
} from "@/components/icons/GameIcons";
import { usePlayerHeaderData } from "@/store";

export type NavTab =
  | "map"
  | "gather"
  | "merchant"
  | "inventory"
  | "animals"
  | "journal";

interface NavItem {
  id: NavTab;
  label: string;
  href: string;
  icon: typeof MapIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "map", label: "Map", href: "/", icon: MapIcon },
  { id: "gather", label: "Gather", href: "/gather", icon: GatherIcon },
  { id: "merchant", label: "Stand", href: "/merchant", icon: MerchantIcon },
  { id: "inventory", label: "Pack", href: "/inventory", icon: InventoryIcon },
  { id: "animals", label: "Animals", href: "/animals", icon: AnimalIcon },
  { id: "journal", label: "Journal", href: "/journal", icon: JournalIcon },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className = "" }: BottomNavigationProps) {
  const pathname = usePathname();
  const headerData = usePlayerHeaderData();
  const isNewPlayer = headerData?.isNewPlayer ?? false;
  const guidedTabs: NavTab[] = isNewPlayer ? ["merchant", "gather"] : [];

  return (
    <nav
      className={`border-t border-stone-200/60 bg-white/80 backdrop-blur-md ${className}`}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] sm:max-w-xl md:max-w-2xl">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          const guided = guidedTabs.includes(item.id);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex min-w-[3.5rem] flex-1 flex-col items-center gap-0.5 rounded-xl px-1.5 py-2 transition-colors sm:min-w-[4rem] sm:px-2 ${
                active
                  ? "bg-emerald-50/90 text-emerald-800"
                  : guided
                    ? "text-amber-700 ring-1 ring-amber-300/70 ring-offset-1 ring-offset-white/80 hover:bg-amber-50/80"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`h-5 w-5 ${active ? "text-emerald-600" : ""}`} />
              <span className="text-[10px] font-medium sm:text-[11px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
