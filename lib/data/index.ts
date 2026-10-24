// The data contract (CLAUDE.md section 4, docs/dashboard-v2-spec.md section 9).
//
// Components call these and nothing else: never a mock module, never fetch to a
// content source. The signatures and return types are the contract, so swapping
// the ./mock import for a CMS or API module changes no caller.

export {
  getUser,
  getProfile,
  getOnboardingComplete,
  getProgress,
  getRoles,
  getRole,
  getBlocks,
  getBlock,
  getBlockItem,
  getRoleSyllabus,
  getConcept,
  getLesson,
  getLessonNeighbours,
  getLessonBody,
  getGapReport,
  getNextRecommended,
  getChecklists,
  getCompanies,
  getResources,
  getPulse,
  setRating,
  toggleChecklistItem,
  markItemDone,
  markLessonComplete,
  setWeeklyGoal,
  setPlan,
  roleTitle,
} from "./mock";
