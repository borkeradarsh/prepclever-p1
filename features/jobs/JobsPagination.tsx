import Link from "next/link";
import { jobsCopy } from "@/content/jobs.config";
import { jobsHref } from "@/lib/jobs/filters";
import type { JobFilters } from "@/types/domain";
import { secondaryLink } from "./styles";

const copy = jobsCopy.paging;

type JobsPaginationProps = { filters: JobFilters; page: number; pageCount: number };

/** Previous and next pages of 20. Plain links, so paging is in the URL and Back works. */
export function JobsPagination({ filters, page, pageCount }: JobsPaginationProps) {
  if (pageCount <= 1) return null;
  const disabled = `${secondaryLink} pointer-events-none opacity-50`;

  return (
    <nav aria-label={copy.label} className="flex items-center justify-between gap-[var(--space-sm)]">
      {page > 1 ? (
        <Link href={jobsHref({ ...filters, page: page - 1 })} className={secondaryLink}>
          {copy.previous}
        </Link>
      ) : (
        <span aria-disabled="true" className={disabled}>
          {copy.previous}
        </span>
      )}
      <p className="text-text-subtle">
        {copy.status(page, pageCount)}
      </p>
      {page < pageCount ? (
        <Link href={jobsHref({ ...filters, page: page + 1 })} className={secondaryLink}>
          {copy.next}
        </Link>
      ) : (
        <span aria-disabled="true" className={disabled}>
          {copy.next}
        </span>
      )}
    </nav>
  );
}
