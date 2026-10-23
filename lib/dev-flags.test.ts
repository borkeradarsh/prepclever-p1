import { afterEach, describe, expect, it, vi } from "vitest";
import {
  defaultDevFlags,
  devFlagsFromSearchParams,
  parseDevFlags,
  serializeDevFlags,
} from "@/lib/dev-flags";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("parseDevFlags", () => {
  it("returns defaults for a missing or empty cookie", () => {
    expect(parseDevFlags(null)).toEqual(defaultDevFlags());
    expect(parseDevFlags("")).toEqual(defaultDevFlags());
  });

  it("reads every flag", () => {
    expect(parseDevFlags("scenario:complete|plan:pro|fail:goal,pulse|slow:1")).toEqual({
      scenario: "complete",
      plan: "pro",
      fail: ["goal", "pulse"],
      slow: true,
    });
  });

  it("ignores unknown values and unknown keys", () => {
    expect(parseDevFlags("scenario:nope|plan:platinum|fail:nothing|colour:red")).toEqual(
      defaultDevFlags(),
    );
  });

  it("is hard-gated off in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(parseDevFlags("scenario:complete|plan:pro")).toEqual(defaultDevFlags());
  });
});

describe("serializeDevFlags", () => {
  it("round-trips through parseDevFlags", () => {
    const flags = { scenario: "first-run" as const, plan: "pro" as const, fail: ["user" as const], slow: true };
    expect(parseDevFlags(serializeDevFlags(flags))).toEqual(flags);
  });

  it("fills unset flags with defaults", () => {
    expect(parseDevFlags(serializeDevFlags({ plan: "pro" }))).toEqual({
      ...defaultDevFlags(),
      plan: "pro",
    });
  });
});

describe("devFlagsFromSearchParams", () => {
  it("reads only the flags present", () => {
    expect(devFlagsFromSearchParams(new URLSearchParams("plan=pro&slow=1"))).toEqual({
      plan: "pro",
      slow: true,
    });
  });

  it("ignores invalid values", () => {
    expect(devFlagsFromSearchParams(new URLSearchParams("scenario=later&plan=gold"))).toEqual({});
  });
});
