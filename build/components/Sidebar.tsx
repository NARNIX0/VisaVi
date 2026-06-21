"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Sparkles,
  LayoutGrid,
  Mic,
  User as UserIcon,
  Settings,
  ChevronsUpDown,
  ChevronRight,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/user";
import { useCredits } from "@/hooks/useCredits";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";

const navItems = [
  { label: "Jobs", href: "/", icon: Briefcase },
  { label: "Review", href: "/review", icon: Sparkles },
  { label: "Applications", href: "/applications", icon: LayoutGrid },
  { label: "Interview Prep", href: "/interview-prep", icon: Mic },
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "AI Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const credits = useCredits((s) => s.credits);
  const isPro = useCredits((s) => s.isPro);
  const openUpgrade = useUpgradeModal((s) => s.openModal);

  return (
    <aside className="flex h-screen w-56 flex-col bg-gradient-to-b from-[#18BE5C] to-[#11A04E] text-white">
      {/* User profile */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
          {currentUser.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight">
            {currentUser.name}
          </p>
          <p className="truncate text-xs text-white/70">{currentUser.email}</p>
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-white/70" />
      </div>

      {/* Credit balance */}
      <div className="mx-3 mb-1 flex items-center justify-between rounded-lg bg-white/15 px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Coins className="h-4 w-4" />
          Credits
        </span>
        <span className="text-sm font-bold tabular-nums">
          {isPro ? `${credits} · Pro` : credits}
        </span>
      </div>

      {/* Platform section */}
      <p className="px-4 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-white/60">
        Platform
      </p>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/20 font-semibold text-white"
                  : "font-medium text-white/85 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade promo card */}
      <div className="m-3 rounded-xl bg-black/10 p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">Unlock more AI features</span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-white/75">
          Upgrade to Pro to generate applications, find recruiters and more.
        </p>
        <button
          onClick={openUpgrade}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f7a3f] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c6634]"
        >
          Upgrade Now
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
