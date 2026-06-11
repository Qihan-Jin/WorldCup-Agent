import { describe, expect, it } from "vitest";
import { getAllMatches } from "../data/matchRepository";
import { defaultProfile } from "../profile/profileStore";
import { generateViewingPlan } from "./planGenerator";

describe("generateViewingPlan", () => {
  it("groups matches by viewing priority", () => {
    const plan = generateViewingPlan(getAllMatches(), defaultProfile);

    expect(plan.summary).toContain("Argentina");
    expect(plan.groups["must-watch"].length).toBeGreaterThan(0);
    expect(Object.keys(plan.groups)).toEqual(["must-watch", "recommended", "highlights", "skip"]);
  });
});
