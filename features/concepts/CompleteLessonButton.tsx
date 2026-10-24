"use client";

import { Check } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { lessonCopy } from "@/content/roadmap.config";
import { completeLessonAction } from "@/features/concepts/actions";
import { track } from "@/lib/analytics";

type CompleteLessonButtonProps = {
  conceptId: string;
  lessonSlug: string;
  completed: boolean;
};

export function CompleteLessonButton({ conceptId, lessonSlug, completed }: CompleteLessonButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  if (completed) {
    return (
      <p className="inline-flex min-h-11 items-center gap-[var(--space-xs)] font-medium text-accent-ink">
        <Check size={16} strokeWidth={2} aria-hidden="true" />
        {lessonCopy.completed}
      </p>
    );
  }

  return (
    <div className="grid justify-items-start gap-[var(--space-sm)]" aria-live="polite">
      <Button
        type="button"
        disabled={pending}
        className="min-h-11"
        onClick={() => {
          setError("");
          startTransition(async () => {
            try {
              await completeLessonAction(conceptId, lessonSlug);
              track("lesson_completed", { lessonId: `${conceptId}/${lessonSlug}` });
            } catch {
              setError(lessonCopy.saveError);
            }
          });
        }}
      >
        <Check size={15} strokeWidth={2} aria-hidden="true" className="mr-[var(--space-xs)]" />
        {lessonCopy.markComplete}
      </Button>
      {error ? (
        <p role="alert" className="text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
