// The post-onboarding domain model (docs/dashboard-v2-spec.md section 9).
// Return types here are the contract between lib/data and the UI: changing one
// is a product decision, not a refactor.

import type { RoleId, Situation, YearsBand } from "@/components/auth/onboarding/types";

export type { RoleId, Situation, YearsBand };

export type Access = "free" | "paid";
export type Plan = "free" | "pro";
export type LessonType = "video" | "reading" | "quiz" | "project";

export type BlockId =
  | "market"
  | "gap-analysis"
  | "upskilling"
  | "positioning"
  | "referrals"
  | "interviews";
export type Track = "fresher" | "switcher" | "mid" | "senior";
export type ItemKind = "guide" | "checklist" | "tool" | "directory" | "role-page" | "report" | "map";
/** Anything not yet built is `coming_soon` and must be shown with that chip. */
export type ItemStatus = "available" | "coming_soon";
export type Rating = "not_started" | "learning" | "confident";
export type DomainId = "math" | "cs" | "data" | "ml" | "dl" | "llm" | "ops" | "lead";
/** Concept map relevance: 2 core, 1 good to know, 0 not needed. */
export type Level = 0 | 1 | 2;
export type RoleFit = "on_track" | "stretch" | "adjacent_first";

/** Every figure the product shows carries where it came from and when. */
export interface Sourced {
  sourceLabel: string;
  sourceUrl?: string;
  checkedOn: string;
  verified: boolean;
}

export interface Domain {
  id: DomainId;
  title: string;
}

export interface Concept {
  id: string;
  title: string;
  domain: DomainId;
  prerequisites: string[];
  levels: Record<RoleId, Level>;
  description: string;
  topics: string[];
  practiceProject: string;
}

export interface PayBand extends Sourced {
  label: string;
  /** Pay is always labelled approximate. */
  approximate: true;
}

/** Labelled "example, may have closed" wherever it is shown. */
export interface ExamplePosting {
  title: string;
  company: string;
  url: string;
  checkedOn: string;
}

export interface Role {
  id: RoleId;
  /** At most 20 characters: it is the onboarding card title. */
  title: string;
  /** At most 60 characters: the onboarding card description. */
  cardDescription: string;
  /** The one-line description from the concept map. */
  shortDescription: string;
  titleVariants: string[];
  yoeRange: string;
  typicalBackground: string;
  payBands: PayBand[];
  ladderNotes: string[];
  examplePostings: ExamplePosting[];
  minYears: number;
}

export interface UserProfile {
  roleId: RoleId;
  track: Track;
  situation: Situation;
  yearsBand: YearsBand | null;
}

export interface Progress {
  completedLessonIds: string[];
  auditRatings: Record<string, Rating>;
  checklistDone: string[];
  /** Item keys: `block/item` for block items, `concept:<id>` for concepts. */
  doneItems: string[];
  lastItem: string | null;
  weeklyGoalSessions: number | null;
  sessionsThisWeek: number;
  streakDays: number;
}

export interface User {
  id: string;
  firstName: string | null;
  plan: Plan;
}

export interface PulseItem extends Sourced {
  text: string;
}

export interface FeatureFlag {
  label: string;
  status: ItemStatus;
}

export interface BlockItem {
  slug: string;
  title: string;
  kind: ItemKind;
  status: ItemStatus;
  access: Access;
  /** Null until the owner sets an estimate. */
  estimatedMinutes: number | null;
  /** Parts of an available item that are not built yet, such as a builder tool. */
  extras?: FeatureFlag[];
}

export interface Block {
  slug: BlockId;
  order: number;
  title: string;
  shortTitle: string;
  summary: string;
  bullets: { term: string; detail: string }[];
  tier: Access;
  status: ItemStatus;
  items: BlockItem[];
}

export interface Lesson {
  id: string;
  slug: string;
  conceptId: string;
  title: string;
  type: LessonType;
  durationMin: number;
  order: number;
  access: Access;
}

/** Only ever returned after an access check: see getLessonBody. */
export interface LessonBody {
  lessonId: string;
  placeholder: boolean;
  body: string;
}

export interface LessonRef {
  concept: Concept;
  lesson: Lesson;
}

export interface Company extends Sourced {
  id: string;
  name: string;
  note: string | null;
  cities: string[];
  when: string;
  /** Trackers mix launched and announced centres; the research marks which. */
  announced: boolean;
  scale: string;
  focus: string;
}

export interface Resource {
  id: string;
  section: string;
  title: string;
  url: string;
  /** Extra links the research lists beside the main one (repo, channel, sheet). */
  moreLinks: { label: string; url: string }[];
  type: string;
  why: string;
  checkedOn: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  source?: { label: string; url: string };
}

export interface Checklist {
  /** Matches the positioning block item slug. */
  id: "resume" | "linkedin" | "github";
  title: string;
  items: ChecklistItem[];
}

// Derived shapes. Every widget needs them and deriving them in components would
// duplicate the rules.

export type BlockState = "not_started" | "in_progress" | "done";

export interface BlockProgress {
  blockId: BlockId;
  done: number;
  total: number;
  ratio: number;
  state: BlockState;
}

export interface BlockView extends Block {
  locked: boolean;
  progress: BlockProgress;
}

export interface ItemLink {
  title: string;
  href: string;
}

export interface BlockItemView {
  block: BlockView;
  item: BlockItem;
  locked: boolean;
  done: boolean;
  previous: ItemLink | null;
  /** The next item, the next block, or the dashboard after the last block. */
  next: ItemLink;
}

export interface SyllabusConcept {
  concept: Concept;
  level: 1 | 2;
  /** Prerequisites the role does not need (level 0), shown as a hint only. */
  optionalPrerequisites: string[];
  rating: Rating;
}

export interface SyllabusDomain {
  domain: Domain;
  concepts: SyllabusConcept[];
}

export interface RoleSyllabus {
  roleId: RoleId;
  domains: SyllabusDomain[];
  /** Concept ids in learning order. */
  order: string[];
}

export interface ConceptView {
  concept: Concept;
  domain: Domain;
  /** 0 when the concept is outside the user's role syllabus. */
  level: Level;
  rating: Rating;
  prerequisites: { id: string; title: string; domain: DomainId; level: Level }[];
  optionalPrerequisites: string[];
  /** Titles and metadata only: free previews show these locked. */
  lessons: Lesson[];
  locked: boolean;
}

export interface DomainReadiness {
  domain: Domain;
  readiness: number;
  total: number;
  confident: number;
}

export interface GapReport {
  /** 0 to 1. */
  readiness: number;
  domains: DomainReadiness[];
  /** Relevant concepts not rated confident, in learning order. */
  gaps: SyllabusConcept[];
  ratedCount: number;
  total: number;
}

export type NextRecommended =
  | { kind: "item"; blockId: BlockId; itemSlug: string; title: string; href: string; locked: boolean }
  | { kind: "concept"; conceptId: string; title: string; href: string; locked: boolean };
