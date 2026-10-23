// Lesson page, structure only: the body is a placeholder until the CMS lands.
// What is real here is the access gate and the locked state.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { LockPanel } from "@/components/ui/LockPanel";
import { SoftCard } from "@/components/ui/SoftCard";
import { LessonRow } from "@/features/shared/LessonRow";
import { MarkCompleteButton } from "@/features/lesson/MarkCompleteButton";
import { canAccess, getUserForAccess } from "@/features/lesson/access";
import { lessonCopy, typeLabels } from "@/content/pages.config";
import { getLesson, getLessonNeighbours, getProgress } from "@/lib/data";
import { isLessonComplete } from "@/lib/progress";
import { routes } from "@/lib/routes";

type LessonParams = { params: Promise<{ courseSlug: string; lessonSlug: string }> };

export async function generateMetadata({ params }: LessonParams): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const found = await getLesson(courseSlug, lessonSlug);
  return { title: found ? `${found.lesson.title} · PrepClever` : "Lesson · PrepClever" };
}

export default async function LessonPage({ params }: LessonParams) {
  const { courseSlug, lessonSlug } = await params;
  const found = await getLesson(courseSlug, lessonSlug);
  if (!found) notFound();

  const { course, lesson } = found;
  const user = await getUserForAccess();
  const unlocked = canAccess(user, lesson);

  const header = (
    <>
      {/* The course crumb is plain text: the course detail page does not exist yet. */}
      <nav aria-label="Breadcrumb" className="pt-[var(--space-lg)] text-text-subtle">
        <Link
          href={routes.courses}
          className="underline underline-offset-2 hover:text-text-primary"
        >
          {lessonCopy.breadcrumbRoot}
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{course.title}</span>
      </nav>
      <PageHeader
        title={lesson.title}
        subtext={`${typeLabels[lesson.type]} · ${lesson.durationMin} min`}
      />
    </>
  );

  // Locked: return before anything touches the lesson body, so it is never
  // rendered and never fetched for a user who fails the access check.
  if (!unlocked) {
    return (
      <AppContainer width="reading">
        {header}
        <LockPanel
          variant="panel"
          title={lessonCopy.locked.title}
          body={lessonCopy.locked.body}
          primary={{ label: lessonCopy.locked.primary, href: routes.upgrade }}
          secondary={{ label: lessonCopy.backToCourses, href: routes.courses }}
        />
      </AppContainer>
    );
  }

  const [progress, neighbours] = await Promise.all([
    getProgress(),
    getLessonNeighbours(courseSlug, lessonSlug),
  ]);
  const completed = isLessonComplete(lesson.id, progress);

  return (
    <AppContainer width="reading">
      {header}

      <SoftCard padding="lg">
        <p className="font-heading text-base leading-tight text-text-primary">
          {lessonCopy.placeholderTitle}
        </p>
        <p className="mt-[var(--space-sm)] text-text-subtle">{lessonCopy.placeholderBody}</p>
      </SoftCard>

      <div className="mt-[var(--space-lg)]">
        <MarkCompleteButton
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          completed={completed}
        />
      </div>

      <nav
        aria-label="Lesson navigation"
        className="mt-[var(--space-lg)] grid gap-[var(--space-sm)] border-t border-border-soft pb-[var(--space-xl)] pt-[var(--space-md)]"
      >
        {neighbours.previous ? (
          <div>
            <p className="text-[length:var(--font-size-small)] text-text-subtle">
              {lessonCopy.previous}
            </p>
            <LessonRow
              lesson={neighbours.previous}
              href={routes.lesson(courseSlug, neighbours.previous.slug)}
              completed={isLessonComplete(neighbours.previous.id, progress)}
              locked={!canAccess(user, neighbours.previous)}
            />
          </div>
        ) : null}
        {neighbours.next ? (
          <div>
            <p className="text-[length:var(--font-size-small)] text-text-subtle">
              {lessonCopy.next}
            </p>
            <LessonRow
              lesson={neighbours.next}
              href={routes.lesson(courseSlug, neighbours.next.slug)}
              completed={isLessonComplete(neighbours.next.id, progress)}
              locked={!canAccess(user, neighbours.next)}
            />
          </div>
        ) : null}
      </nav>
    </AppContainer>
  );
}
