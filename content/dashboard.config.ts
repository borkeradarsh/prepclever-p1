// Every string the home page renders.

import type { RoleFit } from "@/types/domain";

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

  states: {
    errorMessage: "Couldn't load this. Try again.",
    retryLabel: "Try again",
    loadingLabel: "Loading",
  },

  metrics: {
    label: "Your progress",
    lastStudied: {
      label: "Last studied",
      firstRunTitle: "Nothing yet",
      firstRunBody: "Your roadmap starts with the GCC market and your target role.",
      firstRunAction: "Start with Block 1",
      action: "Pick up where you left off",
    },
    next: {
      label: "Next up",
      action: "Continue",
      lockedAction: "Unlock with Pro",
      lockedNote: "Part of Pro",
      doneTitle: "You're through the roadmap",
      doneBody: "Revisit any block to keep it fresh.",
      doneAction: "See the roadmap",
    },
    roadmap: {
      label: "Roadmap progress",
      value: (done: number, total: number) => `${done} of ${total}`,
      body: "steps done across the six blocks",
      bar: "Roadmap progress",
      emptyBody: "No steps are set up yet.",
      action: "See the roadmap",
    },
    readiness: {
      label: "Skill readiness",
      value: (percent: number) => `${percent}%`,
      body: "for your role, from your skill audit",
      bar: "Skill readiness",
      action: "See your gap report",
      firstRunTitle: "Not measured yet",
      firstRunBody: "Rate your skills once to see how ready you are.",
      firstRunAction: "Take the skill audit",
      mapAction: "Open the concept map",
    },
  },

  blocks: {
    heading: "Your six blocks",
    subtext: "Where you are on the roadmap, and where you need help next.",
    label: (order: number) => `Block ${order}`,
    progress: (done: number, total: number) => `${done} of ${total} done`,
    progressLabel: (title: string) => `${title} progress`,
    current: "You are here",
    nextHeading: "Next in this block",
    lockedNote: "Included in Pro",
    mapNote: "The concept map in this block is free",
    open: (title: string) => `Open ${title}`,
    emptyTitle: "No blocks yet",
    emptyBody: "Your roadmap is being prepared.",
  },

  roles: {
    heading: "Roles you could aim for",
    subtext: "All seven GCC AI roles, scored against your one skill audit. Yours comes first.",
    regionLabel: "Roles, scroll sideways",
    previous: "Previous roles",
    next: "More roles",
    yourRole: "Your role",
    fit: {
      on_track: "Your experience fits",
      stretch: "A stretch for now",
      adjacent_first: "Enter through a related role first",
    } as Record<RoleFit, string>,
    readiness: (percent: number) => `${percent}% ready`,
    readinessLabel: (title: string) => `Readiness for ${title}`,
    noAudit: "Take the skill audit to see how ready you are",
    core: (count: number) => `${count} core concepts`,
    jobs: "See jobs",
    jobsLabel: (title: string) => `See ${title} jobs`,
    rolePage: "Your role page",
    allRoles: "About this role",
    emptyTitle: "No roles to show",
    emptyBody: "Role data is being prepared.",
  },
};
