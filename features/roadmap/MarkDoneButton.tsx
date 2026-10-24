"use client";

import { Check } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { itemCopy } from "@/content/roadmap.config";
import { setItemDoneAction } from "@/features/roadmap/actions";

type MarkDoneButtonProps = {
  blockSlug: string;
  itemSlug: string;
  done: boolean;
};

export function MarkDoneButton({ blockSlug, itemSlug, done }: MarkDoneButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const save = (value: boolean) => {
    setError("");
    startTransition(async () => {
      try {
        await setItemDoneAction(blockSlug, itemSlug, value);
      } catch {
        setError(itemCopy.saveError);
      }
    });
  };

  return (
    <div className="grid justify-items-start gap-[var(--space-sm)]" aria-live="polite">
      {done ? (
        <div className="flex flex-wrap items-center gap-[var(--space-md)]">
          <p className="inline-flex items-center gap-[var(--space-xs)] font-medium text-accent-ink">
            <Check size={16} strokeWidth={2} aria-hidden="true" />
            {itemCopy.done}
          </p>
          <Button type="button" variant="secondary" disabled={pending} onClick={() => save(false)} className="min-h-11">
            {itemCopy.undo}
          </Button>
        </div>
      ) : (
        <Button type="button" disabled={pending} onClick={() => save(true)} className="min-h-11">
          <Check size={15} strokeWidth={2} aria-hidden="true" className="mr-[var(--space-xs)]" />
          {itemCopy.markDone}
        </Button>
      )}
      {error ? (
        <p role="alert" className="text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
