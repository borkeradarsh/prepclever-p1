"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Situation } from "@/components/auth/onboarding/types";
import { intentCookieAssignment } from "@/lib/intent";

type IntentOptionProps = { situation: Situation; href: string; label: string; detail: string };

/**
 * A landing-page starting point. Records the choice before navigating, so
 * onboarding opens with it selected. Still a plain link without JavaScript.
 */
export function IntentOption({ situation, href, label, detail }: IntentOptionProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        document.cookie = intentCookieAssignment(situation);
      }}
    >
      <span className="blueprint-option-label">{label}</span>
      <span className="blueprint-option-detail">{detail}</span>
      <ArrowRight className="blueprint-option-arrow" size={15} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  );
}
