// Every in-app URL, in one place. Dependency-free on purpose: this file is safe
// to import from anywhere, including a future middleware on the edge runtime.

export const routes = {
  dashboard: "/dashboard",
  path: "/path",
  courses: "/courses",
  profile: "/profile",
  upgrade: "/upgrade",
  onboarding: "/onboarding/situation",
  lesson: (courseSlug: string, lessonSlug: string) =>
    `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}`,
} as const;

/** Prefixes that live behind the app shell, for a future route guard. */
export const APP_ROUTE_PREFIXES = [
  routes.dashboard,
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
