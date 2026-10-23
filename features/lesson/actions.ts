"use server";

import { revalidatePath } from "next/cache";
import { getLesson, markLessonComplete } from "@/lib/data";
import { canAccess, getUserForAccess } from "@/features/lesson/access";
import { routes } from "@/lib/routes";

/**
 * Marks a lesson complete. Re-checks access on the server: a locked lesson can
 * never be completed just because someone posted the id.
 */
export async function markLessonCompleteAction(courseSlug: string, lessonSlug: string) {
  const found = await getLesson(courseSlug, lessonSlug);
  if (!found) return;

  const user = await getUserForAccess();
  if (!canAccess(user, found.lesson)) return;

  await markLessonComplete(found.lesson.id);
  revalidatePath(routes.lesson(courseSlug, lessonSlug));
  revalidatePath(routes.dashboard);
}
