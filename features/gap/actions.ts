"use server";

import { setRating } from "@/lib/data";
import type { Rating } from "@/types/domain";

const RATINGS: Rating[] = ["not_started", "learning", "confident"];

/**
 * Saves one audit answer. The audit is free for everyone, so there is no
 * access check; the rating and the concept id are both validated (setRating
 * rejects an unknown concept). No revalidation: setting the cookie already
 * invalidates the client router cache, and the audit page holds its own state.
 */
export async function rateConceptAction(conceptId: string, rating: Rating) {
  if (!RATINGS.includes(rating)) throw new Error(`Unknown rating ${String(rating)}`);
  await setRating(conceptId, rating);
}
