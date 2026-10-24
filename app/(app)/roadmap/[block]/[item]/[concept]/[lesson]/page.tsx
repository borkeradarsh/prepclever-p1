// /roadmap/upskilling/[domain]/[concept]/[lesson]: one lesson.
//
// Locked: the page returns before getLessonBody is called, so a free user's
// request never fetches a body. getLessonBody re-checks access itself as well.
// Bodies are placeholders from lib/data until the CMS lands (TODO(cms)).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { LockPanel } from "@/components/ui/LockPanel";
import { SoftCard } from "@/components/ui/SoftCard";
import { typeLabels } from "@/content/pages.config";
import { itemCopy, lessonCopy, roadmapCopy } from "@/content/roadmap.config";
import { CompleteLessonButton } from "@/features/concepts/CompleteLessonButton";
import { ItemPager } from "@/features/roadmap/ItemPager";
import { canAccess } from "@/lib/access";
import { getConcept, getLesson, getLessonBody, getProgress, getRoleSyllabus, getUser } from "@/lib/data";
import { conceptNeighbours, lessonNeighbours } from "@/lib/journey";
import { isLessonComplete } from "@/lib/progress";
import { routes } from "@/lib/routes";

type LessonParams = { params: Promise<{ block: string; item: string; concept: string; lesson: string }> };

export async function generateMetadata({ params }: LessonParams): Promise<Metadata> {
  const { concept, lesson } = await params;
  const found = await getLesson(concept, lesson).catch(() => null);
  return { title: `${found?.lesson.title ?? roadmapCopy.title} · PrepClever` };
}

export default async function LessonPage({ params }: LessonParams) {
  const { block, item: domainId, concept: conceptId, lesson: lessonSlug } = await params;
  if (block !== "upskilling") notFound();

  // getConcept carries lesson titles and metadata only: never a body.
  const [found, view, user, syllabus] = await Promise.all([
    getLesson(conceptId, lessonSlug),
    getConcept(domainId, conceptId),
    getUser(),
    getRoleSyllabus(),
  ]);
  if (!found || !view) notFound();

  const { concept, lesson } = found;
  const lessons = view.lessons;
  const pager = lessonNeighbours(lessons, lesson.slug, concept, conceptNeighbours(syllabus.order, concept.id).next);

  const header = (
    <>
      <PageHeader title={lesson.title} subtext={`${concept.title} · ${lessonCopy.of(lesson.order, lessons.length)}`} />
      <div className="-mt-[var(--space-sm)] mb-[var(--space-lg)] flex flex-wrap gap-[var(--space-xs)]">
        <Chip>{typeLabels[lesson.type]}</Chip>
        <Chip>{itemCopy.minutes(lesson.durationMin)}</Chip>
      </div>
    </>
  );

  if (!canAccess(user, lesson)) {
    const here = routes.conceptLesson(concept.domain, concept.id, lesson.slug);
    return (
      <AppContainer width="reading">
        {header}
        <LockPanel
          variant="panel"
          title={lessonCopy.locked.title}
          body={lessonCopy.locked.body}
          primary={{ label: lessonCopy.locked.primary, href: routes.upgradeFrom("locked-page", here) }}
          secondary={{ label: lessonCopy.backToConcept(concept.title), href: routes.concept(concept.domain, concept.id) }}
        />
        <ItemPager previous={pager.previous} next={pager.next} />
      </AppContainer>
    );
  }

  const [body, progress] = await Promise.all([getLessonBody(concept.id, lesson.slug), getProgress()]);

  return (
    <AppContainer width="reading">
      {header}
      <div className="grid gap-[var(--space-lg)]">
        <SoftCard padding="lg" className="grid gap-[var(--space-sm)]">
          {body?.placeholder ? (
            <p className="flex flex-wrap items-center gap-[var(--space-sm)] text-[length:var(--font-size-small)] text-text-subtle">
              <Chip>{lessonCopy.placeholder}</Chip>
              {lessonCopy.placeholderNote}
            </p>
          ) : null}
          <p className="max-w-prose whitespace-pre-line text-text-primary">{body?.body}</p>
        </SoftCard>
        <CompleteLessonButton
          conceptId={concept.id}
          lessonSlug={lesson.slug}
          completed={isLessonComplete(lesson.id, progress)}
        />
      </div>
      <ItemPager previous={pager.previous} next={pager.next} />
    </AppContainer>
  );
}
