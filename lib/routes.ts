// Every in-app URL, in one place. Dependency-free on purpose: this file is safe
// to import from anywhere, including a future middleware on the edge runtime.

const seg = encodeURIComponent;

export const routes = {
  start: "/start",
  dashboard: "/dashboard",
  roadmap: "/roadmap",
  block: (blockSlug: string) => `/roadmap/${seg(blockSlug)}`,
  blockItem: (blockSlug: string, itemSlug: string) => `/roadmap/${seg(blockSlug)}/${seg(itemSlug)}`,
  conceptMap: "/roadmap/concept-map",
  concept: (domainId: string, conceptId: string) => `/roadmap/upskilling/${seg(domainId)}/${seg(conceptId)}`,
  conceptLesson: (domainId: string, conceptId: string, lessonSlug: string) =>
    `/roadmap/upskilling/${seg(domainId)}/${seg(conceptId)}/${seg(lessonSlug)}`,
  explore: "/explore",
  jobs: "/jobs",
  job: (id: string) => `/jobs/${seg(id)}`,
  // TODO(session-b): /path and /courses redirect to /roadmap and /roadmap/upskilling.
  path: "/path",
  courses: "/courses",
  profile: "/profile",
  upgrade: "/upgrade",
  /** Every upgrade entry point says where it came from and where to return. */
  upgradeFrom: (from: string, returnTo: string) =>
    `/upgrade?from=${seg(from)}&returnTo=${seg(returnTo)}`,
  onboarding: "/onboarding/situation",
  /** Legacy lesson URL, now keyed by concept id. TODO(session-b): replaced by conceptLesson. */
  lesson: (conceptId: string, lessonSlug: string) =>
    `/courses/${seg(conceptId)}/lessons/${seg(lessonSlug)}`,
} as const;

/** Prefixes that live behind the app shell, for a future route guard. */
export const APP_ROUTE_PREFIXES = [
  routes.dashboard,
  routes.roadmap,
  routes.explore,
  routes.jobs,
  routes.path,
  routes.courses,
  routes.profile,
  routes.upgrade,
] as const;

export function isAppRoute(pathname: string) {
  return APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
