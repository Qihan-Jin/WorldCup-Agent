import { describe, expect, it } from "vitest";
import { fixtureSampleMatches } from "../data/fixtureSample";
import { defaultProfile } from "../profile/profileStore";
import { scoreMatch } from "./matchScoring";

describe("scoreMatch", () => {
  it("prioritizes the user's favorite team", () => {
    const mexicoMatch = fixtureSampleMatches.find((match) => match.id === "m-1")!;
    const scored = scoreMatch(mexicoMatch, { ...defaultProfile, favoriteTeam: "Mexico" });

    expect(scored.score).toBeGreaterThanOrEqual(80);
    expect(scored.reasons).toContain("Your favorite team is playing.");
  });

  it("marks the final as must-watch", () => {
    const final = fixtureSampleMatches.find((match) => match.id === "m-104")!;
    const scored = scoreMatch(final, defaultProfile);

    expect(scored.priority).toBe("must-watch");
  });
});
