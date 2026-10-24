"use server";

import { revalidatePath } from "next/cache";
import { canAccess } from "@/lib/access";
import { getLesson, getUser, markLessonComplete } from "@/lib/data";

/**
 * Completes a lesson. The ids come from the client, so the lesson is looked up
 * and access re-checked here: a locked lesson can never be completed by
 * posting its slug.
 */
export async function completeLessonAction(conceptId: string, lessonSlug: string) {
  const [found, user] = await Promise.all([getLesson(conceptId, lessonSlug), getUser()]);
  if (!found || !canAccess(user, found.lesson)) return;

  await markLessonComplete(found.lesson.id);
  // Ticks and Block 3 progress live in the layout's sidebar too.
  revalidatePath("/", "layout");
}
