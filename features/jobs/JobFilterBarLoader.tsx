import { getJobFacets, getRoles } from "@/lib/data";
import type { JobFilters } from "@/types/domain";
import { JobFilterBar } from "./JobFilterBar";

/** Loads the facet lists on the server, then hands them to the client filter bar. */
export async function JobFilterBarLoader({ filters }: { filters: JobFilters }) {
  const [facets, roles] = await Promise.all([getJobFacets({ devSample: filters.devSample }), getRoles()]);
  return (
    <JobFilterBar
      filters={filters}
      facets={facets}
      roles={roles.map((role) => ({ id: role.id, title: role.title }))}
    />
  );
}
