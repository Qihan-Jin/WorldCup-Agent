import { describe, expect, it } from "vitest";
import { fixtureSampleMatches } from "../data/fixtureSample";
import { generateMatchInsight } from "./insightGenerator";

describe("generateMatchInsight", () => {
  it("creates casual fan context for a match", () => {
    const insight = generateMatchInsight(fixtureSampleMatches[0]);

    expect(insight.title).toContain("Mexico");
    expect(insight.whyItMatters.length).toBeGreaterThan(20);
    expect(insight.watchFor.length).toBeGreaterThan(0);
  });
});
