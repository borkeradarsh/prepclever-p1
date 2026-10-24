import { notSureCard, roles } from "@/content/roles.config";
import type { RoleId, Situation, YearsBand } from "./types";

export const situations: { id: Situation; title: string; description: string; needsYears: boolean }[] = [
  { id: "student", title: "Student / final year", description: "In college or about to graduate", needsYears: false },
  { id: "it_services", title: "IT services company", description: "Working at a services or consulting firm", needsYears: true },
  { id: "product_tech", title: "Product / tech role", description: "At a product company or another tech job", needsYears: true },
  { id: "non_tech", title: "Switching careers", description: "Coming from a non-technical background", needsYears: false },
];

export const yearsBands: { id: YearsBand; label: string; description: string }[] = [
  { id: "0-1", label: "0–1", description: "Early in your career" },
  { id: "2-5", label: "2–5", description: "2–5 years of experience" },
  { id: "6-10", label: "6–10", description: "6–10 years of experience" },
  { id: "10+", label: "10+", description: "10 or more years" },
];

/** The eight role cards: the seven roles from content/roles.config.ts, then "Not sure yet". */
export const roleCards: { id: RoleId | "not_sure"; title: string; description: string }[] = [
  ...roles.map((role) => ({ id: role.id, title: role.title, description: role.cardDescription })),
  notSureCard,
];

export const situationLabels: Record<Situation, string> = { student: "Student", it_services: "Service-company engineer", product_tech: "Product-company engineer", non_tech: "Career switcher" };
