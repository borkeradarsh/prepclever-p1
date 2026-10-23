// The post-onboarding domain model (docs/dashboard-structure-spec.md section 4).
// Return types here are the contract between lib/data and the UI: changing one
// is a product decision, not a refactor.

import type { RoleId, Situation } from "@/components/auth/onboarding/types";

export type { RoleId, Situation };

export type Access = "free" | "paid";
export type Plan = "free" | "pro";
export type LessonType = "video" | "reading" | "quiz" | "project";

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  type: LessonType;
  durationMin: number;
  order: number;
  access: Access;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  stageId: string;
  lessons: Lesson[];
}

export interface Stage {
  id: string;
  order: number;
  name: string;
  outcome: string;
  courseIds: string[];
}

export interface Path {
  roleId: RoleId;
  situation: Situation;
  title: string;
  stages: Stage[];
}

export interface Progress {
  completedLessonIds: string[];
  lastLessonId: string | null;
  weeklyGoalSessions: number | null;
  sessionsThisWeek: number;
  streakDays: number;
}

export interface User {
  id: string;
  firstName: string | null;
  plan: Plan;
}

export interface PulseItem {
  text: string;
  sourceLabel: string;
  checkedOn: string;
  verified: boolean;
}

export interface ReadinessItem {
  id: string;
  label: string;
  done: boolean;
}

// Derived shapes. Not in the spec's type list, but every widget needs them and
// deriving them in components would duplicate the rules.

export type StageState = "done" | "in_progress" | "up_next" | "locked";

export interface StageProgress {
  stageId: string;
  state: StageState;
  completed: number;
  total: number;
  ratio: number;
}

export interface PathProgress {
  stages: StageProgress[];
  completed: number;
  total: number;
  allComplete: boolean;
}

export interface LessonRef {
  course: Course;
  lesson: Lesson;
}
