"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimalIcon,
  InventoryIcon,
  JournalIcon,
  MapIcon,
  MerchantIcon,
} from "@/components/icons/GameIcons";

export type NavTab = "map" | "animals" | "merchant" | "inventory" | "journal";

interface NavItem {
  id: NavTab;
  label: string;
  href: string;
  icon: typeof MapIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "map", label: "Map", href: "/", icon: MapIcon },
  { id: "animals", label: "Animals", href: "/animals", icon: AnimalIcon },
  { id: "merchant", label: "Merchant", href: "/merchant", icon: MerchantIcon },
  { id: "inventory", label: "Pack", href: "/inventory", icon: InventoryIcon },
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

  return (
    <nav
      className={`border-t border-stone-200/60 bg-white/80 backdrop-blur-md ${className}`}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] sm:max-w-xl md:max-w-2xl">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-colors ${
                active
                  ? "bg-emerald-50/90 text-emerald-800"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`h-5 w-5 ${active ? "text-emerald-600" : ""}`} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
