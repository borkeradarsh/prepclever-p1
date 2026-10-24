"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { jobsCopy, seniorityLabels } from "@/content/jobs.config";
import { ALL_ROLES, jobsHref, POSTED_WITHIN, SENIORITIES, SORTS } from "@/lib/jobs/filters";
import type { JobFacets, JobFilters, RoleId } from "@/types/domain";

const copy = jobsCopy.filters;

const labelClass = "text-[length:var(--font-size-small)] text-text-subtle";
const controlClass =
  "min-h-11 w-full min-w-0 rounded-[var(--radius-soft-sm)] border border-border bg-background px-[var(--space-sm)] text-[length:var(--font-size-small)] text-text-primary";

type JobFilterBarProps = {
  filters: JobFilters;
  facets: JobFacets;
  roles: { id: RoleId; title: string }[];
};

/**
 * Filters live in the URL. A select navigates as soon as it changes; search
 * waits for submit. Without JavaScript the form still works as a plain GET.
 */
export function JobFilterBar({ filters, facets, roles }: JobFilterBarProps) {
  const router = useRouter();
  const go = (patch: Partial<JobFilters>) =>
    router.push(jobsHref({ ...filters, ...patch, page: 1 }), { scroll: false });

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "role") go({ roleId: value === ALL_ROLES ? null : (value as RoleId) });
    if (name === "company") go({ company: value || null });
    if (name === "city") go({ city: value || null });
    if (name === "seniority") go({ seniority: (value || null) as JobFilters["seniority"] });
    if (name === "posted") go({ postedWithinDays: value ? (Number(value) as 7 | 30) : null });
    if (name === "sort") go({ sort: value as JobFilters["sort"] });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q");
    go({ q: typeof q === "string" ? q.trim() : "" });
  };

  // A value the facets no longer list (an old shared link) still shows as selected.
  const withCurrent = (values: string[], current: string | null) =>
    current && !values.some((value) => value.toLowerCase() === current.toLowerCase()) ? [current, ...values] : values;

  return (
    // Keyed by the URL so every control resets to it after Back or a navigation.
    <form
      key={jobsHref(filters)}
      role="search"
      aria-label={copy.label}
      action="/jobs"
      method="get"
      onSubmit={onSubmit}
      className="grid gap-[var(--space-sm)] pb-[var(--space-lg)]"
    >
      {filters.devSample ? <input type="hidden" name="devSample" value="1" /> : null}

      <div className="grid gap-[var(--space-xs)]">
        <label htmlFor="jobs-q" className={labelClass}>
          {copy.search}
        </label>
        <div className="flex gap-[var(--space-sm)]">
          <input
            id="jobs-q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder={copy.searchPlaceholder}
            className={`${controlClass} flex-1`}
          />
          <Button type="submit" className="min-h-11 shrink-0">
            <Search size={15} strokeWidth={1.8} aria-hidden="true" className="mr-[var(--space-xs)]" />
            {copy.searchButton}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[var(--space-sm)] md:grid-cols-3 lg:grid-cols-6">
        <Field id="jobs-role" label={copy.role}>
          <select id="jobs-role" name="role" defaultValue={filters.roleId ?? ALL_ROLES} onChange={onSelect} className={controlClass}>
            <option value={ALL_ROLES}>{copy.allRoles}</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
        </Field>

        <Field id="jobs-company" label={copy.company}>
          <select id="jobs-company" name="company" defaultValue={filters.company ?? ""} onChange={onSelect} className={controlClass}>
            <option value="">{copy.allCompanies}</option>
            {withCurrent(facets.companies, filters.company).map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </Field>

        <Field id="jobs-city" label={copy.city}>
          <select id="jobs-city" name="city" defaultValue={filters.city ?? ""} onChange={onSelect} className={controlClass}>
            <option value="">{copy.allCities}</option>
            {withCurrent(facets.cities, filters.city).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </Field>

        <Field id="jobs-seniority" label={copy.seniority}>
          <select id="jobs-seniority" name="seniority" defaultValue={filters.seniority ?? ""} onChange={onSelect} className={controlClass}>
            <option value="">{copy.anySeniority}</option>
            {SENIORITIES.map((value) => (
              <option key={value} value={value}>
                {seniorityLabels[value]}
              </option>
            ))}
          </select>
        </Field>

        <Field id="jobs-posted" label={copy.posted}>
          <select
            id="jobs-posted"
            name="posted"
            defaultValue={filters.postedWithinDays ? String(filters.postedWithinDays) : ""}
            onChange={onSelect}
            className={controlClass}
          >
            <option value="">{copy.anyTime}</option>
            {POSTED_WITHIN.map((days) => (
              <option key={days} value={days}>
                {copy.postedWithin(days)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="jobs-sort" label={copy.sort}>
          <select id="jobs-sort" name="sort" defaultValue={filters.sort} onChange={onSelect} className={controlClass}>
            {SORTS.map((value) => (
              <option key={value} value={value}>
                {copy.sortLabels[value]}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-[var(--space-xs)]">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
