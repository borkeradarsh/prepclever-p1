import { BookOpen, Check, CircleHelp, Hammer, Lock, Video } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { typeLabels } from "@/content/pages.config";
import type { Lesson, LessonType } from "@/types/domain";

const icons: Record<LessonType, LucideIcon> = {
  video: Video,
  reading: BookOpen,
  quiz: CircleHelp,
  project: Hammer,
};

type LessonRowProps = {
  lesson: Lesson;
  href: string;
  completed?: boolean;
  /** The user may open the page either way: the body is what gets withheld. */
  locked?: boolean;
};

/** One lesson line. Shared by the lesson page and, next session, the roadmap. */
export function LessonRow({ lesson, href, completed = false, locked = false }: LessonRowProps) {
  const Icon = icons[lesson.type];

  return (
    <Link
      href={href}
      className="group flex min-h-11 items-center gap-[var(--space-sm)] rounded-[var(--radius-soft-sm)] px-[var(--space-sm)] py-[var(--space-xs)] transition-colors duration-200 ease-out hover:bg-brand-soft/40"
    >
      <Icon
        size={15}
        strokeWidth={1.8}
        aria-hidden="true"
        className="shrink-0 text-text-subtle"
      />
      {/* Wraps rather than truncates: subtopic titles are long and all of them matter. */}
      <span className="min-w-0 flex-1 text-text-primary">{lesson.title}</span>
      <span className="shrink-0 text-[length:var(--font-size-small)] text-text-subtle">
        <span className="sr-only">{typeLabels[lesson.type]}, </span>
        {lesson.durationMin} min
      </span>
      {completed ? (
        <Check size={15} strokeWidth={2} className="shrink-0 text-accent-ink" aria-label="Completed" />
      ) : null}
      {locked ? (
        <Lock size={15} strokeWidth={1.8} className="shrink-0 text-text-subtle" aria-label="Locked" />
      ) : null}
    </Link>
  );
}
