// The role definitions every surface reads. Copy limits, sourcing and the
// concept map descriptions are enforced, not trusted.

import { describe, expect, it } from "vitest";
import { roleCards } from "@/components/auth/onboarding/config";
import { ROLE_IDS } from "@/components/auth/onboarding/types";
import { conceptMapRoles } from "@/content/concepts";
import { marketingNav } from "@/content/marketing-nav.config";
import { notSureCard, roles } from "@/content/roles.config";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe("roles", () => {
  it("defines the seven roles in the spec's order", () => {
    expect(roles.map((role) => role.id)).toEqual(ROLE_IDS);
  });

  it("keeps the onboarding card copy within its limits", () => {
    for (const role of roles) {
      expect(role.title.length, role.id).toBeLessThanOrEqual(20);
      expect(role.cardDescription.length, role.id).toBeLessThanOrEqual(60);
    }
    expect(notSureCard.title.length).toBeLessThanOrEqual(20);
    expect(notSureCard.description.length).toBeLessThanOrEqual(60);
  });

  it("uses the concept map's one-line descriptions verbatim", () => {
    for (const role of roles) {
      expect(role.shortDescription, role.id).toBe(conceptMapRoles.find((entry) => entry.id === role.id)?.description);
    }
  });

  it("sets minimum years as the spec gives them", () => {
    expect(roles.map((role) => role.minYears)).toEqual([0, 3, 4, 2, 0, 3, 10]);
  });

  it("sources every pay band, dates it and labels it approximate", () => {
    for (const role of roles) {
      expect(role.payBands.length, role.id).toBeGreaterThan(0);
      for (const band of role.payBands) {
        expect(band.sourceLabel).not.toHaveLength(0);
        expect(band.checkedOn).toMatch(ISO_DATE);
        expect(band.approximate).toBe(true);
        expect(typeof band.verified).toBe("boolean");
      }
    }
  });

  it("dates every example posting and links it over https", () => {
    for (const role of roles) {
      expect(role.examplePostings.length, role.id).toBeGreaterThan(0);
      for (const posting of role.examplePostings) {
        expect(posting.url).toMatch(/^https:\/\//);
        expect(posting.checkedOn).toMatch(ISO_DATE);
      }
    }
  });
});

describe("surfaces derive from roles.config", () => {
  it("shows eight onboarding cards: seven roles, then Not sure yet", () => {
    expect(roleCards.map((card) => card.id)).toEqual([...ROLE_IDS, "not_sure"]);
    for (const role of roles) {
      expect(roleCards.find((card) => card.id === role.id)).toEqual({
        id: role.id,
        title: role.title,
        description: role.cardDescription,
      });
    }
  });

  it("lists all seven roles in the marketing nav", () => {
    const menu = marketingNav.find((item) => item.kind === "menu" && item.id === "roles");
    const hrefs = menu && menu.kind === "menu" ? menu.items.map((item) => item.href) : [];
    expect(hrefs).toEqual([...ROLE_IDS.map((id) => `/roles#${id}`), "/roles"]);
  });
});
