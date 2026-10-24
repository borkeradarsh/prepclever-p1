import { describe, expect, it } from "vitest";
import { INTENT_COOKIE, intentCookieAssignment, intentFromCookieHeader, parseIntent } from "@/lib/intent";

describe("intent cookie", () => {
  it("accepts only the four situations", () => {
    expect(parseIntent("student")).toBe("student");
    expect(parseIntent("it_services")).toBe("it_services");
    expect(parseIntent("astronaut")).toBeNull();
    expect(parseIntent("")).toBeNull();
    expect(parseIntent(undefined)).toBeNull();
  });

  it("reads the value out of a cookie header among others", () => {
    expect(intentFromCookieHeader(`a=1; ${INTENT_COOKIE}=product_tech; b=2`)).toBe("product_tech");
    expect(intentFromCookieHeader(`${INTENT_COOKIE}=<script>`)).toBeNull();
    expect(intentFromCookieHeader("other=student")).toBeNull();
    expect(intentFromCookieHeader("")).toBeNull();
  });

  it("writes a cookie the reader understands", () => {
    const assignment = intentCookieAssignment("non_tech");
    expect(assignment).toMatch(/path=\//);
    expect(intentFromCookieHeader(assignment.split(";")[0])).toBe("non_tech");
  });
});
