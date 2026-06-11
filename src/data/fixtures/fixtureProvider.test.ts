import { describe, expect, it } from "vitest";
import { createFixtureRepository } from "./fixtureRepository";
import { staticFixtureProvider } from "./staticFixtureProvider";

describe("fixture providers", () => {
  it("uses a provider-backed repository without exposing mutable match objects", () => {
    const repository = createFixtureRepository(staticFixtureProvider);
    const matches = repository.getAllMatches();
    const firstMatch = matches[0];

    firstMatch.homeTeam = "Changed";
    firstMatch.storylineTags.push("changed");

    const freshMatch = repository.getMatchById(firstMatch.id);

    expect(repository.getDataSource().coverage).toBe("full-static");
    expect(repository.getDataSource().matchCount).toBe(matches.length);
    expect(freshMatch?.homeTeam).not.toBe("Changed");
    expect(freshMatch?.storylineTags).not.toContain("changed");
  });

  it("keeps the static provider API-ready and synchronous for the app shell", () => {
    expect(staticFixtureProvider.id).toBe("static-fifa-full-schedule");
    expect(staticFixtureProvider.getMatches()).toHaveLength(staticFixtureProvider.getDataSource().matchCount);
  });
});
