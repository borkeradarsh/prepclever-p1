// Thin analytics wrapper (docs/dashboard-structure-spec.md section 13). The event
// names are a closed union so a typo is a type error, not a silent miss.
// TODO(analytics): forward to a real provider; today it only logs in development.

export type AnalyticsEvent =
  | "dashboard_viewed"
  | "continue_clicked"
  | "stage_expanded"
  | "weekly_goal_set"
  | "pulse_next_clicked"
  | "readiness_action_clicked"
  | "lesson_opened"
  | "lesson_completed"
  | "upgrade_clicked"
  | "upgrade_interest"
  | "role_change_started";

export type AnalyticsProps = Record<string, string | number | boolean | null>;

export function track(event: AnalyticsEvent, props?: AnalyticsProps) {
  if (process.env.NODE_ENV === "production") return;
  console.debug(`[analytics] ${event}`, props ?? {});
}
