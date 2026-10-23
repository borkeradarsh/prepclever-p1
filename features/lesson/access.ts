import { getUser } from "@/lib/data";
import type { User } from "@/types/domain";

export { canAccess } from "@/lib/access";

/** The user for an access decision, defaulting to the most restrictive plan. */
export async function getUserForAccess(): Promise<Pick<User, "plan">> {
  try {
    return await getUser();
  } catch {
    // A failed lookup must never widen access.
    return { plan: "free" };
  }
}
