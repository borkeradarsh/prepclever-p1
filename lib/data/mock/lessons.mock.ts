// PLACEHOLDER CONTENT, TODO(cms): lesson bodies are the owner's own content and
// arrive with the CMS. What is real here is the structure: one lesson per
// concept subtopic (titles are the concept map's own subtopics) plus one
// project lesson built from the concept's practice project.
//
// Types and durations are placeholders too: every subtopic is a reading and
// every project is a project, so no quiz lessons exist yet (plans.config.ts
// keeps quizzes "coming soon" for that reason).

import { concepts } from "@/content/concepts";
import { ACCESS_RULES } from "@/lib/access";
import type { Concept, Lesson, LessonBody } from "@/types/domain";

const READING_MINUTES = 15;
const PROJECT_MINUTES = 40;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Deterministic: same concept, same lessons, same ids. */
export function buildLessons(concept: Concept): Lesson[] {
  const access = ACCESS_RULES.blocks.upskilling;
  const subtopics = concept.topics.map((topic, index) => ({
    id: `${concept.id}-l${index + 1}`,
    slug: slugify(topic),
    conceptId: concept.id,
    title: topic,
    type: "reading" as const,
    durationMin: READING_MINUTES,
    order: index + 1,
    access,
  }));
  return [
    ...subtopics,
    {
      id: `${concept.id}-project`,
      slug: "practice-project",
      conceptId: concept.id,
      title: "Practice project",
      type: "project",
      durationMin: PROJECT_MINUTES,
      order: subtopics.length + 1,
      access,
    },
  ];
}

/** Every lesson in concept order: the index space the progress cookie uses. */
export const allLessons: Lesson[] = concepts.flatMap(buildLessons);

/** Only ever called after an access check (lib/data getLessonBody enforces it). */
export function buildLessonBody(concept: Concept, lesson: Lesson): LessonBody {
  return {
    lessonId: lesson.id,
    placeholder: true,
    body:
      lesson.type === "project"
        ? `PLACEHOLDER CONTENT. Project brief: ${concept.practiceProject}`
        : "PLACEHOLDER CONTENT. The lesson body arrives with the CMS.",
  };
}
