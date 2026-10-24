// /roadmap/concept-map: the concept map on its own, free for everyone and
// linked from Explore. Block 3's first item (/roadmap/upskilling/concept-map)
// shows the same map inside the roadmap, with Mark as done and Next.

import type { Metadata } from "next";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { concepts, domains } from "@/content/concepts";
import { mapCopy } from "@/content/roadmap.config";
import { roles } from "@/content/roles.config";
import { ConceptMapSection } from "@/features/concept-map/ConceptMapSection";

export const metadata: Metadata = { title: `${mapCopy.title} · PrepClever` };

export default function ConceptMapPage() {
  return (
    <AppContainer>
      <PageHeader title={mapCopy.title} subtext={mapCopy.subtext(concepts.length, domains.length, roles.length)} />
      <div className="pb-[var(--space-xl)]">
        <ConceptMapSection />
      </div>
    </AppContainer>
  );
}
