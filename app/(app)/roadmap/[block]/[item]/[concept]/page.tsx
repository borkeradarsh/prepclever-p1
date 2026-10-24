// /roadmap/upskilling/[domain]/[concept]: a concept (Block 3 topic). The URL's
// [block] is always "upskilling" and [item] is the domain: these sit under the
// generic block routes so /roadmap/upskilling keeps its overview.
//
// The free preview (description, subtopics, practice project, prerequisites,
// the user's rating) is for everyone. Lessons are listed by title for everyone;
// their bodies only ever come from getLessonBody on the lesson page, after the
// access check, so this page never requests one.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { LockPanel } from "@/components/ui/LockPanel";
import { textLink } from "@/components/ui/link-styles";
import { getConceptById, levelLabels } from "@/content/concepts";
import { conceptCopy, itemCopy, roadmapCopy } from "@/content/roadmap.config";
import { LevelChip, RatingLine } from "@/features/concepts/ConceptBadges";
import { ItemPager } from "@/features/roadmap/ItemPager";
import { LessonRow } from "@/features/shared/LessonRow";
import { getConcept, getProgress, getRoleSyllabus } from "@/lib/data";
import { conceptNeighbours } from "@/lib/journey";
import { isLessonComplete } from "@/lib/progress";
import { routes } from "@/lib/routes";
import type { ReactNode } from "react";

type ConceptParams = { params: Promise<{ block: string; item: string; concept: string }> };

export async function generateMetadata({ params }: ConceptParams): Promise<Metadata> {
  const title = getConceptById((await params).concept)?.title;
  return { title: `${title ?? roadmapCopy.title} · PrepClever` };
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-[var(--space-sm)]">
      <h2 id={id} className="font-heading text-lg leading-tight text-text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ConceptPage({ params }: ConceptParams) {
  const { block, item: domainId, concept: conceptId } = await params;
  if (block !== "upskilling") notFound();

  const [view, syllabus, progress] = await Promise.all([
    getConcept(domainId, conceptId),
    getRoleSyllabus(),
    getProgress(),
  ]);
  if (!view) notFound();

  const { concept, domain, level, rating, prerequisites, lessons, locked } = view;
  const here = routes.concept(domain.id, concept.id);
  const minutes = lessons.reduce((sum, lesson) => sum + lesson.durationMin, 0);
  const pager = conceptNeighbours(syllabus.order, concept.id);

  return (
    <AppContainer width="reading">
      <PageHeader title={concept.title} subtext={`${domain.title} · ${roadmapCopy.blockLabel(3)}`} />
      <div className="-mt-[var(--space-sm)] mb-[var(--space-md)] grid gap-[var(--space-xs)]">
        <div className="flex flex-wrap gap-[var(--space-xs)]">
          <LevelChip level={level} />
        </div>
        <RatingLine rating={rating} rated={progress.auditRatings[concept.id] !== undefined} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-[var(--space-lg)]">
        <p className="max-w-prose text-text-primary">{concept.description}</p>

        <Section id="concept-learn" title={conceptCopy.learnHeading}>
          <ol className="grid list-decimal gap-[var(--space-xs)] pl-[var(--space-md)] text-text-primary">
            {concept.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ol>
        </Section>

        <Section id="concept-project" title={conceptCopy.projectHeading}>
          <p className="max-w-prose text-text-primary">{concept.practiceProject}</p>
        </Section>

        <Section id="concept-prerequisites" title={conceptCopy.prerequisitesHeading}>
          {prerequisites.length === 0 ? (
            <p className="text-text-subtle">{conceptCopy.noPrerequisites}</p>
          ) : (
            <ul className="grid gap-px">
              {prerequisites.map((prerequisite) => (
                <li key={prerequisite.id} className="flex flex-wrap items-center gap-x-[var(--space-sm)]">
                  <Link
                    href={routes.concept(prerequisite.domain, prerequisite.id)}
                    className={`${textLink} inline-flex min-h-11 items-center`}
                  >
                    {prerequisite.title}
                  </Link>
                  <span className="text-[length:var(--font-size-small)] text-text-subtle">
                    {prerequisite.level === 0 ? conceptCopy.optionalPrerequisite : levelLabels[prerequisite.level]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section id="concept-lessons" title={conceptCopy.lessonsHeading}>
          <p className="text-[length:var(--font-size-small)] text-text-subtle">
            {conceptCopy.lessonsCount(lessons.length, minutes)}
          </p>
          <div className="grid gap-px rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card p-[var(--space-xs)]">
            {lessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                href={routes.conceptLesson(domain.id, concept.id, lesson.slug)}
                completed={isLessonComplete(lesson.id, progress)}
                locked={locked}
              />
            ))}
          </div>
          {locked ? (
            <LockPanel
              variant="panel"
              title={conceptCopy.locked.title}
              body={conceptCopy.locked.body}
              primary={{ label: conceptCopy.locked.primary, href: routes.upgradeFrom("locked-page", here) }}
              secondary={{ label: itemCopy.freeAlternative.label, href: routes.gapReport }}
            />
          ) : null}
        </Section>
      </div>

      <ItemPager previous={pager.previous} next={pager.next} />
    </AppContainer>
  );
}
