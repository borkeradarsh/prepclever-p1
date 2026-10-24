// Every string the dashboard renders. The widget blocks are filled in now so the
// next session adds markup, not copy decisions.

export const dashboardCopy = {
  greeting: {
    /** Used when a first name is known. */
    withName: (firstName: string) => `Welcome back, ${firstName}`,
    /** No name is collected anywhere in the product yet, so this is the usual case. */
    withoutName: "Welcome back",
    subtext: "Here is where you are and what to do next.",
    roleChipPrefix: "Aiming for:",
    roleChipHint: "Change your target role",
    planFree: "Free",
    planPro: "Pro",
  },

  /** TODO(session-c): the temporary home until the widgets are rebuilt on the six blocks. */
  temporary: {
    title: "Your roadmap is ready",
    body: "Six blocks, from knowing the market to sitting the interview. Blocks 1 and 2 are free.",
    cta: "Start your roadmap",
  },

  states: {
    errorMessage: "Couldn't load this. Try again.",
    retryLabel: "Try again",
    loadingLabel: "Loading",
  },

  continueCard: {
    heading: "Continue",
    eyebrowFirstRun: "Start here",
    ctaFirstRun: "Start lesson 1",
    ctaContinue: "Continue",
    ctaLocked: "Unlock with Pro",
    secondaryLocked: "Review free lessons",
    lockedBody: "Lesson 1 of every course is free. Pro opens the rest.",
    completeTitle: "You've finished your path",
    completeBody: "Revisit any course to keep the material fresh.",
    completeCta: "Browse courses",
    emptyTitle: "No lessons yet",
    emptyBody: "Your path has no courses in it yet.",
  },

  pathOverview: {
    heading: "Your path",
    footerLink: "See full roadmap",
    lockedNote: "Included in Pro",
    stateLabels: {
      done: "Done",
      in_progress: "In progress",
      up_next: "Up next",
      locked: "Locked",
    },
    /** e.g. "2 courses · 9 lessons" — what a free user sees instead of the list. */
    counts: (courses: number, lessons: number) =>
      `${courses} ${courses === 1 ? "course" : "courses"} · ${lessons} ${lessons === 1 ? "lesson" : "lessons"}`,
    emptyTitle: "No stages yet",
    emptyBody: "Your roadmap is being prepared.",
  },

  weeklyGoal: {
    heading: "This week",
    prompt: "How many sessions a week?",
    chips: [2, 3, 5],
    chipSuffix: "a week",
    progress: (done: number, goal: number) => `${done} of ${goal} sessions this week`,
    streak: (days: number) => `${days}-day streak`,
    metMessage: "Goal met this week. Nice.",
    saveError: "Couldn't save your goal. Try again.",
  },

  gccPulse: {
    heading: "GCC pulse",
    nextLabel: "Next stat",
    unverifiedLabel: "Unverified",
  },

  profileReadiness: {
    heading: "Profile readiness",
    count: (done: number, total: number) => `${done} of ${total} done`,
    seeAll: "See all",
    seeFewer: "See fewer",
    action: "Do this",
  },
};
