import type { FixtureDataSource, Match } from "../../types";
import type { FixtureProvider } from "./fixtureProvider";

function cloneMatch(match: Match): Match {
  return {
    ...match,
    storylineTags: [...match.storylineTags]
  };
}

export interface FixtureRepository {
  getAllMatches(): Match[];
  getFixtureDataSource(): FixtureDataSource;
  getDataSource(): FixtureDataSource;
  getMatchById(matchId: string): Match | undefined;
  getMatchesForTeam(team: string): Match[];
}

export function createFixtureRepository(provider: FixtureProvider): FixtureRepository {
  function getAllMatches(): Match[] {
    return provider
      .getMatches()
      .map(cloneMatch)
      .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
  }

  function getFixtureDataSource(): FixtureDataSource {
    return provider.getDataSource();
  }

  return {
    getAllMatches,
    getFixtureDataSource,
    getDataSource: getFixtureDataSource,
    getMatchById: (matchId) => getAllMatches().find((match) => match.id === matchId),
    getMatchesForTeam: (team) => getAllMatches().filter((match) => match.homeTeam === team || match.awayTeam === team)
  };
}
