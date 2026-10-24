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
  profile: "/profile",
  upgrade: "/upgrade",
  /** Every upgrade entry point says where it came from and where to return. */
  upgradeFrom: (from: string, returnTo: string) =>
    `/upgrade?from=${seg(from)}&returnTo=${seg(returnTo)}`,
  onboarding: "/onboarding/situation",
} as const;

/** Prefixes that live behind the app shell, for a future route guard. */
export const APP_ROUTE_PREFIXES = [
  routes.dashboard,
  routes.roadmap,
  routes.explore,
  routes.jobs,
  routes.profile,
  routes.upgrade,
] as const;

export function isAppRoute(pathname: string) {
  return APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
