import { describe, expect, it } from "vitest";
import { getSelectableTeams } from "./teamOptions";

describe("getSelectableTeams", () => {
  it("returns unique real teams sorted alphabetically", () => {
    const teams = getSelectableTeams();

    expect(teams).toHaveLength(48);
    expect(new Set(teams).size).toBe(48);
    expect(teams).toEqual([...teams].sort((a, b) => a.localeCompare(b)));
    expect(teams).toContain("Argentina");
    expect(teams).toContain("Japan");
    expect(teams).toContain("Canada");
    expect(teams).toContain("Türkiye");
    expect(teams).not.toContain("Winner Group A");
    expect(teams).not.toContain("Finalist 1");
  });
});
