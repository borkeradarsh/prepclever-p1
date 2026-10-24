// Every string the roadmap pages render: /roadmap, block overviews, item pages
// and their lock pages. Block and item titles are not here: they are in
// content/blocks.config.ts.

import type { BlockState, ItemKind } from "@/types/domain";

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
