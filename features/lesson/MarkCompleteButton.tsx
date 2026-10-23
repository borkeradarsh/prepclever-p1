"use client";

import { Check } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { lessonCopy } from "@/content/pages.config";
import { dashboardCopy } from "@/content/dashboard.config";
import { markLessonCompleteAction } from "@/features/lesson/actions";
import { track } from "@/lib/analytics";

type MarkCompleteButtonProps = {
  courseSlug: string;
  lessonSlug: string;
  completed: boolean;
};

export function MarkCompleteButton({
  courseSlug,
  lessonSlug,
  completed,
}: MarkCompleteButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  if (completed) {
    return (
      <p className="inline-flex items-center gap-[var(--space-xs)] text-accent-ink">
        <Check size={15} strokeWidth={2} aria-hidden="true" />
        {lessonCopy.markedComplete}
      </p>
    );
  }

  return (
    <div className="grid justify-items-start gap-[var(--space-sm)]">
      <Button
        type="button"
        disabled={pending}
        onClick={() => {
          setError("");
          startTransition(async () => {
            try {
              await markLessonCompleteAction(courseSlug, lessonSlug);
              track("lesson_completed", { lessonId: lessonSlug });
            } catch {
              setError(dashboardCopy.states.errorMessage);
            }
          });
        }}
      >
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
