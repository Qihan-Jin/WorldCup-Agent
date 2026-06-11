import { describe, expect, it } from "vitest";
import { getAllMatches, getFixtureDataSource, getMatchById, getMatchesForTeam } from "./matchRepository";

describe("matchRepository", () => {
  it("returns verified fixture sample matches in kickoff order", () => {
    const matches = getAllMatches();

    expect(matches).toHaveLength(104);
    for (let index = 1; index < matches.length; index += 1) {
      expect(matches[index - 1].kickoffUtc <= matches[index].kickoffUtc).toBe(true);
    }
  });

  it("exposes fixture data source boundaries", () => {
    const source = getFixtureDataSource();

    expect(source.provider).toBe("FIFA");
    expect(source.coverage).toBe("full-static");
    expect(source.sourceUrl).toContain("fifa.com");
    expect(source.matchCount).toBe(getAllMatches().length);
  });

  it("returns independent match objects and storyline tags on each call", () => {
    const matches = getAllMatches();
    const match = matches[0];
    const originalId = match.id;
    const originalHomeTeam = match.homeTeam;

    match.homeTeam = "Mutated Team";
    match.storylineTags.push("mutated-tag");

    const freshMatch = getAllMatches().find((candidate) => candidate.id === originalId);

    expect(freshMatch).toBeDefined();
    expect(freshMatch).not.toBe(match);
    expect(freshMatch?.storylineTags).not.toBe(match.storylineTags);
    expect(freshMatch?.homeTeam).toBe(originalHomeTeam);
    expect(freshMatch?.storylineTags).not.toContain("mutated-tag");
  });

  it("finds matches for a selected team", () => {
    const matches = getMatchesForTeam("Mexico");

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => match.homeTeam === "Mexico" || match.awayTeam === "Mexico")).toBe(true);
  });

  it("finds a match by id", () => {
    const match = getMatchById("m-1");

    expect(match?.homeTeam).toBe("Mexico");
    expect(match?.awayTeam).toBe("South Africa");
  });
});
