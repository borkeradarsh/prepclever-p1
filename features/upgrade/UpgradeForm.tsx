"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { textLink } from "@/components/ui/link-styles";
import { upgradeCopy } from "@/content/plans.config";
import { upgradeAction, type UpgradeFormState } from "@/features/upgrade/actions";
import type { UpgradeSource } from "@/lib/billing";

type UpgradeFormProps = {
  source: UpgradeSource;
  /** Already validated by the page; the action validates it again. */
  returnTo: string;
};

const initialState: UpgradeFormState = { status: "idle" };

export function UpgradeForm({ source, returnTo }: UpgradeFormProps) {
  const [state, formAction, pending] = useActionState(upgradeAction, initialState);

  if (state.status === "opening_soon") {
    return (
      <div role="status">
        <EmptyState
          compact
          title={upgradeCopy.openingSoon.title}
          body={upgradeCopy.openingSoon.body}
          action={
            <Link href={state.returnTo} className={textLink}>
              {upgradeCopy.openingSoon.back}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-[var(--space-md)]">
      <input type="hidden" name="from" value={source} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <Button type="submit" disabled={pending} className="min-h-11">
        {pending ? upgradeCopy.pending : upgradeCopy.action}
      </Button>
      <Link href={returnTo} className={textLink}>
        {upgradeCopy.notNow}
      </Link>
    </form>
  );
}
