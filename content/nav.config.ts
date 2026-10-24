// The app shell's navigation. One list drives both the desktop top bar and the
// mobile bottom tab bar, so they can never drift apart.

import { BriefcaseBusiness, House, Library, Route, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { routes } from "@/lib/routes";

export type NavItem = {
  href: string;
  label: string;
  /** Shorter label for the bottom tab bar, where width is tight. */
  tabLabel: string;
  icon: LucideIcon;
};

export const appNav: NavItem[] = [
  { href: routes.dashboard, label: "Home", tabLabel: "Home", icon: House },
  { href: routes.path, label: "My path", tabLabel: "Path", icon: Route },
  { href: routes.courses, label: "Courses", tabLabel: "Courses", icon: Library },
  { href: routes.jobs, label: "Jobs", tabLabel: "Jobs", icon: BriefcaseBusiness },
  { href: routes.profile, label: "Profile", tabLabel: "Profile", icon: User },
];

export const navCopy = {
  brand: "PrepClever",
  brandAriaLabel: "PrepClever home",
  primaryNavLabel: "Main navigation",
  tabBarLabel: "Sections",
  upgrade: "Upgrade",
  userMenuLabel: "Account menu",
  profile: "Profile",
  signOut: "Sign out",
};
