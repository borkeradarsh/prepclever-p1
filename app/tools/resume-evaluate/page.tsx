import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";

export const metadata: Metadata = {
  title: "Resume Evaluate — PrepClever",
  description:
    "Score your resume against a real GCC job description: keyword alignment, quantified impact and the gaps a hiring manager will notice.",
};

const checks = [
  {
    title: "Keyword alignment",
    detail:
      "Match your resume against the exact job description you are targeting, and see which required terms are missing entirely.",
  },
  {
    title: "Quantified impact",
    detail:
      "Find the bullets that describe activity rather than outcome, and the ones that would carry a number if you added one.",
  },
  {
    title: "Role narrative",
    detail:
      "Check whether the first third of the page tells a hiring manager which role you are applying for, within six seconds.",
  },
  {
    title: "ATS readability",
    detail:
      "Catch the layout choices — tables, columns, graphics — that parse badly before a human ever sees the file.",
  },
];

export default function ResumeEvaluatePage() {
  return (
    <MarketingPage
      eyebrow="Tools"
      title="Resume Evaluate"
      lede="Block 4 of the blueprint, as a standalone tool. Paste a GCC job description, upload your resume, and get a scored breakdown of what a hiring manager and an ATS each see."
    >
      <ul className="marketing-role-list">
        {checks.map((check) => (
          <li className="marketing-role-card" key={check.title}>
            <h2>{check.title}</h2>
            <p>{check.detail}</p>
          </li>
        ))}
      </ul>
      <div className="marketing-note">
        <h2>The tool is not live yet</h2>
        <p>
          Resume Evaluate ships with the positioning block. Create a free account and it appears in
          your dashboard the day it launches — along with the rest of the roadmap.
        </p>
        <p>
          <Link className="closing-cta-aside-link" href="/signup">
            Get started free
          </Link>
        </p>
      </div>
    </MarketingPage>
  );
}
