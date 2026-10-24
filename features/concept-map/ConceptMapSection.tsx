import { concepts, domains } from "@/content/concepts";
import { ConceptMap } from "@/features/concept-map/ConceptMap";
import { getProfile, getProgress, getRoles } from "@/lib/data";

/**
 * Loads the user's role and confident ratings for the map. Only the fields the
 * graph draws go to the client: descriptions, topics and projects stay on the
 * concept pages.
 */
export async function ConceptMapSection() {
  const [profile, progress, roles] = await Promise.all([getProfile(), getProgress(), getRoles()]);
  const slim = concepts.map(({ id, title, domain, prerequisites, levels }) => ({ id, title, domain, prerequisites, levels }));
  const confident = Object.entries(progress.auditRatings)
    .filter(([, rating]) => rating === "confident")
    .map(([id]) => id);

  return (
    <ConceptMap
      concepts={slim}
      domains={domains}
      roles={roles.map((role) => ({ id: role.id, title: role.title }))}
      initialRole={profile.roleId}
      confident={confident}
    />
  );
}
