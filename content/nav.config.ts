// The app shell's navigation. One list drives the sidebar, the mobile drawer
// and the bottom tab bar, so they can never drift apart. The roadmap's blocks
// are not listed here: they come from content/blocks.config.ts via lib/nav.ts.

import { BriefcaseBusiness, Compass, House, Route, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { routes } from "@/lib/routes";
import type { SectionLabels } from "@/lib/nav";

export type NavItem = {
  key: "home" | "roadmap" | "jobs" | "explore" | "profile";
  href: string;
  label: string;
  icon: LucideIcon;
};

const home: NavItem = { key: "home", href: routes.dashboard, label: "Home", icon: House };
const roadmap: NavItem = { key: "roadmap", href: routes.roadmap, label: "Roadmap", icon: Route };
const jobs: NavItem = { key: "jobs", href: routes.jobs, label: "Jobs", icon: BriefcaseBusiness };
const explore: NavItem = { key: "explore", href: routes.explore, label: "Explore", icon: Compass };
const profile: NavItem = { key: "profile", href: routes.profile, label: "Profile", icon: User };

/** Sidebar order. The roadmap entry renders the six blocks beneath it. */
export const sidebarNav: NavItem[] = [home, roadmap, jobs, explore, profile];

/** Bottom tab bar under 1024px. Profile lives in the user menu there. */
export const tabNav: NavItem[] = [home, roadmap, jobs, explore];

export const sectionLabels: SectionLabels = {
  dashboard: "Home",
  roadmap: "Roadmap",
  jobs: "Jobs",
  explore: "Explore",
  profile: "Profile",
  upgrade: "Upgrade",
};

export const navCopy = {
  brand: "PrepClever",
  /** The collapsed sidebar's mark. */
  brandShort: "P",
  brandAriaLabel: "PrepClever home",
  sidebarLabel: "Main navigation",
  tabBarLabel: "Sections",
  breadcrumbLabel: "Breadcrumb",
  upgrade: "Upgrade",
  upgradeHint: "Open Blocks 3 to 6 with Pro",
  userMenuLabel: "Account menu",
  profile: "Profile",
  signOut: "Sign out",
  planFree: "Free",
  planPro: "Pro",
  roleChipHint: "Your target role. Change it in Profile",
  collapse: "Collapse sidebar",
  expand: "Expand sidebar",
  menu: "Menu",
  contents: "Contents",
  closeMenu: "Close menu",
  backToRoadmap: "Roadmap",
  overview: "Overview",
  blockLabel: (order: number) => `Block ${order}`,
  blockProgress: (done: number, total: number) => `${done} of ${total} done`,
  locked: "Pro, locked",
  done: "Done",
  inProgress: "In progress",
  notStarted: "Not started",
  comingSoon: "Coming soon",
  soon: "Soon",
  conceptsHeading: "Your concepts",
  /** Same words as levelLabels in content/concepts.ts, kept here so the client bundle skips the concept map. */
  levels: { 2: "Core", 1: "Good to know" } as Record<1 | 2, string>,
  lessonsLocked: "lessons in Pro",
  groupCount: (done: number, total: number) => `${done}/${total}`,
  groupCountLabel: (done: number, total: number) => `${done} of ${total} done`,
};
