import type { Metadata } from "next";
import Link from "next/link";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { pageCopy } from "@/content/pages.config";
import { routes } from "@/lib/routes";

const copy = pageCopy.path;

export const metadata: Metadata = { title: `${copy.title} · PrepClever` };

export default function MyPathPage() {
  return (
    <AppContainer>
      <PageHeader title={copy.title} subtext={copy.subtext} />
      <EmptyState
        title={copy.comingSoon.title}
        body={copy.comingSoon.body}
        action={
          <Link
            href={routes.dashboard}
            className="text-accent-ink underline underline-offset-2 hover:text-accent-ink-strong"
          >
            Back to home
          </Link>
        }
      />
    </AppContainer>
  );
}
