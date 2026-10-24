// Every string the roadmap pages render: /roadmap, block overviews, item pages
// and their lock pages. Block and item titles are not here: they are in
// content/blocks.config.ts.

import type { BlockState, ItemKind, Rating } from "@/types/domain";

export const kindLabels: Record<ItemKind, string> = {
  guide: "Guide",
  checklist: "Checklist",
  tool: "Tool",
  directory: "Directory",
  "role-page": "Role page",
  report: "Report",
  map: "Map",
};

export const blockStateLabels: Record<BlockState, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

export const roadmapCopy = {
  title: "Your roadmap",
  subtext: "Six blocks from knowing the market to sitting the interview. Blocks 1 and 2 are free.",
  flowLabel: "The six roadmap blocks, in order",
  blockLabel: (order: number) => `Block ${order}`,
  progress: (done: number, total: number) => `${done} of ${total} done`,
  progressLabel: (title: string) => `${title} progress`,
  lockedNote: "Included in Pro",
  comingSoon: "Coming soon",
  startFirst: "Start with Block 1",
  continueBlock: (order: number) => `Continue with Block ${order}`,
  allDone: "You've been through every block. Revisit any of them to keep it fresh.",
  emptyTitle: "No blocks yet",
  emptyBody: "Your roadmap is being prepared.",
  loadingLabel: "Loading the roadmap",
};

export const blockCopy = {
  insideHeading: "What's inside",
  itemsHeading: "Steps in this block",
  start: "Start this block",
  continue: (title: string) => `Continue: ${title}`,
  review: "Review from the start",
  /** The block pager's titles; the pager adds "Previous" and "Next" itself. */
  blockLink: (order: number, title: string) => `Block ${order}: ${title}`,
  home: "Back to home",
  locked: {
    title: "This block is part of Pro",
    body: "You can see every step in it. Pro opens Blocks 3 to 6 of the roadmap, every step included.",
    primary: "Unlock with Pro",
  },
};

export const itemCopy = {
  minutes: (minutes: number) => `About ${minutes} min`,
  markDone: "Mark as done",
  done: "Done",
  undo: "Mark as not done",
  saveError: "Couldn't save that. Try again.",
  previous: "Previous",
  next: "Next",
  pagerLabel: "Step navigation",
  doneLabel: "Done",
  lockedLabel: "Locked",
  pending: {
    title: "Content is being added",
    body: "This step is being written from our research. You can mark it done once you've covered it on your own, and come back when it lands.",
  },
  comingSoon: {
    title: "Coming soon",
    body: "This step isn't built yet. Carry on with the next one in the meantime.",
  },
  extrasHeading: "Also in this step",
  locked: {
    title: "This step is part of Pro",
    body: "Pro opens Blocks 3 to 6 of the roadmap, including this step. You'll come straight back here after upgrading.",
    primary: "Unlock with Pro",
    insideHeading: "What's inside this block",
    stepsHeading: "Steps in this block",
  },
  /** The free alternative every lock page offers. */
  freeAlternative: { label: "Review your gap report", block: "gap-analysis", item: "gap-report" },
};

export const ratingLabels: Record<Rating, string> = {
  not_started: "Not started",
  learning: "Learning",
  confident: "Confident",
};

/** Concept pages (Block 3 topics) and their lessons. */
export const conceptCopy = {
  outsideRole: "Not in your role",
  ratingPrefix: "Your audit:",
  notRated: "Not rated yet",
  changeRating: "Change in the skill audit",
  learnHeading: "What you'll learn",
  projectHeading: "Practice project",
  prerequisitesHeading: "Learn first",
  noPrerequisites: "Nothing. This is a starting point.",
  optionalPrerequisite: "Optional prerequisite for your role",
  lessonsHeading: "Lessons",
  lessonsCount: (count: number, minutes: number) => `${count} lessons · about ${minutes} min`,
  previousConcept: "Previous concept",
  nextConcept: "Next concept",
  backToBlock: "Block 3 overview",
  locked: {
    title: "Lessons are part of Pro",
    body: "The overview above is free. Pro opens every lesson in Block 3, with the project brief. You'll come straight back here after upgrading.",
    primary: "Unlock lessons with Pro",
  },
};

export const lessonCopy = {
  of: (order: number, total: number) => `Lesson ${order} of ${total}`,
  placeholder: "Placeholder",
  placeholderNote: "Lesson bodies arrive with the CMS; this one is a placeholder.",
  markComplete: "Mark as complete",
  completed: "Completed",
  saveError: "Couldn't save that. Try again.",
  backToConcept: (title: string) => `Back to ${title}`,
  locked: {
    title: "This lesson is part of Pro",
    body: "The concept overview stays free. Pro opens this lesson and every other one in Block 3. You'll come straight back here after upgrading.",
    primary: "Unlock with Pro",
  },
};

/** Block 2: the skill audit. */
export const auditCopy = {
  intro:
    "Rate every concept your target role needs. Be honest: the gap report and your job matches are only as good as these answers. Each answer saves as you go.",
  progress: (rated: number, total: number) => `${rated} of ${total} rated`,
  progressLabel: "Skill audit progress",
  domainCount: (rated: number, total: number) => `${rated} of ${total} rated`,
  ratingGroupLabel: (title: string) => `Your level in ${title}`,
  saving: "Saving…",
  saved: "Saved",
  error: "Couldn't save that answer. It has been put back; try again.",
  done: "Every concept is rated.",
  toReport: "See your gap report",
};

/** Block 2: the gap report. */
export const gapCopy = {
  readinessHeading: "Readiness",
  readinessLabel: "Overall readiness for your role",
  readinessNote: (rated: number, total: number) =>
    rated === total ? `Based on all ${total} concepts.` : `Based on ${rated} of ${total} concepts rated so far.`,
  finishAudit: "Finish the skill audit",
  domainsHeading: "By domain",
  domainLabel: (title: string) => `${title} readiness`,
  domainConfident: (confident: number, total: number) => `${confident} of ${total} confident`,
  gapsHeading: "Your top gaps",
  gapsNote: "In learning order: the first ones unlock the rest.",
  noGaps: "No gaps: you're confident in every concept your role needs.",
  empty: {
    title: "Take the skill audit first",
    body: "The gap report scores your answers against your role. Rate your concepts and it fills in here.",
    action: "Start the skill audit",
  },
  upgrade: {
    title: "Close these gaps with Pro",
    body: "Pro opens the lessons and project brief for every concept in Block 3, in the order that closes these gaps fastest.",
    action: "See Pro",
  },
  pro: {
    title: "Start closing these gaps",
    body: "Block 3 takes them in learning order.",
    action: (title: string) => `Start with ${title}`,
  },
};

/** The concept map (/roadmap/concept-map and Block 3's first item). */
export const mapCopy = {
  title: "Concept map",
  subtext: (concepts: number, domains: number, roles: number) =>
    `${concepts} concepts, ${domains} domains, ${roles} roles. Pick a role, then open any concept.`,
  viewsLabel: "View",
  graph: "Graph",
  matrix: "Role matrix",
  rolesLabel: "Show relevance for",
  allRoles: "All roles",
  yourRole: "Your role",
  graphLabel: "Concept graph. Each concept is a link; arrows run from prerequisites to what they unlock. The role matrix lists the same concepts as a table.",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  zoomReset: "Reset zoom",
  matrixCaption: "Every concept and how much each role needs it",
  concept: "Concept",
  totals: "Core / good to know",
  levels: { 2: "Core", 1: "Good to know", 0: "Not needed" } as Record<0 | 1 | 2, string>,
  legendConfident: "Rated confident in your audit",
  focusHint: "Hover or focus a concept to trace what it needs and what it unlocks.",
  needs: (count: number) => (count === 0 ? "A starting point" : `Needs ${count} ${count === 1 ? "concept" : "concepts"} first`),
  unlocks: (count: number) => `Unlocks ${count}`,
  open: "Open concept",
  legend: "Legend",
  dotsNote: "Dots follow the role chips, in order",
  levelFor: (level: string, role: string) => `${level} for ${role}`,
};

/** Block 3's overview lists the role's concepts by domain. */
export const syllabusCopy = {
  heading: "Your concepts",
  note: "Your role's concepts, grouped by domain and in learning order within each.",
  count: (count: number) => `${count} ${count === 1 ? "concept" : "concepts"}`,
};
