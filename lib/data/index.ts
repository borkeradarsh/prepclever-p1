// The data contract (CLAUDE.md section 4, build spec section 5).
//
// Components call these and nothing else: never a mock module, never fetch to a
// content source. The signatures and return types are the contract, so swapping
// the ./mock import for a CMS or API module changes no caller.

export {
  getUser,
  getPath,
  getCourses,
  getCourse,
  getLesson,
  getLessonNeighbours,
  getProgress,
  getNextLesson,
  getPulse,
  getReadiness,
  setWeeklyGoal,
  markLessonComplete,
} from "./mock";
