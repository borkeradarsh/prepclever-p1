import { concepts, domains } from "@/content/concepts";
import { SoftCard } from "@/components/ui/SoftCard";
import { ConceptMap } from "@/features/concept-map/ConceptMap";
import { LearningPath } from "@/features/roadmap/LearningPath";
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

  // From 1280px the learning path sits beside the map, as in the research
  // page's side panel; below that it follows the map.
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-[var(--space-lg)] xl:grid-cols-[minmax(0,1fr)_20rem]">
      <ConceptMap
        concepts={slim}
        domains={domains}
        roles={roles.map((role) => ({ id: role.id, title: role.title }))}
        initialRole={profile.roleId}
        confident={confident}
      />
      <SoftCard padding="md" className="xl:sticky xl:top-[calc(var(--app-nav-height)+var(--space-md))]">
        <LearningPath scroll />
      </SoftCard>
    </div>
  );
}
