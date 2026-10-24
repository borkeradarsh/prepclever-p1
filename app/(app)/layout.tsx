import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { AppTopBar } from "@/components/layout/app/AppTopBar";
import { MobileTabBar } from "@/components/layout/app/MobileTabBar";
import { Sidebar } from "@/components/layout/app/Sidebar";
import { getBlocks, getProfile, getProgress, getRoleSyllabus, getUser, roleTitle } from "@/lib/data";
import { buildNavBlocks, type ShellData } from "@/lib/nav";
import { parseSidebarCookie, SIDEBAR_COOKIE } from "@/lib/sidebar-cookie";
import { trackLabel } from "@/lib/tracks";

/** The shell must never take the page down: a failed read just drops its part. */
async function settle<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}

async function loadShell(): Promise<ShellData> {
  const [user, profile, blocks, progress, syllabus] = await Promise.all([
    settle(getUser()),
    settle(getProfile()),
    settle(getBlocks()),
    settle(getProgress()),
    settle(getRoleSyllabus()),
  ]);
  return {
    plan: user?.plan ?? null,
    firstName: user?.firstName ?? null,
    roleChip: profile ? { role: roleTitle(profile.roleId), track: trackLabel(profile.track, profile.situation) } : null,
    // Without a known plan, lock icons follow the most restrictive one.
    blocks: blocks ? buildNavBlocks(blocks, user?.plan ?? "free", progress?.doneItems ?? [], syllabus) : null,
  };
}

/**
 * The app shell, rendered once for every page behind it. Pages never implement
 * navigation themselves.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const [shell, store] = await Promise.all([loadShell(), cookies()]);
  const sidebarState = parseSidebarCookie(store.get(SIDEBAR_COOKIE)?.value);

  return (
    <div className="app-body min-h-dvh bg-background lg:flex">
      <Sidebar data={shell} initialState={sidebarState} />
      <div className="min-w-0 flex-1">
        <AppTopBar data={shell} />
        <main>{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
