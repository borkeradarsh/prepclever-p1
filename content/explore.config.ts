// The /explore index. A card without an href is shown with a Coming soon chip
// and is not a link, so nothing here can be a dead end.

export type ExploreCard = {
  id: string;
  title: string;
  description: string;
  /** Null until the page exists. */
  href: string | null;
};

export const exploreCopy = {
  title: "Explore",
  subtext: "Look beyond your own role: every role, the companies hiring, and how the pieces connect.",
  comingSoon: "Coming soon",
  open: "Open",
};

export const exploreCards: ExploreCard[] = [
  {
    id: "roles",
    title: "Roles",
    description: "The seven AI engineering roles PrepClever builds a roadmap for.",
    href: "/roles",
  },
  {
    id: "companies",
    title: "Companies",
    description: "Global enterprises running capability centres in India that hire AI talent.",
    href: "/companies",
  },
  {
    id: "concept-map",
    title: "Concept map",
    description: "The concepts behind every role and how they build on each other.",
    href: "/roadmap/concept-map",
  },
  {
    id: "hiring",
    title: "How GCCs hire",
    description: "The rounds, the timelines and what each one is testing.",
    href: null,
  },
  {
    id: "resources",
    title: "Resources",
    description: "The courses, repos and channels our research found worth your time.",
    href: null,
  },
];
