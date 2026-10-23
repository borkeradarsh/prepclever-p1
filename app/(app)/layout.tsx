import type { ReactNode } from "react";
import { AppTopBar } from "@/components/layout/app/AppTopBar";
import { getUser } from "@/lib/data";
import type { User } from "@/types/domain";

/**
 * The app shell, rendered once for every page behind it. Pages never implement
 * navigation themselves.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  // The shell must never take the page down: without a user we simply drop the
  // plan badge and the upgrade button.
  let user: User | null = null;
  try {
    user = await getUser();
  } catch {
    user = null;
  }

  return (
    <div className="app-body min-h-dvh bg-background">
      <AppTopBar user={user} />
      <main>{children}</main>
    </div>
  );
}
